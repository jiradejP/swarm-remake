import React, { Component } from 'react';
import Navbar from './Navbar';
import Aside from './Dashboard/Aside';
import WriteBox from './Dashboard/WriteBox';
import { getCurrentUser } from '../Utils/firebaseAuthen.js';
import iziToast from 'izitoast/dist/js/iziToast.min.js';
import $ from "jquery";
import swal from 'sweetalert';
import { swarmServer } from '../Utils/utils.js';
import { sendMail, getAllUser } from '../Utils/firebaseDatabase.js';
import 'bulma/css/bulma.css'

class MailBox extends Component {
    constructor() {
        super();
        this.state = {
            user: {},
            documentNumber: '',
            documentNumberN: '',
            documentNumberY: '',
            to : '',
            dateOfDocument : '',
            subject : '',
            content : '',
            files : null,
            from : '',
            isFullWritebox : true,
            isPrivate : false,
            dropdownEmails:false,
            allUsersEmail : [],
            allOnlyEmails : [],
            checked : 0,
            allClick : false,
            dateOfDocumentD: '',
            dateOfDocumentM: '',
            dateOfDocumentY: '',
            fromOfDocumentFrom: '',
            fromOfDocumentWay: 'ปกติ',
            docType: 'inbound',
            inBound_type: 'sendToResponse',
        }

        this.handleChange = this.handleChange.bind(this);
        this.send = this.send.bind(this);
        this.resetState = this.resetState.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.checkChecked = this.checkChecked.bind(this);

        iziToast.settings({
            progressBar: false
        });

        getCurrentUser().then((user) => {
            this.setState(prevState => ({
                user: user
            }));
        })
    }
    componentWillMount(){
        let allEmails = [];
        let allOnlyEmails = [];
        getAllUser().then((allUsers) => {
            for (let i in allUsers) {
                allEmails.push(
                    <label key={i}>
                        <input type="checkbox" name="to" value={allUsers[i]} onChange={(e) => this.clicklist(e, allUsers[i]) }/>
                        <span style={{marginLeft:'5px'}}>{allUsers[i]}</span>
                    </label>
                )
                allOnlyEmails.push(allUsers[i])
            }
            allOnlyEmails.join();
            this.setState({
                allUsersEmail: allEmails,
                allOnlyEmails,
            })
        })
    }
    componentWillReceiveProps(newProps){
        if(newProps.sendTo){
            this.setState({ to: newProps.sendTo});
        }
        this.setState({ from: newProps.user.email})
    }

    clickAll = (e) =>{
        if(e.target.checked){
            let emailList = this.state.allOnlyEmails;
            emailList = emailList.join();
            let lengthOfUsers = this.state.allUsersEmail;
            this.setState({ to: emailList, allClick: true, checked: lengthOfUsers.length });
            $('input[name="to"]').prop('checked', true);
        }
        else {
            this.setState({ to: '', allClick: false, checked: 0 });
            $('input[name="to"]').prop('checked', false);
        }
    }

