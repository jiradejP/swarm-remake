import React, { Component } from 'react';
import moment from 'moment';
import 'moment/locale/th';

// moment().locale(th);

class MailCard extends Component {
    isRead = false;
    constructor(){
        super();
        this.state = {
            data : {},
            isRead: false,
        }
        this.click = this.click.bind(this);         
    }
    componentDidMount(){
        this.setState(prevState => ({
            data: this.props.data
        }), () => this.forceUpdate());
    }
    click = () =>{
        this.props.openMailContent();
        this.props.setCurrentMailContent(this.state.data);
    }
    render() {
        moment.locale('th');
        // console.log(moment.locale())
        let dateTime = moment(this.state.data.createDate).format("Do MMM");
        // console.log(dateTime)
        for (let i in this.state.data.actions){
            if (this.state.data.actions[i].action === 'read' && this.state.data.actions[i].email === this.props.user.email){
                // this.isRead = true; ปิดไว้ เพื่อไม่ให้มันเทาถ้าดูแล้ว ป้องกันแอดไซน์ใหม่แล้วมันไม่ขาว
                break;
            }
        }
        let ifFromFrom = false;
        if(this.props.from === 'sent'){
            ifFromFrom = true;
        }
        let isDone = false;
        let isCancel = false;
        let status = ''
        if(this.state.data.status === 'done'){
            status = "เสร็จสิ้น"
            isDone = true;
        }else if(this.state.data.status === 'cancel'){
            status = "ยกเลิก"
            isCancel = true;
        }else if(this.state.data.status === 'doing'){
            status = "กำลังดำเนินการ"
            // isCancel = true;
        } 
        return (

            // <div className={'card '+(this.isRead ? 'active' : 'card')} onClick={this.click}>
            //     <div className="card-content columns">
            //         <div className={"msg-actions column is-1 " + (isDone ? 'card-done' : isCancel ? 'card-cancel' : status ? 'card-doing' : '')} style={{ width:'11.66667%' }}>{status}</div>
            //         <div className="msg-header column is-2" >
            //             <strong title={"ส่งจาก " + this.state.data.from}>{ ifFromFrom ? this.state.data.to : this.state.data.from }</strong>
            //         </div>
            //         <div className={"msg-docnumber column is-1" } title={"หมายเลขเอกสาร : คส. " + this.state.data.documentNumber } >{this.state.data.documentNumber}</div>
            //         <div className="msg-content column is-4" >
            //             <span><strong>{this.state.data.subject}</strong> - {this.state.data.content}</span>
            //         </div>
            //         <div className={"msg-doctype column is-2"} style={{ width:'15%' }}>{(this.state.data.docType === 'outbound') ? "เอกสารออก" : (this.state.data.inBound_type === "sendToAck") ? "แจ้งเพื่อทราบ/ดำเนินการ" : "แจ้งเพื่อพิจารณา"}</div>
            //         <div className="msg-attrs column is-2" style={{ width:'15%' }}>
            //             <span className="msg-attachment" title="มีเอกสารแนบ">{this.state.data.files ? <i className="fa fa-paperclip"></i> : ''}</span>
            //             <span className="msg-private" title="ส่งแบบส่วนตัว">{this.state.data.isPrivate ? <i className="fas fa-user-secret"></i> : ''}</span>
            //             <span className="msg-timestamp">{this.state.data.updateTime}</span>
            //         </div>
            //     </div>
            // </div>
            <div className={'card '+(this.isRead ? 'active' : 'card')} onClick={this.click}>
                <div className="card-content columns">
                    <div className="msg-content column is-2" >
                        <span><strong>{this.state.data.subject}</strong> - {this.state.data.content}</span>
                    </div>
                    <div className={"msg-docnumber column is-1" } title={"หมายเลขเอกสาร : คส. " + this.state.data.documentNumber } >{this.state.data.documentNumber}</div>
                    <div className={"msg-doctype column is-2"}>{(this.state.data.docType === 'outbound') ? "เอกสารออก" : (this.state.data.inBound_type === "sendToAck") ? "แจ้งเพื่อทราบ/ดำเนินการ" : "แจ้งเพื่อพิจารณา"}</div>
                    <div className="msg-header column is-4" >
                        <strong title={"ส่งจาก " + this.state.data.from}>{ ifFromFrom ? this.state.data.to : this.state.data.from }</strong>
                     </div>
                     <div className="msg-attrs column is-1">
                     <span className="msg-attachment" title="มีเอกสารแนบ">{this.state.data.files ? <i className="fa fa-paperclip"></i> : ''}</span>
                         <span className="msg-private" title="ส่งแบบส่วนตัว">{this.state.data.isPrivate ? <i className="fas fa-user-secret"></i> : ''}</span>
                     </div>
                    <div className="msg-attrs column is-2" style={{ textAlign: 'center'}}>
                         {/* <span className="msg-timestamp">{this.state.data.updateTime}</span> */}
                         <span className="msg-timestamp">{dateTime}</span>
                     </div>
                </div>
            </div>
        );
    }
}

export default MailCard;
