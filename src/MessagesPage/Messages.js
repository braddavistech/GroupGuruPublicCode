import React, { Component } from "react";
import moment from "moment";
import base from "../firebase";
import firebase from "firebase";
import $ from "jquery";
import "firebase/firestore";
import "./Messages.css";
import { confirmAlert } from "react-confirm-alert";

const db = firebase.firestore();

export default class Messages extends Component {

  addBlur = () => {
    $(".navBarContainer").addClass("none");
    $("#root").addClass("none");
  }

  clearBlur = () => {
    $(".navBarContainer").removeClass("none");
    $("#root").removeClass("none");
  }

  saveMessage = () => {
    $("#messageNotEntered").hide();
    let date = new Date();
    date = moment(date).utc().format()
    if (this.message.value === "") { $("#messageNotEntered").show() }
    else {
      base.addToCollection("messages", {
        title: this.title.value,
        body: this.message.value,
        userId: this.props.props.currentUser.userId,
        createdDate: date
      }).then(message => {
        let temp = { messageId: message.id };
        const myInfo = db.collection('messages').doc(message.id)
        myInfo.update(temp)
      })
      this.title.value = "";
      this.message.value = "";
    }
  }

  saveEdit = (oldMessage) => {
    let date = new Date();
    date = moment(date).utc().format()
    let message = {};
    message.lastEditDate = date;
    message.title = this.title.value;
    message.body = this.body.value;
    this.clearBlur()
    const myInfo = db.collection('messages').doc(oldMessage.messageId)
    myInfo.update(message)
  }

  deleteMessage = (message) => {
    db.collection('messages').doc(message.messageId).delete()
    this.clearBlur()
  }

