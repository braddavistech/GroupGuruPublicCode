import React, { Component } from "react";
import BigCalendar from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";
import { confirmAlert } from "react-confirm-alert";
import $ from "jquery";
import moment from "moment-timezone";
import jstz from "jstz";
import "firebase/firestore";
import DataModules from "../modules/dataModules";
import firebase from "firebase";
const db = firebase.firestore();

export default class Calendar extends Component {
  state = {
    localizer: BigCalendar.momentLocalizer(moment),
    message: null,
    messageLoaded: false,
    editProcess: false,
    title: "",
    start: "",
    end: "",
    description: "",
    location: "",
    streetAdd: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
    allDay: {}
  }

  addBlur = () => {
    $("#root").addClass("none");
    $(".navBarContainer").addClass("none");
  }

  clearBlur = () => {
    $("#root").removeClass("none");
    $(".navBarContainer").removeClass("none");
  }

  messageNull = () => {
    this.setState({ message: null })
  }

  stateOptions = (user) => {
    let i = 0;
    let options = DataModules.stateOpts();
    return (
      <select name="stateId" size="5" className="stateSelectEdit" defaultValue={user.stateId} ref={input => this.stateId = input}>Select Your State
        {
          options.map(stateOption => {
            i++
            return <option value={stateOption.value} key={i} className="stateIdOptsEdit">{stateOption.title}</option>
          })
        }
      </select>
    )
  }

  showState = () => {
    let i = 0;
    let options = DataModules.stateOpts();
    return (
      <select name="stateId" size="5" className="stateSelectEdit" ref={input => this.stateId = input}>Select Your State
        {
          options.map(stateOption => {
            i++
            return <option value={stateOption.value} key={i} className="stateIdOptsEdit">{stateOption.title}</option>
          })
        }
      </select>
    )
  }

  saveEventEdit = () => {
    let TimeZone = jstz.determine();
    let TimeZoneName = TimeZone.name();
    let monthDate = this.start.value.split("T");
    monthDate = monthDate[0] + " " + monthDate[1];
    let tempValue = moment(monthDate).tz(TimeZoneName)
    tempValue = tempValue.utc().format()
    let start = tempValue;
    monthDate = this.end.value.split("T");
    monthDate = monthDate[0] + " " + monthDate[1];
    tempValue = moment(monthDate).tz(TimeZoneName)
    tempValue = tempValue.utc().format()
    let end = tempValue;
    let eventUpdate = { id: this.state.message.id }
    if (this.title.value !== "") eventUpdate.title = this.title.value;
    if (this.start.value !== "") eventUpdate.start = start;
    if (this.end.value !== "") eventUpdate.end = end;
    if (this.description.value !== "") eventUpdate.description = this.description.value;
    if (this.location.value !== "") eventUpdate.location = this.location.value;
    if (this.streetAdd.value !== "") eventUpdate.streetAdd = this.streetAdd.value;
    if (this.city.value !== "") eventUpdate.city = this.city.value;
    if (this.stateInput.value !== "") eventUpdate.state = this.stateInput.value;
    if (this.state.zip !== "") eventUpdate.zip = this.state.zip;
    if (this.notes.value !== "") eventUpdate.notes = this.notes.value;
    if (this.allDay.value === "false") eventUpdate.allDay = false;
    if (this.allDay.value === "true") eventUpdate.allDay = true;
  }

