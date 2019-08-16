const   express = require('express'),
        app = express(),
        upload = require('express-fileupload'),
        bodyParser = require('body-parser'),
        cors = require('cors'),
        PORT = 4000,
        exec = require('child_process').exec;
        pdfUtil = require('pdf-util'),
        solrTextRoutes = require('./solrText.route'),
        solrNumRoutes = require('./solrNum.route'),
        detect = require('detect-file-type'),
        pdf = require('pdf-extract'),
        nodemailer = require('nodemailer');

const options = {
    type: 'ocr', // perform ocr to get the text within the scanned image
    clean: false, // keep the single page pdfs created during the ocr process
    ocr_flags: [
        '-l tha+eng',
        '-psm 1'
    ]
}

app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    next();
});
//CORS middleware
// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');

//     next();
// }
// app.use(allowCrossDomain);
//...
app.use(upload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true }));

app.use('/solrText', solrTextRoutes);
app.use('/solrNum', solrNumRoutes);

app.post('/content', (req, res) => {
    const processor = pdf(req.files.file.tempFilePath, options, function(err) {
        if (err) {
          return callback(err);
        }
      });
      processor.on('complete', function(data) {
        console.log(data.text_pages, 'extracted text pages');
        res.send(data.text_pages)
      });
      processor.on('error', function(err) {
        console.log(err)
      });
})

app.post('/sendMail', async function (req, res) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: "swarm.document@gmail.com", // generated ethereal user
            pass: "swarm2562" // generated ethereal password
        }
    });
    let info = await transporter.sendMail({
        from: '"no-reply from Swarm Mail" <swarm.document@gmail.com>', // sender address
        to: req.body.receivers, // list of receivers
        // to: "thunderman369@hotmail.com", // list of receivers
        subject: "จากระบบเอกสารสารบรรณภาค cs มีเอกสารส่งถึงคุณ ", // Subject line
        text: "", // plain text body
        html: "<b>เรื่อง "+req.body.title+"</b><br> มีเอกสารส่งถึงคุณ จากคุณ"+req.body.name+" "+req.body.surname+"<br>("+req.body.senders+") <br> หมายเลขเอกสาร : "+req.body.id+" <br> ดูรายละเอียดเอกสารคลิ้กที่ลิ้งค์<br><a href='"+req.body.link+"'>www.E-Document.com</a> "// html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return res.send(info);
})

app.post('/sendMailComment', async function (req, res) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: "swarm.document@gmail.com", // generated ethereal user
            pass: "swarm2562" // generated ethereal password
        }
    });

    let info = await transporter.sendMail({
        from: '"no-reply from Swarm Mail" <swarm.document@gmail.com>', // sender address
        to: req.body.receivers.toString(), // list of receivers
        // to: "thunderman369@hotmail.com", // list of receivers
        subject: "จากระบบเอกสารสารบรรณภาค cs มีผู้แสดงความคิดเห็นในเอกสารของคุณ", // Subject line
        text: "", // plain text body
        html: "มีผู้แสดงความคิดเห็นในเอกสาร '"+req.body.comment+"'"// html body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return res.send(info);
})

app.post('/sendMailUpload', async function (req, res) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: "swarm.document@gmail.com", // generated ethereal user
            pass: "swarm2562" // generated ethereal password
        }
    });
    let info = await transporter.sendMail({
        from: '"no-reply from Swarm Mail" <swarm.document@gmail.com>', // sender address
        to: req.body.receivers.toString(), // list of receivers
        // to: "thunderman369@hotmail.com", // list of receivers
        subject: "จากระบบเอกสารสารบรรณภาค cs เอกสารของคุณมีการอัพโหลดไฟล์", // Subject line
        text: "", // plain text body
        html: "เอกสารของคุณมีการอัพโหลดไฟล์ จาก"+req.body.senders+"<br>ที่หมายเลขเอกสาร : "+req.body.id+" <br> ดูรายละเอียดเอกสารคลิ้กที่ลิ้งค์<br><a href='"+req.body.link+"'>www.E-Document.com</a>"// html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return res.send(info);
})

