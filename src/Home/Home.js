import React, { Component } from "react";
import "./home.css";
import $ from "jquery";

export default class Home extends Component {
  state = {
    mainPage: false,
    aboutPage: false,
    showOptions: false,
    showFeatureOptions: false
  }

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    return (
      <div className="mainHomeContainer">
        <section id="mainTitleHeader">
          <article id="ggLogo"><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FGroupGuruLogo.png?alt=media&token=645ff366-105a-491d-a069-ad9b195fb8bf" alt="ggLogo" id="homeGGIcon" /></article>
          <h1 id="homePageTitle">GROUP GURU</h1>
        </section>
        <div className="homeOptions">
          <section className="indivHomeOptions" onClick={() => this.props.history.push("/GroupGuru/AddressBook")}>
            <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FaddressBookMainIcon.png?alt=media&token=ffa57c05-2b1a-45ca-ae7e-56be49141ef7" className="indivHomeOptionsIcon" alt="Address Book Icon" />
            <p className="indivHomeOptionsText">Address Book</p>
          </section>
          <section className="indivHomeOptions" onClick={() => this.props.history.push("/GroupGuru/Messages")}>
            <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2Fmessage.png?alt=media&token=48b92fdc-2246-44c3-9bd9-de3ffc4c8b64" className="indivHomeOptionsIcon" alt="Messages Icon" />
            <p className="indivHomeOptionsText">Messages</p>
          </section>
          <section className="indivHomeOptions" onClick={() => this.props.history.push("/GroupGuru/Calendar")}>
            <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FcalendarMainIcon.png?alt=media&token=b971010b-25f0-4bed-8455-5f4dbdf620dd" className="indivHomeOptionsIcon" alt="Calendar Icon" />
            <p className="indivHomeOptionsText">Calendar</p>
          </section>
          <section className="indivHomeOptions" onClick={() => this.props.history.push("/GroupGuru/Photos")}>
            <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2Fcamera.png?alt=media&token=1803862e-ba6a-4b9d-9872-86aa25054986" className="indivHomeOptionsIcon" alt="Photos Icon" />
            <p className="indivHomeOptionsText">Photos</p>
          </section>
          <section className="indivHomeOptions" onClick={() => this.props.history.push("/GroupGuru/Recipes")}>
            <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2Frecipes.png?alt=media&token=f00b5c2a-241e-4d16-a6a7-9f6474dd0ba5" className="indivHomeOptionsIcon" alt="Recipes Icon" />
            <p className="indivHomeOptionsText">Recipes</p>
          </section>
          <section className="indivHomeOptions" onClick={() => {
            this.props.history.push("/GroupGuru/Map")
          }}>
            <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2Fmap.png?alt=media&token=4a1b66c2-6116-4adf-ade8-6ca5e9c2f94c" className="indivHomeOptionsIcon" alt="Map Icon" />
            <p className="indivHomeOptionsText">Map</p>
          </section>
        </div>
      </div>
    )
  }
}
