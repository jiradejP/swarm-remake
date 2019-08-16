import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import { takeAction, getMailbyID, getUserName } from '../../Utils/firebaseDatabase.js';
import { swarmServer } from '../../Utils/utils.js';
import { ETHGetEmail } from "../../Utils/ethreum";

import Replies from './Replies';
import Reply from './Reply';
import Action from './Action';
import moment from 'moment';
import 'moment/locale/th';

class MailContent extends Component {
    constructor() {
        super();
        this.state = {
            fromNameList: [],
            toNameList: [],
            data: {},
            fileReading: '',
            activeFile: -1,
            permissionToAction: '',
            prevMail: {},
            isShowActions: false,
            fileImage: true,
            isCollapseHeader: false,
            fromOfDocumentSearch: '',
            documentNumberSearch: '',
            isShowErrorDiv: false,
            isInspector: false,
        }
        this.readFile = this.readFile.bind(this);
        this.refreshMailContent = this.refreshMailContent.bind(this);
        this.toggleShowActions = this.toggleShowActions.bind(this);
        this.refreshThisMail = this.refreshThisMail.bind(this);
        this.getETHgetEmail = this.getETHgetEmail.bind(this);
        this.letSetState = this.letSetState.bind(this);
        this.cantConnectTruffle = this.cantConnectTruffle.bind(this);
        
    }
    componentWillReceiveProps(newProps) {
        // console.log(newProps)
        const fromOfDoc = newProps.currentMailContent.fromOfDocument;
        let fromOfDocumentSearch;
        if (fromOfDoc) fromOfDocumentSearch = `/match/${fromOfDoc.replace('/', '-')}`;

        const docNumber = newProps.currentMailContent.documentNumber;
        let documentNumberSearch;
        if (docNumber) documentNumberSearch = `/match/${docNumber.replace('/', '-')}`;

        this.setState(prevState => ({
            fromOfDocumentSearch,
            documentNumberSearch
        }));

        this.getETHgetEmail(this.props.currentMailContent);
    }

    componentWillMount(){
        // componentDidMount(){
        const from = this.props.currentMailContent.from.split(',');
        const to = this.props.currentMailContent.to.split(',');
        let fromNameList = [];
        let toNameList = [];
        // console.log(this.props.currentMailContent.from.split(','))
        // console.log(this.props.currentMailContent.to.split(','))
        from.forEach(function(e){
            getUserName(e).then(function(value){
                fromNameList.push(value.firstName + " " + value.lastName);
            })
        })
        to.forEach(function(e){
            getUserName(e).then(function(value){
                toNameList.push(value.firstName + " " + value.lastName);
            })
        })
        this.setState({ fromNameList: fromNameList, toNameList: toNameList })
    }
   
