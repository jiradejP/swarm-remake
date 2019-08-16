import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toggleSignOut } from "../../Utils/firebaseAuthen.js";
import Swal from "sweetalert2";
import { Affix } from "antd";
// import "antd/dist/antd.css";

class Aside extends Component {
  logout = () => {
    <i class="fas fa-sign-out-alt" />;
    Swal.fire({
      title: "ต้องการจะออกจากระบบหรือไม่?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่"
    }).then(result => {
      if (result.value) {
        toggleSignOut();
      }
    });
  };
  render() {
    // console.log(this.props.location)
    let dashboardPage = false;
    let inboxPage = false;
    let inboxPrivatePage = false;
    let sentPage = false;
    let searchPage = false;
    let allPage = false;
    let doingPage = false;
    let donePage = false;
    let cancelPage = false;
    let usersPage = false;
    // let unassignPage = false;
    let inboundPage = false;
    let outboundPage = false;
    if (this.props.page === "dashboard") dashboardPage = true;
    else if (this.props.page === "inbox") inboxPage = true;
    else if (this.props.page === "inboxprivate") inboxPrivatePage = true;
    else if (this.props.page === "sent") sentPage = true;
    else if (this.props.page === "search") searchPage = true;
    else if (this.props.page === "all") allPage = true;
    else if (this.props.page === "doing") doingPage = true;
    else if (this.props.page === "done") donePage = true;
    else if (this.props.page === "cancel") cancelPage = true;
    else if (this.props.page === "users") usersPage = true;
    // else if (this.props.page === 'unassign') unassignPage = true;
    else if (this.props.page === "inbound") inboundPage = true;
    else if (this.props.page === "outbound") outboundPage = true;
    return (
        // <aside className="column is-2 aside">
        //   <div>
        //     <div className="compose has-text-centered">
        //       <a
        //         className="button is-danger is-block is-bold"
        //         onClick={this.props.openWriteBox}
        //       >
        //         <span className="compose">+ สร้างเอกสารใหม่</span>
        //       </a>
        //       {/*<Link to='/MailBox' className="button is-danger is-block is-bold">*/}
        //       {/*<span className="compose">+ สร้างเอกสารใหม่</span>*/}
        //       {/*</Link>*/}
        //     </div>
        //     <div className="main">
        //       <Link
        //         to="/dashboard"
        //         className={"item " + (dashboardPage ? "active" : "")}
        //       >
        //         <span className="icon">
        //           <i className="fas fa-tachometer-alt" />
        //         </span>
        //         <span className="name">หน้าแรก</span>
        //       </Link>
        //       <Link
        //         to="/search"
        //         className={"item " + (searchPage ? "active" : "")}
        //       >
        //         <span className="icon">
        //           <i className="fas fa-search" />
        //         </span>
        //         <span className="name">ค้นหาเอกสาร</span>
        //       </Link>
        //       <hr className="hr" />
        //       <Link
        //         to="/inbox"
        //         className={"item " + (inboxPage ? "active" : "")}
        //       >
        //         <span className="icon">
        //           <i className="fa fa-inbox" />
        //         </span>
        //         <span className="name">กล่องจดหมาย</span>
        //       </Link>
        //       {/* <Link to='/inboxprivate' className={"item " + (inboxPrivatePage ? 'active' : '')}>
        //                     <span className="icon"><i className="fas fa-lock"></i></span>
        //                     <span className="name">เอกสารส่วนตัวถึงคุณ</span>
        //                 </Link> */}
        //       <Link
        //         to={{ pathname: "/sent", state: { isCreateByYou: true } }}
        //         className={"item " + (sentPage ? "active" : "")}
        //       >
        //         <span className="icon">
        //           <i className="fas fa-share-square" />
        //         </span>
        //         <span className="name">ที่สร้างโดยคุณ</span>
        //       </Link>
        //       <hr className="hr" />
        //       {/* <center style={{marginBottom:'5px'}}><h4>เอกสารภายใน</h4></center> */}
        //       <Link to="/all" className={"item " + (allPage ? "active" : "")}>
        //         <span className="icon">
        //           <i className="fas fa-copy" />
        //         </span>
        //         <span className="name">เอกสารทั้งหมด</span>
        //       </Link>
        //       {/* <Link to='/doing' className={"item " + (doingPage? 'active' : '')}>
        //                         <span className="icon"><i className="far fa-list-alt"></i></span>
        //                         <span className="name">เอกสารกำลังดำเนินการ</span>
        //                 </Link>
        //                 <Link to='/done' className={"item " + (donePage? 'active' : '')}>
        //                         <span className="icon"><i className="far fa-check-circle"></i></span>
        //                         <span className="name">เอกสารดำเนินการเสร็จ</span>
        //                 </Link>
        //                 <Link to='/cancel' className={"item " + (cancelPage? 'active' : '')}>
        //                         <span className="icon"><i className="far fa-times-circle"></i></span>
        //                         <span className="name">ยกเลิกเอกสาร</span>
        //                 </Link> */}
        //       {/* <Link to='/unassign' className={"item " + (unassignPage ? 'active' : '')}>
        //                     <span className="icon"><i className="far fa-circle"></i></span>
        //                     <span className="name">เอกสารที่ไม่ได้มอบหมาย</span>
        //                 </Link> */}
        //       <Link
        //         to="/inbound"
        //         className={"item " + (inboundPage ? "active" : "")}
        //       >
        //         <span className="icon">
        //           <i className="fas fa-sign-in-alt" />
        //         </span>
        //         <span className="name">เอกสารภายใน</span>
        //       </Link>
        //       <Link
        //         to="/outbound"
        //         className={"item " + (outboundPage ? "active" : "")}
        //       >
        //         <span className="icon">
        //           <i className="fas fa-sign-out-alt" />
        //         </span>
        //         <span className="name">เอกสารภายนอก</span>
        //       </Link>
        //       <hr className="hr" />
        //       <Link
        //         to="/users"
        //         className={"item " + (usersPage ? "active" : "")}
        //       >
        //         <span className="icon">
        //           <i className="fas fa-users" />
        //         </span>
        //         <span className="name">สมาชิกทั้งหมด</span>
        //       </Link>
        //       <a className="item" onClick={this.logout}>
        //         <span className="icon">
        //           <i className="fas fa-sign-out-alt" />
        //         </span>
        //         <span className="name">ออกจากระบบ</span>
        //       </a>
        //     </div>
        //   </div>
        // </aside>
      <Affix offsetTop={10} className="column is-2 aside " >
          {/* <div style={{ width: '190px' }}> */}
          <div className="aside-affix">
          {/* <div> */}
              <div className="compose has-text-centered">

                  <a className="button is-danger is-block is-bold" onClick={this.props.openWriteBox}>
                      <span className="compose">+ สร้างเอกสารใหม่</span>
                  </a>
                  {/*<Link to='/MailBox' className="button is-danger is-block is-bold">*/}
                      {/*<span className="compose">+ สร้างเอกสารใหม่</span>*/}
                  {/*</Link>*/}

              </div>
              <div className="main">
                  <Link to='/dashboard' className={"item " + (dashboardPage? 'active' : '')}>
                          <span className="icon"><i className="fas fa-tachometer-alt"></i></span>
                          <span className="name">หน้าแรก</span>
                  </Link>
                  <Link to='/search' className={"item " + (searchPage ? 'active' : '')}>
                      <span className="icon"><i className="fas fa-search"></i></span>
                      <span className="name">ค้นหาเอกสาร</span>
                  </Link>
                  <hr className = "hr"/>
                  <Link to='/inbox' className={"item " + (inboxPage? 'active' : '')}>
                          <span className="icon"><i className="fa fa-inbox"></i></span>
                          <span className="name">กล่องจดหมาย</span>
                  </Link>
                  {/* <Link to='/inboxprivate' className={"item " + (inboxPrivatePage ? 'active' : '')}>
                      <span className="icon"><i className="fas fa-lock"></i></span>
                      <span className="name">เอกสารส่วนตัวถึงคุณ</span>
                  </Link> */}
                  <Link to={{pathname: "/sent", state: { isCreateByYou: true }}} className={"item " + (sentPage? 'active' : '')}>
                          <span className="icon"><i className="fas fa-share-square"></i></span>
                          <span className="name">ที่สร้างโดยคุณ</span>
                  </Link>
                  <hr className = "hr"/>
                  {/* <center style={{marginBottom:'5px'}}><h4>เอกสารภายใน</h4></center> */}
                  <Link to='/all' className={"item " + (allPage? 'active' : '')}>
                          <span className="icon"><i className="fas fa-copy"></i></span>
                          <span className="name">เอกสารทั้งหมด</span>
                  </Link>
                  {/* <Link to='/doing' className={"item " + (doingPage? 'active' : '')}>
                          <span className="icon"><i className="far fa-list-alt"></i></span>
                          <span className="name">เอกสารกำลังดำเนินการ</span>
                  </Link>
                  <Link to='/done' className={"item " + (donePage? 'active' : '')}>
                          <span className="icon"><i className="far fa-check-circle"></i></span>
                          <span className="name">เอกสารดำเนินการเสร็จ</span>
                  </Link>
                  <Link to='/cancel' className={"item " + (cancelPage? 'active' : '')}>
                          <span className="icon"><i className="far fa-times-circle"></i></span>
                          <span className="name">ยกเลิกเอกสาร</span>
                  </Link> */}
                  {/* <Link to='/unassign' className={"item " + (unassignPage ? 'active' : '')}>
                      <span className="icon"><i className="far fa-circle"></i></span>
                      <span className="name">เอกสารที่ไม่ได้มอบหมาย</span>
                  </Link> */}
                  <Link to='/inbound' className={"item " + (inboundPage ? 'active' : '')}>
                      <span className="icon"><i className="fas fa-sign-in-alt"></i></span>
                      <span className="name">เอกสารภายใน</span>
                  </Link>
                  <Link to='/outbound' className={"item " + (outboundPage ? 'active' : '')}>
                      <span className="icon"><i className="fas fa-sign-out-alt"></i></span>
                      <span className="name">เอกสารภายนอก</span>
                  </Link>
                  <hr className = "hr"/>
                  <Link to='/users' className={"item " + (usersPage ? 'active' : '')}>
                      <span className="icon"><i className="fas fa-users"></i></span>
                      <span className="name">สมาชิกทั้งหมด</span>
                  </Link>
                  <a className="item" onClick={this.logout}>
                      <span className="icon"><i className="fas fa-sign-out-alt"></i></span>
                      <span className="name">ออกจากระบบ</span>
                  </a>
              </div>
          </div>
      </Affix>
    );
  }
}

export default Aside;
