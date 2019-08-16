import React, { Component } from 'react';
import Navbar from './Navbar';
import Aside from './Dashboard/Aside';
import MailContent from './Dashboard/MailContent';
import WriteBox from './Dashboard/WriteBox';
import { getCurrentUser } from '../Utils/firebaseAuthen.js';
import { getMailByReceiverSent } from '../Utils/firebaseDatabase.js';
import MailList from './Dashboard/MailList';

class Sent extends Component {
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
            getMailByReceiverSent(user.email).then((mails) => {
                this.setState(prevState => ({
                    mails: mails
                }));
            })
        })
    }
    refreshAllMail = () => {
        return new Promise((resolve, reject) => {
            getMailByReceiverSent(this.state.user.email).then((mails) => {
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
        // console.log(this.props)
        return (
            <div id="Sent">
                <Navbar user={this.state.user} />
                <div className="container is-fluid">
                    <div className="columns">
                        <Aside page="sent" openWriteBox={this.openWriteBox} />
                        <div className="column is-10 content">
                            <h2>เอกสารที่คุณสร้างขึ้น</h2>
                            {this.state.isViewMailContent ?
                                <MailContent user={this.state.user} closeMailContent={this.closeMailContent} currentMailContent={this.state.currentMailContent} />
                                :
                                <MailList location={this.props.location} mails={this.state.mails} openMailContent={this.openMailContent} setCurrentMailContent={this.setCurrentMailContent} user={this.state.user} actionsBtn={true} from="sent"/>
                            }
                        </div>
                    </div>
                    <WriteBox isActive={this.state.writeBoxIsActive} closeWriteBox={this.closeWriteBox} user={this.state.user} />
                </div>
            </div>
        );
    }
}

export default Sent;
