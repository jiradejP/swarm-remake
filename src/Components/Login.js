import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import validator from 'validator';
// import { form, button } from 'react-validation';
import { toggleSignIn, retrieveID, signinWithGoogle } from '../Utils/firebaseAuthen.js'

const email = (value) => {
    if (!validator.isEmail(value)) {
        return `${value} is not a valid email.`
    }
}
const required = (value) => {
    if (!value.toString().trim().length) {
        return 'require';
    }
}
const Button = ({ hasErrors, ...props }) => {
    return (
        <button {...props} disabled={hasErrors} />
    );
};
const password = (value, props, components) => {
    if (value !== components['confirm'][0].value) {
        return <span className="error">Passwords are not equal.</span>
    }
}

class Login extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            GGisLoading: false,
            email: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }

    componentWillMount(){
        let url = new URL(window.location.href);
        let isShouldReload = (url.searchParams.get("shouldReload") === 'true');
        if(isShouldReload){
            window.location.assign("/login");
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }
    handleSubmit = (event) => {
        console.log("handleSubmit")
        event.preventDefault();
        this.setState(prevState => ({
            isLoading: true,
        }));
        toggleSignIn(this.state.email, this.state.password)
        .then(()=>{
            console.log(true)
            if(true){
                retrieveID();
            }
            this.setState(prevState => ({
                isLoading: false,
            }));
        }).catch((reject_id)=>{
            if(reject_id == 2){
                window.location = '../register';
            }
            this.setState(prevState => ({
                isLoading: false
            }));
        })
    }
    // GoogleLogin = (response) => {
    //     this.setState({GGisLoading: true});
    //     signinWithGoogle().then((result)=>{
    //         console.log('success');
    //         console.log(result);
    //         this.setState({ GGisLoading: false });
    //     }).catch((err)=>{
    //         console.log('error');
    //         console.log(err);
    //         this.setState({ GGisLoading: false });
    //     })
    // }
    render() {
        const btnClass = classNames('button', 'is-block', 'is-normal', 'is-success', {
            'is-loading': this.state.isLoading,
        });
        // const btnDanger = classNames('button', 'is-block', 'is-normal',{
        //     'is-loading': this.state.GGisLoading,
        // })
        return (
            <section className="hero is-fullheight" style={{ backgroundColor: '#f4f8ff' }}>
                <div>
                    <div className="hero-body">
                        <div className="container has-text-centered">
                            <div className="column is-4 is-offset-4">
                                <h3 className="title has-text-grey" style={{marginBottom: '30px'}}>Login to SwarmMail</h3>
                                <p className="subtitle" style={{ fontSize: '15px', marginBottom: '20px' }}>Documentation on Blockchain Technology</p>
                                <div className="box">
                                    <figure className="avatar">
                                        <img src="https://cdn0.iconfinder.com/data/icons/user-pictures/100/maturewoman-3-128.png" alt="avatar" width="120px"/>
                                    </figure>
                                    <form>
                                        <div className="field">
                                            <p className="control has-icons-left has-icons-right">
                                                <input className="input is-normal" type="email" value={this.state.email} id="email" onChange={this.handleChange} placeholder="Your Email" validations={[required, email]} />
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-envelope"></i>
                                                </span>
                                                <span className="icon is-small is-right">
                                                    <i className="far fa-check"></i>
                                                </span>
                                            </p>
                                        </div>                           
                                        <div className="field">
                                            <p className="control has-icons-left">
                                                <input className="input is-normal" type="password" value={this.state.password} id="password" onChange={this.handleChange} placeholder="Your Password" />
                                                <span className="icon is-small is-left">
                                                    <i className="fas fa-lock"></i>
                                                </span>
                                            </p>
                                        </div>
                                        <button className={btnClass} style={{ 'width': '100%' }} onClick={this.handleSubmit} id="login">Login</button>
                                    </form>
                                    {/* <h4 style={{marginTop: '20px', marginBottom: '20px'}}>OR</h4> */}
                                    {/* <button style={{ width: '100%', backgroundColor: 'rgb(209, 72, 54)', color: '#fff' }} 
                                        className={btnDanger} onClick={this.GoogleLogin}
                                    >
                                        <i className="fab fa-google"></i>
                                        <span style={{ marginLeft: '10px' }}>Login with Google</span>
                                    </button> */}
                                    <br></br>
                                        <p className="has-text-grey">
                                            <Link to="register">Register </Link> &nbsp;.&nbsp;
                                            <Link to="forgotpassword">Forgot Password</Link> &nbsp;.&nbsp;
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

export default Login;