  saveEvent = () => {
    let event = {};
    let TimeZone = jstz.determine();
    let TimeZoneName = TimeZone.name();
    if (this.allDay.value === "true") {
      event.allDay = true
      event.start = this.start.value.split("T")
      event.start = event.start[0] + "T12:00:00Z";
      event.end = this.end.value.split("T");
      event.end = event.end[0] + "T12:00:00Z";
    } else {
      let monthDate = this.start.value.split("T");
      monthDate = monthDate[0] + " " + monthDate[1];
      let tempValue = moment(monthDate).tz(TimeZoneName)
      tempValue = tempValue.utc().format()
      event.start = tempValue;
      monthDate = this.end.value.split("T");
      monthDate = monthDate[0] + " " + monthDate[1];
      tempValue = moment(monthDate).tz(TimeZoneName)
      tempValue = tempValue.utc().format()
      event.end = tempValue;
      event.allDay = false
    }
    event.title = this.title.value;
    event.description = this.description.value;
    event.location = this.location.value;
    event.phoneNumber = this.phoneNumber.value;
    event.streetAddress = this.streetAddress.value;
    event.city = this.city.value;
    event.stateId = this.stateId.value;
    event.zip = this.zip.value;
    event.notes = this.notes.value;
    event.eventId = DataModules.makeRandomId();
    event.userId = this.props.props.currentUser.userId;
    event.eventType = "local";
    let canSave = true;
    if (!this.title.value.replace(/\s/g, "").length) canSave = false;
    if (!this.start.value.replace(/\s/g, "").length) canSave = false;
    if (!this.end.value.replace(/\s/g, "").length) canSave = false;
    if (!this.description.value.replace(/\s/g, "").length) event.description = "No description given.";
    if (!this.location.value.replace(/\s/g, "").length) event.location = "No location given.";
    if (!this.phoneNumber.value.replace(/\s/g, "").length) event.phoneNumber = "No phone given.";
    if (!this.streetAddress.value.replace(/\s/g, "").length) event.streetAddress = "No address given.";
    if (!this.city.value.replace(/\s/g, "").length) event.city = "No city given.";
    if (!this.state.zip.replace(/\s/g, "").length) event.zip = "No zip given.";
    if (!this.notes.value.replace(/\s/g, "").length) event.notes = "No notes given.";
    if (this.allDay.value === "true") event.allDay = true
    else event.allDay = false
    if (!this.allDay.value.replace(/\s/g, "").length) event.allDay = true;
    if (canSave) {
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
      allEvents.push(event)
      db.collection("events").doc("GlobalEvents").set({ GlobalEvents: allEvents })
    }
    this.clearBlur();
  }

  endEdit = () => {
    this.setState({ editProcess: false }, () => {
      this.props.refresh();
    })
  }

