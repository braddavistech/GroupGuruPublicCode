import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import "./Navbar.css";

export default class NavBar extends Component {
  state = {
    mainPage: false,
    aboutPage: false,
    showOptions: false,
    showFeatureOptions: false
  }

  logOut = () => {
    $(".navbarUserOptions").hide();
    $("#userOptionLinks").hide();
    $(".navbarFeatureOptionsText").hide();
    this.setState({ showOptions: false, showFeatureOptions: false }, () => this.props.logOut());
  }

  showOptions = () => {
    if (!this.state.showOptions) {
      $(".navbarUserOptions").show();
      $("#userOptionLinks").hide();
      $(".navbarFeatureOptionsText").hide();
      this.setState({ showOptions: true, showFeatureOptions: false })
    } else {
      $(".navbarUserOptions").hide();
      this.setState({ showOptions: false })
    }
  }

  showFeatureOptions = () => {
    if (!this.state.showFeatureOptions) {
      $("#userOptionLinks").show();
      $(".navbarFeatureOptionsText").show();
      $(".navbarUserOptions").hide();
      this.setState({ showFeatureOptions: true, showOptions: false })
    } else {
      $("#userOptionLinks").hide();
      $(".navbarFeatureOptionsText").hide();
      this.setState({ showFeatureOptions: false })
    }
  }

  messagesPage = () => {
    $(".navbarUserOptions").hide();
    $("#userOptionLinks").hide();
    $(".navbarFeatureOptionsText").hide();
    this.setState({ showOptions: false, showFeatureOptions: false });
  }
  profilePic = () => {
    if (this.props.currentUser.photoURL === null || this.props.currentUser.photoURL === undefined) {
      return
    } else {
      return <img src={this.props.currentUser.photoURL} className="navbarProfilePic" alt={this.props.currentUser.displayName} />
    }
  }

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    if (this.props.currentUser !== null) {
      return (
        <div className="navBarContainer">
          <div className="navbarLeft">
            <section className="navbarLink">
              <Link to="/GroupGuru" className="navbarLinkText" onClick={this.messagesPage}>HOME</Link>
            </section>
            <section className="navbarLink" id="featureLink">
              <p className="navbarLinkText" onClick={this.showFeatureOptions}>FEATURES</p>
            <section className="navbarLink hide" id="userOptionLinks">
              <Link to="/GroupGuru/AddressBook" className="navbarLinkText navbarFeatureOptionsText hide" onClick={this.messagesPage}>ADDRESS BOOK</Link>
              <Link to="/GroupGuru/Messages" className="navbarLinkText navbarFeatureOptionsText hide" onClick={this.messagesPage}>MESSAGES</Link>
              <Link to="/GroupGuru/Calendar" className="navbarLinkText navbarFeatureOptionsText hide" onClick={this.messagesPage}>CALENDAR</Link>
              <Link to="/GroupGuru/Photos" className="navbarLinkText navbarFeatureOptionsText hide" onClick={this.messagesPage}>PHOTOS</Link>
              <Link to="/GroupGuru/Recipes" className="navbarLinkText navbarFeatureOptionsText hide" onClick={this.messagesPage}>RECIPES</Link>
              <Link to="/GroupGuru/Map" className="navbarLinkText navbarFeatureOptionsText hide" onClick={this.messagesPage}>MAP</Link>
                 <Link to="/GroupGuru/about" className="navbarLinkText navbarFeatureOptionsText hide" onClick={this.messagesPage}>ABOUT</Link>
            </section>
            </section>
          </div>
          <div className="navbarRight">
            <section className="userNavbarOptionsColumn">
              <section className="navbarLink">
                {this.profilePic()}
                <p className="navbarLinkText" onClick={() => {
                  this.showOptions();
                }}>{this.props.currentUser.displayName}</p>
              </section>
              <section className="navbarUserOptions hide">
                <p className="userOptionTextNavbar" onClick={() => {
                  this.logOut();
                }}>LOG OUT</p>
              </section>
            </section>
          </div>
        </div>
      )
    } else {
      return (
        <div className="navBarContainer">
          <div className="navbarLeft">
            <section className="navbarLink">
              <Link to="/GroupGuru" className="navbarLinkText" onClick={this.messsagesPage}>HOME</Link>
            </section>
            <section className="navbarLink">
              <Link to="/GroupGuru/about" className="navbarLinkText" onClick={this.messagesPage}>ABOUT</Link>
            </section>
          </div>
          <div className="navbarRight">
            <section className="navbarLink">
              <Link to="/GroupGuru" className="navbarLinkText" onClick={this.messagesPage}>LOGIN</Link>
            </section>
          </div>
        </div>
      )
    }
  }
}