app.post('/sendMailAssign', async function (req, res) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: "swarm.document@gmail.com", // generated ethereal user
            pass: "swarm2562" // generated ethereal password
        }
    });
    let info = await transporter.sendMail({
        from: '"no-reply from Swarm Mail" <swarm.document@gmail.com>', // sender address
        to: req.body.receivers.toString(), // list of receivers
        // to: "thunderman369@hotmail.com", // list of receivers
        subject: "จากระบบเอกสารสารบรรณภาค cs มีเอกสารมอบหมายถึงคุณ", // Subject line
        text: "", // plain text body
        html: "มีเอกสารมอบหมายถึงคุณ จาก "+req.body.senders+"<br>ที่หมายเลขเอกสาร : "+req.body.id+" <br> ดูรายละเอียดเอกสารคลิ้กที่ลิ้งค์<br><a href='"+req.body.link+"'>www.E-Document.com</a>"// html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return res.send(info);
})

//not in use

app.post('/sendMailAccept', async function (req, res) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: "swarm.document@gmail.com", // generated ethereal user
            pass: "swarm2562" // generated ethereal password
        }
    });
    let info = await transporter.sendMail({
        from: '"no-reply from Swarm Mail" <swarm.document@gmail.com>', // sender address
        to: req.body.receivers.toString(), // list of receivers
        // to: "thunderman369@hotmail.com", // list of receivers
        subject: "จากระบบเอกสารสารบรรณภาค cs เอกสารของคุณได้ถูกอนุมัติ", // Subject line
        text: "", // plain text body
        html: "เอกสารของคุณได้ถูกอนุมัติ จาก "+req.body.senders+"<br>ที่หมายเลขเอกสาร : "+req.body.id+" <br> ดูรายละเอียดเอกสารคลิ้กที่ลิ้งค์<br><a href='"+req.body.link+"'>www.E-Document.com</a>"// html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return res.send(info);
})

app.post('/sendMailReject', async function (req, res) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: "swarm.document@gmail.com", // generated ethereal user
            pass: "swarm2562" // generated ethereal password
        }
    });
    let info = await transporter.sendMail({
        from: '"no-reply from Swarm Mail" <swarm.document@gmail.com>', // sender address
        to: req.body.receivers.toString(), // list of receivers
        // to: "thunderman369@hotmail.com", // list of receivers
        subject: "จากระบบเอกสารสารบรรณภาค cs เอกสารของคุณได้ถูกปฏิเสธ", // Subject line
        text: "", // plain text body
        html: "เอกสารของคุณได้ถูกปฏิเสธ จาก "+req.body.senders+"<br>ที่หมายเลขเอกสาร : "+req.body.id+" <br> ดูรายละเอียดเอกสารคลิ้กที่ลิ้งค์<br><a href='"+req.body.link+"'>www.E-Document.com</a>"// html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return res.send(info);
})

app.post('/sendMailCancel', async function (req, res) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: "swarm.document@gmail.com", // generated ethereal user
            pass: "swarm2562" // generated ethereal password
        }
    });
    let info = await transporter.sendMail({
        from: '"no-reply from Swarm Mail" <swarm.document@gmail.com>', // sender address
        to: req.body.receivers.toString(), // list of receivers
        // to: "thunderman369@hotmail.com", // list of receivers
        subject: "จากระบบเอกสารสารบรรณภาค cs เอกสารของคุณได้ถูกยกเลิก", // Subject line
        text: "", // plain text body
        html: "เอกสารของคุณได้ถูกยกเลิก จาก "+req.body.senders+"<br>ที่หมายเลขเอกสาร : "+req.body.id+" <br> ดูรายละเอียดเอกสารคลิ้กที่ลิ้งค์<br><a href='"+req.body.link+"'>www.E-Document.com</a>"// html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return res.send(info);
})


function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

app.listen(PORT, function () { 
 console.log('Server is runnning on Port:',PORT,'!!!'); 
});
