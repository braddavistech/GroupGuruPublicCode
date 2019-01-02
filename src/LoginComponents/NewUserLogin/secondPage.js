import React, { Component } from "react";
import DataModules from "../../modules/dataModules";
import $ from "jquery";
import firebase from "firebase";
import "firebase/firestore";
import { user } from "firebase-functions/lib/providers/auth";
import moment from "moment-timezone";
import jstz from "jstz";

const db = firebase.firestore();

export default class SecondPage extends Component {

  saveInfo = () => {
    let users = {}
    users.phoneNumber = this.phoneNumber.value;
    users.streetAddress = this.streetAddress.value;
    users.city = this.city.value;
    users.stateId = this.stateId.value;
    users.zip = this.zip.value;
    users.birthday = this.birthday.value;
    users.anniversary = this.anniversary.value;
    if (users.phoneNumber === "") { user.phoneNumber = "No Phone Provided." }
    if (users.streetAddress === "") { users.streetAddress = "No Address Provided." }
    if (users.city === "") { users.city = "No City Provided." }
    if (users.stateId === "") { users.stateId = "No State Provided." }
    if (users.zip === "") { users.zip = "No Zipcode Provided." }
    const myInfo = db.collection('users').doc(this.props.props.currentUser.userId)
    myInfo.update(users)

    let allEvents = [];
    this.props.props.Holidays.GlobalEvents.forEach(oldEvent => {
      let TimeZone = jstz.determine();
      let TimeZoneName = TimeZone.name();
      oldEvent.start = moment(oldEvent.start).tz(TimeZoneName)
      oldEvent.start = oldEvent.start.utc().format();
      oldEvent.end = moment(oldEvent.end).tz(TimeZoneName)
      oldEvent.end = oldEvent.end.utc().format()
      allEvents.push(oldEvent)
    })

    if (users.birthday !== "") {
      let event = {}
      let birthday = users.birthday.split("-");
      event.start = "2018-" + birthday[1] + "-" + birthday[2] + "T12:00:00Z";
      event.end = "2018-" + birthday[1] + "-" + birthday[2] + "T12:00:00Z";
      event.allDay = true;
      event.city = "No city given.";
      event.description = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Birthday";
      event.eventId = DataModules.makeRandomId();
      event.type = "local";
      event.imageURL = "birthday picture";
      event.location = "No location given.";
      event.notes = "No notes given.";
      event.streetAddress = "No address given.";
      event.title = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Birthday";
      event.userId = this.props.props.currentUser.userId;
      event.zip = "No zip given.";
      allEvents.push(event)
      let newEvent = {}
      newEvent.start = "2019-" + birthday[1] + "-" + birthday[2] + "T12:00:00Z";
      newEvent.end = "2019-" + birthday[1] + "-" + birthday[2] + "T12:00:00Z";
      newEvent.allDay = true;
      newEvent.city = "No city given.";
      newEvent.description = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Birthday";
      newEvent.eventId = DataModules.makeRandomId();
      newEvent.type = "local";
      newEvent.imageURL = "birthday picture";
      newEvent.location = "No location given.";
      newEvent.notes = "No notes given.";
      newEvent.streetAddress = "No address given.";
      newEvent.title = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Birthday";
      newEvent.userId = this.props.props.currentUser.userId;
      newEvent.zip = "No zip given.";
      allEvents.push(newEvent)
      let nextEvent = {}
      nextEvent.start = "2020-" + birthday[1] + "-" + birthday[2] + "T12:00:00Z";
      nextEvent.end = "2020-" + birthday[1] + "-" + birthday[2] + "T12:00:00Z";
      nextEvent.allDay = true;
      nextEvent.city = "No city given.";
      nextEvent.description = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Birthday";
      nextEvent.eventId = DataModules.makeRandomId();
      nextEvent.type = "local";
      nextEvent.imageURL = "birthday picture";
      nextEvent.location = "No location given.";
      nextEvent.notes = "No notes given.";
      nextEvent.streetAddress = "No address given.";
      nextEvent.title = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Birthday";
      nextEvent.userId = this.props.props.currentUser.userId;
      nextEvent.zip = "No zip given.";
      allEvents.push(nextEvent)
    }
    if (users.anniversary !== "") {
      let anniv = {}
      let anniversary = users.anniversary.split("-");
      anniv.start = "2018-" + anniversary[1] + "-" + anniversary[2] + "T12:00:00Z";
      anniv.end = "2018-" + anniversary[1] + "-" + anniversary[2] + "T12:00:00Z";
      anniv.allDay = true;
      anniv.city = "No city given.";
      anniv.description = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Anniversary";
      anniv.eventId = DataModules.makeRandomId();
      anniv.type = "local";
      anniv.imageURL = "birthday picture";
      anniv.location = "No location given.";
      anniv.notes = "No notes given.";
      anniv.streetAddress = "No address given.";
      anniv.title = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Anniversary";
      anniv.userId = this.props.props.currentUser.userId;
      anniv.zip = "No zip given.";
      allEvents.push(anniv)
      let newsEvent = {}
      newsEvent.start = "2019-" + anniversary[1] + "-" + anniversary[2] + "T12:00:00Z";
      newsEvent.end = "2019-" + anniversary[1] + "-" + anniversary[2] + "T12:00:00Z";
      newsEvent.allDay = true;
      newsEvent.city = "No city given.";
      newsEvent.description = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Anniversary";
      newsEvent.eventId = DataModules.makeRandomId();
      newsEvent.type = "local";
      newsEvent.imageURL = "birthday picture";
      newsEvent.location = "No location given.";
      newsEvent.notes = "No notes given.";
      newsEvent.streetAddress = "No address given.";
      newsEvent.title = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Anniversary";
      newsEvent.userId = this.props.props.currentUser.userId;
      newsEvent.zip = "No zip given.";
      allEvents.push(newsEvent)
      let nextEvent = {}
      nextEvent.start = "2020-" + anniversary[1] + "-" + anniversary[2] + "T12:00:00Z";
      nextEvent.end = "2020-" + anniversary[1] + "-" + anniversary[2] + "T12:00:00Z";
      nextEvent.allDay = true;
      nextEvent.city = "No city given.";
      nextEvent.description = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Anniversary";
      nextEvent.eventId = DataModules.makeRandomId();
      nextEvent.type = "local";
      nextEvent.imageURL = "birthday picture";
      nextEvent.location = "No location given.";
      nextEvent.notes = "No notes given.";
      nextEvent.streetAddress = "No address given.";
      nextEvent.title = this.props.props.currentUser.firstName + " " + this.props.props.currentUser.lastName + "'s Birthday";
      nextEvent.userId = this.props.props.currentUser.userId;
      nextEvent.zip = "No zip given.";
      allEvents.push(nextEvent)
    }

    db.collection("events").doc("GlobalEvents").set({ GlobalEvents: allEvents })

    this.props.history.push("/GroupGuru/createAccount/Page3");
  }