    letSetState = (mailDetail) => {
        let data = mailDetail;
        this.setState(prevState => ({
            data,
        }), () => {
            // console.log(this.state.data);
            if (mailDetail.id !== this.state.prevMail.id)
                takeAction(this.state.data, this.props.user, 'read');
            if (this.state.data.from.indexOf(this.props.user.email) != -1) {
                this.setState(prevState => ({
                    permissionToAction: "sender",
                    prevMail: mailDetail
                }));
            }
            else if (this.state.data.to.indexOf(this.props.user.email) != -1) {
                this.setState(prevState => ({
                    permissionToAction: "receiver",
                    prevMail: mailDetail
                }));
            }else if (this.state.data.to.indexOf(this.props.user.email) == -1 && this.state.data.from.indexOf(this.props.user.email) == -1){
                this.setState(prevState => ({
                    permissionToAction: "no permission",
                    // prevMail: null
                }));
            }
            this.forceUpdate();
        });
    }
    getETHgetEmail = (MailContent) => {
        console.log('Start fetch from Truffle ...');
        ETHGetEmail(MailContent.id).then((ETHData) => {
            this.letSetState(MailContent)
            try {
                // let newStateData = MailContent;
                // let ETHactions = [];
                // let ETHfiles = [];
                // for (let item in ETHData.logs) {
                //     if (item.event === 'print_string'){
                //         let ETHmailDetail = JSON.parse(`{ ${item.args._data} }`);
                        
                //         newStateData.allTo = ETHmailDetail.allTo
                //         newStateData.content = ETHmailDetail.content
                //         newStateData.createDate = ETHmailDetail.createDate
                //         newStateData.dateOfDocument = ETHmailDetail.dateofDoc
                //         newStateData.documentNumber = ETHmailDetail.docNumber
                //         newStateData.from = ETHmailDetail.from;
                //         newStateData.fromOfDocument = ETHmailDetail.fromOfDocument
                //         newStateData.fromOfDocumentWay = ETHmailDetail.fromOfDocumentWay
                //         newStateData.inBound_type = ETHmailDetail.inBound_type
                //         newStateData.subject = ETHmailDetail.subject
                //         newStateData.timestamp = ETHmailDetail.timestamp
                //         newStateData.to = ETHmailDetail.to
                //     }
                //     else if (item.event === 'actionArr') {
                //         ETHactions.push(item.args)
                //     }
                //     else if (item.event === 'fileArr') {
                //         ETHfiles.push(item.args)
                //     }
                // }
                // newStateData.actions = ETHactions;
                // newStateData.files = ETHfiles;
                // console.log('set State!!!!!!');
                // console.log(newStateData);
                // this.setState(state => ({
                //     data: newStateData 
                // }), () => console.log('done'));
            } catch (error) {
                this.letSetStateWhenFail()
            }
        })
        .catch(() => { this.cantConnectTruffle(); })
    }
    cantConnectTruffle = () => {
        this.setState({ isShowErrorDiv: true })
    }
    letSetStateWhenFail = () => {
        console.log('letSetStateWhenFail');
        setTimeout(() => {
            let data = this.props.currentMailContent;
            console.log(data);
            data.files = {};
            data.actions = {};
            this.setState(prevState => ({
                data,
            }), () => {
                if (data.id !== this.state.prevMail.id)
                    takeAction(this.state.data, this.props.user, 'read');
                if (this.state.data.from.indexOf(this.props.user.email) != -1) {
                    this.setState(prevState => ({
                        permissionToAction: "sender",
                        prevMail: data
                    }));
                }
                else if (this.state.data.to.indexOf(this.props.user.email) != -1) {
                    this.setState(prevState => ({
                        permissionToAction: "receiver",
                        prevMail: data
                    }));
                }
                this.forceUpdate();
            });
        }, 2000);
    }
    readFile = (file, i) => {
        // console.log(file)
        if (this.state.activeFile == i){
            // console.log('if')
            this.setState(prevState => ({
                fileReading: '',
                activeFile: -1
            }), () => this.forceUpdate());
        } else {
            // console.log('else')
            this.setState(prevState => ({
                fileReading: file,
                activeFile: i
            }), () => {
                this.forceUpdate()
                if (this.state.fileReading.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || this.state.fileReading.type === 'application/pdf' || this.state.fileReading.type === '' || this.state.fileReading.type === null || this.state.fileReading.type === undefined) {
                    this.setState(prevState => ({
                        fileImage: false
                    }), () => this.forceUpdate());
                }
            });
        }
    }
    refreshMailContent = (mailID) => {
        getMailbyID(this.state.data.id).then((data) => {
            data.id = mailID
            this.setState(prevState => ({
                data
            }), () => {
                this.forceUpdate();
            });
        })
    }

