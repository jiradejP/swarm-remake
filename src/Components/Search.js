import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import Navbar from './Navbar';
import Aside from './Dashboard/Aside';
import WriteBox from './Dashboard/WriteBox';
import { getCurrentUser } from '../Utils/firebaseAuthen.js';

class Search extends Component {
    constructor() {
        super();
        this.state = {
            writeBoxIsActive: false,
            user: {},
            documentNumber: '',
            documentNumberN: '',
            documentNumberY: '',
            documentText: ''
        }
        this.openWriteBox = this.openWriteBox.bind(this);
        this.closeWriteBox = this.closeWriteBox.bind(this);
        
        getCurrentUser().then((user) => {
            this.setState(prevState => ({
                user: user
            }));
        })
    }

    handleChange = (event) => {
        this.setState({
            documentText: event.target.value,
        })

    }

    setDocumentNumber = () => {
        this.setState(prevState => ({
            documentNumber: prevState.documentNumberN + '-' + prevState.documentNumberY
        }));
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
        return (
            <div id="Search">
                <Navbar user={this.state.user} />
                <div className="container is-fluid">
                    <div className="columns">
                        <Aside page="search" openWriteBox={this.openWriteBox} />
                        <div className="column is-10 content">
                        {/* <form action={"/match/" + this.state.documentText}> */}
                            <center><h2>ค้นหาเอกสาร</h2></center>
                            <center><span>ค้นหาเอกสารจากชื่อเรื่องอีเมล / หมายเลขเอกสาร / เนื้อหาไฟล์ </span></center>
                            {/* <div className="columns" style={{ marginBottom: '-10px', marginTop: '20px !important', textAlign: 'center' }}>
                                <div className="column is-2"></div>
                                <div className="column is-4">
                                    <span>หมายเลขเอกสาร : </span>
                                </div>
                                <div className="column is-4">
                                    <span>ประจำปีพ.ศ. : </span>                                
                                </div>
                                <div className="column is-8"></div>
                            </div> */}
                                <div className="columns">
                                    <div className="column is-3"></div>
                                    <div className="column is-6">
                                        <input className="input is-medium" type="text" placeholder="ค้นหาด้วยคำ"
                                            style={{ textAlign: 'left' }}
                                            name="documentNumberN" onChange={this.handleChange}
                                            onKeyPress={(target) => {
                                                if(target.charCode === 13){
                                                    let seachLink = document.getElementById("search-link");
                                                    seachLink.click();
                                                }
                                            }}
                                        />
                                    </div>
                                    {/* <span style={{textAlign: 'center', fontSize: '2rem', paddingTop: '10px'}}>/</span>
                                <div className="column is-4">
                                    <input className="input is-medium" type="text" placeholder="2561"
                                        style={{ textAlign: 'center' }} maxLength="4"
                                        name="documentNumberY" value={this.state.documentNumberY} onChange={this.handleChange}
                                    />
                                </div> */}
                                </div>
                                <div className="columns">
                                    <div className="column is-5"></div>
                                    <div className="column is-2">
                                        <Link id="search-link" to={"/match/" + this.state.documentText}
                                            className="button is-medium is-primary"
                                            style={{ width: '100%' }} onClick={this.searchClick}>ค้นหา
                                        </Link>
                                    </div>
                                </div>
                            {/* </form> */}
                        </div>
                    </div>
                    <WriteBox isActive={this.state.writeBoxIsActive} closeWriteBox={this.closeWriteBox} user={this.state.user} />
                </div>
            </div>
        );
    }
}

export default Search;

// import React, { Component } from 'react';
// import { Link } from 'react-router-dom'
// import Navbar from './Navbar';
// import Aside from './Dashboard/Aside';
// import WriteBox from './Dashboard/WriteBox';
// import { getCurrentUser } from '../Utils/firebaseAuthen.js';

// class Search extends Component {
//     constructor() {
//         super();
//         this.state = {
//             writeBoxIsActive: false,
//             user: {},
//             documentNumber: '',
//             documentNumberN: '',
//             documentNumberY: '',
//         }
//         this.openWriteBox = this.openWriteBox.bind(this);
//         this.closeWriteBox = this.closeWriteBox.bind(this);

//         getCurrentUser().then((user) => {
//             this.setState(prevState => ({
//                 user: user
//             }));
//         })
//     }
//     handleChange = (event) => {
//         this.setState(({
//             [event.target.name]: event.target.value,
//         }), () => this.setDocumentNumber());
//     }
//     setDocumentNumber = () => {
//         this.setState(prevState => ({
//             documentNumber: prevState.documentNumberN + '-' + prevState.documentNumberY
//         }));
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
//     render() {
//         return (
//             <div id="Search">
//                 <Navbar user={this.state.user} />
//                 <div className="container is-fluid">
//                     <div className="columns">
//                         <Aside page="search" openWriteBox={this.openWriteBox} />
//                         <div className="column is-10 content">
//                             <center><h2>ค้นหาเอกสาร</h2></center>
//                             <div className="columns" style={{ marginBottom: '-10px', marginTop: '20px !important', textAlign: 'center' }}>
//                                 <div className="column is-2"></div>
//                                 <div className="column is-4">
//                                     <span>หมายเลขเอกสาร : </span>
//                                 </div>
//                                 <div className="column is-4">
//                                     <span>ประจำปีพ.ศ. : </span>                                
//                                 </div>
//                                 <div className="column is-8"></div>
//                             </div>
//                             <div className="columns">
//                                 <div className="column is-2"></div>
//                                 <div className="column is-4">
//                                     <input className="input is-medium" type="text" placeholder="183"
//                                         style={{ textAlign: 'center' }} maxLength="4"
//                                         name="documentNumberN" value={this.state.documentNumberN} onChange={this.handleChange}
//                                         />
//                                 </div>
//                                 <span style={{textAlign: 'center', fontSize: '2rem', paddingTop: '10px'}}>/</span>
//                                 <div className="column is-4">
//                                     <input className="input is-medium" type="text" placeholder="2561"
//                                         style={{ textAlign: 'center' }} maxLength="4"
//                                         name="documentNumberY" value={this.state.documentNumberY} onChange={this.handleChange}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="columns">
//                                 <div className="column is-2"></div>
//                                 <div className="column is-8">
//                                     <Link to={"/match/" + this.state.documentNumber} className="button is-medium is-primary" style={{ width: '100%' }} onClick={this.searchClick}>ค้นหา</Link>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <WriteBox isActive={this.state.writeBoxIsActive} closeWriteBox={this.closeWriteBox} user={this.state.user} />
//                 </div>
//             </div>
//         );
//     }
// }

// export default Search;