  stateOptions = () => {
    let i = 0;
    let options = DataModules.stateOpts();
    return (
      <select name="stateId" size="5" className="stateSelect" ref={input => this.stateId = input}>Select Your State
        {
          options.map(stateOption => {
            i++
            return <option value={stateOption.value} key={i} className="stateIdOpts">{stateOption.title}</option>
          })
        }
      </select>
    )
  }

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    let states = this.stateOptions()
    return (
      <div className="mainContainer">
        <section className="titleSection">
          <h1 className="mainTitle">Please Complete Your Profile</h1>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Birthday</label>
          <input type="date" className="mainLoginInput" ref={input => this.birthday = input} ></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Anniversary</label>
          <input type="date" className="mainLoginInput" ref={input => this.anniversary = input} ></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Phone</label>
          <input type="text" className="mainLoginInput" ref={input => this.phoneNumber = input} placeholder="Phone number...."></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Street Address</label>
          <input type="text" className="mainLoginInput" ref={input => this.streetAddress = input} placeholder="Street Address...."></input>
        </section>
        <section className="cityStateZipSection">
          <section className="inputAddressSection">
            <label className="mainLoginInputAddressLabel">City</label>
            <input type="text" className="mainLoginInput" ref={input => this.city = input} placeholder="City...."></input>
          </section>
          <section className="inputAddressSection">
            <label className="mainLoginInputAddressLabel">State</label>
            {states}
          </section>
          <section className="inputAddressSection">
            <label className="mainLoginInputAddressLabel">Zip Code</label>
            <input type="text" className="mainLoginInput" ref={input => this.zip = input} placeholder="Zip...."></input>
          </section>
        </section>
        <section className="optionsSection">
          <article className="btnSetSection">
            <label className="mainLoginButtonLabels">Skip For Now</label>
            <button onClick={() => this.props.history.push("/GroupGuru")} className="mainLoginButton">Skip</button>
          </article>
          <article className="btnSetSection">
            <label className="mainLoginButtonLabels">Continue</label>
            <button onClick={this.saveInfo} className="mainLoginButton">Save</button>
          </article>
        </section>
      </div>
    )
  }
}