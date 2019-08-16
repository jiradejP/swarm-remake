import React, { Component } from "react";
import $ from "jquery";
import swal from "sweetalert";
import iziToast from "izitoast/dist/js/iziToast.min.js";
import axios, { post } from "axios";
import Swal from "sweetalert2";
import { DatePicker, Upload, Button, Icon } from "antd";
import "antd/dist/antd.css";

import { getCurrentUser } from "../../Utils/firebaseAuthen.js";
import { sendMail, getAllUser , getUserName } from "../../Utils/firebaseDatabase.js";
import { swarmServer } from "../../Utils/utils.js";

import moment from 'moment';
import 'moment/locale/th';

class WriteBox extends Component {
  constructor() {
    super();
    this.state = {
      to: "",
      documentNumber: "",
      dateOfDocument: moment(moment()).format('DD/MM/YYYY'),
      subject: "",
      content: "",
      files: null,
      filesContent: null,
      from: "",
      isFullWritebox: true,
      isPrivate: false,
      dropdownEmails: false,
      allUsersEmail: [],
      allOnlyEmails: [],
      checked: 0,
      allClick: false,
      // dateOfDocumentD: "",
      // dateOfDocumentM: "",
      // dateOfDocumentY: "",
      fromOfDocumentFrom: "",
      fromOfDocumentWay: "ปกติ",
      documentNumberN: "",
      documentNumberY: "",
      docType: "inbound",
      inBound_type: "sendToResponse",
      text: "",
      checkAlert: 0,
      fileList: [],
      name: "",
      surname: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.send = this.send.bind(this);
    this.resetState = this.resetState.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.checkChecked = this.checkChecked.bind(this);
    this.textChange = this.textChange.bind(this);
    iziToast.settings({
      progressBar: false
    });
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
    componentDidMount(){
    let allEmails = [];
    let allOnlyEmails = [];
    getAllUser().then(allUsers => {
      for (let i in allUsers) {
        allEmails.push(
          <label key={i}>
            <input
              type="checkbox"
              name="to"
              value={allUsers[i]}
              onChange={e => this.clicklist(e, allUsers[i].email)}
            />
            <span style={{ marginLeft: "5px" }}>{allUsers[i].firstName + " " + allUsers[i].lastName }</span>
            <br></br>
            <span style={{ marginLeft: "5px" }}>{"(" + allUsers[i].email +")"}</span>
          </label>
        );
        allOnlyEmails.push(allUsers[i].email);
      }
      allOnlyEmails.join();
      this.setState({
        allUsersEmail: allEmails,
        allOnlyEmails
      });
    });
  }
  componentWillReceiveProps(newProps) {
    if (newProps.sendTo) {
      this.setState({ to: newProps.sendTo });
    }
    this.setState({ 
        from: newProps.user.email 
      })
  }
  clickAll = e => {
    if (e.target.checked) {
      let emailList = this.state.allOnlyEmails;
      emailList = emailList.join();
      let lengthOfUsers = this.state.allUsersEmail;
      this.setState({
        to: emailList,
        allClick: true,
        checked: lengthOfUsers.length
      });
      $('input[name="to"]').prop("checked", true);
    } else {
      this.setState({ to: "", allClick: false, checked: 0 });
      $('input[name="to"]').prop("checked", false);
    }
  };
  clicklist = (e, email) => {
    if (e.target.checked) {
      if (!this.state.to) {
        this.setState({ to: email });
      } else {
        this.setState(
          prevState => ({
            to: prevState.to + "," + email
          }),
          () => this.forceUpdate()
        );
      }
      this.setState(
        prevState => ({
          checked: prevState.checked + 1
        }),
        () => this.checkChecked()
      );
    } else {
      let to = this.state.to;
      to = to.split(",");
      to.splice(to.indexOf(email), 1);
      to = to.join();
      this.setState(
        prevState => ({
          to,
          checked: prevState.checked - 1
        }),
        () => this.checkChecked()
      );
    }
  };

  checkChecked = () => {
    let lengthOfUsers = this.state.allUsersEmail;
    if (this.state.checked === lengthOfUsers.length) {
      this.setState({ allClick: true });
    } else this.setState({ allClick: false });
  };
  handleChange = event => {
    if (event.target.name === "isPrivate") {
      this.setState({ [event.target.name]: event.target.checked });
    } else this.setState({ [event.target.name]: event.target.value });
  };

  docnumChange = event => {
    this.setState(
      {
        [event.target.name]: event.target.value
      },
      () => this.updateDocnum()
    );
  };

  updateDocnum = () => {
    this.setState(prevState => ({
      documentNumber: `${prevState.documentNumberN}/${
        prevState.documentNumberY
      }`
    }));
  };

  textChange = () => {
    const formData = new FormData();
    formData.append("file", this.state.filesContent);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    return axios
      .post("http://127.0.0.1:4000/content", formData, config)
      .then(contentData => {
         this.setState({
            text: this.state.documentNumber.replace("/", " ") + " " + this.state.subject + " " + contentData.data
        })
      });
  };

  uploadFile = files => {
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

  isFillAll = () => {
    const {
      to,
      subject,
      content,
      fromOfDocumentFrom,
      documentNumberN,
      documentNumberY
    } = this.state;
    return (
      to &&
      subject &&
      content &&
      fromOfDocumentFrom &&
      documentNumberN &&
      documentNumberY
    );
  };

  send = async event => {
    const url = 'http://127.0.0.1:4000/sendMail/';
    if (!this.isFillAll()) {
      swal("ระวัง!", "กรุณากรอกข้อมูลให้ครบ", "warning");
      iziToast.warning({
        title: "ระวัง!",
        message: "กรุณากรอกข้อมูลให้ครบ"
      });
      return;
    }
    event.preventDefault();
    if (this.state.files) {
        this.uploadFile(this.state.files).then(hash => {
          Swal.fire({
            onBeforeOpen: () => {
              Swal.showLoading();
            },
            type: "warning",
            title: "รอสักครู่",
            text: "กำลังดำเนินการจัดเก็บข้อมูลบนบล็อกเชน",
            showConfirmButton: false
          });
          iziToast.warning({
            title: "รอสักครู่",
            message: "กำลังดำเนินการจัดเก็บข้อมูลบนบล็อกเชน"
          });
          this.props.closeWriteBox();

          let file = {
            address: hash,
            email: this.props.user.email,
            name: this.state.files.name,
            type: this.state.files.type
          };

          sendMail(this.state, file).then((ID) => {
            console.log(ID.id)
            Swal.fire({
              type: "success",
              title: "สำเร็จ",
              text: "ดำเนินการเก็บเอกสารบนบล็อกเชนเรียบร้อย",
              showConfirmButton: true
            });
            iziToast.success({
              title: "สำเร็จ",
              message: "ดำเนินการเก็บเอกสารบนบล็อกเชนเรียบร้อย"
            });
            let receivers = this.state.to;
            let senders = this.state.from;
            let allTo = receivers;
            if (Array.isArray(receivers)) {
              allTo = receivers.filter(receiver => receiver !== senders);
            }
            axios.post(url, {
              receivers: allTo,
              senders: this.state.from,
              title: this.state.subject,
              link: window.location.href,
              id: this.state.documentNumber,
              name: this.state.name,
              surname: this.state.surname
            });

            this.textChange().then( () => {
              let obj = {
                  text: this.state.text,
                  id: ID.id
              };

              // Axios.post('http://127.0.0.1:4000/solrText/add', obj);
            })

            this.resetState();
          });
        });
    } else {
      Swal.fire({
        onBeforeOpen: () => {
          Swal.showLoading();
        },
        type: "warning",
        title: "รอสักครู่",
        text: "กำลังดำเนินการจัดเก็บข้อมูลบนบล็อกเชน",
        showConfirmButton: false
      });
      iziToast.warning({
        title: "รอสักครู่",
        message: "กำลังดำเนินการจัดเก็บข้อมูลบนบล็อกเชน"
      });
      sendMail(this.state).then(() => {
        console.log(this.state.files);
        Swal.fire({
          type: "success",
          title: "สำเร็จ",
          text: "ส่งเอกสารเรียบร้อย",
          showConfirmButton: true
        });
        iziToast.success({
          title: "สำเร็จ",
          message: "ส่งเอกสารเรียบร้อย"
        });

        let receivers = this.state.to;
        let senders = this.state.from;
        let allTo = receivers;
        if (Array.isArray(receivers)) {
          allTo = receivers.filter(receiver => receiver !== senders);
        }
        axios.post(url, {
          receivers: allTo,
          senders: this.state.from,
          title: this.state.subject,
          link: window.location.href,
          id: this.state.documentNumber,
          name: this.state.name,
          surname: this.state.surname
        });
        this.resetState();
        this.props.closeWriteBox();
      });
    }
  };

  resetState = () => {
    this.setState(
      {
        to: "",
        documentNumber: "",
        dateOfDocument: moment(moment()).format('DD/MM/YYYY'),
        subject: "",
        content: "",
        files: null,
        filesContent: null,
        isFullWritebox: true,
        docType: "inbound",
        inBound_type: "sendToResponse",
        dateOfDocumentD: "",
        dateOfDocumentM: "",
        dateOfDocumentY: "",
        fromOfDocumentFrom: "",
        fromOfDocumentWay: "ปกติ",
        documentNumberN: "",
        documentNumberY: "",
        text: ""
      },
      () => {
        this.props.closeWriteBox();
      }
    );
  };
  toggleCollapse = () => {
    this.setState(
      prevState => ({
        isFullWritebox: !prevState.isFullWritebox
      }),
      () => this.forceUpdate()
    );
  };
  toggleDropdown = () => {
    this.setState(
      prevState => ({
        dropdownEmails: !prevState.dropdownEmails
      }),
      () => this.forceUpdate()
    );
  };
  setInput = to => {
    this.setState(
      prevState => ({
        to: to
      }),
      () => this.forceUpdate()
    );
  };
  handleInOutBound = event => {
    if (event.target.value === "inbound") {
      this.setState(prevState => ({
        docType: "inbound"
      }));
    } else
      this.setState(prevState => ({
        docType: "outbound",
        inBound_type: null
      }));
  };
  inBoundType = event => {
    if (event.target.value === "sendToResponse") {
      this.setState({ inBound_type: "sendToResponse" });
    } else this.setState({ inBound_type: "sendToAck" });
  };

  onChange = (date, dateString) => {
  
    this.setState(
      prevState => ({
        dateOfDocument : moment(dateString).format('DD/MM/YYYY')
      }),() => this.forceUpdate(),
    )
  };

  handleUploadChange = info => {
    
    let fileList = [...info.fileList];
    // console.log(fileList)
    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-1);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.status = "uploading"
        file.url = file.response.url;
        file.status = "done"
      }
      return file;
    });
    let file = null;
    if(fileList.length !== 0){
      file = fileList[0].originFileObj;
    }
    this.setState({ 
      fileList, 
      files: file,
      filesContent: file });
    // });
  };

  render() {
    let yearTh = parseInt(moment().set('year'))+543;

    const props = {
      onChange: this.handleUploadChange,
      multiple: false,
      status : 'done',
      defaultFileList:[{
        status: 'done',
      }]
    };
    return (
      <div
        className={
          this.props.isActive ? "write-box write-box-container" : "hidden"
        }
      >
        <div className="write-box-header">
          <div className="write-box-header-text" onClick={this.toggleCollapse}>
            <span>สร้างเอกสารใหม่</span>
          </div>
          <div className="write-box-header-action">
            <a onClick={this.toggleCollapse}>
              <i className="fas fa-ls fa-window-minimize" />
            </a>
            <a onClick={this.resetState}>
              <i className="fas fa-lg fa-times" />
            </a>
          </div>
        </div>
        {this.state.isFullWritebox ? (
          <div>
            <div className="write-box-section">
              <div
                className="write-box-section-text"
                style={{ width: "160px" }}
              >
                ประเภทเอกสาร
              </div>
              <div
                className="write-box-section-input"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div style={{ width: "140px", height: "100%" }}>
                  <div style={{ width: "140px", marginTop: "5px" }}>
                    <label className="inline">
                      <input
                        type="radio"
                        name="bound"
                        value="inbound"
                        checked={this.state.docType === "inbound"}
                        onChange={this.handleInOutBound}
                      />
                      <span style={{ marginLeft: "5px" }}>เข้า</span>
                    </label>
                    <label className="inline" style={{ marginLeft: "15px" }}>
                      <input
                        type="radio"
                        name="bound"
                        value="outbound"
                        checked={this.state.docType === "outbound"}
                        onChange={this.handleInOutBound}
                      />
                      <span style={{ marginLeft: "5px" }}>ออก</span>
                    </label>
                  </div>
                </div>
                {this.state.docType === "inbound" ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      height: "100%"
                    }}
                  >
                    <div
                      style={{
                        width: "2px",
                        backgroundColor: "#cfcfcf",
                        marginTop: "3px",
                        height: "30px"
                      }}
                    />
                    <div
                      style={{ width: "311px", padding: "6px 0px 0px 15px" }}
                    >
                      <label className="inline">
                        <input
                          type="radio"
                          name="inbound_type"
                          value="sendToResponse"
                          checked={this.state.inBound_type === "sendToResponse"}
                          onChange={this.inBoundType}
                        />
                        <span style={{ marginLeft: "5px" }}>
                          แจ้งเพื่อพิจารณา
                        </span>
                      </label>
                      <label className="inline" style={{ marginLeft: "15px" }}>
                        <input
                          type="radio"
                          name="inbound_type"
                          value="sendToAck"
                          checked={this.state.inBound_type === "sendToAck"}
                          onChange={this.inBoundType}
                        />
                        <span style={{ marginLeft: "5px" }}>แจ้งเพื่อทราบ</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="write-box-section">
              <div className="write-box-section-text">ผู้รับ</div>
              <div className="write-box-section-input">
                <input
                  type="text"
                  name="to"
                  value={this.state.to}
                  onChange={this.handleChange}
                />
              </div>
              <div
                className={
                  "dropdown " + (this.state.dropdownEmails ? "is-active" : "")
                }
              >
                <div className="dropdown-trigger" onClick={this.toggleDropdown}>
                  <button
                    className="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu2"
                  >
                    <span>ถึง</span>
                    <span className="icon is-small">
                      <i className="fas fa-angle-down" aria-hidden="true" />
                    </span>
                  </button>
                </div>
                {this.state.dropdownEmails ? (
                  <div className="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                      <div className="dropdown-item">
                        <label>
                          <input
                            type="checkbox"
                            name="to"
                            value="all"
                            onChange={this.clickAll}
                            checked={this.state.allClick}
                          />
                          <span style={{ marginLeft: "5px" }}>ALL</span>
                        </label>
                        <hr className="hr-mg10px" />
                        <div className="dropdown-itemlist">
                          {this.state.allUsersEmail}
                        </div>
                        <div className="hr-mg10px" />
                        <p style={{ textAlign: "center" }}>
                          {/* ท่านสามารถสร้างเอกสารทิ้งไว้
                          โดยที่ยังไม่มอบหมายถึงผู้ใดได้ */}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="write-box-section">
              <div className="write-box-section-text">เรื่อง</div>
              <div className="write-box-section-input">
                <input
                  type="text"
                  name="subject"
                  value={this.state.subject}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div
              className="writebox-doc-detail"
              style={{ display: "flex", flexDirection: "row", height: "80px" }}
            >
              <div
                className="write-box-section inline"
                style={{ width: "30%" }}
              >
                <div className="write-box-section-text">หมายเลขหนังสือ</div>
                <div className="write-box-section-inputgroup">
                  <div className="write-box-section-inputitem">
                    <div className="write-box-section-input">
                      <span>หมายเลข : </span>
                      <input
                        type="text"
                        name="documentNumberN"
                        value={this.state.documentNumberN}
                        onChange={this.docnumChange}
                        style={{ width: "75px", textAlign: "center" }}
                      />
                    </div>
                  </div>
                  <div className="write-box-section-inputitem">
                    <div className="write-box-section-input">
                      <span>ประจำปีพ.ศ. : </span>
                      <input
                        type="text"
                        name="documentNumberY"
                        value={this.state.documentNumberY}
                        onChange={this.docnumChange}
                        style={{ width: "53px", textAlign: "center" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="separate-inline inline" />
              <div
                className="write-box-section inline"
                style={{ marginLeft: "5px", width: "32%" }}
              >
                <div className="write-box-section-text">ลงวันที่</div>
                <div className="write-box-section-inputgroup">
                  <div className="write-box-section-inputitem">
                    {/* <div className="write-box-section-input" style={{marginTop:'10px'}}>
                                            <input type="text" name="dateOfDocumentD" value={this.state.dateOfDocumentD} onChange={this.dateChange} 
                                                style={{width:'45px', textAlign:'center'}} placeholder="วันที่" 
                                            />
                                            <span> / </span>
                                            <input type="text" name="dateOfDocumentM" value={this.state.dateOfDocumentM} onChange={this.dateChange} 
                                                style={{width:'45px', textAlign:'center'}} placeholder="เดือนที่" 
                                            />
                                            <span> / </span>
                                            <input type="text" name="dateOfDocumentY" value={this.state.dateOfDocumentY} onChange={this.dateChange} 
                                                style={{width:'48px', textAlign:'center'}} placeholder="ปี พ.ศ." 
                                            />
                                        </div> */}
                    <DatePicker defaultValue={moment(moment()).set('year',yearTh)}
                                format = {'DD/MM/YYYY'} 
                                locale = {moment.locale('th')} 
                                onChange={this.onChange}
                    />
                  </div>
                </div>
              </div>
              <div className="separate-inline inline" />
              <div
                className="write-box-section inline"
                style={{ marginLeft: "5px", width: "36%" }}
              >
                <div className="write-box-section-text">
                  {this.state.docType === "inbound"
                    ? "การรับเอกสาร"
                    : "การส่งเอกสาร"}
                </div>
                <div className="write-box-section-inputgroup">
                  <div className="write-box-section-inputitem">
                    <div className="write-box-section-input">
                      <span>
                        {this.state.docType === "inbound"
                          ? "ผู้ส่ง"
                          : "เลขหนังสือต้นเรื่อง"}{" "}
                        :{" "}
                      </span>
                      {this.state.docType === "inbound" ? (
                        <input
                          type="text"
                          name="fromOfDocumentFrom"
                          value={this.state.fromOfDocumentFrom}
                          onChange={this.handleChange}
                          style={{ width: "140px" }}
                        />
                      ) : (
                        <input
                          type="text"
                          name="fromOfDocumentFrom"
                          value={this.state.fromOfDocumentFrom}
                          onChange={this.handleChange}
                          style={{
                            display: "block",
                            width: "206px",
                            height: "20px"
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {this.state.docType === "inbound" ? (
                    <div className="write-box-section-inputitem">
                      <div className="write-box-section-input">
                        <span>ผ่านช่องทาง : </span>
                        <input
                          type="text"
                          name="fromOfDocumentWay"
                          value={this.state.fromOfDocumentWay}
                          onChange={this.handleChange}
                          style={{ width: "80px" }}
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="write-box-content">
              <div className="write-box-content-text inline">
                <div className="write-box-section-text">
                  รายละเอียดของเอกสาร
                </div>
                <textarea
                  type="textarea"
                  name="content"
                  value={this.state.content}
                  onChange={this.handleChange}
                />
              </div>
              <div className="separate-inline-content inline" />
              <div className="write-box-content-upload inline">
                <div className="write-box-section-text">อัพโหลดไฟล์เอกสาร</div>
                <div className="file-upload">
                  {/* <label className="file-label">
                                        <input type="file" name="files" onChange={this.uploadChange} accept= ".docx, .pdf"/>
                                    </label> */}
                  <Upload {...props}
                    fileList={this.state.fileList}
                    name="files"
                    onChange={this.handleUploadChange}
                    accept=".docx, .pdf"
                  >
                    <Button>
                      <Icon type="upload" /> Upload file
                    </Button>
                  </Upload>
                </div>
              </div>
            </div>
            <div className="write-box-footer">
              <a className="button is-primary sent-btn" onClick={this.send}>
                ส่ง
              </a>
              <div>
                <label style={{ display: "flex", flexDirection: "row" }}>
                  <input
                    type="checkbox"
                    name="isPrivate"
                    onChange={this.handleChange}
                    style={{
                      marginLeft: "20px",
                      marginRight: "10px",
                      marginTop: "9px"
                    }}
                  />
                  <span>ส่วนบุคคล</span>
                  {this.state.isPrivate ? (
                    <span style={{ marginLeft: "5px" }}>
                      <i className="fas fa-user-secret" />
                    </span>
                  ) : (
                    ""
                  )}
                </label>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default WriteBox;
