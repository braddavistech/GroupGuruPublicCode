import React, { Component } from "react";
import "./MainLogin.css";
import $ from "jquery";

export default class MainLogin extends Component {

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    return (
      <div className="mainLoginContainer">
        <section className="mainTitleSection">
          <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FGroupGuruLogo.png?alt=media&token=645ff366-105a-491d-a069-ad9b195fb8bf" id="mainLoginIcon" alt="Group Guru" />
          <h1 className="mainTitle">WELCOME TO</h1>
          <h1 className="ggTitle">GROUP GURU</h1>
        </section>
        <section className="optionsMainLoginSection">
          <article className="mainBtnSetSection">
            <label className="mainLoginButtonLabels">Already A User?</label>
            <button onClick={() => this.props.history.push("/GroupGuru/userLogin")} className="mainLoginButton">LOGIN</button>
          </article>
          <article className="mainBtnSetSection">
            <label className="mainLoginButtonLabels">New To Group Guru?</label>
            <button onClick={() => this.props.history.push("/GroupGuru/createAccount")} className="mainLoginButton">CREATE ACCOUNT</button>
          </article>
        </section>
      </div>

    )
  }
}