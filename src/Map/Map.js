import React, { Component } from "react";
import GoogleMapReact from 'google-map-react';
import DataModules from "../modules/dataModules";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import $ from "jquery";
import Geocode from "react-geocode";
import "./Map.css";


export default class Map extends Component {
  state = {
    onlineNow: 0
  }

  addBlur = () => {
    $("#root").addClass("none");
    $(".navBarContainer").addClass("none");
  }

  clearBlur = () => {
    $("#root").removeClass("none");
    $(".navBarContainer").removeClass("none");
  }

  seeOnline = () => {
    this.addBlur();
    confirmAlert({
      customUI: ({ onClose }) => {
        let loggedIn = this.props.props.loggedIn;
        let usersOnline = []
        this.props.props.users.forEach(person => {
          if (loggedIn[person.userId] !== undefined) {
            if (loggedIn[person.userId].online) {
              let newUser = {};
              newUser.user = person;
              newUser.lastLoggedIn = loggedIn[person.userId].lastLoggedIn;
              usersOnline.push(newUser);
            }
          }
        })
        return (
          <div id="LoginActivityList">
            <h1 id="mainProfileActivityTitle">Users Currently Online</h1>
            <div id="loginActivityDiv">
              {
                usersOnline.map(usersOnline => {
                  return <p className="activityItem"><img src={usersOnline.user.photoURL} id={DataModules.makeRandomId()} className="userPicSheet" alt="Profile Shot" />{usersOnline.user.firstName} {usersOnline.user.lastName} - Last logged in {moment(`${usersOnline.lastLoggedIn}`).fromNow()}</p>
                })
              }
            </div>
            <div className="activityBtnSection">
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                this.clearBlur();
                onClose();
              }} />
            </div>
          </div>
        )
      }
    })
  }

  seeHistory = () => {
    this.addBlur();
    confirmAlert({
      customUI: ({ onClose }) => {
        let logins = this.props.props.loginActivity.logins;
        logins.sort(function (a, b) {
          return new Date(b.loginTimestamp) - new Date(a.loginTimestamp);
        });
        return (
          <div id="LoginActivityList">
            <h1 id="mainProfileActivityTitle">Recent Login Activity</h1>
            <div id="loginActivityDiv">
              {
                logins.map(user => {
                  return <p className="activityItem">{user.user.firstName} {user.user.lastName}, last logged in {moment(`${user.loginTimestamp}`).fromNow()}</p>
                })
              }
            </div>
            <div className="activityBtnSection">
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                this.clearBlur();
                onClose();
              }} />
            </div>
          </div>
        )
      }
    })
  }


  getMapOptions = (maps) => {
    return {
      streetViewControl: false,
      scaleControl: true,
      fullscreenControl: false,
      styles: [{
        featureType: "poi.business",
        elementType: "labels",
        stylers: [{
          visibility: "off"
        }]
      }],
      gestureHandling: "greedy",
      disableDoubleClickZoom: true,
      minZoom: 3,
      maxZoom: 22,

      mapTypeControl: true,
      mapTypeId: maps.MapTypeId.SATELLITE,
      mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: maps.ControlPosition.BOTTOM_CENTER,
        mapTypeIds: [
          maps.MapTypeId.ROADMAP,
          maps.MapTypeId.SATELLITE,
          maps.MapTypeId.HYBRID
        ]
      },
      zoomControl: true,
      clickableIcons: false
    };
  }

  showDetails = (user, address) => {
    this.addBlur();
    confirmAlert({
      customUI: ({ onClose }) => {
        if (this.props.props.currentUser.userId !== "pgk933mCJVSOJg4DjnM0YPlkpW93") {
          return (
            <div id="GroupGuruLoginActivityProfile">
              <h1 id="mainProfileActivityTitle">ACTIVITY INFORMATION</h1>
              <div id="mainProfileActivityDiv">
                <section id="activityColumn">
                  <section className="activitySection">
                    <p id="mainActivityName">{user.user.firstName} {user.user.lastName}</p>
                  </section>
                  <section className="activitySection">
                    <img src={user.user.photoURL} className="activityPicImage" alt="contactImage" />
                    <p className="activityData">@{user.user.displayName}</p>
                  </section>
                  <section className="activitySection">
                    <p className="activityData">Logged in {moment(`${user.loginTimestamp}`).fromNow()} @</p>
                    <p className="activityData">{address}</p>
                  </section>
                  <section className="activitySection">
                    <p className="activityData">Phone Number</p>
                    <p className="activityData">{user.user.phoneNumber}</p>
                    <p className="activityData">Address</p>
                    <p className="activityData">{user.user.streetAddress}</p>
                    <p className="activityData">{user.user.city}, {user.user.stateId} {user.user.zip}</p>
                  </section>
                </section>
              </div>
              <div className="activityBtnSection">
                <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                  this.clearBlur();
                  onClose();
                }} />
              </div>
            </div>
          )
        } else {
          return (
            <div id="GroupGuruLoginActivityProfile">
              <h1 id="mainProfileActivityTitle">ACTIVITY INFORMATION</h1>
              <div id="mainProfileActivityDiv">
                <section id="activityColumn">
                  <section className="activitySection">
                    <p id="mainActivityName">{user.user.firstName} {user.user.lastName}</p>
                  </section>
                  <section className="activitySection">
                    <img src={user.user.photoURL} className="activityPicImage" alt="contactImage" />
                    <p className="activityData">@{user.user.displayName}</p>
                  </section>
                  <section className="activitySection">
                    <p className="activityData">Logged in {moment(`${user.loginTimestamp}`).fromNow()} @</p>
                    <p className="activityData">(Hidden)</p>
                  </section>
                  <section className="activitySection">
                    <p className="activityData">Phone Number</p>
                    <p className="activityData">(Hidden)</p>
                    <p className="activityData">Address</p>
                    <p className="activityData">(Hidden)</p>
                    <p className="activityData">{user.user.city}, {user.user.stateId} {user.user.zip}</p>
                  </section>
                </section>
              </div>
              <div className="activityBtnSection">
                <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                  this.clearBlur();
                  onClose();
                }} />
              </div>
            </div>
          )
        }
      }
    })
  }

  streetAddressLogin = (user) => {
    Geocode.setApiKey("NEED OWN KEY");
    Geocode.fromLatLng(user.loginLocation.lat, user.loginLocation.long).then(
      response => {
        const address = response.results[0].formatted_address;
        this.showDetails(user, address)
      },
      error => {
      }
    ).then(address => {
      return address
    })
  }

  streetAddressOnline = (user) => {
    Geocode.setApiKey("NEED OWN KEY");
    Geocode.fromLatLng(user.loginLocation.lat, user.loginLocation.long).then(
      response => {
        const address = response.results[0].formatted_address;
        this.loggedInDetails(user, address)
      },
      error => {
      }
    ).then(address => {
      return address
    })
  }

  loggedInDetails = (user, address) => {
    this.addBlur();

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div id="GroupGuruLoginActivityProfile">
            <h1 id="mainProfileActivityTitle">CURRENTLY ONLINE</h1>
            <div id="mainProfileActivityDiv">
              <section id="activityColumn">
                <section className="activitySection">
                  <p id="mainActivityName">{user.firstName} {user.lastName}</p>
                </section>
                <section className="activitySection">
                  <img src={user.photoURL} className="activityPicImage" alt="contactImage" />
                  <p className="activityData">@{user.displayName}</p>
                </section>
                <section className="activitySection">
                  <p className="activityData">Online Now @</p>
                  <p className="activityData">{address}</p>
                </section>
                <section className="activitySection">
                  <p className="activityData">Phone Number</p>
                  <p className="activityData">{user.phoneNumber}</p>
                  <p className="activityData">Address</p>
                  <p className="activityData">{user.streetAddress}</p>
                  <p className="activityData">{user.city}, {user.stateId} {user.zip}</p>
                </section>
              </section>
            </div>
            <div className="activityBtnSection">
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                this.clearBlur();
                onClose();
              }} />
            </div>
          </div>
        )
      }
    })
  }

  addLoginActivity = () => {
    if (this.props.props.loginActivity !== null && this.props.props.users !== null) {
      this.props.props.loginActivity.logins.forEach(login => {
        this.props.props.users.forEach(user => {
          if (user.userId === login.userId) {
            login.user = user
          }
        })
      })
      return this.props.props.loginActivity.logins.map(user => {
        return <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FmapPin.png?alt=media&token=d71ed0b9-f592-48d8-9652-2976bd10a4bc" className="loginActivityPin" id={DataModules.makeRandomId()} lat={user.loginLocation.lat - .0000035} lng={user.loginLocation.long + .00006} onClick={() => this.streetAddressLogin(user)} alt="Login Location" />
      })
    }
  }


  trackOnlineUsers = () => {
    let onlineNow = []
    let allUsers = this.props.props.users;
    if (allUsers !== null) {
      allUsers.forEach(user => {
        let tempUser = this.props.props.loggedIn[user.userId]
        if (tempUser !== undefined) {

          if (tempUser.online) {
            user.locationNow = tempUser;
            onlineNow.push(user)
          }
        }
      })

      return onlineNow.map(user => {
        if (this.props.props.currentUser.userId !== user.userId) {
          if (user.loginLocation.long !== undefined) {
            return <img src={user.photoURL} className="onlineActivityPin" key={DataModules.makeRandomId()} lat={user.loginLocation.lat - .0000035} lng={user.loginLocation.long + .00006}
              onClick={() => this.streetAddressOnline(user)}
              alt="online" />
          }
        }
      })
    }
  }

  userOnlineMap = () => {
    return <div id="map">
      <GoogleMapReact bootstrapURLKeys={{ key: "NEED OWN KEY" }} options={this.getMapOptions} defaultCenter={{ lat: this.props.props.lat, lng: this.props.props.long }} defaultZoom={9}>
        <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FyouAreHere.png?alt=media&token=acd8c1ff-d4e2-4f6b-ac7b-b2c5b2cb1f5b" className="mapPointer" lat={this.props.props.lat - .0000035} lng={this.props.props.long + .00006}
          alt="Your location." />
        {this.trackOnlineUsers()}
      </GoogleMapReact>
    </div>
  }

  roadMap = () => {
    console.log("testing")
    return <div id="map">
      <GoogleMapReact bootstrapURLKeys={{ key: "NEED OWN KEY" }} options={this.getMapOptions} defaultCenter={{ lat: this.props.props.lat, lng: this.props.props.long }} defaultZoom={9}>
        <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FyouAreHere.png?alt=media&token=acd8c1ff-d4e2-4f6b-ac7b-b2c5b2cb1f5b" className="mapPointer" lat={this.props.props.lat} lng={this.props.props.long + .00006}
          alt="Your location." />
        {this.addLoginActivity()}
      </GoogleMapReact>
    </div>
  }


  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    if (this.props.props.loginActivity !== null) {
      if (this.props.props.currentUser.userId !== "pgk933mCJVSOJg4DjnM0YPlkpW93") {
        return (
          <div className="mainMapContainer">
            <section id="activityMap">
              <h1 className="mapsLabel">ALL LOGIN LOCATIONS</h1>
              {this.roadMap()}
              <button onClick={() => this.seeHistory()} id="showLogins">SHOW ALL ACTIVITY</button>
            </section>
            <section id="onlineMap">
              <h1 className="mapsLabel">USERS CURRENTLY ONLINE
            </h1>
              {this.userOnlineMap()}
              <button onClick={() => this.seeOnline()} id="showLogins">SHOW ONLINE USERS</button>
            </section>
          </div>
        )
      } else {
        return (
          <div className="mainMapContainer">
            <section id="activityMap">
              <h1 className="mapsLabel">ALL LOGIN LOCATIONS</h1>
              {this.roadMap()}
            </section>
            <section id="onlineMap">
              <h1 className="mapsLabel">USERS CURRENTLY ONLINE
              </h1>
              {this.userOnlineMap()}
            </section>
          </div>
        )
      }
    } else {
      return (
        <div className="mainAddressContainer">
          <h1 className="mapsLabel" >Map Loading...</h1>
        </div>
      )
    }
    // }
  }
}
