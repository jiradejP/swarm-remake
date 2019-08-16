import React, { Component } from "react";
import $ from "jquery";
import swal from "sweetalert";
import iziToast from "izitoast/dist/js/iziToast.min.js";
import classNames from "classnames";
import { Spin, Icon } from "antd";
import axios from "axios";

import {
  assignTo,
  setStatusTo,
  acceptReject,
  newUploadFile,
  getMailbyID
} from "../../Utils/firebaseDatabase.js";
import { swarmServer } from "../../Utils/utils.js";
import { element } from "prop-types";

class Action extends Component {
  constructor() {
    super();
    this.state = {
      isReceiver: false,
      isSender: false,
      data: {},
      user: {},
      permissionToAction: "",
      isShowUpload: false,
      isShowAssign: false,
      isShowStatus: false,
      optionUpload: 0,
      assign: "",
      status: "done",
      isShowAction: true,
      files: null,
      errorIsLoading: false,
      isShowErrorDiv: false,
      isLoading: false
    };

    iziToast.settings({
      progressBar: false
    });
  }
  componentWillReceiveProps(newProps) {
    if (this.state.data) {
      if (
        this.state.data.status === "done" ||
        this.state.data.status === "cancel"
      ) {
        this.setState(
          prevState => ({
            isShowAction: false
          }),
          () => this.forceUpdate()
        );
      }
    }
    this.setState(
      prevState => ({
        data: newProps.data,
        user: newProps.user,
        permissionToAction: newProps.permissionToAction,
        isShowErrorDiv: newProps.isShowErrorDiv
      }),
      () => this.forceUpdate()
    );
    if (newProps.permissionToAction === "sender") {
      this.setState(
        prevState => ({
          isSender: true
        }),
        () => this.forceUpdate()
      );
    } else if (newProps.permissionToAction === "receiver") {
      this.setState(
        prevState => ({
          isReceiver: true
        }),
        () => this.forceUpdate()
      );
    } else if (newProps.permissionToAction === "no permission") {
      // console.log(newProps.permissionToAction)
      this.setState(
        prevState => ({
          isReceiver: false,
          isSender: false
        }),
        () => this.forceUpdate()
      );
    } else {
      this.setState(
        prevState => ({
          isReceiver: null,
          isSender: null
        }),
        () => this.forceUpdate()
      );
    }
  }
  acceptClick = () => {
    swal({
      title: "คุณแน่ใจหรือไม่?",
      text: "เมื่อตอบรับเอกสารแล้วไม่สามารถเปลี่ยนแปลงได้",
      icon: "info",
      buttons: true,
      successMode: true
    }).then(isOK => {
      if (isOK) {
        acceptReject(this.state.data, this.state.user, "accepted").then(() => {
          swal("สำเร็จ", "ตอบกลับเอกสารสำเร็จ", "success");
          iziToast.success({
            title: "สำเร็จ",
            message: "ตอบกลับเอกสารสำเร็จ"
          });
          this.props.closeMailContent();
        });
        const url = `http://localhost:4000/sendMailAccept/`;
        let receivers = this.state.data.allTo;
        let from = this.state.data.from;
        // const allTo = receivers.filter(receiver => receiver !== from)
        axios.post(url, {
          receivers: receivers,
          senders: from,
          // // "title": this.state.subject,
          link: window.location.href
          // // "id": this.state.documentNumber,
          // "senders": this.state.
        });
      }
    });
  };
  rejectClick = () => {
    swal({
      title: "คุณแน่ใจหรือไม่?",
      text: "เมื่อตอบรับเอกสารแล้วไม่สามารถเปลี่ยนแปลงได้",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(isOK => {
      if (isOK) {
        acceptReject(this.state.data, this.state.user, "rejected").then(() => {
          swal("สำเร็จ", "ปฏิเสธเอกสารสำเร็จ", "success");
          iziToast.success({
            title: "สำเร็จ",
            message: "ปฏิเสธเอกสารสำเร็จ"
          });
          this.props.closeMailContent();
        });
        const url = `http://localhost:4000/sendMailReject/`;
        let receivers = this.state.data.allTo;
        let from = this.state.data.from;
        // const allTo = receivers.filter(receiver => receiver !== from)
        // console.log()
        axios.post(url, {
          receivers: receivers,
          senders: from,
          id: this.state.data.documentNumber,
          // // "title": this.state.subject,
          link: window.location.href
          // // "id": this.state.documentNumber,
          // "senders": this.state.
        });
      }
    });
  };
  toggleShowUpload = () => {
    this.setState(
      prevState => ({
        isShowUpload: !prevState.isShowUpload,
        isShowAssign: false,
        isShowStatus: false
      }),
      () => this.forceUpdate()
    );
  };
  toggleShowAssign = () => {
    this.setState(
      prevState => ({
        isShowUpload: false,
        isShowAssign: !prevState.isShowAssign,
        isShowStatus: false
      }),
      () => this.forceUpdate()
    );
  };
  toggleShowStatus = () => {
    this.setState(
      prevState => ({
        isShowUpload: false,
        isShowAssign: false,
        isShowStatus: !prevState.isShowStatus
      }),
      () => this.forceUpdate()
    );
  };
  newUpload = () => {
    this.setState(
      prevState => ({
        optionUpload: 0
      }),
      () => this.forceUpdate()
    );
  };
  UploadToOldFile = () => {
    this.setState(
      prevState => ({
        optionUpload: 1
      }),
      () => this.forceUpdate()
    );
  };
  handleChange = event => {
    if (event.target.name === "files") {
      const files = event.target.files[0];
      this.setState({ files });
    } else this.setState({ [event.target.name]: event.target.value });
  };

  assignClick = () => {
    if (!this.state.assign) {
      swal("ระวัง!", "กรุณากรอกอีเมลผู้รับมอบหมาย", "warning");
      iziToast.warning({
        title: "ระวัง!",
        message: "กรุณากรอกอีเมลผู้รับมอบหมาย"
      });
      return;
    }
    swal({
      title: "คุณแน่ใจหรือไม่?",
      icon: "info",
      buttons: true,
      successMode: true
    }).then(isOK => {
      if (isOK) {
        const url = `http://localhost:4000/sendMailAssign/`;
        let receivers = this.state.assign;
        let senders = this.state.data.from;

        axios.post(url, {
          receivers: receivers,
          senders: senders,
          title: this.state.subject,
          link: window.location.href,
          id: this.state.data.documentNumber
          // "senders": this.state.
        });
        assignTo(this.state.data, this.state.user, this.state.assign).then(
          () => {
            swal("สำเร็จ", "มอบหมายสำเร็จ", "success");
            iziToast.success({
              title: "สำเร็จ",
              message: "มอบหมายสำเร็จ"
            });
            this.toggleShowAssign();
            this.props.closeMailContent();
            this.forceUpdate();
          }
        );
      }
    });
  };
  statusClick = () => {
    swal({
      title: "คุณแน่ใจหรือไม่?",
      icon: "info",
      buttons: true,
      successMode: true
    }).then(isOK => {
      if (isOK) {
        const url = `http://localhost:4000/sendMailCancel/`;
        let receivers = this.state.data.allTo;
        let senders = this.state.data.from;
        console.log(this.state.data.allTo);
        axios.post(url, {
          receivers: receivers,
          senders: senders,
          // "title": this.state.subject,
          link: window.location.href,
          id: this.state.data.documentNumber
          // "senders": this.state.
        });
        setStatusTo(this.state.data, this.state.user, this.state.status).then(
          () => {
            swal("สำเร็จ", "เปลี่ยนสถานะของเอกสารสำเร็จ", "success");
            iziToast.success({
              title: "สำเร็จ",
              message: "เปลี่ยนสถานะของเอกสารสำเร็จ"
            });
            this.toggleShowStatus();
            this.forceUpdate();
            this.props.refreshThisMail().then(data => {
              this.setState(
                prevState => ({
                  data: data
                }),
                () => this.forceUpdate()
              );
            });
          }
        );
      }
    });
  };
  uploadFile = () => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: swarmServer,
        "Access-Control-Allow-Origin": "*",
        crossDomain: true,
        type: "POST",
        contentType: this.state.files.type,
        data: this.state.files,
        processData: false,
        success: function(response) {
          resolve(response);
        },
        error: function(xhr, status) {
          reject(status);
        }
      });
    });
  };

  uploadClick = () => {
    this.setState(prevState => ({
      isLoading: true
    }));

    //   if(this.state.files.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && this.state.files.type !== "application/pdf"){
    if(this.state.files === null){
        swal('ผิดพลาด', 'ไม่มีไฟล์อัพโหลด', 'warning');
        iziToast.warning({
            title: 'ผิดพลาด',
            message: 'ไม่มีไฟล์อัพโหลด',
        });
        this.setState(prevState => ({
            isLoading: false
          }));
    }else{
        this.uploadFile().then(hash => {
            let file = {
              address: hash,
              email: this.props.user.email,
              name: this.state.files.name,
              type: this.state.files.type
            };
      
            newUploadFile(this.state.data, file, this.state.user).then(() => {
              const url = `http://localhost:4000/sendMailUpload/`;
              let receivers = this.state.data.allTo;
              let from = this.state.data.from;
              // const allTo = receivers.filter(!from)
              const allTo = receivers.filter(receiver => receiver !== from);
              axios.post(url, {
                receivers: allTo,
                senders: from,
                id: this.state.data.documentNumber,
                link: window.location.href
                // // "title": this.state.subject,
                // // "link": window.location.href,
                // // "id": this.state.documentNumber,
                // "senders": this.state.
              });
              console.log(this.state.files.type);
              swal("สำเร็จ", "อัพโหลดไฟล์สำเร็จ", "success");
              iziToast.success({
                title: "สำเร็จ",
                message: "อัพโหลดไฟล์สำเร็จ"
              });
              this.props.refreshThisMail().then(data => {
                this.setState(
                  prevState => ({
                    data: data
                  }),
                  () => {
                    this.forceUpdate();
                  }
                );
              });
              this.setState(
                prevState => ({
                  isShowUpload: false,
                  isShowAssign: false,
                  isShowStatus: false,
                  isLoading: false
                }),
                () => this.forceUpdate()
              );
            });
          });
    }
  };
  errorClick = () => {
    this.setState({ errorIsLoading: true });
    this.props.letSetStateWhenFail();
    setTimeout(() => {
      this.setState({ isShowErrorDiv: false });
    }, 2000); //2000
  };
  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 36 }} spin />;
    let status = "";
    if (this.state.data.status === "done") status = "เสร็จสิ้น";
    else if (this.state.data.status === "cancel") status = "ยกเลิกเอกสาร";

    const errorBtn = classNames("button", "is-medium", "is-warning", {
      "is-loading": this.state.errorIsLoading
    });
    // console.log(this.state.data)
    const btnUploadClass = classNames("button", "is-info", "is-normal", {
      "is-loading": this.state.isLoading
    });
    //   console.log(this.state.isLoading)
    return (
      <div>
        {this.state.isShowAction ? (
          <div className="Action">
            <div className="mail-actioning">
              {this.state.isSender ? (
                <div>
                  <center>
                    <h3>กระทำกับเอกสารนี้</h3>
                  </center>
                  <div className="Action-uploadfile inline">
                    <a
                      className={
                        "button is-medium action action-upload " +
                        (this.state.isShowUpload ? "active" : "")
                      }
                      onClick={this.toggleShowUpload}
                    >
                      อัพโหลดไฟล์
                    </a>
                  </div>
                  <div className="Action-assign inline">
                    <a
                      className={
                        "button is-medium action action-upload " +
                        (this.state.isShowAssign ? "active" : "")
                      }
                      onClick={this.toggleShowAssign}
                    >
                      มอบหมาย
                    </a>
                  </div>
                  {/* <div className="Action-status inline">
                            <a className={"button is-medium action action-upload " + (this.state.isShowStatus ? "active" : "")} onClick={this.toggleShowStatus}>ตั้งสถานะเอกสาร</a>
                        </div> */}
                  {this.state.isShowUpload ? (
                    <center style={{ marginTop: "50px" }}>
                      <div className="option-upload">
                        <div className="upload-area">
                          <div className="file-upload inline">
                            <label className="file-label">
                              <input
                                type="file"
                                name="files"
                                onChange={this.handleChange}
                                style={{ width: "160px" }}
                                accept=".docx, .pdf"
                              />
                            </label>
                          </div>
                          <br />
                          <a
                            className="button is-primary is-medium action"
                            onClick={this.uploadClick}
                            style={{ marginTop: "30px" }}
                          >
                            Upload
                          </a>
                        </div>
                      </div>
                    </center>
                  ) : this.state.isShowAssign ? (
                    <div className="assign">
                      <h4>Assign To ..</h4>
                      <div className="control has-icons-left has-icons-right">
                        <input
                          className="input is-medium"
                          type="email"
                          placeholder="name@email.com"
                          name="assign"
                          value={this.state.assign}
                          onChange={this.handleChange}
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-user" />
                        </span>
                        <span className="icon is-small is-right">
                          <i className="fas fa-check" />
                        </span>
                      </div>
                      <center>
                        <a
                          className="button is-medium is-primary"
                          onClick={this.assignClick}
                        >
                          Assign
                        </a>
                      </center>
                    </div>
                  ) : this.state.isShowStatus ? (
                    <div className="status">
                      <div className="control">
                        <center
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <label
                            className="radio"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <input
                              type="radio"
                              name="status"
                              value="done"
                              onClick={this.handleChange}
                              style={{ marginTop: "8px" }}
                              defaultChecke
                            />
                            <span style={{ marginLeft: "10px" }}>
                              เอกสารเสร็จสิ้น(Done)
                            </span>
                          </label>
                          <label
                            className="radio"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <input
                              type="radio"
                              name="status"
                              value="cancel"
                              onClick={this.handleChange}
                              style={{ marginTop: "8px" }}
                            />
                            <span style={{ marginLeft: "10px" }}>
                              ยกเลิกเอกสาร(Cancel)
                            </span>
                          </label>
                        </center>
                      </div>
                      <center>
                        <a
                          className="button is-medium is-primary"
                          onClick={this.statusClick}
                        >
                          Set Status
                        </a>
                      </center>
                    </div>
                  ) : (
                    " "
                  )}
                </div>
              ) : this.state.isSender === null &&
                this.state.isReceiver === null ? (
                <div>
                  <Spin indicator={antIcon} />
                </div>
              ) : // : ( ? <div><Spin indicator={antIcon}/></div>
              this.state.isReceiver ? (
                <div>
                  <center>
                    <h3>กระทำกับเอกสารนี้</h3>
                  </center>
                  <a
                    className={
                      "button is-medium action action-upload " +
                      (this.state.isShowUpload ? "active" : "")
                    }
                    onClick={this.toggleShowUpload}
                  >
                    Upload File
                  </a>
                  {/* <div className="inline">
                            <span className="action-or"> - </span>
                            <a className="button is-primary is-medium action" onClick={this.acceptClick}>ตอบรับเอกสาร</a>
                            <a className="button is-danger is-medium action" onClick={this.rejectClick}>ปฏิเสธเอกสาร</a>
                        </div> */}
                  {this.state.isShowUpload ? (
                    <div style={{ marginTop: "40px" }}>
                      <center>
                        <div className="option-upload">
                          <div className="upload-area">
                            <div className="file-upload inline">
                              <label className="file-label ">
                                <input
                                  type="file"
                                  name="files"
                                  onChange={this.handleChange}
                                  style={{ width: "160px" }}
                                  accept=".docx, .pdf"
                                />
                              </label>
                            </div>
                            <br />
                            {/* <a className="button is-primary is-medium action" onClick={this.uploadClick} style={{marginTop:'30px'}}>Upload</a> */}
                            <button
                              className={btnUploadClass}
                              style={{ marginTop: "30px" }}
                              onClick={this.uploadClick}
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      </center>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                <h3>คุณไม่มีสิทธิ์กระทำกับเอกสารนี้</h3>
              )}
            </div>

            <div
              className={
                "ETH-ConnectFail " + (this.state.isShowErrorDiv ? "" : "hidden")
              }
              style={{ width: "600px", height: "150px", margin: "auto" }}
            >
              <hr />
              <center>
                <h3>เกิดข้อผิดพลาด! ไม่สามารถเชื่อมต่อเครือข่าย Ethereum</h3>
              </center>
              <center>
                <a className={errorBtn} onClick={this.errorClick}>
                  คลิกที่นี่ เพื่อเรียกใช้ข้อมูลเบื้องต้นที่ถูกสำรองไว้
                </a>
              </center>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "40px" }}>
            <center>
              <h3>เอกสารฉบับนี้ได้ {status} แล้ว</h3>
            </center>
          </div>
        )}
      </div>
    );
  }
}

export default Action;
