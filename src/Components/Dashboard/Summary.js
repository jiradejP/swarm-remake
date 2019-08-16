import React, { Component } from "react";
import MailList from "./MailList";
import {
  getMailByReceiver,
  getAllEmail,
  getAllEmailDoing,
  getAllEmailDone,
  getAllEmailCancel,
  getUserName
} from "../../Utils/firebaseDatabase.js";
import { getCurrentUser } from "../../Utils/firebaseAuthen.js"
// import {getCurrentUser} from "../../Utils/firebaseAuthen.js";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import swal from "sweetalert";
import { Spin, Icon } from "antd";

import "antd/lib/icon/style/css";
import "antd/lib/spin/style/css";

class Summary extends Component {
  constructor() {
    super();
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    this.state = {
      user: {
        email: "-"
      },
      name: "-",
      surname: "-",
      mailsAll: <Spin indicator={antIcon} />,
      // mailsDone: <Spin indicator={antIcon} />,
      // mailsDoing: <Spin indicator={antIcon} />,
      mailsToYou: <Spin indicator={antIcon} />,
      isShowInboxCard: true,
      isShowAllCard: true,
      isShowDoingCard: true,
      isShowDoneCard: true,
      isShowCancelCard: true,
      all: undefined,
      mails: undefined,
      doing: undefined,
      done: undefined,
      cancel: undefined,
      firstName: "-",
      lastName: "-"
    };
    getAllEmail().then(mails => {
      // console.log(mails)
      this.state.all = mails;
    });
    getAllEmailDoing().then(mails => {
      // console.log(mails)
      this.state.doing = mails;
    });
    getAllEmailDone().then(mails => {
      // console.log(mails)
      this.state.done = mails;
    });
    getAllEmailCancel().then(mails => {
      // console.log(mails)
      this.state.cancel = mails;
    });
    getAllEmail().then(allMails => {
      let mailsDoing = 0;
      let mailsDone = 0;
      for (let i in allMails) {
        if (allMails[i].status === "done") mailsDone++;
        else if (allMails[i].status === "doing") mailsDoing++;
      }
      this.state.mailsAll = allMails.length;
      this.state.mailsDoing = mailsDoing;
      this.state.mailsDone = mailsDone;
    });
    // getCurrentUser().then(user => {
    //     getUserName(user.email).then(value => {
    //       this.setState(prevState => ({
    //         name: value.firstName,
    //         surname: value.lastName,
    //         user: user
    //       }));
    //     });
    //   });
  }

  triggerUpdate = () => {
    this.forceUpdate();
  };

