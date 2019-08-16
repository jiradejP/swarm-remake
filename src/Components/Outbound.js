import React, { Component } from 'react';
import Navbar from './Navbar';
import Aside from './Dashboard/Aside';
import MailContent from './Dashboard/MailContent';
import WriteBox from './Dashboard/WriteBox';
import { getCurrentUser } from '../Utils/firebaseAuthen.js';
import { getAllEmail } from '../Utils/firebaseDatabase.js';
import MailList from './Dashboard/MailList';

class Outbound extends Component {
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
        this.refreshOutboundMail = this.refreshOutboundMail.bind(this);

        getCurrentUser().then((user) => {
            this.setState(prevState => ({
                user: user
            }));
            getAllEmail().then((mails) => {
                let outbounds = [];
                console.log(mails)
                for (let i in mails) {
                    if(mails[i].docType === 'outbound'){
                        outbounds.push(mails[i])
                    }
                    // if (mails[i].isPrivate);
                    // else if (mails[i].docType === 'outbound') {
                    //     outbounds.push(mails[i])
                    // }
                }
                this.setState(prevState => ({
                    mails: outbounds
                }));
            })
        })
    }
    refreshOutboundMail = () => {
        return new Promise((resolve, reject) => {
            getAllEmail().then((mails) => {
                let outbounds = [];
                console.log("outbounds")
                for (let i in mails) {
                    if(mails[i].docType === 'outbound'){
                        outbounds.push(mails[i])
                    }
                    // if (mails[i].isPrivate){
                    //     console.log(mails[i])
                    // }
                    // else if (mails[i].docType === 'outbound') {
                    //     outbounds.push(mails[i])
                    // }
                }
                this.setState(prevState => ({
                    mails: outbounds
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
        this.refreshOutboundMail().then(() => {
            this.setState({
                isViewMailContent: false
            }, () => this.forceUpdate());
        })
    }
    render() {
        // console.log(this.state)
        return (
            <div id="Outbound">
                <Navbar user={this.state.user} />
                <div className="container is-fluid">
                    <div className="columns">
                        <Aside page="outbound" openWriteBox={this.openWriteBox} />
                        <div className="column is-10 content">
                            <h2>เอกสารออก</h2>
                            <h4>เอกสารทั้งหมด ที่ส่งออกจากหน่วยงาน</h4>
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

export default Outbound;