  editMessage = (message) => {
    this.addBlur();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div id="GroupGuruMessageAlert">
            <div id="editMessageInstructionsSection">
              <h1 id="mainEditTitle">Edit Or Delete Your Message</h1>
            </div>
            <div id="editMessageInputDiv">
              <p className="editInputLabel">Message Title</p>
              <input className="editMessageInput" defaultValue={message.title} ref={input => this.title = input} ></input>
              <p className="editInputLabel">Message Body</p>
              <textarea className="editMessageTextarea" defaultValue={message.body} ref={input => this.body = input} ></textarea>
            </div>
            <div id="editBtnSection">
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FbackIcon.jpg?alt=media&token=2e34129c-472b-4cfd-beec-e56f591e674b" className="editConfirmation" alt="Back" onClick={() => {
                this.clearBlur();
                onClose()
              }} />
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FsaveIcon.jpg?alt=media&token=4cfa4233-9546-461f-9bcc-bb1218984727" className="editConfirmation" alt="Save" onClick={() => {
                this.saveEdit(message);
                onClose()
              }} />
              <img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FtrashIcon.png?alt=media&token=dfe58347-1845-4ebf-8db7-8b155d9657d4" className="editConfirmation" alt="Delete" onClick={() => {
                this.deleteMessage(message);
                onClose()
              }} />
            </div>
          </div>
        )
      }
    })
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

  editDate = (message) => {
    if (message.lastEditDate !== undefined) {
      return <p className="oldMsgTime">(edited {moment(`${message.lastEditDate}`).fromNow()}) (added {moment(`${message.createdDate}`).fromNow()})</p>
    } else {
      return <p className="oldMsgTime">(added {moment(`${message.createdDate}`).fromNow()}) </p>
    }
  }

  messages = () => {
    let messages = this.props.props.messages;
    if (messages.length > 1) {
      messages.sort(function (a, b) {
        return new Date(b.createdDate) - new Date(a.createdDate);
      });
    }
    let i = 0;
    return (messages.map(message => {
      i++;
      let messageAuthor = this.props.props.users.find(e => e.userId === message.userId)
      if (messageAuthor.userId === this.props.props.currentUser.userId) {
        return <div className="indivMessage" key={i}>
          <section className="indivMessageOwner" key={i}>
            <section className="inlineRowOwned">
              <img className="editMessageButton" src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FtrashIcon.png?alt=media&token=dfe58347-1845-4ebf-8db7-8b155d9657d4" alt="Delete" onClick={() => { db.collection('messages').doc(message.messageId).delete() }} />
              <img className="editMessageButton" src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FeditIcon.png?alt=media&token=5dd654c2-743f-4d30-b6d8-e30efe815cea" alt="Edit" onClick={() => this.editMessage(message)} />
              <h1 className="oldMsgInfoOwned">{this.isOnline(messageAuthor)}@{messageAuthor.displayName}</h1>
              <img className="messageProfilePic" src={messageAuthor.photoURL} alt={messageAuthor.DisplayName} />
            </section>
            <p className="oldMsgTimeOwned">(added {moment(`${message.createdDate}`).fromNow()})</p>
            <p className="oldMsgTitle">{message.title}</p>
            <p className="oldMsgBody">{message.body}</p>
          </section>
        </div >
      } else {
        return <div className="indivMessage" key={i}>
          <section className="indivMessageOther" key={i}>
            <section className="inlineRow">
              <img className="messageProfilePic" src={messageAuthor.photoURL} alt={messageAuthor.DisplayName} />
              <h1 className="oldMsgInfo">@{messageAuthor.displayName}{this.isOnline(messageAuthor)}</h1>
            </section>
            <p className="oldMsgTime">(added {moment(`${message.createdDate}`).fromNow()}) </p>
            <p className="oldMsgTitle">{message.title}</p>
            <p className="oldMsgBody">{message.body}</p>
          </section>
        </div >
      }
    }))
  }

  render() {
    $(document).keyup(function (e) {
      if (e.keyCode === 27) {
        $("#root").removeClass("none");
        $(".navBarContainer").removeClass("none");
      }
    });
    if (this.props.props.currentUser === null) {
      this.props.history.push("/");
    }

    if (this.props.props.messages !== undefined && this.props.props.messages !== null) {
      return (
        <div className="mainMessageContainer" >
          <section className="titleSection">
            <h1 className="mainMessageTitle">MESSAGES</h1>
            <div className="oldMessagesWholeContainerFull">{this.messages()}</div>
          </section>
          <section className="hideNewMessage" >
            <p className="newMessageShowHide" onClick={() => {
              $(".oldMessagesWholeContainerFull").addClass("oldMessagesWholeContainer");
              $(".oldMessagesWholeContainerFull").removeClass("oldMessagesWholeContainerFull");
              $(".hideNewMessage").hide();
              $(".showNewMessage").show();
            }}>CREATE NEW MESSAGE<img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2Fexpand.png?alt=media&token=675987bf-7e16-4884-808f-f3ce8a0251d1" className="messageExpandHide" alt="Add Message" /></p>
          </section>
          <section className="showNewMessage hide">
            <p className="newMessageShowHide" onClick={() => {
              $(".oldMessagesWholeContainer").addClass("oldMessagesWholeContainerFull");
              $(".oldMessagesWholeContainer").removeClass("oldMessagesWholeContainer");
              $(".hideNewMessage").show();
              $(".showNewMessage").hide();
            }}>HIDE NEW MESSAGE<img src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2Fhide.png?alt=media&token=a5be8db2-cc6c-41e0-ba72-c0f408f02f58" className="messageExpandHide" alt="Add Message" /></p>
            <section className="messageInputSection">
              <section className="newMessageInputSection">
                <label className="newMessageInputLabel ">Title</label>
                <input type="text" className="newMessageInput" ref={input => this.title = input} defaultValue="" placeholder="Title...."></input>
              </section>
              <p className="newMessageAlert hide" id="messageNotEntered">You must enter a message to save.</p>
              <section className="newMessageInputSection">
                <label className="newMessageInputLabel ">Message</label>
                <input type="text" className="newMessageInput" ref={input => this.message = input} defaultValue="" placeholder="Message...."></input>
              </section>
              <section className="messageCreateSection">
                <article className="addMessageBtnSection">
                  <img className="saveIcon" onClick={this.saveMessage} src="https://firebasestorage.googleapis.com/v0/b/groupguru2-0.appspot.com/o/buttonIcons%2FsaveIcon.jpg?alt=media&token=4cfa4233-9546-461f-9bcc-bb1218984727" alt="Save" />
                </article>
              </section>
            </section>
          </section>
        </div>
      )
    } else {
      return (
        <div>
          <h1>Loading....</h1>
        </div>
      )

    }
  }
}