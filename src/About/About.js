import React, { Component } from "react";
import "./About.css";

export default class About extends Component {

  render() {
    return (
      <div className="aboutContainer">
      <section className="aboutTitleSection">
      <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FGroupGuruLogo.png?alt=media&token=645ff366-105a-491d-a069-ad9b195fb8bf" id="aboutLoginIcon" alt="Group Guru"/>
        <h1 className="aboutTitle">ABOUT</h1>
        <h1 className="ggTitle">GROUP GURU</h1>
      </section>
      <section className="aboutBodyTextSection">
      <p className="aboutText">If you would like to tour Group Guru, please use email guest@braddavistech.com and password braddavistech to login. (Some functionality will be modified in this mode.)</p>
      <p className="aboutText">Group Guru is an app created to allow for better communication among family members. Whether it is a family recipe, scheduling holiday events, or keeping up with family member addresses, Group Guru puts the information in the hands of its’ users. Group Guru utilizes Google Firestore Database and Firebase Database to store messages, data and other user information, as well as Google Firebase Storage for user image uploads. This application tracks real-time presence on both the mobile and desktop site. All calendar events are stored in UTC time and converted to local time for each user. Locations are acquired through a coordinate-based system and are shown on a map using Google Maps and Google Geocode.  Users are given the ability to edit the information and data that they create, allowing all information to be current for users.</p>
      </section>
      {/* <section className="userInputSection">
        <label className="userMainLoginInputLabel">Email<p className="inputAlert hide" id="emailNotValid">The email entered is not valid.</p><p className="inputAlert hide" id="emailNotEntered">You must enter an email to create an account.</p></label>
        <input type="text" className="userMainLoginInput" ref={input => this.email = input} defaultValue="" placeholder="Email...."></input>
      </section>
      <section className="userInputSection">
        <label className="userMainLoginInputLabel">Password<p className="inputAlert hide" id="passwordLength">The password must be 6 characters.</p><p className="inputAlert hide" id="passwordNotEntered">You must enter a password to create an account.</p></label>
        <input type="password" className="userMainLoginInput" ref={input => this.password = input} defaultValue="" placeholder="Password...."></input>
      </section> */}
      <section className="aboutOptionsSection">
        <article className="aboutBtnSetSection">
          <label className="aboutButtonLabels">Finished?</label>
          <button onClick={() => {
            this.props.history.push("/GroupGuru/")}
            } className="aboutButton">HOME</button>
        </article>
        {/* <article className="aboutBtnSetSection">
          <label className="aboutButtonLabels">New User?</label>
          <button onClick={() => this.props.history.push("/GroupGuru/createAccount")} className="aboutButton">Create Account</button>
        </article> */}
      </section>
    </div>
    )
  }
}