    clicklist = (e, email) =>{
        if(e.target.checked){
            if(!this.state.to){
                this.setState({ to: email });
            }
            else {
                this.setState(prevState => ({
                    to: prevState.to + ',' + email
                }), () => this.forceUpdate());
            }
            this.setState(prevState => ({
                checked: prevState.checked + 1
            }), () => this.checkChecked());
        }
        else {
            let to = this.state.to;
            to = to.split(',')
            to.splice(to.indexOf(email), 1)
            to = to.join()
            this.setState(prevState => ({
                to,
                checked: prevState.checked - 1
            }), () => this.checkChecked());
        }
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
    checkChecked = () => {
        let lengthOfUsers = this.state.allUsersEmail;
        if (this.state.checked === lengthOfUsers.length){
            this.setState({ allClick: true });
        }
        else this.setState({ allClick: false });
    }
    handleChange = (event) => {
        if (event.target.name === 'isPrivate'){
            this.setState({ [event.target.name]: event.target.checked });
        }
        else this.setState({ [event.target.name]: event.target.value });
    }
    dateChange = (event) => {
        let number = event.target.value;
        if (event.target.name === 'dateOfDocumentD'){
            if (parseInt(number) < 1) {
                number = 1;
            }
            else if (parseInt(number) > 31) {
                number = 31;
            }
        }
        if (event.target.name === 'dateOfDocumentM') {
            if (parseInt(number) < 1) {
                number = 1;
            }
            else if (parseInt(number) > 12) {
                number = 12;
            }
        }
        if (event.target.name === 'dateOfDocumentY') {
            if (parseInt(number) > 2562) {
                number = 2562;
            }
        }
        this.setState({
            [event.target.name]: number
        }, () => this.updateDateOfDoc());
    }
    updateDateOfDoc = () => {
        this.setState(prevState => ({
            dateOfDocument: `${prevState.dateOfDocumentD}/${prevState.dateOfDocumentM}/${prevState.dateOfDocumentY}`
        }));
    }
    docnumChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        }, () => this.updateDocnum());
    }
    updateDocnum = () => {
        this.setState(prevState => ({
            documentNumber: `${prevState.documentNumberN}/${prevState.documentNumberY}`
        }));
    }
    uploadChange = (event) => {
        const files = event.target.files[0];
        this.setState({ files });
    }
    uploadFile = () =>{
        return new Promise((resolve, reject) => {
            $.ajax({
                url: swarmServer,
                'Access-Control-Allow-Origin': '*',
                crossDomain: true,
                type: 'POST',
                contentType: this.state.files.type,
                data: this.state.files,
                processData: false,
                success: function (response) {
                    resolve(response)
                },
                error: function (xhr, status) {
                    reject(status)
                }
            });
        })
    }
    isFillAll = () =>{
        const { to, subject, content, dateOfDocumentD, dateOfDocumentM, dateOfDocumentY, fromOfDocumentFrom, documentNumberN, documentNumberY } = this.state;
        return ( to && subject && content && dateOfDocumentD && dateOfDocumentM && dateOfDocumentY && fromOfDocumentFrom && documentNumberN && documentNumberY );
    }
    send = (event)=> {
        if(!this.isFillAll()) {
            swal('ระวัง!', 'กรุณากรอกข้อมูลให้ครบ', 'warning');
            iziToast.warning({
                title: 'ระวัง!',
                message: 'กรุณากรอกข้อมูลให้ครบ',
            });
            return;
        }
        event.preventDefault();
        if(this.state.files){
            this.uploadFile().then((hash)=>{
                let file = {
                    address : hash,
                    email : this.props.user.email,
                    name: this.state.files.name,
                    type: this.state.files.type
                }
                sendMail(this.state, file).then(()=>{
                    swal('รอสักครู่', 'กำลังดำเนินการจัดเก็บข้อมูลบนบล็อกเชน', 'warning');
                    iziToast.warning({
                        title: 'รอสักครู่',
                        message: 'กำลังดำเนินการจัดเก็บข้อมูลบนบล็อกเชน',
                    });
                    this.resetState();
                    this.props.closeWriteBox()
                });
            })
        }
        else{
            sendMail(this.state).then(()=>{
                swal('รอสักครู่', 'กำลังดำเนินการจัดเก็บข้อมูลบนบล็อกเชน', 'warning');
                iziToast.warning({
                    title: 'รอสักครู่',
                    message: 'กำลังดำเนินการจัดเก็บข้อมูลบนบล็อกเชน',
                });
                this.resetState();
                this.props.closeWriteBox()
            });
        }
    }
    resetState = () => {
        this.setState({
            to: '',
            documentNumber : '',
            dateOfDocument : '',
            subject: '',
            content: '',
            files: '',
            isFullWritebox: true,
            docType: 'inbound',
            inBound_type: 'sendToResponse',
            dateOfDocumentD: '',
            dateOfDocumentM: '',
            dateOfDocumentY: '',
            fromOfDocumentFrom: '',
            fromOfDocumentWay: 'ปกติ',
            documentNumberN: '',
            documentNumberY: '',
        }, () => { this.props.closeWriteBox()})
    }
    toggleCollapse = () => {
        this.setState(prevState => ({
            isFullWritebox: !prevState.isFullWritebox
        }), () => this.forceUpdate());
    }
    toggleDropdown = () => {
        this.setState(prevState => ({
            dropdownEmails: !prevState.dropdownEmails
        }), () => this.forceUpdate());
    }
    setInput = (to) => {
        this.setState(prevState => ({
            to: to
        }), () => this.forceUpdate());
    }
    handleInOutBound = (event) => {
        if (event.target.value === 'inbound'){
            this.setState(prevState => ({
                docType: 'inbound'
            }));
        }
        else this.setState(prevState => ({
            docType: 'outbound',
            inBound_type: null
        }));
    }
    inBoundType = (event) => {
        if (event.target.value === 'sendToResponse') {
            this.setState({ inBound_type: 'sendToResponse'});
        }
        else this.setState({inBound_type: 'sendToAck'});
    }
    render() {
        return (
            <div id="MailBox">
                <Navbar user={this.state.user} />
                <div className="container is-fluid">
                    <div className="columns">
                        <Aside page="MailBox" openWriteBox={this.openWriteBox} />
                        <div className="column is-10 content">
                            <div className="write-box-section">
                                <div className="write-box-section-text" style={{width:'160px'}}>ประเภทเอกสาร</div>
                                <div className="write-box-section-input" style={{display: 'flex', flexDirection: 'row'}}>
                                    <div style={{width: '140px', height: '100%'}}>
                                        <div style={{width: '140px', marginTop: '5px'}}>
                                            <label className="inline">
                                                <input type="radio" name="bound" value="inbound" checked={(this.state.docType === 'inbound')} onChange={this.handleInOutBound}/>
                                                <span style={{marginLeft: '5px'}}>เข้า</span>
                                            </label>
                                            <label className="inline" style={{marginLeft:'15px'}}>
                                                <input type="radio" name="bound" value="outbound" checked={(this.state.docType === 'outbound')} onChange={this.handleInOutBound}/>
                                                <span style={{marginLeft: '5px'}}>ออก</span>
                                            </label>
                                        </div>
                                    </div>
                                    {(this.state.docType === 'inbound') ?
                                        <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
                                            <div style={{width:'2px', backgroundColor: '#cfcfcf', marginTop: '3px', height:'30px'}}></div>
                                            <div style={{width: '311px', padding: '6px 0px 0px 15px'}}>
                                                <label className="inline">
                                                    <input type="radio" name="inbound_type" value="sendToResponse" checked={(this.state.inBound_type === 'sendToResponse')} onChange={this.inBoundType} />
                                                    <span style={{ marginLeft: '5px' }}>แจ้งเพื่อพิจารณา</span>
                                                </label>
                                                <label className="inline" style={{ marginLeft: '15px' }}>
                                                    <input type="radio" name="inbound_type" value="sendToAck" checked={(this.state.inBound_type === 'sendToAck')} onChange={this.inBoundType} />
                                                    <span style={{ marginLeft: '5px' }}>แจ้งเพื่อทราบ</span>
                                                </label>
                                            </div>
                                        </div> : ''}
                                </div>
                            </div>
                            <div className="write-box-section">
                                <div className="write-box-section-text">ผู้รับ</div>
                                <div className="write-box-section-input">
                                    <input type="text" name="to" value={this.state.to} onChange={this.handleChange}/>
                                </div>
                                <div className={"dropdown " + (this.state.dropdownEmails?"is-active":"")}>
                                    <div className="dropdown-trigger" onClick={this.toggleDropdown}>
                                        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu2">
                                            <span>ถึง</span>
                                            <span className="icon is-small">
                                            <i className="fas fa-angle-down" aria-hidden="true"></i>
                                        </span>
                                        </button>
                                    </div>
                                    {
                                        this.state.dropdownEmails?
                                            <div className="dropdown-menu" role="menu">
                                                <div className="dropdown-content" >
                                                    <div className="dropdown-item">
                                                        <label>
                                                            <input type="checkbox" name="to" value="all" onChange={this.clickAll} checked={this.state.allClick}/>
                                                            <span style={{marginLeft:'5px'}}>ALL</span>
                                                        </label>
                                                        <hr className="hr-mg10px"/>
                                                        <div className="dropdown-itemlist">
                                                            {this.state.allUsersEmail}
                                                        </div>
                                                        <div className="hr-mg10px"/>
                                                        <p style={{textAlign:'center'}}>ท่านสามารถสร้างเอกสารทิ้งไว้ โดยที่ยังไม่มอบหมายถึงผู้ใดได้</p>
                                                    </div>
                                                </div>
                                            </div>:''
                                    }
                                </div>
                            </div>
                            <div className="write-box-section">
                                <div className="write-box-section-text">เรื่อง</div>
                                <div className="write-box-section-input">
                                    <input type="text" name="subject" value={this.state.subject} onChange={this.handleChange} />
                                </div>
                            </div>
                            <div className="writebox-doc-detail" style={{display:'flex',flexDirection:'row', height:'80px'}}>
                                <div className="write-box-section inline" style={{width:'30%'}}>
                                    <div className="write-box-section-text">หมายเลขหนังสือ</div>
                                    <div className="write-box-section-inputgroup">
                                        <div className="write-box-section-inputitem">
                                            <div className="write-box-section-input">
                                                <span>หมายเลข : </span>
                                                <input type="text" name="documentNumberN" value={this.state.documentNumberN} onChange={this.docnumChange}
                                                       style={{width:'75px', textAlign:'center'}}
                                                />
                                            </div>
                                        </div>
                                        <div className="write-box-section-inputitem">
                                            <div className="write-box-section-input">
                                                <span>ประจำปีพ.ศ. : </span>
                                                <input type="text" name="documentNumberY" value={this.state.documentNumberY} onChange={this.docnumChange}
                                                       style={{width:'53px', textAlign:'center'}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="separate-inline inline"></div>
                                <div className="write-box-section inline" style={{ marginLeft:'5px', width:'32%' }}>
                                    <div className="write-box-section-text">ลงวันที่</div>
                                    <div className="write-box-section-inputgroup">
                                        <div className="write-box-section-inputitem">
                                            <div className="write-box-section-input" style={{marginTop:'10px'}}>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="separate-inline inline"></div>
                                <div className="write-box-section inline" style={{ marginLeft: '5px', width: '36%' }}>
                                    <div className="write-box-section-text">{(this.state.docType === 'inbound') ? "การรับเอกสาร" : "การส่งเอกสาร" }</div>
                                    <div className="write-box-section-inputgroup">
                                        <div className="write-box-section-inputitem">
                                            <div className="write-box-section-input">
                                                <span>{(this.state.docType === 'inbound') ? "ผู้ส่ง" : "เลขหนังสือต้นเรื่อง"} : </span>
                                                {(this.state.docType === 'inbound') ?
                                                    <input type="text" name="fromOfDocumentFrom" value={this.state.fromOfDocumentFrom} onChange={this.handleChange}
                                                           style={{width:'140px'}}
                                                    /> :
                                                    <input type="text" name="fromOfDocumentFrom" value={this.state.fromOfDocumentFrom} onChange={this.handleChange}
                                                           style={{ display: 'block', width: '206px', height:'20px'}}
                                                    />
                                                }
                                            </div>
                                        </div>
                                        {(this.state.docType === 'inbound') ?
                                            <div className="write-box-section-inputitem">
                                                <div className="write-box-section-input">
                                                    <span>ผ่านช่องทาง : </span>
                                                    <input type="text" name="fromOfDocumentWay" value={this.state.fromOfDocumentWay} onChange={this.handleChange}
                                                           style={{width:'80px'}}
                                                    />
                                                </div>
                                            </div>:''}
                                    </div>
                                </div>
                            </div>
                            <div className="write-box-content">
                                <div className="write-box-content-text inline">
                                    <div className="write-box-section-text">รายละเอียดของเอกสาร</div>
                                    <textarea type="textarea" name="content" value={this.state.content} onChange={this.handleChange}/>
                                </div>
                                <div className="separate-inline-content inline"></div>
                                <div className="write-box-content-upload inline">
                                    <div className="write-box-section-text">อัพโหลดไฟล์เอกสาร</div>
                                    <div className="file-upload">
                                        <label className="file-label">
                                            <input type="file" name="files" onChange={this.uploadChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="write-box-footer">
                                <a className="button is-primary sent-btn" onClick={this.send}>ส่ง</a>
                                <div>
                                    <label style={{display: 'flex', flexDirection: 'row'}}>
                                        <input type="checkbox" name="isPrivate" onChange={this.handleChange} style={{marginLeft:'20px', marginRight: '10px', marginTop: '9px'}}/>
                                        <span>ส่วนบุคคล</span>
                                        { this.state.isPrivate ? <span style={{marginLeft: '5px'}}><i className="fas fa-user-secret"></i></span> : '' }
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <WriteBox isActive={this.state.writeBoxIsActive} closeWriteBox={this.closeWriteBox} user={this.state.user} />
                </div>
            </div>
        );
    }
}

export default MailBox;