    toggleShowActions = () => {
        this.setState(prevState => ({
            isShowActions: !prevState.isShowActions
        }), () => this.forceUpdate());
    }
    convertDate = (timestamp) => {
        let date = new Date(timestamp);
        date = date.toString();
        date = date.split(' ').splice(1, 4).join(' ');
        return date;
    }
    refreshThisMail = () => {
        return new Promise((resolve, reject) => {
            getMailbyID(this.state.data.id).then((data) => {
                this.setState(prevState => ({
                    data: data
                }), () => {
                    resolve(data);
                    this.forceUpdate()
                });
            })
        })
    }
    collapseHeader = () => {
        this.setState(prevState => ({
            isCollapseHeader: !prevState.isCollapseHeader
        }));
    }
    render() {
        // console.log(this.state.fromNameList)
        // console.log(this.state.toNameList)
        let allTo = '';
        if(this.state.data.allTo !== undefined){
            allTo = this.state.data.allTo.toString();
        }
        
        let files = [];
        if(this.state.permissionToAction !== 'no permission'  ){
                for (let i in this.state.data.files) {
                    // console.log(this.state.data.files[i]);
                    if (parseInt(this.state.activeFile) === parseInt(i))
                        files.push(<div className="attach-item active" key={"file-" + i} onClick={(e) => this.readFile(this.state.data.files[i], i)}>{this.state.data.files[i].name}</div>)
                    else files.push(<div className="attach-item" key={"file-" + i} onClick={(e) => this.readFile(this.state.data.files[i], i)}>{this.state.data.files[i].name}</div>)
                }
        }else if(this.state.data.isPrivate === false){
            for (let i in this.state.data.files) {
                    // console.log(this.state.data.files[i]);
                    if (parseInt(this.state.activeFile) === parseInt(i))
                        files.push(<div className="attach-item active" key={"file-" + i} onClick={(e) => this.readFile(this.state.data.files[i], i)}>{this.state.data.files[i].name}</div>)
                    else files.push(<div className="attach-item" key={"file-" + i} onClick={(e) => this.readFile(this.state.data.files[i], i)}>{this.state.data.files[i].name}</div>)
                }
        }
        let filesForAction = [];
        for (let i in this.state.data.files) {
            filesForAction.push(<option className="attach-item active" key={"filesForAction-" + i} >{this.state.data.files[i].name}</option>)
        }
        let actions = [];
        for (let i in this.state.data.actions) {
            actions.push(
                <tr key={"actions-" + i}>
                    <td>{this.convertDate(this.state.data.actions[i].timestamp)}</td>
                    <td>{this.state.data.actions[i].email}</td>
                    <td>{this.state.data.actions[i].action}</td>
                </tr>
            )
        }
        const toStringDate = (time) => {
            return new Date(time).toUTCString();
        }
        // console.log(actions)
        let actionsArray = this.state.data.actions;
        
        let mailAction = 'รอตอบรับ';
        // console.log(this.state)
        // if(this.state.data.statusAction !== undefined){
        //     if(this.state.data.statusAction === "accepted" ){
        //         mailAction = <div>ผู้รับได้กระทำเอกสารนี้ : อนุมัติเอกสารแล้ว</div>
        //     }else {
        //         mailAction = <div>ผู้รับได้กระทำเอกสารนี้ : ปฏิเสธเอกสารแล้ว</div>
        //     }
        // }
        moment.locale('th');
        // console.log(this.state.data.createDate)
        
        // console.log(this.state.data.dateOfDocument)
        let dateTime = "";
        if(this.state.data.createDate !== undefined){
            let tempDate = this.state.data.createDate.toString();
            tempDate = tempDate.replace(tempDate.split(' ')[3], (parseInt(tempDate.split(' ')[3],10) + 543).toString())
            // console.log(this.state.data.createDate.toString().split(' ')[3])
            dateTime = moment(tempDate).format("ll , h:mm");
        }

        let dateConTentDoc = "";
        if(this.state.data.createDate !== undefined){
            console.log(parseInt(this.state.data.dateOfDocument.split('/')[2]) + 543)
            dateConTentDoc = parseInt(this.state.data.dateOfDocument.split('/')[2]) + 543;
        }
        // console.log(this.state.data.dateOfDocument)
        return (
            <div id="MailContent" className="MailContent">
                <button className="MailContent-back button is-block is-bold" onClick={this.props.closeMailContent}>
                    <i className="fas fa-arrow-left fa-lg"></i>
                </button>
                <hr />
                <div className="mail-detail">
                    <div className="subject"><h3>เรื่อง : {this.state.data.subject}</h3></div>
                    <div className="header columns">
                        <div className="column is-9 from-to">
                            <span>จาก : {this.state.fromNameList.toString() + "(" + this.state.data.from + ")"}</span> 
                            <br /><span style={{ wordWrap: 'break-word' }}>ถึง : {this.state.toNameList.toString() + "(" + this.state.data.to + ")"}</span>
                            <br /><span >สถานะของคุณ : {(this.state.permissionToAction === 'sender') ? "เจ้าของเอกสาร" : (this.state.permissionToAction === 'receiver') ? "ผู้รับเอกสาร" : "ผู้ชมเอกสาร"}</span>
                            <br /><span>ประเภทเอกสาร : {(this.state.data.docType === 'outbound') ? 'เอกสารออก' : 'เอกสารเข้า'}</span>
                            {(this.state.data.docType === 'outbound') ? '' : <span>{(this.state.data.inBound_type === 'sendToAck') ? ' - แจ้งเพื่อทราบ/ดำเนินการ' : ' - แจ้งเพื่อพิจารณา'}</span>}<br/>
                            {/* <span>สถานะเอกสาร : {mailAction}</span> */}
                            <div style={{ cursor: 'pointer' }} onClick={this.collapseHeader}>
                                <span>ดูเพิ่มเติม</span>
                                <span className="icon">
                                    <i className={this.state.isShowActions ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                                </span>
                            </div>
                        </div>
                        <div className="column is-3 more">
                            <div>{dateTime} น.</div>
                            {this.state.data.files ? <div title="มีเอกสารแนบ"><i className="fa fa-paperclip"></i></div> : ''}
                            {this.state.data.isPrivate ? <div title="ส่งแบบส่วนตัว"><i className="fas fa-user-secret"></i></div> : ''}
                        </div>
                    </div>
                    <div className="columns" >
                        <div className={this.state.isCollapseHeader ? "column is-12 detail" : "hidden"}>
                            <span style={{ wordWrap: 'break-word' }}>ID : {this.state.data.id}</span>
                            <br />
                            <span style={{ wordWrap: 'break-word' }}>ผู้มีส่วนร่วมในเอกสารนี้ : {allTo}</span>
                            <br />
                            {this.state.data.documentNumber ? <div>
                                <span>เลขหนังสือ : <Link to={this.state.documentNumberSearch}>{this.state.data.documentNumber}</Link></span>
                                {this.state.data.dateOfDocument ? <span style={{ marginLeft: '20px' }}>วันที่ของเอกสาร: {dateConTentDoc}</span> : ''}
                            </div> : ''}
                            {this.state.data.fromOfDocument ?
                                <div>
                                    <span>{(this.state.data.docType === 'outbound') ? "เลขหนังสือต้นเรื่อง" : "จาก"} : <Link to={this.state.fromOfDocumentSearch}>{this.state.data.fromOfDocument}</Link></span>
                                    {this.state.data.fromOfDocumentWay ? <span style={{ marginLeft: '20px' }}>ผ่านช่องทาง : {this.state.data.fromOfDocumentWay}</span> : ''}
                                </div> : ''}
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: '30px' }}></div>
                <div className="mail-content">{this.state.data.content}</div>
                {this.state.data.files ?
                    <div>
                        <br />
                        <div className="mail-attach">
                            <h4>{this.state.data.files.length} เอกสารในจดหมายนี้</h4>
                            <div className="file-files">
                                {files}
                            </div>
                            {this.state.fileReading ? <div className="file-detail">
                                
                                ID : {this.state.fileReading.address}
                                <br />
                                File name : {this.state.fileReading.name}
                                <br />
                                Address : {this.state.fileReading.address}
                                <br />
                                Uploader : {this.state.fileReading.email}
                                <br />
                                Upload date : {toStringDate(this.state.fileReading.uploadDate)}
                            </div> : ''}
                        </div>
                        {this.state.fileReading ?
                            this.state.fileImage ?
                                <center><img src={swarmServer + this.state.fileReading.address + "/"} alt={this.state.fileReading.name} width="60%" /></center>
                                :
                                this.state.fileReading.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ?
                                <div style={{ textAlign: 'center' }}>
                                    <a href={swarmServer + this.state.fileReading.address + "/"} download="filename">click here to download(docx)</a>
                                    {/* <a onClick={() => {
                                        window.open("http://localhost:8500/bzz:/6fc7e9a480ad8f851911f1384a252c7dcda69ee273c46a3fc4224be8e363fa50?content_type=application/vnd.openxmlformats-officedocument.wordprocessingml.document", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
                                        window.open("http://localhost:8500/bzz:/"+ { this.state.fileReading.address } )
                                    }}>click here</a> */}
                                    {/* <object data={swarmServer + this.state.fileReading.address + "/"} type={this.state.fileReading.type ? this.state.fileReading.type : "application/pdf"} className="pdf-embed"><embed /></object> */}
                                </div>
                                // <div style={{ textAlign: 'center' }}>
                                //     <a href={swarmServer + this.state.fileReading.address + "/"}>click here to download</a>
                                //     <object data={swarmServer + this.state.fileReading.address + "/"} type={this.state.fileReading.type ? this.state.fileReading.type : "vnd.openxmlformats-officedocument.wordprocessingml.document"}><embed /></object>
                                // </div>
                                : this.state.fileReading.type === "application/pdf" ?
                                <div style={{ textAlign: 'center' }}>
                                    {/* <a href={swarmServer + this.state.fileReading.address + "/"} download="filename">click here to download(PDF) </a> */}
                                    <object data={swarmServer + this.state.fileReading.address + "/"} type={this.state.fileReading.type ? this.state.fileReading.type : "application/pdf"} className="pdf-embed"><embed /></object>
                                </div> : ''
                            : ''}
                    </div> : ''
                }

                <Action data={this.state.data} user={this.props.user} permissionToAction={this.state.permissionToAction} files={filesForAction} refreshMailContent={this.refreshMailContent} closeMailContent={this.props.closeMailContent}
                    refreshThisMail={this.refreshThisMail}
                    letSetStateWhenFail={this.letSetStateWhenFail}
                    isShowErrorDiv={this.state.isShowErrorDiv}
                />

                <div className="card events-card inbox-card">
                    <header className="card-header" onClick={this.toggleShowActions}>
                        <h3 className="card-header-title">การกระทำกับอีเมลฉบับนี้</h3>
                        <a className="card-header-icon" aria-label="more options">
                            <span className="icon">
                                <i className={this.state.isShowActions ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                            </span>
                        </a>
                    </header>
                    {this.state.isShowActions ?
                        <div className="card-table">
                            <div className="summary-inbox-content">

                                <div className="mail-actions">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Timestamp</th>
                                                <th>Account</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {actions}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div> : ''
                    }
                </div>
                <Replies replies={this.state.data.replies} />
                <Reply allTo={this.state.data.allTo} user={this.props.user} mailID={this.state.data.id} refreshMailContent={this.refreshMailContent} />
            </div>
        );
    }
}

export default MailContent;
