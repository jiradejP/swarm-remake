const firebase = require("firebase");
const $ = require('jquery');
const { mailServer } = require('./utils');
require("firebase/firestore");
require('./firebaseConfig.js');

const swal = require('sweetalert');
const iziToast = require('izitoast/dist/js/iziToast.min.js');

var { ETHSendEmail, ETHSetFile, ETHSetAction } = require('../Utils/ethreum');

const db = firebase.firestore();
const mailRef = db.collection('Email');
const userRef = db.collection('User');
var allUsers = '';

function mailer(from, to, action){
    return new Promise((resolve, reject)=>{
        $.post( mailServer + 'mailer',{from, to, action,
            url: mailServer,
            headers : {
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Request-Headers': 'x-requested-with',
                'Access-Control-Request-Credentials': true,
                'Access-Control-Request-Methods': "GET , POST , OPTIONS",

            },
            crossDomain: true,
            type: 'POST',
            })
            .done(()=>{
            console.log('Sent mail by mailer done!')
        })
    })
}
function convertDateObject(mail){
    // console.log(mail.timestamp);
    // let serverTimestamp = mail.createDate || mail.timestamp;
    let timeNow = new Date();
    // mail.updateTime = mail.timestamp.toLocaleString();
    // console.log(timeNow.toLocaleString());
    mail.timestamp = timeNow;
    // mail.time = serverTimestamp.toLocaleString();
    return mail;
}
function takeActiontoDB(mailID,userEmail,actionString){
    return new Promise((resolve, reject) => {
        const mail = mailRef.doc(mailID);
        mail.get().then((doc) => {
            let actions = doc.data().actions;
            let action = {
                action: actionString,
                email: userEmail,
                timestamp: new Date().getTime()
            }
            if (actions == null || actions == undefined) {
                actions = [action]
            } else actions.push(action)
            let update = {
                "actions": actions,
                // "statusAction": actionString,
            }
            if(actionString === 'accepted'){
                update.statusAction = 'accepted';
            }else if(actionString === 'rejected'){
                update.statusAction = 'rejected';
            }
            if(action !== 'read'){
                update.timestamp = firebase.firestore.FieldValue.serverTimestamp();
            }
            ETHSetAction(mailID, userEmail, actionString);
            console.log(update)
            mail.update(update).then(() => {
                resolve()
            })
            .catch(() => reject())
        });
    });
}
export const getAllEmail = () => {
    return new Promise((resolve, reject) => {
        mailRef.orderBy('createDate', 'desc').get().then((querySnapshot) => {
            let allMails = [];
            querySnapshot.forEach(function (doc) {
                let mail = doc.data();
                // console.log(mail);
                mail.id = doc.id;
                // console.log(mail.timestamp);
                allMails.push(convertDateObject(mail));
            });
            resolve(allMails);
        // }).catch((e) => reject(e));
        }).catch(() => reject());
    });
}
export const getAllEmailDoing = () => {
    return new Promise((resolve, reject) => {
        mailRef.orderBy('createDate', 'desc').get().then((querySnapshot) => {
            let allMails = [];
            querySnapshot.forEach(function (doc) {
                let mail = doc.data();
                if (mail.isPrivate) return;
                if(mail.status === 'doing'){
                    mail.id = doc.id;
                    allMails.push(convertDateObject(mail));
                }
            });
            resolve(allMails);
        }).catch(() => reject());
    });
}
export const getAllEmailDone = () => {
    return new Promise((resolve, reject) => {
        mailRef.orderBy('createDate', 'desc').get().then((querySnapshot) => {
            let allMails = [];
            querySnapshot.forEach(function (doc) {
                let mail = doc.data();
                if (mail.isPrivate) return;
                if (mail.status === 'done') {
                    mail.id = doc.id;
                    allMails.push(convertDateObject(mail));
                }
            });
            resolve(allMails);
        }).catch(() => reject());
    });
}
export const getAllEmailCancel = () => {
    return new Promise((resolve, reject) => {
        mailRef.orderBy('createDate', 'asc').get().then((querySnapshot) => {
            let allMails = [];
            querySnapshot.forEach(function (doc) {
                let mail = doc.data();
                if (mail.isPrivate) return;
                if (mail.status === 'cancel') {
                    mail.id = doc.id;
                    allMails.push(convertDateObject(mail));
                }
            });
            resolve(allMails);
        }).catch(() => reject());
    });
}
export const getMailByReceiver = (receiverEmail) => {
    return new Promise((resolve,reject) => {
        getAllEmail().then((allMails)=>{
            let mails = [];
            allMails.forEach(function (mail) {
                if ( mail.to.indexOf(receiverEmail) !== -1 ){
                    mails.push(mail);
                }
            });
            resolve(mails);
        })
    });
}
export const getMailByReceiverAndPrivate = (receiverEmail) => {
    return new Promise((resolve, reject) => {
        getAllEmail().then((allMails) => {
            let mails = [];
            allMails.forEach(function (mail) {
                if (mail.to.indexOf(receiverEmail) !== -1 && mail.isPrivate === true) {
                    mails.push(mail);
                }
            });
            resolve(mails);
        })
    });
}
export const getMailByReceiverDoing = (receiverEmail) => {
    // console.log(receiverEmail);
    return new Promise((resolve, reject) => {
        getAllEmail().then((allMails) => {
            // console.log("getAllEmail");
            let mails = [];
            allMails.forEach(function (mail) {
                // console.log("allMails");
                if (mail.to.indexOf(receiverEmail) !== -1) {
                    if(mail.status === 'doing'){
                        mails.push(mail);
                    }
                }
            });
            resolve(mails);
        })
    });
}
export const getMailByReceiverSent = (receiverEmail) => {
    return new Promise((resolve, reject) => {
        getAllEmail().then((allMails) => {
            let mails = [];
            allMails.forEach(function (mail) {
                if (mail.from.indexOf(receiverEmail) !== -1) {
                        mails.push(mail);
                }
            });
            resolve(mails);
        })
    });
}
export const sendMail = (mailDetail,fileObject) => {
    return new Promise((resolve,reject)=>{
        if(fileObject){
            fileObject.uploadDate = new Date().getTime();
        }
        let Mail = {
            to: mailDetail.to,
            subject: mailDetail.subject,
            content: mailDetail.content,
            from: mailDetail.from,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            replies: [],
            actions: [{
                action: 'created',
                email: mailDetail.from,
                timestamp: new Date().getTime(),
            },
            {
                action: 'assign to ' + mailDetail.to,
                email: mailDetail.from,
                assignTo: mailDetail.to,
                timestamp: new Date().getTime(),
            }],
            documentNumber: mailDetail.documentNumber,
            dateOfDocument: mailDetail.dateOfDocument,
            fromOfDocument: mailDetail.fromOfDocumentFrom,
            fromOfDocumentWay: mailDetail.fromOfDocumentWay,
            allTo: [mailDetail.from,mailDetail.to],
            status: 'doing',
            createDate: firebase.firestore.FieldValue.serverTimestamp(),
            isPrivate: mailDetail.isPrivate,
            docType: mailDetail.docType,
            inBound_type: mailDetail.inBound_type,
        }
        if (mailDetail.inBound_type === 'sendToAck'){
            Mail.status = 'done';
        }
        console.log(Mail);
        if (fileObject) {
            fileObject.uploadDate = new Date().getTime();
            Mail.files = [fileObject];
        }
        if (Mail.to === 'all' || Mail.to === 'ALL'){
            getAllUser().then((emailusers)=>{
                Mail.to = emailusers.join();
                mailRef.add(Mail)
                .then((ID)=>{
                    console.log(ID)
                    console.log(mailDetail)
                    ETHSendEmail(mailDetail, fileObject, ID.id).then((data) => {
                        console.log("This Best" + data)
                        if (fileObject){
                            ETHSetFile(ID.id, fileObject).then(()=>{ })
                        }
                        ETHSetAction(ID.id, mailDetail.from, 'created').then(() => {
                            ETHSetAction(ID.id, mailDetail.from, 'assign to ' + mailDetail.to).then(() => {  })
                            swal('สำเร็จ', 'บันทึกลงบล็อกเชนสำเร็จ', 'success');
                            iziToast.success({
                                title: 'สำเร็จ',
                                message: 'บันทึกลงบล็อกเชนสำเร็จ',
                            });
                        })
                    })
                    resolve(ID)
                })
                .catch(() => reject());    
            })
        }
        else {
            mailRef.add(Mail)
                .then((ID) => {
                    console.log(ID)
                    ETHSendEmail(mailDetail, fileObject, ID.id).then((data) => {
                        if (fileObject) {
                            ETHSetFile(ID.id, fileObject).then(()=>{})
                        }
                        ETHSetAction(ID.id, mailDetail.from, 'created').then(() => {
                            ETHSetAction(ID.id, mailDetail.from, 'assign to ' + mailDetail.to).then(() => { })
                            swal('สำเร็จ', 'บันทึกลงบล็อกเชนสำเร็จ', 'success');
                            iziToast.success({
                                title: 'สำเร็จ',
                                message: 'บันทึกลงบล็อกเชนสำเร็จ',
                            });
                        })
                    })
                    resolve(ID)
                })
            .then(()=> resolve())
            .catch(()=>reject());    
        }
        mailer(mailDetail.from, mailDetail.to, 'sent document to you');
        return resolve
    })
}
export const getMailbyID = (mailID) => {
    return new Promise((resolve, reject) => {
        const mail = mailRef.doc(mailID);
        mail.get().then((doc) => {
            let data = doc.data();
            data.id = doc.id;
            resolve(data);
        });
    });
}
export const replyEmail = (mailID, data, from) => {
    return new Promise((resolve, reject)=>{
        const mail = mailRef.doc(mailID);
        mail.get().then((doc) => {
            console.log(doc)
            let replies = doc.data().replies;
            let reply = {
                files : data.files,
                content : data.content,
                email : from,
                replyDate: new Date().getTime()
            }
            if (replies == null || replies == undefined){
                replies = [ reply ]
            } else replies.push(reply)
            mail.update({
                replies : replies
            }).then(()=> {
                takeAction(mailID, from, 'comment')
                resolve();
            })
            .catch(()=>reject())
        });
    });
}
export const saveAccount = (email,firstName,lastName) => {
    return new Promise((resolve, reject) => {
        console.log(firstName + " "+lastName)
        userRef.get().then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                if(email === doc.data()){
                    resolve();
                    return;
                }
            });
            userRef.add({
                email,
                firstName,
                lastName
            }).then(() => resolve())
            .catch(() => reject());
        });
    })
}
// save edit name , surname
export const saveEditName = (email , firstName ) => {
    return new Promise((resolve , reject) => {
        userRef.get().then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                if(email === doc.data().email){
                    // console.log("sucess")
                    userRef.doc(doc.id).set({
                        email : email,
                        firstName : firstName,
                        lastName : doc.data().lastName
                    }).then(() => resolve())
                    .catch((e) => reject(e));
                }
            });
        });
    })
}
export const saveEditSurname = (email , lastName  ) => {
    return new Promise((resolve , reject) => {
        userRef.get().then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                if(email === doc.data().email){
                    userRef.doc(doc.id).set({
                        email : email,
                        firstName : doc.data().firstName,
                        lastName : lastName
                    }).then(() => resolve())
                    .catch((e) => reject(e));
                }
            });
        });
    })
    
}
export const saveEditBoth = (email ,firstName , lastName ) => {
    return new Promise((resolve , reject) => {
        userRef.get().then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                if(email === doc.data().email){
                    userRef.doc(doc.id).update({
                        email : email,
                        firstName : firstName,
                        lastName : lastName
                    }).then(() => resolve())
                    .catch((e) => reject(e));
                }
            });
        });
    })
}
export const getAllUser = () => {
    return new Promise((resolve, reject) => {
        userRef.get().then((querySnapshot) => {
            let users = [];
            let usersString = [];
            querySnapshot.forEach(function (doc) {
                let user = doc.data();
                users.push(user);
                usersString.push(user.email)
            });
            resolve(users);
        }).catch(() => reject());
    });
}
export const getUserName = (email) => {
    return new Promise((resolve, reject) => {
        // const option = {
        //     email: email
        // }
        // console.log(email)
        userRef.where("email", "==", email).get().then((querySnapshot) => {
            let user = {};
            // let usersString = [];
            querySnapshot.forEach(function(doc) {
                user = doc.data();
            });
            // querySnapshot.forEach(function (doc) {
            //     let user = doc.data();
            //     users.push(user);
            //     usersString.push(user.email)
            // });
            resolve(user);
        }).catch((e) => reject(e));
    });
}
export const takeAction = (mail,user,action,to) => {
    return new Promise((resolve, reject) => {
        // console.log(action)
        if( action === 'accept' ){
            
        }
        else if (action === 'reject'){
            
        }
        else if (action === 'assign'){
            action = 'assign to ' + to
        }
        if( action === 'read' ){
            for (let i in mail.actions) {
                if (mail.actions[i].action === 'read' && mail.actions[i].email == user.email) {
                    return
                }
            }
        }
        takeActiontoDB(mail.id, user.email, action).then(()=>{
            if(to) mailer(user.email, to, action);
            else mailer(user.email, mail.from, action);
            resolve();
        }).catch(()=>{
            reject();
        });
    })
}
export const assignTo = (Mail, user, assignto) => {
    return new Promise((resolve, reject) => {
        const mail = mailRef.doc(Mail.id);
        mail.get().then((doc) => {
            const mailDetail = doc.data();
            let newAllTo = ''
            let oldAllTo = mailDetail.allTo;
            if (oldAllTo){
                newAllTo = oldAllTo + ',' + assignto
            } else newAllTo = assignto

            console.log(mailDetail.to);
            let allAssigned = mailDetail.to.split(',');
            allAssigned.splice(allAssigned.indexOf(user.email), 1);
            allAssigned.push(assignto);
            assignto = allAssigned.join();
            mail.update({
                "to": assignto,
                "allTo": newAllTo
            }).then(() => {
                takeAction(Mail, user, 'assign', assignto);
                resolve();
            })
            .catch(() => reject())
        });
    });
}
export const setStatusTo = (Mail, user, status) => {
    return new Promise((resolve, reject) => {
        const mail = mailRef.doc(Mail.id);
        mail.get().then((doc) => {
            mail.update({
                "status": status
            }).then(() => {
                takeAction(Mail, user, "set status to " + status)
                resolve();
            })
            .catch(() => reject())
        });
    });
}
export const acceptReject = (Mail, user , action) => {
    return new Promise((resolve, reject) => {
        const mail = mailRef.doc(Mail.id);
        mail.get().then((doc) => {
            let data = doc.data();
            
            let allAssigned = data.to.split(',');
            allAssigned.splice(allAssigned.indexOf(user.email), 1);
            allAssigned.push(data.from);
            let assignto = allAssigned.join();

            mail.update({
                "to": assignto
            }).then(() => {
                takeAction(Mail, user, action)
                resolve();
            }).catch(() => reject())
        });
    });
}
export const newUploadFile = (Mail, File, user) => {
    return new Promise((resolve, reject) => {
        console.log(Mail);
        const mail = mailRef.doc(Mail.id);
        File.uploadDate = new Date().getTime();
        mail.get().then((doc) => {
            let data = doc.data();
            let newFiles = {};
            if(typeof data.files === 'object'){
                let oldFiles = data.files;
                newFiles = oldFiles;
                newFiles.push(File);
            } else newFiles = [File];
            mail.update({
                files: newFiles
            }).then(() => {
                ETHSetFile(Mail.id, File).then(() => {
                    swal('สำเร็จ', 'อัพโหลดสู่ Ethereum-Swarm สำเร็จ', 'success');
                    iziToast.success({
                        title: 'สำเร็จ',
                        message: 'อัพโหลดสู่ Ethereum-Swarm สำเร็จ',
                    });
                })
                takeAction(Mail, user, 'upload ' + File.name)
                resolve();
            }).catch(() => reject())
        });
    });
}

const doSomething = () => new Promise((resolve, reject) => {
    
});