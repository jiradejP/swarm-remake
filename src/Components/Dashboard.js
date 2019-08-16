import React, { Component } from "react";
import Navbar from "./Navbar";
import Aside from "./Dashboard/Aside";
import Summary from "./Dashboard/Summary";
import MailContent from "./Dashboard/MailContent";
import MailList from "./Dashboard/MailList";
import WriteBox from "./Dashboard/WriteBox";
import { getCurrentUser } from "../Utils/firebaseAuthen.js";
// import { getUserName } from "../Utils/firebaseDatabase.js";
import {
  getMailByReceiverDoing,
  getAllUser,
  getUserName,
  saveAccount
} from "../Utils/firebaseDatabase.js";

// import { BackTop } from 'antd';
// import 'antd/lib/back-top/style/css';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      writeBoxIsActive: false,
      isViewMailContent: false,
      user: {},
      email: [],
      currentMailContent: {},
      test: [],
      mails: [],
      name: "",
      surname: ""
    };
    this.openWriteBox = this.openWriteBox.bind(this);
    this.closeWriteBox = this.closeWriteBox.bind(this);
    this.openMailContent = this.openMailContent.bind(this);
    this.closeMailContent = this.closeMailContent.bind(this);
    this.refreshAllMail = this.refreshAllMail.bind(this);

    getCurrentUser().then(user => {
      console.log("dashboard get mail");
      getUserName(user.email).then(value => {
        this.setState(prevState => ({
          name: value.firstName,
          surname: value.lastName,
          user: user
        }));
      });
    //   this.setState(prevState => ({
    //     user: user
    //   }));
      getMailByReceiverDoing(user.email).then(mails => {
        this.setState(prevState => ({
          mails: mails,
          test: mails
        }));
      });
      getAllUser().then(allUsers => {
        for (let i in allUsers) {
          if (allUsers[i] === user.email) {
            return;
          }
        }
        // saveAccount(user.email);
      });
    });
  }
  refreshAllMail = () => {
    console.log("test ");
    return new Promise((resolve, reject) => {
      getMailByReceiverDoing(this.state.user.email).then(mails => {
        console.log(mails);
        this.setState(prevState => ({
          mails: mails
        }));
        resolve();
      });
    });
  };
  setCurrentMailContent = data => {
    this.setState(
      prevState => ({
        currentMailContent: data
      }),
      () => this.forceUpdate()
    );
  };
  openWriteBox = () => {
    this.setState(prevState => ({
      writeBoxIsActive: true
    }));
  };
  closeWriteBox = () => {
    this.setState(prevState => ({
      writeBoxIsActive: false
    }));
  };
  openMailContent = () => {
    this.setState(prevState => ({
      isViewMailContent: true
    }));
  };
  closeMailContent = () => {
    this.refreshAllMail().then(() => {
      this.setState(
        {
          isViewMailContent: false
        },
        () => this.forceUpdate()
      );
    });
  };

  triggerUpdate = () => {
    this.refreshAllMail().then(() => {
      console.log("triggerUpdate");
      this.forceUpdate();
    });
  };

  render() {
    // console.log(this.props.location)
    // if (this.state.test.length !== this.state.mails.length) {
    //   console.log("not equal");
    // } else {
    //   console.log("equal");
    // }
    return (
      <div id="Dashboard">
        {/* <div>
                    <BackTop />
                </div> */}
        <Navbar user={this.state.user} />

        <div className="container is-fluid">
          <div className="columns">
            <Aside
              location={this.props.location}
              page="dashboard"
              openWriteBox={this.openWriteBox}
            />
            <div className="column is-10 content">
              {this.state.isViewMailContent ? (
                <MailContent
                  user={this.state.user}
                  closeMailContent={this.closeMailContent}
                  currentMailContent={this.state.currentMailContent}
                />
              ) : (
                <Summary
                  mails={this.state.mails}
                  openMailContent={this.openMailContent}
                  setCurrentMailContent={this.setCurrentMailContent}
                  user={this.state.user}
                  name={this.state.name}
                  surname={this.state.surname}
                  mailsAll={this.state.mailsAll}
                />
              )}
            </div>
          </div>
          <WriteBox
            triggerUpdate={this.refreshAllMail}
            isActive={this.state.writeBoxIsActive}
            closeWriteBox={this.closeWriteBox}
            user={this.state.user}
          />
        </div>
      </div>
    );
  }
}

export default Dashboard;