  addEvent = (start, end) => {
    this.addBlur()
    return (
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="addEvent">
              <div className="eventEditDetailsAlert">
                <p id="eventTitleAlert">ADD EVENT</p>
                <section className="eventAddContainer">
                  <label className="newEventLabel" htmlFor="title">Title</label>
                  <input className="newEventInput" type="text" ref={input => this.title = input} id="title" name="title" placeholder="Enter Event Title"></input>
                </section>
                <section className="dateSelectContainer">
                  <section className="dateSelect">
                    <label className="newEventLabel" htmlFor="start">Start</label>
                    <input className="newEventDate" type="datetime-local" defaultValue={start} ref={input => this.start = input} id="start" name="start" min={new Date()} max="2023-12-31T00:00"></input>
                  </section>
                  <section className="dateSelect">
                    <label className="newEventLabel" htmlFor="end">End</label>
                    <input className="newEventDate" type="datetime-local" defaultValue={end} ref={input => this.end = input} id="end" name="end" min={new Date()} max="2023-12-31T00:00"></input>
                  </section>
                </section>
                <section className="eventAddContainer">
                  <label className="newEventLabel" htmlFor="duration">Will This Last All Day?</label>
                  <select className="durationSelect" defaultValue={true} ref={input => this.allDay = input} id="allDay">
                    <option value={false}>No</option>
                    <option value={true}>Yes</option>
                  </select>
                </section>
                <section className="eventAddContainer">
                  <label className="newEventLabel" htmlFor="description">Description</label>
                  <input className="newEventInput" type="text" name="description" ref={input => this.description = input} id="description" placeholder="Enter Event Description"></input>
                </section>
                <section className="eventAddContainer">
                  <label className="newEventLabel" htmlFor="location">Location of Event</label>
                  <input className="newEventInput" type="text" name="location" ref={input => this.location = input} id="location" placeholder="Enter Event Location"></input>
                </section>
                <section className="eventAddAddress">
                  <p className="editProfileLabel">Phone Number</p>
                  <input className="editProfileInput" ref={input => this.phoneNumber = input} placeholder="Phone number...."></input>
                  <p className="editProfileLabel">Address</p>
                  <input className="editProfileInput" ref={input => this.streetAddress = input} placeholder="Address...."></input>
                  <label className="editProfileLabel">City</label>
                  <input type="text" className="editProfileInput" ref={input => this.city = input} placeholder="City...."></input>
                  <section className="editProfileCityStateZipSection">
                    <section className="editAddressSection">
                      <label className="mainProfileInputAddressLabel">State</label>
                      {this.showState()}
                    </section>
                    <section className="editAddressSection">
                      <label className="mainProfileInputAddressLabel">Zip Code</label>
                      <input type="text" className="editProfileLocationInput" ref={input => this.zip = input} placeholder="Zip...."></input>
                    </section>
                  </section>
                </section>
                <section className="eventNotesContainer">
                  <p className="editProfileLabel">Notes</p>
                  <textarea className="eventNotes" ref={input => this.notes = input} ></textarea>
                </section>
              </div>
              <div className="eventAddBtnSection">
                <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                  this.clearBlur();
                  onClose();
                }} />
                <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FsaveIcon.jpg?alt=media&token=4cfa4233-9546-461f-9bcc-bb1218984727" className="editConfirmation" alt="Save" onClick={() => {
                  this.saveEvent();
                  onClose();
                }} />
              </div>
            </div>
          )
        }
      })
    )
  }

  eventShow = (event) => {
    if (event.event.eventType === "global") {
      return <section className="indivEventGlobal" key={DataModules.makeRandomId()}>
        <img src={event.event.imageURL} className="eventImage" alt="event" />
        <p className="eventTitle">{event.title}</p>
      </section>
    } else if (event.event.userId === this.props.props.currentUser.userId) {
      return <section className="indivEventMine" key={DataModules.makeRandomId()}>
        <img src={this.props.props.currentUser.photoURL} className="eventImage" alt="event" />
        <p className="eventTitle">{event.title}</p>
      </section>
    } else {
      let thisEventAuthor = {}
      this.props.props.users.forEach(user => {
        if (user.userId === event.event.userId) {
          thisEventAuthor = user;
        }
      })
      return <section className="indivEventOther" key={DataModules.makeRandomId()}>
        <img src={thisEventAuthor.photoURL} className="eventImage" alt="event" />
        <p className="eventTitle">{event.title}</p>
      </section>
    }
  }

  setEvents = () => {
    let events = this.props.props.Holidays.GlobalEvents;
    events.forEach(event => {
      event.start = moment.utc(event.start).toDate();
      event.end = moment.utc(event.end).toDate();
    })
    return events
  }

  eventAuthorDetails = (event) => {
    let userInfo = {};
    this.props.props.users.forEach(user => {
      if (user.userId === event.userId) {
        userInfo = user
      }
    })
    if (userInfo.phoneNumber !== "No phone provided.") {
      return (
        <section className="eventDetailsNotesSection">
          <p className="eventTitleDetailsLocation">Details/Notes</p>
          <p className="eventTitleDetailsLocation">{event.notes}</p>
          <p className="eventTitleDetailsLocation">Event created by {userInfo.displayName} <img src={userInfo.photoURL} className="eventAuthorPic" alt="author pic" /></p>
          <p className="eventTitleDetailsLocation">Call {userInfo.firstName} @ {userInfo.phoneNumber} for more information.</p>
        </section>
      )
    } else {
      return (
        <section className="eventDetailsNotesSection">
          <p className="eventTitleDetailsLocation">Details/Notes</p>
          <p className="eventTitleDetailsLocation">{event.notes}</p>
          <p className="eventTitleDetailsLocation">Event created by {userInfo.displayName} <img src={userInfo.photoURL} className="eventAuthorPic" alt="author pic" /></p>
        </section>
      )
    }
  }

  eventDetails = (event) => {
    return (
      confirmAlert({
        customUI: ({ onClose }) => {
          this.addBlur();
          return (
            <div className="eventDetailsAlert">
              <p className="eventTitleDetailsMain">{event.title}</p>
              <p className="eventTitleDetailsSub">{event.description}</p>
              <p className="eventTitleDetailsSub">Begins {moment.utc(event.start).format("dddd, MMMM Do, YYYY @ h:mm A")}</p>
              <p className="eventTitleDetailsSub">Ends {moment.utc(event.end).format("dddd, MMMM Do, YYYY @ h:mm A")}</p>
              <section className="eventDetailsAddressSection">
                <p className="eventTitleDetailsLocation">Location</p>
                <p className="eventTitleDetailsLocation">{event.location}</p>
                <p className="eventTitleDetailsAddress">{event.streetAdd}</p>
                <p className="eventTitleDetailsAddress">{event.city}, {event.stateId} {event.zip}</p>
              </section>
              {this.eventAuthorDetails(event)}
              <div className="eventBtnSection" onClick={() => {
                  this.clearBlur();
                  onClose();
              }}>
                <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="eventConfirmation" alt="Back"/>
                <p className="directNavButtonLabel">BACK</p>
              </div>
            </div>
          )
        }
      })
    )
  }

  eventDetailsGuest = (event) => {
    return (
      confirmAlert({
        customUI: ({ onClose }) => {
          this.addBlur();
          return (
            <div className="eventDetailsAlert">
              <p className="eventTitleDetailsMain">{event.title}</p>
              <p className="eventTitleDetailsSub">Description (Hidden)</p>
              <p className="eventTitleDetailsSub">Begins {moment.utc(event.start).format("dddd, MMMM Do, YYYY @ h:mm A")}</p>
              <p className="eventTitleDetailsSub">Ends {moment.utc(event.end).format("dddd, MMMM Do, YYYY @ h:mm A")}</p>
              <section className="eventDetailsAddressSection">
                <p className="eventTitleDetailsLocation">Location</p>
                <p className="eventTitleDetailsLocation">(Hidden)</p>
                <p className="eventTitleDetailsAddress">{event.city}, {event.stateId} {event.zip}</p>
              </section>
              <div className="eventBtnSection" onClick={() => {
                  this.clearBlur();
                  onClose();
              }}>
                <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="eventConfirmation" alt="Back"/>
                <p className="directNavButtonLabel">BACK</p>
              </div>
            </div>
          )
        }
      })
    )
  }

  addEventDetails = (event) => {
    let eventStart = moment(event.start).format("YYYY-MM-DDTHH:mm").toString()
    let eventEnd = moment(event.end).format("YYYY-MM-DDTHH:mm").toString()
    this.addEvent(eventStart, eventEnd)
  }

  render() {
    let events = this.setEvents()
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    if (this.props.props.currentUser.userId !== "pgk933mCJVSOJg4DjnM0YPlkpW93") {
    return (
      <div className="mainCalendarContainer">
        <h1 id="calendarTitle">CALENDAR</h1>
        <p id="clickDirections">Click any open spot to add an event or click event to see details.</p>
        <section id="calendarColorSection">
        <p id="holidayEventColor">HOLIDAYS</p>
          <p id="myEventColor">YOUR EVENTS</p>
          <p id="otherEventColor">OTHER USER EVENTS</p>
        </section>
        <section id="calendarSection">
          <BigCalendar id="calendar" components={{ event: this.eventShow }} selectable timeslots={2} step={60} onSelectSlot={(slot) => this.addEventDetails(slot)} onSelectEvent={(event) => { this.eventDetails(event) }} localizer={this.state.localizer} defaultView="month" events={events} startAccessor="start" endAccessor="end" />
        </section>
        <section id="calendarSectionSmall">
          <BigCalendar id="calendar" components={{ event: this.eventShow }} selectable timeslots={2} step={60} onSelectSlot={(slot) => this.addEventDetails(slot)} onSelectEvent={(event) => { this.eventDetails(event) }} localizer={this.state.localizer} defaultView="agenda" events={events} startAccessor="start" endAccessor="end" />
        </section>
      </div>
    )
    } else {
      return (
        <div className="mainCalendarContainer">
          <h1 id="calendarTitle">CALENDAR</h1>
          <p id="clickDirections">Click any open spot to add an event or click event to see details.</p>
          <section id="calendarColorSection">
          <p id="holidayEventColor">HOLIDAYS</p>
            <p id="myEventColor">YOUR EVENTS</p>
            <p id="otherEventColor">OTHER USER EVENTS</p>
          </section>
          <section id="calendarSection">
            <BigCalendar id="calendar" components={{ event: this.eventShow }} selectable timeslots={2} step={60} onSelectEvent={(event) => { this.eventDetailsGuest(event) }} localizer={this.state.localizer} defaultView="month" events={events} startAccessor="start" endAccessor="end" />
          </section>
          <section id="calendarSectionSmall">
            <BigCalendar id="calendar" components={{ event: this.eventShow }} selectable timeslots={2} step={60} onSelectEvent={(event) => { this.eventDetailsGuest(event) }} localizer={this.state.localizer} defaultView="agenda" events={events} startAccessor="start" endAccessor="end" />
          </section>
        </div>
      )
    }

  }
}
