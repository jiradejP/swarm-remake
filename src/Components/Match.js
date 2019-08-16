import React, { Component } from 'react';
import Navbar from './Navbar';
import Aside from './Dashboard/Aside';
import MailContent from './Dashboard/MailContent';
import WriteBox from './Dashboard/WriteBox';
import { getCurrentUser } from '../Utils/firebaseAuthen.js';
import { getAllEmail } from '../Utils/firebaseDatabase.js';
import MailList from './Dashboard/MailList';
import Axios from 'axios';

class Match extends Component {
    constructor() {
        super();
        this.state = {
            writeBoxIsActive: false,
            isViewMailContent: false,
            user: {},
            email: [],
            related: [],
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
        })
    }
    componentWillMount(){
        let thisQuery = this.props.match.params.id;
            let obj = {
                text : thisQuery
            }
            Axios.post('http://127.0.0.1:4000/solrText/search', obj).then(
                res => {
                    getAllEmail().then((allMails) => {
                        let mails = [];
                        let related = [];
                        res.data.forEach(element => {
                            for (let item of allMails) {
                                // console.log("Id Mail " + item.id)
                                if (item.id === element) {
                                    mails.push(item)
                                }
                                // if (item.fromOfDocument === element){
                                //     related.push(item)
                                // }
                            }
                        });
                        this.setState(prevState => ({
                            mails, related
                        }), () => {
                            this.forceUpdate();
                        });
                    })
                }
            )
    }

    refreshAllMail = () => {
        return new Promise((resolve, reject) => {
            let thisQuery = this.props.match.params.id;
            let obj = {
                text : thisQuery
            }
            Axios.post('http://127.0.0.1:4000/solrText/search', obj).then(
                res => {
                    getAllEmail().then((allMails) => {
                        let mails = [];
                        let related = [];
                        res.data.forEach(element => {
                            for (let item of allMails) {
                                // console.log("Id Mail " + item.id)
                                if (item.id === element) {
                                    mails.push(item)
                                }
                                // if (item.fromOfDocument === element){
                                //     related.push(item)
                                // }
                            }
                        });
                        this.setState(prevState => ({
                            mails, related
                        }), () => {
                            this.forceUpdate();
                        });
                    })
                }
            )
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
        let thisQuery = this.props.match.params.id;
        //thisQuery = thisQuery.replace('-', '/');
        return (
            <div id="Match">
                <Navbar user={this.state.user} />
                <div className="container is-fluid">
                    <div className="columns">
                        <Aside page="search" openWriteBox={this.openWriteBox} />
                        <div className="column is-10 content">
                            <h2>ค้นหาเอกสารที่มีคำ "{thisQuery}"</h2>
                            {this.state.isViewMailContent ?
                                <MailContent user={this.state.user} closeMailContent={this.closeMailContent} currentMailContent={this.state.currentMailContent} />
                                :
                                <div>
                                    <div>
                                        <MailList mails={this.state.mails} openMailContent={this.openMailContent} setCurrentMailContent={this.setCurrentMailContent} user={this.state.user} actionsBtn={true} />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <WriteBox isActive={this.state.writeBoxIsActive} closeWriteBox={this.closeWriteBox} user={this.state.user} />
                </div>
            </div>
        );
    }
}

export default Match;

// import React, { Component } from 'react';
// import Navbar from './Navbar';
// import Aside from './Dashboard/Aside';
// import MailContent from './Dashboard/MailContent';
// import WriteBox from './Dashboard/WriteBox';
// import { getCurrentUser } from '../Utils/firebaseAuthen.js';
// import { getAllEmail } from '../Utils/firebaseDatabase.js';
// import MailList from './Dashboard/MailList';

// class Match extends Component {
//     constructor() {
//         super();
//         this.state = {
//             writeBoxIsActive: false,
//             isViewMailContent: false,
//             user: {},
//             email: [],
//             related: [],
//             currentMailContent: {},
//         }
//         this.openWriteBox = this.openWriteBox.bind(this);
//         this.closeWriteBox = this.closeWriteBox.bind(this);
//         this.openMailContent = this.openMailContent.bind(this);
//         this.closeMailContent = this.closeMailContent.bind(this);
//         this.refreshAllMail = this.refreshAllMail.bind(this);

//         getCurrentUser().then((user) => {
//             this.setState(prevState => ({
//                 user: user
//             }));
//         })
//     }
//     componentWillMount(){
//         let thisQuery = this.props.match.params.id;
//         thisQuery = thisQuery.replace('-','/');
//         getAllEmail().then((allMails) => {
//             let mails = [];
//             let related = [];
//             for (let item of allMails) {
//                 if (item.documentNumber === thisQuery) {
//                     mails.push(item)
//                 }
//                 if (item.fromOfDocument === thisQuery){
//                     related.push(item)
//                 }
//             }
//             this.setState(prevState => ({
//                 mails, related
//             }), () => {
//                 this.forceUpdate();
//             });
//         })
//     }
//     refreshAllMail = () => {
//         return new Promise((resolve, reject) => {
//             getAllEmail().then((allMails) => {
//                 let thisQuery = this.props.match.params.id;
//                 thisQuery = thisQuery.replace('-', '/');
//                 let mails = [];
//                 let related = [];
//                 for (let item of allMails){
//                     if (item.documentNumber === thisQuery || item.fromOfDocumentFrom === thisQuery) {
//                         mails.push(item)
//                     }
//                     if (item.fromOfDocument === thisQuery) {
//                         related.push(item)
//                     }
//                 }
//                 this.setState(prevState => ({
//                     mails, related
//                 }), () => {
//                     this.forceUpdate();
//                     resolve()
//                 });
//             })
//         })
//     }
//     setCurrentMailContent = (data) => {
//         this.setState(prevState => ({
//             currentMailContent: data
//         }), () => this.forceUpdate());
//     }
//     openWriteBox = () => {
//         this.setState(prevState => ({
//             writeBoxIsActive: true
//         }));
//     }
//     closeWriteBox = () => {
//         this.setState(prevState => ({
//             writeBoxIsActive: false
//         }));
//     }
//     openMailContent = () => {
//         this.setState(prevState => ({
//             isViewMailContent: true
//         }));
//     }
//     closeMailContent = () => {
//         this.refreshAllMail().then(() => {
//             this.setState({
//                 isViewMailContent: false
//             }, () => this.forceUpdate());
//         })
//     }
//     render() {
//         let thisQuery = this.props.match.params.id;
//         thisQuery = thisQuery.replace('-', '/');
//         return (
//             <div id="Match">
//                 <Navbar user={this.state.user} />
//                 <div className="container is-fluid">
//                     <div className="columns">
//                         <Aside page="search" openWriteBox={this.openWriteBox} />
//                         <div className="column is-10 content">
//                             <h2>ค้นหาเอกสารหมายเลข {thisQuery}</h2>
//                             {this.state.isViewMailContent ?
//                                 <MailContent user={this.state.user} closeMailContent={this.closeMailContent} currentMailContent={this.state.currentMailContent} />
//                                 :
//                                 <div>
//                                     <div>
//                                         <MailList mails={this.state.mails} openMailContent={this.openMailContent} setCurrentMailContent={this.setCurrentMailContent} user={this.state.user} actionsBtn={true} />
//                                     </div>
//                                     <div style={{marginTop: '50px'}}>
//                                         <h3>เอกสารที่เกี่ยวข้องกับเอกสาร {thisQuery}</h3>
//                                         <MailList mails={this.state.related} openMailContent={this.openMailContent} setCurrentMailContent={this.setCurrentMailContent} user={this.state.user} actionsBtn={true} />
//                                     </div>
//                                 </div>
//                             }
//                         </div>
//                     </div>
//                     <WriteBox isActive={this.state.writeBoxIsActive} closeWriteBox={this.closeWriteBox} user={this.state.user} />
//                 </div>
//             </div>
//         );
//     }
// }

// export default Match;
