import React, { Component } from "react";
import classNames from "classnames";
import $ from "jquery";
import { toggleSignOut } from "../Utils/firebaseAuthen.js";
import { Link } from 'react-router-dom'

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      navbarMenuIsActive: false,
      userEmail: "Account",
      picture:
        "https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-3-128.png"
    };
    this.toggleNavbarMenu = this.toggleNavbarMenu.bind(this);
  }
  componentWillReceiveProps(newProps) {
    const userEmail = newProps.user.email;
    // const getPictureURL = `http://picasaweb.google.com/data/entry/api/user/${userEmail}?alt=json`;
    // $.get(getPictureURL,
    //     data => {
    //         if (data.entry) {
    //             this.setState({ picture: data.entry.gphoto$thumbnail.$t});
    //         }
    //     },
    // );
    this.setState({ userEmail });
  }
  toggleNavbarMenu = () => {
    this.setState(prevState => ({
      navbarMenuIsActive: !prevState.navbarMenuIsActive
    }));
  };
  logout = () => {
    toggleSignOut();
  };
  // editInfo = () => {
  //     console.log("hello world Edit user page.")
  // }
  render() {
    const NavbarMenu = classNames("navbar-item", "has-dropdown", {
      "is-active": this.state.navbarMenuIsActive
    });
    // console.log(${userEmail});
    return (
      <nav className="navbar has-shadow" id="Navbar">
        <div className="container is-fluid">
          <div className="navbar-brand">
            {/* <a className="navbar-item" href="../"> */}
            <a className="navbar-item" href="/dashboard">
              <h1 style={{ marginLeft: "20px", fontSize: "1.5rem" }}>
                SWARM MAIL
              </h1>
            </a>
          </div>
          <div id="navMenu" className="nav-style" >
            <div className="navbar-end">
              <div className={NavbarMenu}>
                <a className="navbar-link" onClick={this.toggleNavbarMenu}>
                  <figure className="navbar-avatar ">
                    <img className="img-avatar" src={this.state.picture} alt="avatar" />
                  </figure>
                  <span> {this.state.userEmail} </span>
                </a>
                <div className="navbar-dropdown">
                  <div className="navbar-account-bar">
                    <Link className="navbar-item" to="/EditUser">
                        ตั้งค่าผู้ใช้
                    </Link>
                    {/* <a className="navbar-item" href="/EditUser">
                      ตั้งค่าผู้ใช้
                    </a> */}
                  </div>
                  <div className="navbar-account-bar" />
                  {/* <a className="navbar-item">Settings</a> */}
                  {/* <hr className="navbar-divider" /> */}

                  <a className="navbar-item" onClick={this.logout}>
                    ออกจากระบบ
                  </a>

                  {/* <a className="navbar-item">
                                        <div className="navbar-item" onClick={this.logout}>ออกจากระบบ</div>
                                    </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
