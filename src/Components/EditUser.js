import React, { Component } from "react";
import Navbar from "./Navbar";
import Aside from "./Dashboard/Aside";
import WriteBox from "./Dashboard/WriteBox";
import { getCurrentUser } from "../Utils/firebaseAuthen.js";
import {
  getUserName,
  saveEditName,
  saveEditSurname,
  saveEditBoth
} from "../Utils/firebaseDatabase.js";
import classNames from "classnames";
import { Skeleton, Row, Col, Card } from "antd";
import Swal from "sweetalert2";
import iziToast from "izitoast/dist/js/iziToast.min.js";

class EditUser extends Component {
  constructor() {
    super();
    this.state = {
      writeBoxIsActive: false,
      isViewMailContent: false,
      user: {},
      email: [],
      currentMailContent: {},
      allMembers: [],
      numberOfUsers: null,
      name: "",
      surname: "",
      updateName: "",
      updateSurname: "",
      isLoading: false
    };
    this.openWriteBox = this.openWriteBox.bind(this);
    this.closeWriteBox = this.closeWriteBox.bind(this);
    this.sendTo = this.sendTo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    getCurrentUser().then(user => {
      getUserName(user.email).then(value => {
        this.setState(prevState => ({
          name: value.firstName,
          surname: value.lastName,
          user: user
        }));
      });
    });
  }
  // componentWillMount() {
  //   console.log(this.state.user);
  //   if (this.state.user.email !== undefined) {
  //   }
  // }
  sendTo = userEmail => {
    this.setState(
      prevState => ({
        sendTo: userEmail
      }),
      () => this.openWriteBox()
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

  setLoading() {
    // console.log("set loading")
    this.setState({ isLoading: true });
  }

  loadCurrentUser = () => {
    getCurrentUser().then(user => {
      getUserName(user.email).then(value => {
        this.setState(prevState => ({
          name: value.firstName,
          surname: value.lastName,
          user: user
        }));
      });
    });
  };

  resetState = () => {
    // console.log("test reset")
    this.setState({
      isLoading: false,
      updateName: "",
      updateSurname: "",
      value: "",
      name: "",
      surname: ""
    });
  };
  resetLoading = () => {
    this.setState({isLoading: false})
  };
  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.setLoading();
    if (this.state.updateName === "" && this.state.updateSurname === "") {
      Swal.fire({
        type: "warning",
        title: "ผิดพลาด",
        text: "กรุณากรอกข้อมูล",
        showConfirmButton: true,
      });
      iziToast.warning({
        title: "ผิดพลาด",
        message: "กรุณากรอกข้อมูล"
      });
      this.resetLoading();
    } else if (this.state.updateName !== "" &&this.state.updateSurname === "") {
      saveEditName(this.state.user.email, this.state.updateName).then(() => {
        Swal.fire({
          type: "success",
          title: "สำเร็จ",
          text: "แก้ไขชื่อเรียบร้อย",
          showConfirmButton: true,
          onClose: () => {
            this.loadCurrentUser();
          }
        });
        iziToast.success({
          title: "สำเร็จ",
          message: "แก้ไขชื่อเรียบร้อย"
        });
        this.resetState();
      });
    } else if (
      this.state.updateSurname !== "" &&
      this.state.updateName === ""
    ) {
      saveEditSurname(this.state.user.email, this.state.updateSurname).then(
        () => {
          Swal.fire({
            type: "success",
            title: "สำเร็จ",
            text: "แก้ไขนามสกุลเรียบร้อย",
            showConfirmButton: true,
            onClose: () => {
              this.loadCurrentUser();
            }
          });
          iziToast.success({
            title: "สำเร็จ",
            message: "แก้ไขนามสกุลเรียบร้อย"
          });
          this.resetState();
        }
      );
    } else {
      // this.setState(prevState => ({
      //   isLoading: true
      // }));
      saveEditBoth(
        this.state.user.email,
        this.state.updateName,
        this.state.updateSurname
      ).then(() => {
        Swal.fire({
          type: "success",
          title: "สำเร็จ",
          text: "แก้ไขชื่อและนามสกุลเรียบร้อย",
          showConfirmButton: true,
          onClose: () => {
            this.loadCurrentUser();
          }
        });
        iziToast.success({
          title: "สำเร็จ",
          message: "แก้ไขชื่อและนามสกุลเรียบร้อย"
        });
        this.resetState();
      });
    }
  };

  render() {
    // console.log(this.state.user.email)
    // console.log(this.props)
    // console.log(this.state.isLoading)
    let checkName = this.state.name;
    let checkSurname = this.state.surname;
    if (checkName === null || checkName === undefined || checkName === "") {
      checkName = <Skeleton active paragraph={false} title={true} />;
    }
    if (
      checkSurname === null ||
      checkSurname === undefined ||
      checkSurname === ""
    ) {
      checkSurname = <Skeleton active paragraph={false} />;
    }
    const btnClass = classNames("button", "is-info", "is-normal", {
      "is-loading": this.state.isLoading
    });
    // console.log(this.state);
    return (
      <div className="users">
        <Navbar user={this.state.user} />
        <div className="container is-fluid">
          <div className="columns">
            <Aside page="users" openWriteBox={this.openWriteBox} />
            <div className="column is-10 content">
              {/* <h2>ตั้งค่าผู้ใช้</h2> */}
              <Card title="ตั้งค่าผู้ใช้" bordered={true} style={{ width: '100% ' }}>
              <form>
                <div>
                  <div style={{ marginTop: "15px" }}>
                    <Row gutter={8}>
                      <Col span={2} style={{ textAlign: "right" }}>
                        <h5>ชื่อ : </h5>
                      </Col>
                      <Col span={4}>
                        <h5>{checkName}</h5>
                      </Col>
                      <Col span={14}>
                        <input
                          className="input is-normal"
                          type="text"
                          id="updateName"
                          placeholder="ชื่อ"
                          value={this.state.value}
                          onChange={this.handleChange}
                          autoFocus=""
                        />
                      </Col>
                      {/* <Col span={15} offset={15} /> */}
                    </Row>
                  </div>
                  <div style={{ marginTop: "15px" }}>
                    <Row gutter={8}>
                      <Col span={2} style={{ textAlign: "right" }}>
                        <h5>นามสกุล : </h5>
                      </Col>
                      <Col span={4}>
                        <h5>{checkSurname}</h5>
                      </Col>
                      <Col span={14}>
                        <input
                          className="input is-normal"
                          type="text"
                          id="updateSurname"
                          placeholder="นามสกุล"
                          value={this.state.value}
                          onChange={this.handleChange}
                          autoFocus=""
                        />
                      </Col>
                      {/* <Col span={15} offset={15} /> */}
                    </Row>
                  </div>
                </div>
                <div style={{ marginTop: "15px" }}>
                  <row gutter={8}>
                    <Col span={4} offset={4} />
                    <Col span={4}>
                      <button
                        className={btnClass}
                        style={{ width: "100%", marginTop: "10px" }}
                        onClick={event => {
                          this.setState({ isLoading: true });
                          this.handleSubmit(event);
                        }}
                      >
                        save
                      </button>
                    </Col>
                    <Col span={10} offset={10} />
                  </row>
                </div>
              </form>
              </Card>

              
            </div>
          </div>
        </div>
        <WriteBox
          isActive={this.state.writeBoxIsActive}
          closeWriteBox={this.closeWriteBox}
          user={this.state.user}
          sendTo={this.state.sendTo}
        />
      </div>
    );
  }
}

export default EditUser;
