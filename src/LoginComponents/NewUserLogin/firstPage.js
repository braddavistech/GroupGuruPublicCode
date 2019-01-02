import React, { Component } from "react";
import firebase from "firebase";
import base from "../../firebase";
import DataModules from "../../modules/dataModules";
import $ from "jquery";
import moment from "moment";
import "./FirstPage.css";
import "firebase/firestore";

const db = firebase.firestore();

export default class CreateUser extends Component {

  addBlur = () => {
    $("#root").addClass("none")
  }

  removeBlur = () => {
    $("#root").removeClass("none")
  }

  saveUser = () => {
    $(".inputAlert").hide()
    let firstName = this.firstName.value;
    let lastName = this.lastName.value;
    let email = this.email.value;
    let password = this.password.value;
    let username = this.username.value;
    if (firstName === "") { $("#firstNameNotEntered").show() }
    if (lastName === "") { $("#lastNameNotEntered").show() }
    if (username === "") { $("#usernameNotEntered").show() }
    if (email === "") { $("#emailNotEntered").show() };
    if (password === "") { $("#passwordlNotEntered").show() }
    // TODO: need to change this code again in the future
    if (this.authorizationCode.value === "DavisFamilyValues") {
      if (DataModules.emailAndUsernameValidation(email)) {
        if (password.length >= 6) {
          if (!DataModules.emailAndUsernameValidation(username)) {
            if (firstName !== "") {
              if (lastName !== "") {
                this.createUser(email, password, username, firstName, lastName);
                this.email.value = "";
                this.password.value = "";
                this.username.value = "";
                this.firstName.value = "";
                this.lastName.value = "";
              }
            }
          } else { $("#usernameNotValid").show() }
        } else { $("#passwordLength").show(); }
      } else { $("#emailNotValid").show() }
    } else {
      $("#authorizationCode").show()
    }
  }

  createUser = (email, password, username, firstName, lastName) => {
    let location = { lat: this.props.props.lat, long: this.props.props.long }
    this.addBlur()
    let date = new Date();
    date = moment(date).utc().format()
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(event => {
        db.collection('users').doc(event.user.uid).set({
          type: "user",
          userId: event.user.uid,
          email: event.user.email,
          displayName: username,
          accountCreatedDate: date,
          loginLocation: location,
          firstName: firstName,
          lastName: lastName,
          online: true,
          emailVerified: false,
          photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5",
          phoneNumber: null,
          streetAddress: null,
          city: null,
          stateId: null,
          zip: null,
          links: [{ title: "Facebook", url: null }, { title: "Twitter", url: null }, { title: "LinkedIn", url: null }]
        })
        base.addToCollection("loginActivity", {
          userId: event.user.uid,
          loginTimestamp: date,
          loginLocation: location
        })
        this.props.history.push("/GroupGuru/createAccount/Page2");
        this.removeBlur();
      })
      .catch(error => {
        this.removeBlur();
      })
  }

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    return (
      <div className="mainContainer">
        <section className="titleSectionNew">
          <h1 className="mainTitle">WELCOME TO</h1>
          <h1 className="ggTitle">GROUP GURU</h1>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">First Name<p className="inputAlert hide" id="firstNameNotEntered">You must enter your first name to create an account.</p></label>
          <input type="text" className="mainLoginInput" ref={input => this.firstName = input} defaultValue="" placeholder="First name...."></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Last Name<p className="inputAlert hide" id="lastNameNotEntered">You must enter your last to create an account.</p></label>
          <input type="text" className="mainLoginInput" ref={input => this.lastName = input} defaultValue="" placeholder="Last name...."></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Email<p className="inputAlert hide" id="emailNotValid">The email entered is not valid.</p><p className="inputAlert hide" id="emailNotEntered">You must enter an email to create an account.</p></label>
          <input type="text" className="mainLoginInput" ref={input => this.email = input} defaultValue="" placeholder="Email...."></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Username<p className="inputAlert hide" id="usernameNotValid">The username entered is not valid.</p><p className="inputAlert hide" id="usernameNotEntered">You must enter a username to create an account.</p></label>
          <input type="text" className="mainLoginInput" ref={input => this.username = input} defaultValue="" placeholder="Username...."></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Password<p className="inputAlert hide" id="passwordLength">The password must be 6 characters.</p><p className="inputAlert hide" id="passwordNotEntered">You must enter a password to create an account.</p></label>
          <input type="password" className="mainLoginInput" ref={input => this.password = input} defaultValue="" placeholder="Password...."></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Authorization Code<p className="inputAlert hide" id="authorizationCode">The authorization code is incorrect. Please email brad@braddavistech.com.</p></label>
          <input type="password" className="mainLoginInput" ref={input => this.authorizationCode = input} defaultValue="" placeholder="Authorization Code...."></input>
        </section>
        <section className="optionsSection">
          <article className="btnSetSection">
            <label className="mainLoginButtonLabels">Already A User</label>
            <button onClick={() => this.props.history.push("/GroupGuru/userLogin")} className="mainNewLoginButton">Login Now</button>
          </article>
          <article className="btnSetSection">
            <label className="mainLoginButtonLabels">Create Account</label>
            <button onClick={this.saveUser} className="mainNewLoginButton">Save</button>
          </article>
        </section>
      </div>
    )
  }
}
