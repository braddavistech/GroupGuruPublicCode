import { Route, Redirect } from "react-router-dom";
import React, { Component } from "react";
import About from "./About/About.js"
import MainLogin from "./LoginComponents/MainLoginPage";
import UserLogin from "./LoginComponents/ExistingUserLogin";
import CreateUser from "./LoginComponents/NewUserLogin/firstPage";
import SecondPage from "./LoginComponents/NewUserLogin/secondPage";
import ThirdPage from "./LoginComponents/NewUserLogin/thirdPage";
import AddressBook from "./AddressBook/AddressBook";
import Messages from "./MessagesPage/Messages";
import Home from "./Home/Home";
import Recipes from "./Recipes/Recipes";
import Map from "./Map/Map";
import Calendar from "./Calendar/Calendar";
import Photos from "./Photos/Photos";
import Stats from "./Stats/Stats";
import $ from "jquery";


export default class ApplicationView extends Component {

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("isBlurred");
        $(".navBarContainer").removeClass("isBlurred");
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    return (
      <React.Fragment>
        <Route exact path="/GroupGuru" render={(props) => {
          if (this.props.currentUser !== null) {
            return <Home {...props} props={this.props} />
          } else {
            return <MainLogin {...props} />
          }
        }} />
        <Route exact path="/GroupGuru/about" render={(props) => {
          return <About {...props} />
        }} />
        <Route exact path="/GroupGuru/userLogin" render={(props) => {
          return <UserLogin {...props} props={this.props}  />
        }} />
        <Route exact path="/GroupGuru/createAccount" render={(props) => {
          return <CreateUser {...props} props={this.props}  />
        }} />
        <Route exact path="/GroupGuru/createAccount/Page2" render={(props) => {
          return <SecondPage {...props} props={this.props} />
        }} />
        <Route exact path="/GroupGuru/createAccount/Page3" render={(props) => {
          return <ThirdPage {...props} props={this.props} />
        }} />
        <Route exact path="/GroupGuru/Messages" render={(props) => {
          if (this.props.currentUser !== null) {
          return <Messages {...props} props={this.props} />
        } else {
          return <Redirect to="/GroupGuru" />
        }
        }} />
        <Route exact path="/GroupGuru/AddressBook" render={(props) => {
          if (this.props.currentUser !== null) {
          return <AddressBook {...props} props={this.props} />
        } else {
          return <Redirect to="/GroupGuru" />
        }
        }} />
        <Route exact path="/GroupGuru/Recipes" render={(props) => {
          if (this.props.currentUser !== null) {
          return <Recipes {...props} props={this.props} />
        } else {
          return <Redirect to="/GroupGuru" />
        }
        }} />
        <Route exact path="/GroupGuru/Map" render={(props) => {
          if (this.props.currentUser !== null) {
          return <Map {...props} props={this.props} />
        } else {
          return <Redirect to="/GroupGuru" />
        }
        }} />
        <Route exact path="/GroupGuru/Calendar" render={(props) => {
          if (this.props.currentUser !== null) {
          return <Calendar {...props} props={this.props} />
        } else {
          return <Redirect to="/GroupGuru" />
        }
        }} />
        <Route exact path="/GroupGuru/Photos" render={(props) => {
          if (this.props.currentUser !== null) {
          return <Photos {...props} props={this.props} />
        } else {
          return <Redirect to="/GroupGuru" />
        }
        }} />
        <Route exact path="/GroupGuru/UserStats" render={(props) => {
          if (this.props.currentUser !== null) {
          return <Stats {...props} props={this.props} />
        } else {
          return <Redirect to="/GroupGuru" />
        }
        }} />
      </React.Fragment>
    )
  }
}
