import React, { Component } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import iziToast from "izitoast/dist/js/iziToast.min.js";

import { handleSignUp } from "../Utils/firebaseAuthen.js";
import classNames from "classnames";


class Register extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPass: "",
      isLoading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    iziToast.settings({
      progressBar: false
    });
  }
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  toggleLoading = shouldLoad => {
    this.setState({ isLoading: shouldLoad });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState(prevState => ({
      isLoading: true
    }));
    handleSignUp(
      this.state.email,
      this.state.password,
      this.state.firstName,
      this.state.lastName,
      this.state.confirmPass,
      this.toggleLoading
    );
  };
//   GoogleSuccess = response => {
//     console.log("success");
//     console.log(response);
//   };
//   GoogleFail = response => {
//     swal("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้งภายหลัง", "error");
//     iziToast.error({
//       title: "เกิดข้อผิดพลาด",
//       message: "กรุณาลองใหม่อีกครั้งภายหลัง"
//     });
//     console.log(response);
//   };
  render() {
    // console.log(this.state.firstName + " " + this.state.lastName )
    const btnClass = classNames("button", "is-info", "is-normal", {
      "is-loading": this.state.isLoading
    });

    return (
      <section
        className="hero is-fullheight"
        style={{ backgroundColor: "#f4f8ff" }}
      >
        <div>
          <div className="hero-body">
            <div className="container has-text-centered">
              {/* <div className="column is-6 is-offset-3   "> */}
              <div className="column is-4 is-offset-4">
                <h3 className="title has-text-grey">Register</h3>
                <p className="subtitle" style={{ fontSize: "15px" }}>
                  Register with your email address
                </p>
                <div className="box">
                  <form>
                    <div className="field">
                      <input
                        className="input is-normal"
                        type="email"
                        id="email"
                        placeholder="อีเมล"
                        value={this.state.value}
                        onChange={this.handleChange}
                        autoFocus=""
                        required
                      />
                    </div>
                    {/* First name, Last name */}
                    <div className="columns columns-fill-name">
                      <div className="column"><input
                          className="input is-normal"
                          type="text"
                          id="firstName"
                          placeholder="ชื่อ"
                          value={this.state.value}
                          onChange={this.handleChange}
                          autoFocus=""
                          required
                        /></div>
                      <div className="column"><input
                          className="input is-normal"
                          type="text"
                          id="lastName"
                          placeholder="นามสกุล"
                          value={this.state.value}
                          onChange={this.handleChange}
                          autoFocus=""
                          required
                        /></div>
                    </div >
                    <div className="field">
                      <input
                        className="input is-normal"
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={this.state.value}
                        onChange={this.handleChange}
                        required
                      />
                    </div>
                    <div className="field">
                      <input
                        className="input is-normal"
                        type="password"
                        id="confirmPass"
                        placeholder="Confirm password"
                        value={this.state.value}
                        onChange={this.handleChange}
                        required
                      />
                    </div>
                    <div className="field" style={{ fontSize: "13px" }} />
                    <button
                      className={btnClass}
                      style={{ width: "100%" }}
                      onClick={this.handleSubmit}
                    >
                      Register
                    </button>
                  </form>
                  {/* <h4 style={{ marginTop: '20px', marginBottom: '20px' }}>OR</h4>
                                    <Link to="/login" className={btnDanger}>
                                        <i className="fab fa-google"></i>
                                        <span style={{ marginLeft: '10px' }}>Login with Google</span>
                                    </Link> */}
                  <br />

                  <p className="has-text-grey">
                    <Link to="login">Login </Link> &nbsp;.&nbsp;
                    <Link to="forgotpassword">Forgot Password</Link>{" "}
                    &nbsp;.&nbsp;
                    <Link to="/">Home Page</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Register;
