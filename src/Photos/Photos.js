import React, { Component } from "react";
import "./Photos.css";
import { confirmAlert } from "react-confirm-alert";
import $ from "jquery";
import DataModules from "../modules/dataModules";
import firebase from "firebase";
import moment from "moment";

const db = firebase.firestore();

export default class Photos extends Component {
  state = {
    mainPage: false,
    aboutPage: false,
    showOptions: false,
    showFeatureOptions: false,
    slideNumber: 0,
    photoAdd: { photoURL: "https://www.bearcatscanner.com/images/detailed/1/no_image_sm_vjbo-hm.png" }
  }

  addBlur = () => {
    $("#root").addClass("none");
    $(".navBarContainer").addClass("none");
  }

  clearBlur = () => {
    $("#root").removeClass("none");
    $(".navBarContainer").removeClass("none");
  }

  showPhotos = () => {
    let photos = this.props.props.photos.photos;
    photos.sort(function (a, b) {
      return new Date(b.addedDate) - new Date(a.addedDate);
    })
    return photos.map(photo => {
      return <img src={photo.photoURL} key={photo.photoId} id={photo.photoId} alt="My Images" key={photo.id} className="photoSlides" />
    })
  }

  handlePic = (event) => {
    this.setState({ photoAdd: { photoURL: event.target.value } })
    $(".addPhotoPicImage").attr("src", event.target.value)
  }

  uploadPhoto = () => {
    let photoId = DataModules.makeRandomId();
    let image = this.photoURLUpload.files[0];
    let details = { contentType: "image/jpg" }
    let storageFolder = firebase.storage().ref().child(`/photos/${photoId}`)
    return storageFolder.put(image, details).then(data => {
      data.ref.getDownloadURL().then(downloadURL => {
        let newPhoto = downloadURL;
        this.setState({ photoAdd: { photoURL: newPhoto } })
        $(".addPhotoPicImage").attr("src", newPhoto);
      });
    })
  }

  savePhoto = () => {
    let date = new Date();
    date = moment(date).utc().format();
    let photo = {};
    photo.photoId = DataModules.makeRandomId();
    photo.userId = this.props.props.currentUser.userId;
    photo.photoURL = this.state.photoAdd.photoURL;
    photo.title = this.title.value;
    photo.description = this.description.value;
    photo.addedDate = date;
    if (!photo.title.replace(/\s/g, '').length) photo.title = "No title provided.";
    if (!photo.description.replace(/\s/g, '').length) photo.description = "No description provided.";
    if (this.state.photoAdd.photoURL !== "https://www.bearcatscanner.com/images/detailed/1/no_image_sm_vjbo-hm.png" && this.state.photoAdd.photoURL !== "") {
      let photos = this.props.props.photos.photos;
      photos.push(photo)
      const myInfo = db.collection("photos").doc("allPhotos")
      myInfo.set({ photos: photos })
    }
    this.setState({ photoAdd: { photoURL: "https://www.bearcatscanner.com/images/detailed/1/no_image_sm_vjbo-hm.png" } })
    this.clearBlur()
  }


  addPhoto = () => {
    this.addBlur();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div id="GroupGuruPhotoAlert">
            <h1 id="mainPhotoAddTitle">ADD PHOTO</h1>
            <div id="addPhotoInputDiv">
              <section className="photoMidSection">
                <section className="photoPicEdit">
                  <section className="photoTop">
                    <section className="addPhotoInput">
                      <section className="addPhotoEdit">
                        <button className="chooseAddPhotoBtn" onClick={() => {
                          $("#photoURLInput").show();
                          $(".addPhotoEdit").hide();
                        }}>Add Photo URL</button>
                        <button className="chooseAddPhotoBtn" onClick={() => {
                          $("#photoUploadInput").show();
                          $(".addPhotoEdit").hide();
                        }}>Upload Photo</button>
                      </section>
                    </section>
                    <section className="addPhotoInputSection hide" id="photoURLInput">
                      <input className="addPhotoUrlInput" placeholder="Add image URL..." ref={input => this.photoURL = input} onChange={this.handlePic}></input>
                      <button className="uploadAddPhotoBtn" onClick={() => {
                        $("#photoUploadInput").show();
                        $("#photoURLInput").hide();
                      }}>Or Upload Photo</button>
                    </section>
                    <section className="addPhotoInputSection hide" id="photoUploadInput">
                      <input type="file" className="addPhotoUploadInput" id="addphotoUpload" accept="image/png, image/jpg, image/jpeg, image/JPG, image/JPEG" ref={input => this.photoURLUpload = input} />
                      <section className="saveBackUpload">
                        <button className="chooseAddPhotoBtn" onClick={() => {
                          $("#photoURLInput").show();
                          $("#photoUploadInput").hide();
                        }}>Add URL Photo</button>
                        <button className="chooseAddPhotoBtn" onClick={this.uploadPhoto}>Add File</button>
                      </section>
                    </section>
                  </section>
                  <img src={this.state.photoAdd.photoURL} className="addPhotoPicImage" alt="contactImage" />
                </section>
                <section id="photoTextSection">
                  <section className="indivPhotoTextEdit">
                    <p className="addPhotoTextTitle">Title</p>
                    <input className="photoTextInput" placeholder="Title..." ref={input => this.title = input} ></input>
                  </section>
                  <section className="indivPhotoTextEdit">
                    <p className="addPhotoTextTitle">Description</p>
                    <input className="photoTextInput" placeholder="Description..." ref={input => this.description = input} ></input>
                  </section>
                </section>
              </section>
            </div>
            <div className="addPhotoBtnSection">
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="photoConfirmation" alt="Back" onClick={() => {
                this.clearBlur();
                this.setState({ photoAdd: { photoURL: "https://www.bearcatscanner.com/images/detailed/1/no_image_sm_vjbo-hm.png" } });
                onClose();
              }} />
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FsaveIcon.jpg?alt=media&token=4cfa4233-9546-461f-9bcc-bb1218984727" className="photoConfirmation" alt="Save" onClick={() => {
                this.savePhoto();
                onClose();
              }} />
            </div>
          </div>
        )
      }
    })
  }

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    let photos = this.showPhotos()
    if (this.props.props.currentUser.userId !== "pgk933mCJVSOJg4DjnM0YPlkpW93") {
    return (
      <div className="mainPhotoContainer">
        <section id="mainPhotoTitleHeader">
          <article id="ggPhotoLogo"></article>
          <h1 id="pagePhotoTitle">PHOTOS</h1>
        </section>
        <section className="photoSlidesSection">
          <section className="innerSlides">
            {photos}
          </section>
        </section>
        <section className="addPhotoSection">
          <button className="addPhotoBtn" onClick={this.addPhoto}>ADD PHOTO</button>
        </section>
      </div>
    )
    } else {
      return (
        <div className="mainPhotoContainer">
          <section id="mainPhotoTitleHeader">
            <article id="ggPhotoLogo"></article>
            <h1 id="pagePhotoTitle">PHOTOS</h1>
          </section>
          <section className="photoSlidesSection">
            <section className="innerSlides">
              {photos}
            </section>
          </section>
          <section className="addPhotoSection">
          </section>
        </div>
      )
      }
  }
}
