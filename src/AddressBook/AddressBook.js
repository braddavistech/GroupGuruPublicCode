import React, { Component } from "react";
import _ from "lodash";
// import base from "./firebase";
import DataModules from "../modules/dataModules";
import firebase from "firebase";
import $ from "jquery";
import "firebase/firestore";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import "./AddressBook.css";

const db = firebase.firestore();

export default class AddressBook extends Component {
  state = {
    searchFilter: "First Name",
    showOptions: false,
    searchString: "",
    currentUser: null,
    contact: { photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" }
  }

  addBlur = () => {
    $("#root").addClass("none");
    $(".navBarContainer").addClass("none");
  }

  clearBlur = () => {
    $("#root").removeClass("none");
    $(".navBarContainer").removeClass("none");
  }

  handleSearch = () => {
    this.setState({ searchString: this.search.value })
  }

  handleQueryChange = (searchType) => {
    $(".querySelectOption").hide();
    this.setState({ searchFilter: searchType, showOptions: false, searchString: "" })
  }

  uploadPhoto = (user) => {
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

  socialMediaLinks = (user) => {
    let i = 0
    return user.links.map(link => {
      i++;
      let temp;
      if (link.url !== null) {
        if (link.title === "Facebook") {
          temp = <a className="socialMediaButton" href={link.url} key={i} alt={link.title} target="blank"><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/socialMediaIcons%2Ffacebook%20(1).png?alt=media&token=32081318-f442-4801-9469-305e158f820c" className="socialMediaIconPic" alt="Facebook" /></a>
        } else if (link.title === "Twitter") {
          temp = <a className="socialMediaButton" href={link.url} key={i} alt={link.title} target="blank"><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/socialMediaIcons%2Ftwitter.png?alt=media&token=ab25720e-95c5-4218-976a-e20f7db8b617" className="socialMediaIconPic" alt="Twitter" /></a>
        } else if (link.title === "LinkedIn") {
          temp = <a className="socialMediaButton" href={link.url} key={i} alt={link.title} target="blank"><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/socialMediaIcons%2Flinkedin.png?alt=media&token=73cf6138-e2ec-4e5d-ba12-7be2c738a944" className="socialMediaIconPic" alt="LinkedIn" /></a>
        }
      }
      return temp
    });
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
      <select name="stateId" size="5" className="stateSelectEdit" ref={input => this.stateIdContact = input}>Select Your State
        {
          options.map(stateOption => {
            i++
            return <option value={stateOption.value} key={i} className="stateIdOptsEdit">{stateOption.title}</option>
          })
        }
      </select>
    )
  }

  addContact = () => {
    this.addBlur();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div id="GroupGuruAlertProfile">
            <h1 id="mainProfileEditTitle">Create Contact</h1>
            <div id="editProfileInputDiv">
              <section id="namesEdit">
                <section className="indivNameEdit">
                  <p className="editProfileLabelName">First Name</p>
                  <input className="editProfileInput" placeholder="Enter first name..." ref={input => this.firstNameContact = input} ></input>
                </section>
                <section className="indivNameEdit">
                  <p className="editProfileLabelName">Last Name</p>
                  <input className="editProfileInput" placeholder="Enter last name..." ref={input => this.lastNameContact = input} ></input>
                </section>
                <section className="indivNameEdit">
                  <p className="editProfileLabelName">Email Address</p>
                  <input className="editProfileInput" placeholder="Enter email..." ref={input => this.emailContact = input} ></input>
                </section>
              </section>
              <section className="profileMidSection">
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
                <section className="addressEditRight">
                  <p className="editProfileLabel">Phone Number</p>
                  <input className="editProfileInput" placeholder="Enter phone number..." ref={input => this.phoneNumberContact = input} ></input>
                  <p className="editProfileLabel">Address</p>
                  <input className="editProfileInput" placeholder="Enter street address..." ref={input => this.streetAddressContact = input} ></input>
                  <label className="editProfileLabel">City</label>
                  <input type="text" className="editProfileInput" placeholder="Enter city...." ref={input => this.cityContact = input} ></input>
                  <section className="editProfileCityStateZipSection">
                    <section className="editAddressSection">
                      <label className="mainProfileInputAddressLabel">State</label>
                      {this.showState()}
                    </section>
                    <section className="editAddressSection">
                      <label className="mainProfileInputAddressLabel">Zip Code</label>
                      <input type="text" className="editProfileLocationInput" placeholder="Enter zip code..." ref={input => this.zipContact = input}></input>
                    </section>
                  </section>
                </section>
              </section>
              <p className="editProfileLabel">Facebook</p>
              <input className="editProfileInput" placeholder="Enter Facebook URL..." ref={input => this.facebookContact = input} ></input>
              <p className="editProfileLabel">Twitter</p>
              <input className="editProfileInput" placeholder="Enter Twitter URL..." ref={input => this.twitterContact = input} ></input>
              <p className="editProfileLabel">Linked In</p>
              <input className="editProfileInput" placeholder="Enter LinkedIn URL..." ref={input => this.linkedInContact = input} ></input>
            </div>
            <div className="editProfileBtnSection">
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                this.clearBlur();
                this.setState({ contact: { photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" } });
                onClose();
              }} />
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FsaveIcon.jpg?alt=media&token=4cfa4233-9546-461f-9bcc-bb1218984727" className="editConfirmation" alt="Save" onClick={() => {
                this.saveContact();
                onClose();
              }} />
            </div>
          </div>
        )
      }
    })
  }

  saveContact = () => {
    let date = new Date();
    date = moment(date).utc().format();
    let firstName = this.firstNameContact.value;
    let lastName = this.lastNameContact.value;
    let username = firstName.charAt(0).toUpperCase() + this.firstNameContact.value.slice(1) + this.lastNameContact.value.charAt(0).toUpperCase() + this.lastNameContact.value.slice(1);
    let tempUser = {};
    let contactId = DataModules.makeRandomId();
    tempUser.userId = contactId;
    tempUser.type = "contact";
    tempUser.accountCreatedDate = date;
    tempUser.firstName = firstName;
    tempUser.lastName = lastName;
    tempUser.displayName = username;
    tempUser.photoURL = this.state.contact.photoURL;
    tempUser.phoneNumber = this.phoneNumberContact.value;
    tempUser.streetAddress = this.streetAddressContact.value;
    tempUser.city = this.cityContact.value;
    tempUser.stateId = this.stateIdContact.value;
    tempUser.zip = this.zipContact.value;
    tempUser.links = [{ title: "Facebook", url: this.facebookContact.value },
    { title: "Twitter", url: this.twitterContact.value },
    { title: "LinkedIn", url: this.linkedInContact.value }]
    if (!tempUser.firstName.replace(/\s/g, '').length) tempUser.firstName = "No first name provided.";
    if (!tempUser.lastName.replace(/\s/g, '').length) tempUser.lastName = "No last name provided.";
    if (!tempUser.displayName.replace(/\s/g, '').length) tempUser.displayName = "No display name provided.";
    if (!tempUser.photoURL.replace(/\s/g, '').length) tempUser.photoURL = "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5";
    if (!tempUser.phoneNumber.replace(/\s/g, '').length) tempUser.phoneNumber = "No phone number provided.";
    if (!tempUser.streetAddress.replace(/\s/g, '').length) tempUser.streetAddress = "No street address provided.";
    if (!tempUser.city.replace(/\s/g, '').length) tempUser.city = "No city provided.";
    if (!tempUser.stateId.replace(/\s/g, '').length) tempUser.stateId = "No state provided.";
    if (!tempUser.zip.replace(/\s/g, '').length) tempUser.zip = "No zip provided";
    if (!tempUser.links[0].url.replace(/\s/g, '').length) { tempUser.links[0].url = null }
    if (!tempUser.links[1].url.replace(/\s/g, '').length) { tempUser.links[1].url = null }
    if (!tempUser.links[2].url.replace(/\s/g, '').length) { tempUser.links[2].url = null }
    this.clearBlur()
    const myInfo = db.collection('contacts').doc(tempUser.userId)
    myInfo.set(tempUser)
    this.setState({ contact: { photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" } })
  }

  saveContactEdit = (user) => {
    let date = new Date();
    date = moment(date).utc().format()
    let tempUser = {};
    tempUser.type = "contact";
    tempUser.lastEditDate = date;
    tempUser.firstName = this.firstName.value;
    tempUser.lastName = this.lastName.value;
    tempUser.displayName = this.firstName.value.charAt(0).toUpperCase() + this.firstName.value.slice(1) + this.lastName.value.charAt(0).toUpperCase() + this.lastName.value.slice(1);
    tempUser.photoURL = this.state.contact.photoURL;
    tempUser.phoneNumber = this.phoneNumber.value;
    tempUser.streetAddress = this.streetAddress.value;
    tempUser.city = this.city.value;
    tempUser.stateId = this.stateId.value;
    tempUser.zip = this.zip.value;
    tempUser.links = [{ title: "Facebook", url: this.facebook.value },
    { title: "Twitter", url: this.twitter.value },
    { title: "LinkedIn", url: this.linkedIn.value }]
    if (!tempUser.firstName.replace(/\s/g, '').length) tempUser.firstName = user.firstName;
    if (!tempUser.lastName.replace(/\s/g, '').length) tempUser.lastName = user.lastName;
    if (!tempUser.displayName.replace(/\s/g, '').length) tempUser.displayName = user.displayName;
    if (!tempUser.photoURL.replace(/\s/g, '').length) tempUser.photoURL = user.photoURL;
    if (!tempUser.phoneNumber.replace(/\s/g, '').length) tempUser.phoneNumber = user.phoneNumber;
    if (!tempUser.streetAddress.replace(/\s/g, '').length) tempUser.streetAddress = user.streetAddress;
    if (!tempUser.city.replace(/\s/g, '').length) tempUser.city = user.city;
    if (!tempUser.stateId.replace(/\s/g, '').length) tempUser.stateId = user.stateId;
    if (!tempUser.zip.replace(/\s/g, '').length) tempUser.zip = user.zip;
    if (!tempUser.links[0].url.replace(/\s/g, '').length) { tempUser.links[0].url = user.links[0].url }
    if (!tempUser.links[1].url.replace(/\s/g, '').length) { tempUser.links[1].url = user.links[1].url }
    if (!tempUser.links[2].url.replace(/\s/g, '').length) { tempUser.links[2].url = user.links[2].url }
    this.clearBlur()
    const myInfo = db.collection('contacts').doc(user.userId)
    myInfo.update(tempUser)
    this.setState({ contact: { photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" } })
  }

  saveEdit = (user) => {
    let date = new Date();
    date = moment(date).utc().format()
    let tempUser = {};
    tempUser.type = "user";
    tempUser.lastEditDate = date;
    tempUser.firstName = this.firstName.value;
    tempUser.lastName = this.lastName.value;
    tempUser.displayName = this.displayName.value;
    tempUser.photoURL = this.state.contact.photoURL;
    tempUser.phoneNumber = this.phoneNumber.value;
    tempUser.streetAddress = this.streetAddress.value;
    tempUser.city = this.city.value;
    tempUser.stateId = this.stateId.value;
    tempUser.zip = this.zip.value;
    tempUser.links = [{ title: "Facebook", url: this.facebook.value },
    { title: "Twitter", url: this.twitter.value },
    { title: "LinkedIn", url: this.linkedIn.value }]
    if (!tempUser.firstName.replace(/\s/g, '').length) tempUser.firstName = user.firstName;
    if (!tempUser.lastName.replace(/\s/g, '').length) tempUser.lastName = user.lastName;
    if (!tempUser.displayName.replace(/\s/g, '').length) tempUser.displayName = user.displayName;
    if (!tempUser.photoURL.replace(/\s/g, '').length) tempUser.photoURL = user.photoURL;
    if (!tempUser.phoneNumber.replace(/\s/g, '').length) tempUser.phoneNumber = user.phoneNumber;
    if (!tempUser.streetAddress.replace(/\s/g, '').length) tempUser.streetAddress = user.streetAddress;
    if (!tempUser.city.replace(/\s/g, '').length) tempUser.city = user.city;
    if (!tempUser.stateId.replace(/\s/g, '').length) tempUser.stateId = user.stateId;
    if (!tempUser.zip.replace(/\s/g, '').length) tempUser.zip = user.zip;
    if (!tempUser.links[0].url.replace(/\s/g, '').length) { tempUser.links[0].url = user.links[0].url }
    if (!tempUser.links[1].url.replace(/\s/g, '').length) { tempUser.links[1].url = user.links[1].url }
    if (!tempUser.links[2].url.replace(/\s/g, '').length) { tempUser.links[2].url = user.links[2].url }
    this.clearBlur();
    const myInfo = db.collection('users').doc(user.userId);
    myInfo.update(tempUser);
    this.setState({ contact: { photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" } });
  }

  handlePicContact = (event) => {
    this.setState({ contact: { photoURL: event.target.value } })
    $(".addContactPicImage").attr("src", event.target.value)
  }

  editContact = (user) => {
    this.setState({ contact: { photoURL: user.photoURL } })
    this.addBlur();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div id="GroupGuruAlertProfile">
            <h1 id="mainProfileEditTitle">Edit Contact Profile</h1>
            <div id="editProfileInputDiv">
              <section id="namesEdit">
                <section className="indivNameEdit">
                  <p className="editProfileLabelName">First Name</p>
                  <input className="editProfileInput" defaultValue={user.firstName} ref={input => this.firstName = input} ></input>
                </section>
                <section className="indivNameEdit">
                  <p className="editProfileLabelName">Last Name</p>
                  <input className="editProfileInput" defaultValue={user.lastName} ref={input => this.lastName = input} ></input>
                </section>
              </section>
              <section className="profileMidSection">
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
                    <input className="editProfileInput" placeholder={user.photoURL} ref={input => this.photoURLContact = input} onChange={this.handlePicContact}></input>
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
                  <img src={user.photoURL} className="addContactPicImage" alt="contactImage" />
                </section>
                <section className="addressEditRight">
                  <p className="editProfileLabel">Phone Number</p>
                  <input className="editProfileInput" defaultValue={user.phoneNumber} ref={input => this.phoneNumber = input} ></input>
                  <p className="editProfileLabel">Address</p>
                  <input className="editProfileInput" defaultValue={user.streetAddress} ref={input => this.streetAddress = input} ></input>
                  <label className="editProfileLabel">City</label>
                  <input type="text" className="editProfileInput" defaultValue={user.city} ref={input => this.city = input} placeholder="City...."></input>
                  <section className="editProfileCityStateZipSection">
                    <section className="editAddressSection">
                      <label className="mainProfileInputAddressLabel">State</label>
                      {this.stateOptions(user)}
                    </section>
                    <section className="editAddressSection">
                      <label className="mainProfileInputAddressLabel">Zip Code</label>
                      <input type="text" className="editProfileLocationInput" defaultValue={user.zip} ref={input => this.zip = input} placeholder="Zip...."></input>
                    </section>
                  </section>
                </section>
              </section>
              <p className="editProfileLabel">Facebook</p>
              <input className="editProfileInput" defaultValue={user.links[0].url} ref={input => this.facebook = input} ></input>
              <p className="editProfileLabel">Twitter</p>
              <input className="editProfileInput" defaultValue={user.links[1].url} ref={input => this.twitter = input} ></input>
              <p className="editProfileLabel">Linked In</p>
              <input className="editProfileInput" defaultValue={user.links[2].url} ref={input => this.linkedIn = input} ></input>
            </div>
            <div className="editProfileBtnSection">
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                this.clearBlur();
                this.setState({ contact: { photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" } });
                onClose();
              }} />
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FsaveIcon.jpg?alt=media&token=4cfa4233-9546-461f-9bcc-bb1218984727" className="editConfirmation" alt="Save" onClick={() => {
                this.saveContactEdit(user);
                onClose();
              }} />
            </div>
          </div>
        )
      }
    })
  }

  editProfile = (user) => {
    this.setState({ currentUser: user, contact: { photoURL: user.photoURL } }, () => {
      this.addBlur();
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div id="GroupGuruAlertProfile">
              <h1 id="mainProfileEditTitle">Edit Your Profile</h1>
              <div id="editProfileInputDiv">
                <section id="namesEdit">
                  <section className="indivNameEdit">
                    <p className="editProfileLabelName">First Name</p>
                    <input className="editProfileInput" defaultValue={user.firstName} ref={input => this.firstName = input} ></input>
                  </section>
                  <section className="indivNameEdit">
                    <p className="editProfileLabelName">Last Name</p>
                    <input className="editProfileInput" defaultValue={user.lastName} ref={input => this.lastName = input} ></input>
                  </section>
                  <section className="indivNameEdit">
                    <p className="editProfileLabelName">Display Name</p>
                    <input className="editProfileInput" defaultValue={user.displayName} ref={input => this.displayName = input} ></input>
                  </section>
                </section>
                <section className="profileMidSection">
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
                      <input className="editProfileInput" placeholder={user.photoURL} ref={input => this.photoURLContact = input} onChange={this.handlePicContact}></input>
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
                    <img src={user.photoURL} className="addContactPicImage" alt="contactImage" />
                  </section>
                  <section className="addressEditRight">
                    <p className="editProfileLabel">Phone Number</p>
                    <input className="editProfileInput" defaultValue={user.phoneNumber} ref={input => this.phoneNumber = input} ></input>
                    <p className="editProfileLabel">Address</p>
                    <input className="editProfileInput" defaultValue={user.streetAddress} ref={input => this.streetAddress = input} ></input>
                    <label className="editProfileLabel">City</label>
                    <input type="text" className="editProfileInput" defaultValue={user.city} ref={input => this.city = input} placeholder="City...."></input>
                    <section className="editProfileCityStateZipSection">
                      <section className="editAddressSection">
                        <label className="mainProfileInputAddressLabel">State</label>
                        {this.stateOptions(user)}
                      </section>
                      <section className="editAddressSection">
                        <label className="mainProfileInputAddressLabel">Zip Code</label>
                        <input type="text" className="editProfileLocationInput" defaultValue={user.zip} ref={input => this.zip = input} placeholder="Zip...."></input>
                      </section>
                    </section>
                  </section>
                </section>
                <p className="editProfileLabel">Facebook</p>
                <input className="editProfileInput" defaultValue={user.links[0].url} ref={input => this.facebook = input} ></input>
                <p className="editProfileLabel">Twitter</p>
                <input className="editProfileInput" defaultValue={user.links[1].url} ref={input => this.twitter = input} ></input>
                <p className="editProfileLabel">Linked In</p>
                <input className="editProfileInput" defaultValue={user.links[2].url} ref={input => this.linkedIn = input} ></input>
              </div>
              <div className="editProfileBtnSection">
                <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                  this.clearBlur();
                  this.setState({ contact: { photoURL: "https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FnoImageAvailable.jpg?alt=media&token=123be68d-db54-4041-bfc4-106888a5a7c5" } });
                  onClose()
                }} />
                <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FsaveIcon.jpg?alt=media&token=4cfa4233-9546-461f-9bcc-bb1218984727" className="editConfirmation" alt="Save" onClick={() => {
                  this.saveEdit(user);
                  onClose()
                }} />
              </div>
            </div>
          )
        }
      })
    })
  }

  availableOptions = () => {
    let optionsAvailable = ["First Name", "Last Name", "Username", "Custom Search"];
    let i = 0;
    return optionsAvailable.map(option => {
      i++;
      if (this.state.searchFilter !== option) {
        return <p className="selectSearchLabel" key={i} onClick={() => this.handleQueryChange(option)}>{option}</p>
      } else { return null }
    })
  }

  searchPlaceholder = () => {
    if (this.state.searchFilter === "First Name") {
      return "Search by First Name..."
    } else if (this.state.searchFilter === "Last Name") {
      return "Search by Last Name..."
    } else if (this.state.searchFilter === "Username") {
      return "Search by Username..."
    } else if (this.state.searchFilter === "Custom Search") {
      return "First, Last, and Username"
    }
  }

  selectSearch = () => {
    if (this.state.showOptions) {
      return (
        <React.Fragment>
          <section className="searchByMenu">
            <p className="selectSearchLabel" onClick={() => {
              // if (this.state.showOptions === false) {
              //   $(".querySelectOption").show();
              //   this.setState({ showOptions: true });
              // } else {
              $(".querySelectOption").hide();
              this.setState({ showOptions: false });
              // })
            }}>Close Menu</p>
            {this.availableOptions()}
          </section>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <section className="searchByMenu">
            <p className="selectSearchLabel" onClick={() => {
              if (this.state.showOptions === false) {
                $(".querySelectOption").show();
                this.setState({ showOptions: true });
                // } else {
                //   $(".querySelectOption").hide();
                //   this.setState({ showOptions: false });
                // }
              }
            }}>Change Listing Order</p>
            <input type="text" className="searchInputAddress" placeholder={this.searchPlaceholder()} defaultValue={this.state.searchString} ref={input => this.search = input} onChange={() => this.handleSearch()} ></input>
          </section>
        </React.Fragment>
      )
    }
  }

  sortUsers = () => {
    let groupMembers = [];
    this.props.props.users.forEach(user => groupMembers.push(user));
    if (this.props.props.contacts !== null) {
      this.props.props.contacts.forEach(contact => groupMembers.push(contact))
    }
    let groupUsers = groupMembers.map(user => {
      user.sortUsername = user.displayName.charAt(0).toUpperCase() + user.displayName.slice(1);
      user.firstName = user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1);
      user.lastName = user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1);
      return user
    })
    if (groupUsers.length > 1) {
      if (this.state.searchFilter === "First Name" || this.state.searchFilter === "Custom Search") {
        groupUsers = _.sortBy(groupUsers, "firstName", "desc")
      } else if (this.state.searchFilter === "Last Name") {
        groupUsers = _.sortBy(groupUsers, "lastName", "desc")
      } else if (this.state.searchFilter === "Username") {
        groupUsers = _.sortBy(groupUsers, "sortUsername", "desc")
      }
    }
    let userMatches = [];
    if (this.state.searchString !== "") {
      let search = this.state.searchString.toLowerCase();
      groupUsers.forEach(user => {
        let tempFirst = user.firstName.toLowerCase();
        let tempLast = user.lastName.toLowerCase();
        let tempUsername = user.displayName.toLowerCase();
        if (this.state.searchFilter === "First Name") {
          if (tempFirst.indexOf(search) !== -1) {
            userMatches.push(user)
          }
        } else if (this.state.searchFilter === "Last Name") {
          if (tempLast.indexOf(search) !== -1) {
            userMatches.push(user)
          }
        } else if (this.state.searchFilter === "Username") {
          if (tempUsername.indexOf(search) !== -1) {
            userMatches.push(user)
          }
        }
        else if (this.state.searchFilter === "Custom Search") {
          if (tempFirst.indexOf(search) !== -1) {
            userMatches.push(user)
          } else if (tempLast.indexOf(search) !== -1) {
            userMatches.push(user)
          } else if (tempUsername.indexOf(search) !== -1) {
            userMatches.push(user)
          }
        }
      })
      groupUsers = userMatches;
    }
    return groupUsers;
  }

  isOnline = (user) => {
    let id = user.userId;
    let online;
    if (this.props.props.loggedIn[id] !== undefined) {
      online = this.props.props.loggedIn[id].online
    }
    if (online) {
      return <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/socialMediaIcons%2FonlineIcon.png?alt=media&token=db403eca-0e02-4c62-862f-5d247e4f33fb" className="onlineStatus" alt="online" />
    } else {
      return <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/socialMediaIcons%2FofflineIcon.png?alt=media&token=362b77c7-a8a7-4365-86d5-22d8ff90d374" className="onlineStatus" alt="offline" />
    }
  }

  printUserGuest = () => {
    return this.sortUsers().map(user => {
      return <div className="userCard" key={user.userId}>
        <section className="userCardTop">
          <section className="userCardLeft">
            <img src={user.photoURL} className="addressProfilePic" alt="Profile Pic" />
          </section>
          <section className="userCardRight">
            <h1 className="userTitleMainCard">{this.isOnline(user)}{user.firstName} {user.lastName}</h1>
            <h2 className="userDetailText">@{user.displayName}</h2>
            <h2 className="userDetailText">Street Address (Hidden)</h2>
            <h2 className="userDetailText">{user.city}, {user.stateId} {user.zip}</h2>
            <h2 className="userDetailText">Phone Number (Hidden)</h2>
            <section className="socialMediaButtonSection">
              {this.socialMediaLinks(user)}
            </section>
          </section>
        </section>
      </div>
    })
  }

  printUser = () => {
    return this.sortUsers().map(user => {
      let emailUser = "mailto:" + user.email
      if (this.props.props.currentUser.userId === user.userId) {
        if (user.photoURL !== null) {
          return <div className="userCard" key={user.userId}>
            <section className="userCardTop">
              <section className="userCardLeft">
                <img src={user.photoURL} className="addressProfilePic" alt="Profile Pic" />
              </section>
              <section className="userCardRight">
                <h1 className="userTitleMainCard">{this.isOnline(user)}{user.firstName} {user.lastName}</h1>
                <h2 className="userDetailText">@{user.displayName}</h2>
                <h2 className="userDetailText">{user.streetAddress}</h2>
                <h2 className="userDetailText">{user.city}, {user.stateId} {user.zip}</h2>
                <h2 className="userDetailText">{user.phoneNumber}</h2>
                <section className="socialMediaButtonSection">
                  {this.socialMediaLinks(user)}
                  <a href={emailUser} ><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FmailIcon.jpg?alt=media&token=ed1abbf7-924f-411b-aad6-7188e4046040" className="emailCard" alt="Email" /></a>
                  <img className="emailCard" src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FeditIcon.png?alt=media&token=5dd654c2-743f-4d30-b6d8-e30efe815cea" alt="Edit" onClick={() => this.editProfile(user)} />
                </section>
              </section>
            </section>
          </div>
        } else {
          return <div className="userCard" key={user.userId}>
            <section className="userCardTop">
              <section className="userCardLeft" >
                <section className="userCardRight">
                  <h1 className="userTitleMainCard">{this.isOnline(user)}{user.firstName} {user.lastName}</h1>
                  <h2 className="userDetailText">@{user.displayName}</h2>
                  <h2 className="userDetailText">{user.streetAddress}</h2>
                  <h2 className="userDetailText">{user.city}, {user.stateId} {user.zip}</h2>
                  <h2 className="userDetailText">{user.phoneNumber}</h2>
                  <a href={emailUser} className="emailAddressLink">{user.email}</a>
                  <section className="socialMediaButtonSection">
                    {this.socialMediaLinks(user)}
                    <a href={emailUser} ><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FmailIcon.jpg?alt=media&token=ed1abbf7-924f-411b-aad6-7188e4046040" className="emailCard" alt="Email" /></a>
                    <img className="emailCard" src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FeditIcon.png?alt=media&token=5dd654c2-743f-4d30-b6d8-e30efe815cea" alt="Edit" onClick={this.editProfile} />
                  </section>
                </section>
              </section>
            </section>
          </div>
        }
      } else {
        if (user.photoURL !== null) {
          if (user.type === "user") {
            return <div className="userCard" key={user.userId}>
              <section className="userCardTop">
                <section className="userCardLeft" >
                  <img src={user.photoURL} className="addressProfilePic" alt="Profile Pic" />
                </section>
                <section className="userCardRight">
                  <h1 className="userTitleMainCard">{this.isOnline(user)}{user.firstName} {user.lastName}</h1>
                  <h2 className="userDetailText">@{user.displayName}</h2>
                  <h2 className="userDetailText">{user.streetAddress}</h2>
                  <h2 className="userDetailText">{user.city}, {user.stateId} {user.zip}</h2>
                  <h2 className="userDetailText">{user.phoneNumber}</h2>
                  <section className="socialMediaButtonSection">
                    {this.socialMediaLinks(user)}
                    <a href={emailUser} ><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FmailIcon.jpg?alt=media&token=ed1abbf7-924f-411b-aad6-7188e4046040" className="emailCard" alt="Email" /></a>
                  </section>
                </section>
              </section>
            </div>
          } else {
            return <div className="contactCard" key={user.userId}>
              <section className="contactCardTop">
                <section className="contactCardLeft" >
                  <img src={user.photoURL} className="addressProfilePic" alt="Profile Pic" />
                </section>
                <section className="contactCardRight">
                  <h1 className="contactTitleMainCard"><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/socialMediaIcons%2FcontactIcon.png?alt=media&token=8c17db03-c2d3-4ada-a99c-ee81cf35be0c" className="contactTag" alt="contact" />{user.firstName} {user.lastName}</h1>
                  <h2 className="contactDetailText">CONTACT ONLY</h2>
                  <h2 className="contactDetailText">{user.streetAddress}</h2>
                  <h2 className="contactDetailText">{user.city}, {user.stateId} {user.zip}</h2>
                  <h2 className="contactDetailText">{user.phoneNumber}</h2>
                  <section className="socialMediaButtonSection">
                    {this.socialMediaLinks(user)}
                    {this.contactEmail(user, emailUser)}
                    <img className="emailCard" src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FeditIcon.png?alt=media&token=5dd654c2-743f-4d30-b6d8-e30efe815cea" alt="Edit" onClick={() => this.editContact(user)} />
                  </section>
                </section>
              </section>
            </div>

          }
        } else {
          if (user.type === "user") {
            return <div className="userCard" key={user.userId}>
              <section className="userCardTop">
                <section className="userCardLeft" ></section>
                <section className="userCardRight">
                  <h1 className="userTitleMainCard">{this.isOnline(user)}{user.firstName} {user.lastName}</h1>
                  <h2 className="userDetailText">@{user.displayName}</h2>
                  <h2 className="userDetailText">{user.streetAddress}</h2>
                  <h2 className="userDetailText">{user.city}, {user.stateId} {user.zip}</h2>
                  <h2 className="userDetailText">{user.phoneNumber}</h2>
                  <section className="socialMediaButtonSection">
                    {this.socialMediaLinks(user)}
                    <a href={emailUser} ><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FmailIcon.jpg?alt=media&token=ed1abbf7-924f-411b-aad6-7188e4046040" className="emailCard" alt="Email" /></a>
                  </section>
                </section>
              </section>
            </div>
          } else {
            return <div className="contactCard" key={user.userId}>
              <section className="contactCardTop">
                <section className="contactCardLeft" ></section>
                <section className="contactCardRight">
                  <h1 className="contactTitleMainCard"> <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/socialMediaIcons%2FcontactIcon.png?alt=media&token=8c17db03-c2d3-4ada-a99c-ee81cf35be0c" id="contactTag" alt="contact" />{user.firstName} {user.lastName}</h1>
                  <h2 className="contactDetailText">CONTACT ONLY</h2>
                  <h2 className="contactDetailText">{user.streetAddress}</h2>
                  <h2 className="contactDetailText">{user.city}, {user.stateId} {user.zip}</h2>
                  <h2 className="contactDetailText">{user.phoneNumber}</h2>
                  <section className="socialMediaButtonSection">
                    {this.socialMediaLinks(user)}
                    {this.contactEmail(user, emailUser)}
                    <img className="emailCard" src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FeditIcon.png?alt=media&token=5dd654c2-743f-4d30-b6d8-e30efe815cea" alt="Edit" onClick={() => this.editContact(user)} />
                  </section>
                </section>
              </section>
            </div>
          }
        }
      }
    })
  }

  contactEmail = (user, email) => {
    if (user.email !== undefined) {
      return <a href={email} ><img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FmailIcon.jpg?alt=media&token=ed1abbf7-924f-411b-aad6-7188e4046040" className="emailCard" alt="Email" /></a>
    }
  }

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    if (this.props.props.users !== undefined && this.props.props.users !== null) {
      if (this.props.props.currentUser.userId !== "pgk933mCJVSOJg4DjnM0YPlkpW93") {
        return (
          <div className="mainAddressContainer" >
            <section className="titleSection">
              <h1 className="mainAddressTitle">ADDRESS BOOK</h1>
              <p id="searchBoxTitle">Showing Results By {this.state.searchFilter}</p>
              {this.selectSearch()}
            </section>
            <section id="addressBookPrint">
              {this.printUser()}
            </section>
            <button id="addContactButton" onClick={this.addContact}>ADD CONTACT</button>
          </div>
        )
      } else {
        return (
          <div className="mainAddressContainer" >
            <section className="titleSection">
              <h1 className="mainAddressTitle">GUEST ADDRESS BOOK</h1>
              <p id="searchBoxTitle">Showing Results By {this.state.searchFilter}</p>
              {this.selectSearch()}
            </section>
            <section id="addressBookPrint">
              {this.printUserGuest()}
            </section>
            <button id="addContactButton" onClick={this.addContact}>ADD CONTACT</button>
          </div>
        )
      }
    } else {
      return (
        <div>
          <h1>Loading....</h1>
        </div>
      )

    }
  }
}