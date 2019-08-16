import React, { Component } from 'react';
import Navbar from './Navbar';
import Aside from './Dashboard/Aside';
import WriteBox from './Dashboard/WriteBox';
import { getCurrentUser } from '../Utils/firebaseAuthen.js';
import { getAllUser } from '../Utils/firebaseDatabase.js';
import { Spin, Icon } from "antd";

class Cancel extends Component {
    constructor() {
        super();
        this.state = {
            writeBoxIsActive: false,
            isViewMailContent: false,
            user: {},
            email: [],
            currentMailContent: {},
            allMembers : [],
            numberOfUsers: null
        }
        this.openWriteBox = this.openWriteBox.bind(this);
        this.closeWriteBox = this.closeWriteBox.bind(this);
        this.sendTo = this.sendTo.bind(this);

        getCurrentUser().then((user) => {
            this.setState(prevState => ({
                user: user
            }));
        })
    }
    componentWillMount(){
        getAllUser().then((allUsers)=>{
            // console.log(all)
            allUsers = allUsers.sort();
            let allMembers = [];
            let numberOfUsers = allUsers.length;
            for (let i in allUsers) {
                allMembers.push(
                    <div className="user" key={"user -" + i} onClick={(e) => this.sendTo(allUsers[i].email)}>
                        <h6 className="inline">{allUsers[i].firstName + " " + allUsers[i].lastName + "(" + allUsers[i].email +")" }</h6>
                        <div className="inline" style={{float: 'right'}}>
                            <span style={{marginLeft: '10px'}}><i className="fas fa-share-square"></i></span>    
                        </div>
                    </div>
                )
            }
            this.setState({
                allMembers,
                numberOfUsers
            }) 
        })
    }
    sendTo = (userEmail) => {
        this.setState(prevState => ({
            sendTo: userEmail
        }), () => this.openWriteBox() );
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
    render() {
        const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
        let checkMember = this.state.numberOfUsers;
        if(checkMember === null){
            checkMember = <Spin indicator={antIcon} />
        }
        return (
            <div className="users">
                <Navbar user={this.state.user} />
                <div className="container is-fluid">
                    <div className="columns">
                        <Aside page="users" openWriteBox={this.openWriteBox} />
                        <div className="column is-10 content">
                            <h2>สมาชิกภายในระบบ</h2>
                            {/* <h3>จำนวนทั้งสิ้น {this.state.numberOfUsers} บัญชี</h3> */}
                            <h3>จำนวนทั้งสิ้น { checkMember } บัญชี</h3>
                            {this.state.allMembers}
                        </div>
                    </div>
                    <WriteBox isActive={this.state.writeBoxIsActive} closeWriteBox={this.closeWriteBox} user={this.state.user} sendTo={this.state.sendTo}/>
                </div>
            </div>
        );
    }
}

export default Cancel;
