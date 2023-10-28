const firebase = require("firebase/app");
require("firebase/auth");

// Initialize Firebase (replace placeholders with your actual Firebase project configuration)
const firebaseConfig = {
  apiKey: "AIzaSyCBifZJX3PdlX-rplxV8NC6NItIG_dCTEM",
  authDomain: "lifeline-edu-site.firebaseapp.com",
  projectId: "lifeline-edu-site",
  storageBucket: "lifeline-edu-site.appspot.com",
  messagingSenderId: "1059969595497",
  appId: "1:1059969595497:web:5e6ee511c2174333ec8af8",
};

firebase.initializeApp(firebaseConfig);

// ...

// Authenticate the user using Firebase Authentication
firebase
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Password is correct, user is authenticated
    var user = userCredential.user;
    res.status(200).json({ message: "Authentication successful" });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.error("Error authenticating user:", error);
    res.status(401).json({ error: "Authentication failed" });
  });

// Initialize Firebase
// initializeApp(firebaseConfig);
// const db = firestore();
// const User = db.collection("Users");
// export default User;

// const auth = getAuth(fire);

// admin
//   .auth()
//   .getUserByEmail(email)
//   .then((userRecord) => {
//     if (userRecord) {
//       return userRecord.uid;
//     } else {
//       console.log("User does not exist with email:", email);
//       res.status(401).json({ error: "Authentication failed" });
//     }
//   })
//   .then(() => {
//     // Password is correct, user is authenticated
//     res.status(200).json({ message: "Authentication successful" });
//   })
//   .catch((error) => {
//     console.error("Error authenticating user:", error);
//     res.status(401).json({ error: "Authentication failed" });
//   });

// 1//03yuwnqcaDvtcCgYIARAAGAMSNwF-L9Ir8aIcA6-lcNB_TEaR3SAb5_ePE9AOenWjjfYHzVRk3DGeNBFWT8QGaqco_k6yT64apGg
