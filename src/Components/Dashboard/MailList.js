import React, { Component } from 'react';
import MailCard from './MailCard';
import { Spin, Icon } from 'antd';

import { getMailByReceiver, getAllEmail , sendMail} from '../../Utils/firebaseDatabase.js';



class MailList extends Component {
    
    constructor(){
        super();
        this.state = {
            user : {
                email: '-'
            },
            cards: null,
            mails : undefined,
            data : this.setState,
            user : {},
            to : '',
            // countI : 0
        }
        
        getAllEmail().then((mails) => {
            this.state.all = mails;
        })
       
    }
    
    componentWillReceiveProps(newProps){
        let cards = [];
        let mails = newProps.mails;
        
        // console.log(mails);
        if(mails !== undefined){
            for (let i in mails) {
                // console.log(this.state.cards)
                // console.log(mails[i].from)
                // console.log(i)
                // this.countI = i;
                cards.push(<MailCard from={this.props.from} data={mails[i]} key={"card-" + i} openMailContent={this.props.openMailContent} setCurrentMailContent={this.props.setCurrentMailContent} user={this.props.user}/>)
            }
            this.setState({ cards: cards });
        }
        getMailByReceiver(newProps.user.email).then((mails) => {
            this.setState(prevState => ({
                mails: mails,
                mailsToYou: mails.length,
            }), () => this.forceUpdate());
        })
        this.setState(prevState => ({
            data: newProps.data,
            user: newProps.user,
        }), () => this.forceUpdate());
    }
     
    render() {
        // console.log(this.props)
        // console.log(this.props.location)
        let column4 = "จาก";
        if(this.props.location !== undefined){
            if(this.props.location.state.isCreateByYou !== undefined && this.props.location.state.isCreateByYou){
                column4 = "ถึง";
            }
        }
        let content = this.state.cards;
        if (this.state.cards === null) {
            const antIcon = <Icon type="loading" style={{ fontSize: 36 }} spin />;
            content = <div style={{ textAlign: 'center', marginTop: '10px' }}><Spin indicator={antIcon} /></div>
        }else if(this.state.cards.length === 0){
            content = <div style={{ marginTop: '10px', marginLeft: '30px' }}>ไม่พบเอกสาร</div>
        }
        return (
            <div className="maillist">
                {this.props.actionsBtn?
                    <div className="maillist-title columns">
                        <div className="msg-header column is-2">เรื่อง</div>                        
                        <div className="msg-header column is-1">หมายเลข</div>                        
                        <div className="msg-header column is-2">ประเภท</div>                        
                        <div className="msg-header column is-4">{column4}</div>
                        <div className="msg-header column is-1">มีไฟล์/ส่วนตัว</div>                        
                        <div className="msg-header column is-2">เวลาอัพเดท</div>                                            
                    </div>:''
                }
                <div className="inbox-messages">
                    {content}
                </div>
            </div>
        );
    }
}

export default MailList;
