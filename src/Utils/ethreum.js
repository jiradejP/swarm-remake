import $ from 'jquery';
import { peachServer } from './utils.js';

export const ETHSendEmail = (mailDetail, fileObject, mailID) => {
    return new Promise((resolve)=>{
        // console.log('Detail of mail is : ');        
        // console.log(mailDetail);        
        // console.log('Detail of file is : ');
        // console.log(fileObject);
        let data = {
            "id": mailID,
            "from": mailDetail.from,
            "to": mailDetail.to,
            "subject": mailDetail.subject,
            "content": mailDetail.content,
            "createdate": "" + new Date().getTime(),
            "lastact": "",
            "type": "",
            "date": mailDetail.dateOfDocument,
            "num": mailDetail.documentNumber,
            "allto": [mailDetail.from, mailDetail.to].join(),
            "timestamp": new Date().getTime(),
            "fromdoc": mailDetail.fromOfDocumentFrom,
            "fromdocway": mailDetail.fromOfDocumentWay,
            "inbound": mailDetail.inBound_type || "",
            "isprivate": mailDetail.isPrivate,
        }

        $.post(peachServer + "/setemail",
        {
            headers : {
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Origin':'http://127.0.0.1:3000'
            },
            crossDomain: true,
            type: 'POST',
        },
         data, function (data) {
            console.log('Status of setmail is : ')
            console.log(data)
            resolve()
        }, "json");
    });
}
export const ETHSetFile = (mailID, fileObject) => {
    return new Promise((resolve) => {
        let file = {
            "emailid": mailID,
            "filename": fileObject.name,
            "filepath": fileObject.address,
            "uploadDate": "" + fileObject.uploadDate,
            "emailadd": fileObject.email,
            "status": "",
        }
        // console.log('Detail of file is : ');
        // console.log(file);
        $.post(peachServer + "/setfile"
        // {
        //     headers : {
        //         'Access-Control-Allow-Origin':'*'
        //     },
        //     'Access-Control-Allow-Origin': '*',
        //     crossDomain: true,
        //     type: 'POST',
        // }
        , file, function (data) {
            // console.log('Status of setfile is : ')
            // console.log(data)
            
            resolve();
        }, "json");
    });
}
export const ETHSetAction = (mailID, userEmail, actionString) => {
    return new Promise((resolve) => {
        let action = {
            "emailad": userEmail,
            "action": actionString,
            "timestamp": "" + new Date().getTime(),
            "to": "",
            "emailid": mailID,
        }
        console.log('Detail of action is :');
        console.log(action);
        $.post(peachServer + "/setaction"
        // {
        //     headers : {
        //         'Access-Control-Allow-Origin':'*'
        //     },
        //     'Access-Control-Allow-Origin': '*',
        //     crossDomain: true,
        // }
        , action, function (data) {
            console.log('Status of action is : ')
            console.log(data)
            resolve(data)
        }, "json");
    });
}
export const ETHGetEmail = (mailID) => {
    // header('Access-Control-Allow-Origin: *');
    return new Promise((resolve, reject) => {
        $.post(peachServer + "/getemail", { 
            id: mailID ,
            //inserted
            url: peachServer,
            
            headers : {
                'Access-Control-Allow-Origin':'*'
            },
            'Access-Control-Allow-Origin': '*',
            crossDomain: true,
            type: 'POST',
            })
            .done((data) => resolve() )
            .fail((error) => reject() )
    });
}

