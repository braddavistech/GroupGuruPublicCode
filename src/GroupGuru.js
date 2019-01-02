import React, { Component } from 'react';
import './App.css';
import base from "./firebase";
import guruLog from "./realtime";
import firebase from "firebase";
import ApplicationView from "./ApplicationView";
import NavBar from "./Navbar/NavBar";
import moment from "moment";
const db = firebase.firestore();

const admin = require('firebase-admin');
admin.initializeApp();

export default class GroupGuru extends Component {
  state = {
    currentUser: null,
    contacts: null,
    loggedIn: null,
    users: null,
    loginActivity: null,
    holidays: null
  }

  // grabLoginActivity = () => {
  //   let loginSearch = [];
  //   console.log("loginSearch")
  //   if (sessionStorage.getItem("loginActivity") === null) {
  //     db.collection("loginActivity").orderBy("loginTimestamp", "desc").get().then(login => {
  //       login.forEach(item => {
  //         // this.state.users.forEach(indiv => {
  //           let tempData = item.data();
  //           // if (indiv.userId === tempData.userId) {
  //           //   tempData.user = indiv;
  //             loginSearch.push(tempData)
  //           // }
  //         })
  //         let saveLogins = []
  //         console.log("allLogins", loginSearch)

  //         loginSearch.forEach(login => {
  //           if (login.userId === "sIbedSVxsiPnaq8ys19LA06Leea2" || login.userId === "rLXRuYgYtjaxRlvlLnEuq309TIw2") {
  //             saveLogins.push(login)
  //           }
  //         })
  //         const myInfo = db.collection("logins").doc("loginActivity")
  //         myInfo.set({ logins: saveLogins })
  //         console.log("savedLogin", saveLogins)

  //         sessionStorage.setItem("loginActivity", loginSearch)
  //         this.setState({ loginActivity: loginSearch })
  //       // })
  //     })
  //   }
  // }


  componentWillMount() {

    let location = {};
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        location = { lat: position.coords.latitude, long: position.coords.longitude }
        sessionStorage.setItem("location", JSON.stringify(location))
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
      })
    } else {
      // TODO:need to set up an error message for no location or simply set location here
      console.log("Location not supported on this browser.");
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.database().ref(".info/connected").on("value", snapshot => {
          if (snapshot.val() === false) {
            this.resetState();
            return
          }

          firebase.database().ref('/loggedIn/' + user.uid).onDisconnect().set({ online: false, lastLoggedIn: moment(new Date()).utc().format() }).then(() => {
            firebase.database().ref('/loggedIn/' + user.uid).set({ online: true, lastLoggedIn: moment(new Date()).utc().format(), currentLocation: location });
          })
        })

        sessionStorage.setItem("userId", user.uid)


        guruLog.syncState("loggedIn", {
          context: this,
          state: "loggedIn"
        });
        // let tempData = []
        // db.collection("events").doc("GlobalEvents").get().then(events => {
        //   tempData = events.data();
        //   this.setState({ holidays: tempData })
        // })
        base.bindDoc("events/GlobalEvents", {
          context: this,
          state: "Holidays",
          withRefs: true
        });
        base.bindDoc("logins/loginActivity", {
          context: this,
          state: "loginActivity",
          withRefs: true
        });
        base.bindDoc("photos/allPhotos", {
          context: this,
          state: "photos",
          withRefs: true
        });
        base.bindDoc("recipes/AllRecipes", {
          context: this,
          state: "recipes",
          withRefs: true
        });
        base.bindDoc(`users/${user.uid}`, {
          context: this,
          state: "currentUser",
          withRefs: true
        });
        base.bindCollection("users", {
          context: this,
          state: "users",
          withRefs: true
        })
        // let loginSearch = [];
        // if (sessionStorage.getItem("loginActivity") === null) {
        //   db.collection("loginActivity").orderBy("loginTimestamp", "desc").limit(50).get().then(login => {
        //     login.forEach(item => {
        //       this.state.users.forEach(indiv => {
        //         let tempData = item.data();
        //         if (indiv.userId === tempData.userId) {
        //           tempData.user = indiv;
        //           loginSearch.push(tempData)
        //         }
        //         console.log("loginSearch")
        //       })
        //       sessionStorage.setItem("loginActivity", loginSearch)
        //       this.setState({ loginActivity: loginSearch })
        //     })
        //   })
        // }
        base.bindCollection("contacts", {
          context: this,
          state: "contacts",
          withRefs: true
        });
        base.bindCollection("messages", {
          context: this,
          state: "messages",
          withRefs: true
        });
        // console.log("grabLogin")
        // this.grabLoginActivity();
      } else {
        base.removeBinding("users");
        base.removeBinding("currentUser");
        base.removeBinding("contacts");
        base.removeBinding("messages");
        base.removeBinding("Holidays");
        base.removeBinding("loginActivity");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("loginActivity");
        this.setState({ messages: null, users: null, loginActivity: null, currentUser: null, contacts: null });
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        let location = { lat: position.coords.latitude, long: position.coords.longitude }
        sessionStorage.setItem("location", JSON.stringify(location))
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        })
      })
    } else {
      // TODO:need to set up an error message for no location or simply set location here
      console.log("Location not supported on this browser.");
    }
  }

  resetState = () => {
    sessionStorage.removeItem("loginActivity")
    this.setState({ messages: null, users: null, currentUser: null, contacts: null, loginActivity: null, Holidays: null, events: null, photos: null });
  }

  logOut = () => {
    firebase.database().ref('/loggedIn/' + this.state.currentUser.userId).set({ online: false, lastLoggedIn: moment(new Date()).utc().format() });
    sessionStorage.removeItem("location")
    firebase.auth().signOut().then(event => console.log("Logged out.", event));
  }

  render() {
    return (
      <React.Fragment>
        <NavBar {...this.state} logOut={this.logOut} />
        <ApplicationView  {...this.state} />
      </React.Fragment>
    )
  }
}
