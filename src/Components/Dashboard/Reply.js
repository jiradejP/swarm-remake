import React, { Component } from 'react';
import swal from 'sweetalert';
import iziToast from 'izitoast/dist/js/iziToast.min.js';
import axios from 'axios';
import classNames from "classnames";
import { replyEmail } from '../../Utils/firebaseDatabase.js';

class Reply extends Component {
    constructor() {
        super();
        this.state = {
            content : '',
            isLoading: false

        }
        this.handleChange = this.handleChange.bind(this);
        this.reply = this.reply.bind(this);
        this.replyDone = this.replyDone.bind(this);

        iziToast.settings({
            progressBar: false
        });
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    reply = () => {
        // console.log(this.props)
        if(this.state.content){
            this.setLoading();
            const from = this.props.user.email;
            let receivers = this.props.allTo;
            const allTo = receivers.filter(receiver => receiver !== from)
            // console.log(allTo)
            const url = `http://localhost:4000/sendMailComment/`;
            const replyData = {
                content : this.state.content,
                files : ''
            }
            const mailID = this.props.mailID;
            replyEmail(mailID, replyData, from).then(()=>{
                this.replyDone(mailID);
                this.resetState();
            }).catch(()=>{
                swal('เกิดข้อผิดพลาด', 'กรุณาลองใหม่อีกครั้งภายหลัง', 'error');
                iziToast.error({
                    title: 'เกิดข้อผิดพลาด',
                    message: 'กรุณาลองใหม่อีกครั้งภายหลัง',
                });
            })
            
            axios.post(url, {
                "receivers": allTo,
                "senders": from,
                "comment": this.state.content,
            })
            
        }
        else {
            swal('ระวัง!', 'กรุณาป้อนข้อมูลที่ต้องการตอบกลับ', 'warning');
            iziToast.warning({
                title: 'ระวัง!',
                message: 'กรุณาป้อนข้อมูลที่ต้องการตอบกลับ',
            });
        }
        // this.resetState();
    }
    replyDone = (mailID) => {
        this.setState(prevState => ({
            content: ''
        }), () => {
            this.props.refreshMailContent(mailID);
        });
    }
    setLoading() {
        this.setState({ isLoading: true });
      }
    resetState = () => {
        this.setState({
          isLoading: false
        });
      };
    render() {
        // console.log(this.props.allTo)
        const btnClass = classNames("button"," button inline", {
            "is-loading": this.state.isLoading
          });
          console.log(this.state.isLoading)
        return (
            <div className="reply">
                <textarea type="textarea" name="content" value={this.state.content} onChange={this.handleChange} />
                <button className={btnClass}  onClick={event =>{
                        this.reply(event);
                        this.setState({ isLoading: true });
                   }} >ตอบกลับ</button>
                <div className="file-upload">
                    <label className="file-label">
                        <input className="file-input" type="file" name="file-upload" multiple />
                    </label>
                </div>
            </div>
        );
    }
}

export default Reply;
