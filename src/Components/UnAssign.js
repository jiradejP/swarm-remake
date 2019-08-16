import React, { Component } from 'react';
import Navbar from './Navbar';
import Aside from './Dashboard/Aside';
import MailContent from './Dashboard/MailContent';
import WriteBox from './Dashboard/WriteBox';
import { getCurrentUser } from '../Utils/firebaseAuthen.js';
import { getAllEmail } from '../Utils/firebaseDatabase.js';
import MailList from './Dashboard/MailList';

class UnAssign extends Component {
    constructor() {
        super();
        this.state = {
            writeBoxIsActive: false,
            isViewMailContent: false,
            user: {},
            email: [],
            currentMailContent: {},
        }
        this.openWriteBox = this.openWriteBox.bind(this);
        this.closeWriteBox = this.closeWriteBox.bind(this);
        this.openMailContent = this.openMailContent.bind(this);
        this.closeMailContent = this.closeMailContent.bind(this);
        this.refreshUnAssignMail = this.refreshUnAssignMail.bind(this);

        getCurrentUser().then((user) => {
            this.setState(prevState => ({
                user: user
            }));
            getAllEmail().then((mails) => {
                let notAssigns = [];
                for (let i in mails) {
                    if (mails[i].isPrivate);
                    else if (mails[i].to === undefined || mails[i].to === ''){
                        notAssigns.push(mails[i])
                    }
                }
                this.setState(prevState => ({
                    mails: notAssigns
                }));
            })
        })
    }
    refreshUnAssignMail = () => {
        return new Promise((resolve, reject) => {
            getAllEmail().then((mails) => {
                let notAssigns = [];
                for (let i in mails) {
                    if (mails[i].isPrivate);
                    else if (mails[i].to === undefined || mails[i].to === '') {
                        notAssigns.push(mails[i])
                    }
                }
                this.setState(prevState => ({
                    mails: notAssigns
                }), () => {
                    this.forceUpdate();
                    resolve()
                });
            })
        })
    }
    setCurrentMailContent = (data) => {
        this.setState(prevState => ({
            currentMailContent: data
        }), () => this.forceUpdate());
    }
    openWriteBox = () => {
        this.setState(prevState => ({
            writeBoxIsActive: true
        }));
    }
    closeWriteBox = () => {
        this.setState(prevState => ({
            writeBoxIsActive: false
        }));
    }
    openMailContent = () => {
        this.setState(prevState => ({
            isViewMailContent: true
        }));
    }
    closeMailContent = () => {
        this.refreshUnAssignMail().then(() => {
            this.setState({
                isViewMailContent: false
            }, () => this.forceUpdate());
        })
    }
    render() {
        return (
            <div id="UnAssign">
                <Navbar user={this.state.user} />
                <div className="container is-fluid">
                    <div className="columns">
                        <Aside page="unassign" openWriteBox={this.openWriteBox} />
                        <div className="column is-10 content">
                            <h2>เอกสารที่ยังไม่ได้มอบหมาย</h2>
                            <h4>เอกสารทั้งหมด ที่ยังไม่ได้มอบหมายถึงผู้ใด</h4>
                            {this.state.isViewMailContent ?
                                <MailContent user={this.state.user} closeMailContent={this.closeMailContent} currentMailContent={this.state.currentMailContent} />
                                :
                                <MailList mails={this.state.mails} openMailContent={this.openMailContent} setCurrentMailContent={this.setCurrentMailContent} user={this.state.user} actionsBtn={true} />
                            }
                        </div>
                    </div>
                    <WriteBox isActive={this.state.writeBoxIsActive} closeWriteBox={this.closeWriteBox} user={this.state.user} />
                </div>
            </div>
        );
    }
}

export default UnAssign;
