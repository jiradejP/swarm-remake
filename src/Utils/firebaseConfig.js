const firebase = require("firebase");

// firebase พี่พีท-พี่เก้า

// const config = {
//     apiKey: "AIzaSyCTI3R2Dk54gH524tGkJkVNcpEY83kXvM0",
//     authDomain: "swarmproject-ee7ea.firebaseapp.com",
//     databaseURL: "https://swarmproject-ee7ea.firebaseio.com",
//     projectId: "swarmproject-ee7ea",
//     storageBucket: "swarmproject-ee7ea.appspot.com",
//     messagingSenderId: "1001016952963"
// };

// firebase ของเรา

const config = {
    apiKey: "AIzaSyD3eLPeDa41Ov_XxTnDgvOPiGjtjsYJF24",
    authDomain: "edocumentswarm.firebaseapp.com",
    databaseURL: "https://edocumentswarm.firebaseio.com",
    projectId: "edocumentswarm",
    storageBucket: "edocumentswarm.appspot.com",
    messagingSenderId: "334733433454"
  };

// firebase ของ swarm.document@gmail.com
// const config = {
//     apiKey: "AIzaSyASFkwNxrjF0ys0eRrOmF_In_fXRy7oDOY",
//     authDomain: "swarm-mail-on-blockchain-2019.firebaseapp.com",
//     databaseURL: "https://swarm-mail-on-blockchain-2019.firebaseio.com",
//     projectId: "swarm-mail-on-blockchain-2019",
//     storageBucket: "swarm-mail-on-blockchain-2019.appspot.com",
//     messagingSenderId: "542850025609",
//     appId: "1:542850025609:web:6c297e190428bad8"
//   };

firebase.initializeApp(config);