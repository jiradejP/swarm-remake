import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { forgotPassword } from '../Utils/firebaseAuthen.js'
class ForgotPassword extends Component {
    constructor(){
        super();
        this.state = {
            email : '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);    
    }
    handleSubmit = (event) =>{
        event.preventDefault(); //submit form ไม่ refresh หน้า
        forgotPassword(this.state.email);

    }
    handleChange = (event) =>{
        this.setState({[event.target.id]:event.target.value});
    }
    render() {
        return (
            <section className="hero is-fullheight" style={{ backgroundColor: '#f4f8ff' }}>
                <div>
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <div className="column is-4 is-offset-4">
                                <h3 className="title has-text-grey">Reset Your Password</h3>
                                <p className="subtitle" style={{ fontSize: '12px' }}>Please enter your email address to reset your password.</p>
                                <div className="box">
                                    <form>
                                        <div className="field">
                                            <input className="input is-normal" type="email" id="email" value={this.state.value} onChange={this.handleChange} placeholder="Email" autoFocus="" required />
                                        </div>
                                        <div className="field is-grouped is-grouped-left">
                                            <p className="control" style={{margin: 'auto'}}>
                                                <a className="button is-warning is-normal" onClick={this.handleSubmit}>Reset password</a>
                                            </p>
                                        </div>
                                    </form>
                                    <br></br>
                                    <p className="has-text-grey">
                                    <Link to="login">Login </Link>&nbsp;.&nbsp;
                                    <Link to="register">Register</Link>&nbsp;.&nbsp;
                                    <Link to="/">Home Page</Link>
                                </p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default ForgotPassword;
