import React, { Component } from 'react';
import Navbar from './Navbar';
import Aside from './Dashboard/Aside';
import MailContent from './Dashboard/MailContent';
import WriteBox from './Dashboard/WriteBox';
import { getCurrentUser } from '../Utils/firebaseAuthen.js';
import { getAllEmail } from '../Utils/firebaseDatabase.js';
import MailList from './Dashboard/MailList';
import { Spin, Icon } from 'antd';


class All extends Component {
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
        this.refreshAllMail = this.refreshAllMail.bind(this);

        getCurrentUser().then((user) => {
            this.setState(prevState => ({
                user: user
            }));
            getAllEmail().then((mails) => {
                let unPrivateMails = [];
                for(let i in mails){
                    // if(mails[i].isPrivate);
                    // else unPrivateMails.push(mails[i])
                    unPrivateMails.push(mails[i])
                }
                this.setState(prevState => ({
                    mails: unPrivateMails
                }));
            })
        })
    }
    refreshAllMail = () => {
        return new Promise((resolve, reject) => {
            getAllEmail().then((mails) => {
                this.setState(prevState => ({
                    mails: mails
                }), () => {
                    this.forceUpdate();
                    resolve()
                });
            })
        })
    }
    setCurrentMailContent = (data) => {
        console.log(data)
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
        this.refreshAllMail().then(() => {
            this.setState({
                isViewMailContent: false
            }, () => this.forceUpdate());
        })
    }
    render() {
        // console.log(this.state.mails);
        console.log(this.state)
        const antIcon = <Icon type="loading" style={{ fontSize: 36 }} spin />;
        return (
            <div id="All">
                <Navbar user={this.state.user} />
                <div className="container is-fluid">
                    <div className="columns">
                        <Aside page="all" openWriteBox={this.openWriteBox} />
                        <div className="column is-10 content">
                            <h2>เอกสารทั้งหมด</h2>
                            {/* <h4>ประกอบด้วย เอกสารที่กำลังดำเนินการ, เอกสารที่ดำเนินการเสร็จเสร็จ และ เอกสารที่ถูกยกเลิก</h4> */}
                            {this.state.isViewMailContent ?
                                <MailContent user={this.state.user} closeMailContent={this.closeMailContent} currentMailContent={this.state.currentMailContent} />
                                // <div style={{ textAlign: 'center', marginTop: '10px' }}><Spin indicator={antIcon} /></div>
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

export default All;