  componentWillReceiveProps(newProps) {
    this.setState(
      prevState => ({
        user: newProps.user,
        name: newProps.name,
        surname: newProps.surname,
      }),
      () => this.forceUpdate()
    );
    // getCurrentUser().then(user => {
    //   getUserName(user.email).then(value => {
    //     this.setState(prevState => ({
    //       name: value.firstName,
    //       surname: value.lastName,
    //       user: user
    //     }));
    //   });
    // });
    getMailByReceiver(newProps.user.email).then(mails => {
      this.setState(
        prevState => ({
          mails: mails,
          mailsToYou: mails.length
        }),
        () => this.forceUpdate()
      );
    });
    getAllEmail().then(allMails => {
      let mailsDoing = 0;
      let mailsDone = 0;
      for (let i in allMails) {
        if (allMails[i].status === "done") mailsDone++;
        else if (allMails[i].status === "doing") mailsDoing++;
      }
      this.setState(
        prevState => ({
          mailsAll: allMails.length,
          mailsDoing: mailsDoing,
          mailsDone: mailsDone
        }),
        () => this.forceUpdate()
      );
    });
  }
  inboxCardClick = () => {
    this.setState(
      prevState => ({
        isShowInboxCard: !prevState.isShowInboxCard
      }),
      () => this.forceUpdate()
    );
  };
  allCardClick = () => {
    this.setState(
      prevState => ({
        isShowAllCard: !prevState.isShowAllCard
      }),
      () => this.forceUpdate()
    );
  };
  doingCardClick = () => {
    this.setState(
      prevState => ({
        isShowDoingCard: !prevState.isShowDoingCard
      }),
      () => this.forceUpdate()
    );
  };
  doneCardClick = () => {
    this.setState(
      prevState => ({
        isShowDoneCard: !prevState.isShowDoneCard
      }),
      () => this.forceUpdate()
    );
  };
  cancelCardClick = () => {
    this.setState(
      prevState => ({
        isShowCancelCard: !prevState.isShowCancelCard
      }),
      () => this.forceUpdate()
    );
  };
  render() {
    // if(this.state.mailsAll !== "-"){
    //     Swal.close()
    // }
    // console.log(this.state);

    // console.log(this.props.user)
    return (
      <div className="Summary">
        <section className="hero is-info welcome is-small">
          <div className="hero-body">
            <div className="container">
              <h1 className="title text-dashboard">
                สวัสดี, คุณ{this.state.name} {this.state.surname}{" "}
                {this.state.user.email}
              </h1>
              <h2 className="subtitle text-dashboard">
                {this.state.mailsToYou === "-"
                  ? "..."
                  : this.state.mailsToYou !== 0
                  ? "ยินดีต้อนรับเข้าสู่ SwarmMail ระบบจัดการเอกสารบนเทคโนโลยีบล็อกเชน"
                  : //   ? "ยินดีต้อนรับกลับมาอีกครั้ง!"
                    "ยินดีต้อนรับเข้าสู่ SwarmMail ระบบจัดการเอกสารบนเทคโนโลยีบล็อกเชน"}
              </h2>
            </div>
          </div>
        </section>
        <section className="info-tiles">
          <div className="tile is-ancestor has-text-centered">
            <Link to="/all" className="tile is-parent">
              <article className="tile is-child box">
                <div className="title">{this.state.mailsAll}</div>
                <p className="subtitle">เอกสารทั้งหมด</p>
              </article>
            </Link>
            {/* <Link to='/done' className="tile is-parent">
                            <article className="tile is-child box">
                                <p className="title">{this.state.mailsDone}</p>
                                <p className="subtitle">ดำเนินการเสร็จสิ้น</p>
                            </article>
                        </Link> */}
            {/* <Link to='/doing' className="tile is-parent">
                            <article className="tile is-child box">
                                <p className="title">{this.state.mailsDoing}</p>
                                <p className="subtitle">กำลังดำเนินการ</p>
                            </article>
                        </Link> */}
            <Link to="/inbox" className="tile is-parent">
              <article className="tile is-child box">
                <div className="title">{this.state.mailsToYou}</div>
                <p className="subtitle">มอบหมายถึงคุณ</p>
              </article>
            </Link>
          </div>
        </section>
        <div className="card events-card inbox-card">
          <header className="card-header" onClick={this.inboxCardClick}>
            <h3 className="card-header-title">มอบหมายถึงคุณเมื่อเร็วๆนี้</h3>
            <a className="card-header-icon" aria-label="more options">
              <span className="icon">
                <i
                  className={
                    this.state.isShowInboxCard
                      ? "fa fa-angle-up"
                      : "fa fa-angle-down"
                  }
                />
              </span>
            </a>
          </header>
          {this.state.isShowInboxCard ? (
            <div>
              <div className="card-table">
                <div className="summary-inbox-content">
                  <MailList
                    mails={this.props.mails}
                    openMailContent={this.props.openMailContent}
                    setCurrentMailContent={this.props.setCurrentMailContent}
                    user={this.props.user}
                    actionsBtn={false}
                  />
                </div>
              </div>
              <footer className="card-footer">
                <Link to="/inbox" className="card-footer-item">
                  {" "}
                  View All{" "}
                </Link>
              </footer>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="card events-card inbox-card">
          <header className="card-header" onClick={this.allCardClick}>
            <h3 className="card-header-title">จดหมายทั้งหมด</h3>
            <a className="card-header-icon" aria-label="more options">
              <span className="icon">
                <i
                  className={
                    this.state.isShowAllCard
                      ? "fa fa-angle-up"
                      : "fa fa-angle-down"
                  }
                />
              </span>
            </a>
          </header>
          {this.state.isShowAllCard ? (
            <div>
              <div className="card-table">
                <div className="summary-inbox-content">
                  <MailList
                    mails={this.state.all}
                    openMailContent={this.props.openMailContent}
                    setCurrentMailContent={this.props.setCurrentMailContent}
                    user={this.props.user}
                    actionsBtn={false}
                  />
                </div>
              </div>
              <footer className="card-footer">
                <Link to="/all" className="card-footer-item">
                  {" "}
                  View All{" "}
                </Link>
              </footer>
            </div>
          ) : (
            ""
          )}
        </div>

        {/* <div className="card events-card inbox-card">
                    <header className="card-header" onClick={this.doingCardClick}>
                        <h3 className="card-header-title">จดหมายทั้งหมดที่กำลังดำเนินการ</h3>
                        <a className="card-header-icon" aria-label="more options">
                            <span className="icon">
                                <i className={this.state.isShowDoingCard ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                            </span>
                        </a>
                    </header>
                    {this.state.isShowDoingCard ?
                        <div>
                            <div className="card-table">
                                <div className="summary-inbox-content">
                                    <MailList mails={this.state.doing} openMailContent={this.props.openMailContent} setCurrentMailContent={this.props.setCurrentMailContent} user={this.props.user} actionsBtn={false} />
                                </div>
                            </div>
                            <footer className="card-footer">
                                <Link to='/doing' className="card-footer-item"> View All </Link>
                            </footer>
                        </div> : ''
                    }
                </div>         */}

        {/* <div className="card events-card inbox-card">
                    <header className="card-header" onClick={this.doneCardClick}>
                        <h3 className="card-header-title">จดหมายทั้งหมดที่เสร็จสิ้น</h3>
                        <a className="card-header-icon" aria-label="more options">
                            <span className="icon">
                                <i className={this.state.isShowDoneCard ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                            </span>
                        </a>
                    </header>
                    {this.state.isShowDoneCard ?
                        <div>
                            <div className="card-table">
                                <div className="summary-inbox-content">
                                    <MailList mails={this.state.done} openMailContent={this.props.openMailContent} setCurrentMailContent={this.props.setCurrentMailContent} user={this.props.user} actionsBtn={false} />
                                </div>
                            </div>
                            <footer className="card-footer">
                                <Link to='/done' className="card-footer-item"> View All </Link>
                            </footer>
                        </div> : ''
                    }
                </div>  */}

        {/* <div className="card events-card inbox-card">
                    <header className="card-header" onClick={this.cancelCardClick}>
                        <h3 className="card-header-title">จดหมายทั้งหมดที่ถูกยกเลิก</h3>
                        <a className="card-header-icon" aria-label="more options">
                            <span className="icon">
                                <i className={this.state.isShowCancelCard ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                            </span>
                        </a>
                    </header>
                    {this.state.isShowCancelCard ?
                        <div>
                            <div className="card-table">
                                <div className="summary-inbox-content">
                                    <MailList mails={this.state.cancel} openMailContent={this.props.openMailContent} setCurrentMailContent={this.props.setCurrentMailContent} user={this.props.user} actionsBtn={false} />
                                </div>
                            </div>
                            <footer className="card-footer">
                                <Link to='/cancel' className="card-footer-item"> View All </Link>
                            </footer>
                        </div> : ''
                    }
                </div>  */}
      </div>
    );
  }
}

export default Summary;
