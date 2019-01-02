import React, { Component } from "react";
import firebase from "firebase";
import "./ExistingUser.css";
import DataModules from "../../modules/dataModules";
import $ from "jquery";
import moment from "moment";
import "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";

const db = firebase.firestore()
export default class UserLogin extends Component {

  addBlur = () => {
    $("#root").addClass("none")
  }

  removeBlur = () => {
    $("#root").removeClass("none")
  }

  login = () => {
    $(".inputAlert").hide()
    let email = this.email.value;
    let password = this.password.value;
    if (password === "") { $("#passwordlNotEntered").show() }
    if (email === "") { $("#emailNotEntered").show() }
    else if (DataModules.emailAndUsernameValidation(email)) {
      if (password.length >= 6) {
        this.loginUser(email, password);
        this.email.value = "";
        this.password.value = "";
      } else { $("#passwordLength").show(); }
    } else { $("#emailNotValid").show() }
  }

  goToMain = () => {
    this.props.history.push("/GroupGuru");
  }

  showError = (error) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div id="GroupGuruAlertLogin">
            <h1 id="mainAlertTitle">Something Went Wrong</h1>
            <div id="alertMessageDiv">
              <section id="errorMessage">
                <p className="errorTitle">{error}</p>
              </section>
              <div className="editProfileBtnSection">
                <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                  this.removeBlur();
                  onClose();
                }} />
              </div>
            </div>
          </div>
        )
      }
    })
  }


  loginUser = (email, password) => {
    let location = { lat: this.props.props.lat, long: this.props.props.long }
    this.addBlur()
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(event => {
        let date = new Date();
        let newLogin = {}
        date = moment(date).utc().format()
        newLogin = {
          userId: event.user.uid,
          loginTimestamp: date,
          loginLocation: location
        }
        let allLogins = []
        db.collection("logins").doc("loginActivity").get().then(login => {
          let loginsTotal = login.data();
          allLogins = loginsTotal.logins;
          allLogins.push(newLogin)
          const myInfo = db.collection("logins").doc("loginActivity")
          myInfo.set({ logins: allLogins })
          this.goToMain()
          this.removeBlur();
        })
      })
      .catch(error => {
        this.showError(error.message)
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
      <div className="mainUserContainer">
        <section className="userTitleSection">
        <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FGroupGuruLogo.png?alt=media&token=645ff366-105a-491d-a069-ad9b195fb8bf" id="existingLoginIcon" alt="Group Guru"/>
          <h1 className="userMainTitle">WELCOME TO</h1>
          <h1 className="ggTitle">GROUP GURU</h1>
        </section>
        <section className="userInputSection">
          <label className="userMainLoginInputLabel">Email</label>
          <p className="inputAlert hide" id="emailNotValid">The email entered is not valid.</p>
          <p className="inputAlert hide" id="emailNotEntered">You must enter an email to login to your account.</p>
          <input type="text" className="userMainLoginInput" ref={input => this.email = input} defaultValue="" placeholder="Email...."></input>
        </section>
        <section className="userInputSection">
          <label className="userMainLoginInputLabel">Password</label>
          <p className="inputAlert hide" id="passwordLength">The password must be 6 characters.</p>
          <p className="inputAlert hide" id="passwordNotEntered">You must enter a password to login to your account.</p>
          <input type="password" className="userMainLoginInput" ref={input => this.password = input} defaultValue="" placeholder="Password...."></input>
        </section>
        <section className="userOptionsSection">
          <article className="userBtnSetSection">
            <label className="userMainLoginButtonLabels">Login Now</label>
            <button onClick={this.login} className="userMainLoginButton">Go</button>
          </article>
          <article className="userBtnSetSection">
            <label className="userMainLoginButtonLabels">New User?</label>
            <button onClick={() => this.props.history.push("/GroupGuru/createAccount")} className="userMainLoginButton">Create Account</button>
          </article>
        </section>
      </div>
    )
  }
}
