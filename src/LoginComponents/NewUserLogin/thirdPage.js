import React, { Component } from "react";
import $ from "jquery";
import firebase from "firebase";
import "firebase/firestore";
import DataModules from "../../modules/dataModules";

const db = firebase.firestore();

export default class ThirdPage extends Component {
  state = {
    contact: { photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" }
  }

  saveInfo = () => {
    $(".inputAlert").hide();
    let users = {}
    users.photoURL = this.state.contact.photoURL;
    users.links = [{ title: "Facebook", url: this.facebook.value },
    { title: "Twitter", url: this.twitter.value },
    { title: "LinkedIn", url: this.linkedIn.value }]
    if (users.photoURL === "") { users.photoURL = "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" }
    if (users.links[0].url === "") { users.links[0].url = null }
    if (users.links[1].url === "") { users.links[1].url = null }
    if (users.links[2].url === "") { users.links[2].url = null }
    const myInfo = db.collection('users').doc(this.props.props.currentUser.userId)
    myInfo.update(users)
    this.setState({ contact: { photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" } })

    this.props.history.push("/GroupGuru");
  }

  uploadPhoto = () => {
    let photoId = DataModules.makeRandomId();
    let image = this.photoURLUploadContact.files[0];
    let details = { contentType: "image/jpg" }
    let storageFolder = firebase.storage().ref().child(`/images/${photoId}`)
    return storageFolder.put(image, details).then(data => {
      data.ref.getDownloadURL().then(downloadURL => {
        let newPhoto = downloadURL;
        this.setState({ contact: { photoURL: newPhoto } })
        $(".addContactPicImage").attr("src", newPhoto);
      });
    })
}

  handlePicContact = (event) => {
    this.setState({contact: {photoURL: event.target.value}})
    $(".addContactPicImage").attr("src", event.target.value)
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
        <section className="titleSection">
          <h1 className="mainTitle">Please Complete Your Profile</h1>
        </section>
        <section className="profilePicEdit">
          <section className="photoInput">
            <p className="editPhotoLabel">Change Photo</p>
            <section className="choosePhotoEdit">
              <button className="choosePhotoBtn" onClick={() => {
                $("#photoURLInput").removeClass("hide");
                $("#photoURLInput").addClass("photoInput");
                $(".choosePhotoEdit").hide();
              }}>Add Photo URL</button>
              <button className="choosePhotoBtn" onClick={() => {
                $("#photoUploadInput").removeClass("hide");
                $("#photoUploadInput").addClass("photoInput");
                $(".choosePhotoEdit").hide();
              }}>Upload Photo</button>
            </section>
          </section>
          <section className="hide" id="photoURLInput">
            <input className="editProfileInput" placeholder="Add image URL..." ref={input => this.photoURLContact = input} onChange={this.handlePicContact}></input>
            <button className="choosePhotoBtn" onClick={() => {
              $("#photoUploadInput").removeClass("hide");
              $("#photoUploadInput").addClass("photoInput");
              $("#photoURLInput").removeClass("photoInput");
              $("#photoURLInput").addClass("hide");
            }}>Or Upload Photo</button>
          </section>
          <section className="hide" id="photoUploadInput">
            <input type="file" className="editProfileInput" id="photoUpload" accept="image/png, image/jpg, image/jpeg, image/JPG, image/JPEG" ref={input => this.photoURLUploadContact = input} />
            <section className="saveBackUpload">
              <button className="choosePhotoBtn" onClick={() => {
                $("#photoURLInput").removeClass("hide");
                $("#photoURLInput").addClass("photoInput");
                $("#photoUploadInput").removeClass("photoInput");
                $("#photoUploadInput").addClass("hide");
              }}>Add URL Photo</button>
              <button className="choosePhotoBtn" onClick={this.uploadPhoto}>Add File</button>
            </section>
          </section>
          <img src={this.state.contact.photoURL} className="addContactPicImage" alt="contactImage" />
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Facebook</label>
          <input type="text" className="mainLoginInput" ref={input => this.facebook = input} placeholder="Facebook URL...."></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Twitter</label>
          <input type="text" className="mainLoginInput" ref={input => this.twitter = input} placeholder="Twitter URL...."></input>
        </section>
        <section className="inputSection">
          <label className="mainLoginInputLabel">Linked In</label>
          <input type="text" className="mainLoginInput" ref={input => this.linkedIn = input} placeholder="LinkedIn URL...."></input>
        </section>
        <section className="optionsSection">
          <article className="btnSetSection">
            <label className="mainLoginButtonLabels">Skip For Now</label>
            <button onClick={() => this.props.history.push("/GroupGuru")} className="mainLoginButton">Skip</button>
          </article>
          <article className="btnSetSection">
            <label className="mainLoginButtonLabels">Continue</label>
            <button onClick={this.saveInfo} className="mainLoginButton">Save and Main</button>
          </article>
        </section>
      </div>
    )
  }
}