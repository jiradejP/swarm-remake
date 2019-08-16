import React from "react";
import { hot } from "react-hot-loader";
import ReactDOM from "react-dom";
import "./Styles/index.css";
import registerServiceWorker from "./Utils/registerServiceWorker";
import "bulma/css/bulma.css";
import "bulmaswatch/minty/bulmaswatch.min.css";
import * as firebase from "firebase";
import "izitoast/dist/css/iziToast.min.css";
import "firebase/firestore";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import App from "./Components/App";
import Register from "./Components/Register";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import Dashboard from "./Components/Dashboard";
import "./Utils/firebaseConfig.js";

import Inbox from "./Components/Inbox";
import InboxPrivate from "./Components/InboxPrivate";
import Sent from "./Components/Sent";
import Search from "./Components/Search";
import Match from "./Components/Match";
import All from "./Components/All";
import Doing from "./Components/Doing";
import Done from "./Components/Done";
import Cancel from "./Components/Cancel";
import UnAssign from "./Components/UnAssign";
import Inbound from "./Components/Inbound";
import Outbound from "./Components/Outbound";
import Users from "./Components/Users";
import MailBox from "./Components/MailBox";
import EditUser from "./Components/EditUser"

import { BackTop } from "antd";
import "antd/lib/back-top/style/css";

const nonLoggedinPath = ["/", "/login", "/register", "/forgotpassword"];

class Index extends React.Component {
  render() {
    // console.log(this.props.location)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (nonLoggedinPath.indexOf(window.location.pathname) !== -1) {
          if (user.emailVerified) {
            window.location.assign("/dashboard");
            // <Redirect>
          }
        }
      } else {
        if (nonLoggedinPath.indexOf(window.location.pathname) === -1) {
          window.location.assign("/login");
        }
      }
    });
    return (
      <div>
        <div>
          <BackTop />
        </div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={App} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/forgotpassword" component={ForgotPassword} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/inbox" component={Inbox} />
            <Route path="/inboxprivate" component={InboxPrivate} />
            <Route path="/sent" component={Sent} />
            <Route path="/search" component={Search} />
            <Route path="/MailBox" component={MailBox} />
            <Route path="/match/:id" component={Match} />
            <Route path="/all" component={All} />
            <Route path="/doing" component={Doing} />
            <Route path="/done" component={Done} />
            <Route path="/cancel" component={Cancel} />
            <Route path="/unassign" component={UnAssign} />
            <Route path="/inbound" component={Inbound} />
            <Route path="/outbound" component={Outbound} />
            <Route path="/users" component={Users} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/EditUser" component={EditUser}/>
            {/* <Route path="/forgotpassword" component={ForgotPassword} /> */}
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
ReactDOM.render(<Index />, document.getElementById("root"));

registerServiceWorker();
export default hot(module)(App);
