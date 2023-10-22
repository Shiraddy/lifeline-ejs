//Express JS
const express = require("express");
const app = express();
const ejs = require("ejs");
app.use(express.static("public"));
app.set("view engine", "ejs");
const path = require("path");
const validator = require("validator");
const firebase = require("firebase/app");
require("firebase/auth");
const createPopper = require("@popperjs/core");
const cors = require("cors");
app.use(cors());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Lodash
var _ = require("lodash");
// var _ = require("lodash/core");
var array = require("lodash/array");
var object = require("lodash/fp/object");

//FireBase
var admin = require("firebase-admin");
var serviceAccount = require("./service account.json");
const { getStorage } = require("firebase-admin/storage");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "lifeline-edu-site.appspot.com",
});

const db = admin.firestore();
const auth = admin.auth();
const bucket = getStorage().bucket("profilePics");
// const bucket = getStorage().bucket();

// Initialize Firebase (if you haven't already done this)
const firebaseConfig = {
  apiKey: "AIzaSyCBifZJX3PdlX-rplxV8NC6NItIG_dCTEM",
  authDomain: "lifeline-edu-site.firebaseapp.com",
  projectId: "lifeline-edu-site",
  storageBucket: "lifeline-edu-site.appspot.com",
  messagingSenderId: "1059969595497",
  appId: "1:1059969595497:web:5e6ee511c2174333ec8af8",
};

firebase.initializeApp(firebaseConfig);

// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
// or firebase.auth.Auth.Persistence.SESSION
// or firebase.auth.Auth.Persistence.NONE

//Body-Parser
const bodyParser = require("body-parser");
const { title } = require("process");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Date and Time
var options = {
  month: "long",
  day: "numeric",
  year: "numeric",
  weekday: "short",
};
var today = new Date();
var date = today.toLocaleDateString("en-US", options);

//Constants
// const contracts = [];

const todoLists = ["Prepare for Work"];

//Serving Up WebPages
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/tuition", async function (req, res) {
  res.render("tuition");
});

//Tutor Application
app.get("/apply", function (req, res) {
  res.render("apply");
});

//Tutor Login
app.get("/login", async function (req, res) {
  // const snapshot = await db.collection("users").get();
  // snapshot.forEach((doc) => {
  //   console.log(doc.id, "=>", doc.data());
  // });
  res.render("login");
});

//Client Form
app.get("/form", function (req, res) {
  res.render("form");
});

// FAQ Page
app.get("/faq", function (req, res) {
  res.render("faq");
});

//Tutor Profile under Production
// app.get("/tutor", function (req, res) {
//   res.render("tutor");
// });

//SIGN UP
app.get("/signup", function (req, res) {
  res.render("signup");
});

// Admin Page
let applications;
let tutors;
app.get("/admin", async function (req, res) {
  // Database Query
  const application = await db.collection("Tutor Applications").get();

  // Store the applications data in the variable
  applications = [];
  tutors = [];
  application.forEach((doc) => {
    applications.push({
      id: doc.id,
      data: doc.data(),
    });
  });

  res.render("admin", {
    dayOfWeek: date,
    todo: todoLists, // You need to define todoLists
    applications: applications,
  });
});

// console.log(applications);

app.get("/admin/:update", function (req, res) {
  let typed = _.lowerCase(req.params.update);
  console.log(typed);
  res.send("Admin params seen");
});

app.post("/message", function (req, res) {
  res.send("I can hear you");
});

app.get("/error", function (req, res) {
  res.render("refactor");
});

//Tutor Application
app.post("/apply", async (req, res) => {
  const { email, password } = req.body;

  try {
    let userRecord;
    let isNewUser = false;

    try {
      // Check if the user already exists in Firebase Authentication
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        // If the user doesn't exist in Authentication, create a new user
        userRecord = await admin.auth().createUser({
          email,
          password,
        });
        isNewUser = true;
      } else {
        throw error; // Re-throw the error for other cases
      }
    }

    console.log("Successfully retrieved or created user:", userRecord);

    const collection = db.collection("Tutor Applications"); // Create Collection
    const Application = collection.doc(email); // Create Document

    // Check if the user's data already exists in Firestore
    const existingData = (await Application.get()).data();

    if (!existingData || isNewUser) {
      // Only update Firestore data if the user doesn't have data in Firestore or is a new user
      // Filter and prepare data to be stored in Firestore
      const filteredData = {};
      for (const key in req.body) {
        if (
          req.body[key] !== null &&
          req.body[key] !== undefined &&
          req.body[key] !== ""
        ) {
          filteredData[key] = req.body[key];
        }
      }

      // Data to be stored in Firestore
      const updatedApplicant = {
        uid: userRecord.uid,
        applicationDate: new Date(),
        email: email,
        emailVerification: userRecord.emailVerified,
        ...filteredData, // Include the filtered data fields
        category: "D",
        rating: 0,
        status: "applicant",
        comment: " ",
      };

      // Set the data in Firestore
      await Application.set(updatedApplicant);
    }

    res.send("File Sent");
  } catch (error) {
    console.error("Error creating/updating user data:", error);
    res.status(500).json({ error: "Failed to create/update user data" });
  }
});

//Login Page Credentials
let contracts;
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    console.log("Invalid email address");
    return res.render("login");
  }

  const sanitizedPassword = sanitizePassword(password);

  try {
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, sanitizedPassword);
    const user = userCredential.user;

    const profile = db.collection("Tutor Applications").doc(email);

    const doc = await profile.get();

    // Database Query
    const offers = await db.collection("Offers").get();

    // Store the applications data in the variable
    contracts = [];
    offers.forEach((doc) => {
      contracts.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    // console.log(contracts);

    if (!doc.exists) {
      console.log("No such document!");
    } else {
      // console.log("Document data:", doc.data());
      let profileData = doc.data();
      let fullName = profileData.lastName + " " + profileData.firstName;
      let profileName = fullName.toUpperCase();
      // console.log(profileName);
      // console.log("ProfileData:", profileData);
      res.render("tutor", {
        profileName: profileName,
        fullName: fullName,
        profile: profileData,
        offers: contracts,
        // profile: profileData,
      });
    }
  } catch (error) {
    console.error("Login Failed:", error.message);
    let errorMessage = "An error occurred during login. Please try again.";

    // Handle specific error cases
    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "Invalid email address.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password. Please try again.";
        break;
      case "auth/user-not-found":
        errorMessage = "Not a valid account: check your email";
        break;
      // Add more cases as needed for other Firebase errors
    }
    // console.log(errorMessage);
    // res.render("login", { error: errorMessage });
    res.render("login", { email, error: errorMessage });
    // res.status(400).json({ error: errorMessage });
  }
});

// Custom function to sanitize the password
function sanitizePassword(password) {
  // Implement your password sanitization logic here
  return password.trim();
}

//POST CONTRACT
app.post("/contract", async function (req, res) {
  const contractType = req.body;
  const offers = db.collection("Offers").doc();

  try {
    // Assuming "contractType" is an object and you want to store it in the Firestore document.
    await offers.set(contractType);

    res.send("Contract Posted");
  } catch (error) {
    console.error("Error posting contract:", error);
    res.status(500).send("Error posting contract");
  }
});

//NOTICE
let notices;
app.post("/notice", async function (req, res) {
  let notice = req.body;
  // let date = new Date();
  // console.log(notice);
  notice = notices = db.collection("Notices").doc();
  notices = [];

  try {
    await notices.set(notice);

    res.send("Notice has been Posted");
  } catch (error) {
    console.error("Error posting Notice:", error);
    res.status(500).send("Error posting Notice");
  }
});

//Posting Todo List
app.post("/todo", function (req, res) {
  let todo = req.body.todo;
  // console.log(todo);
  todoLists.push(todo);
  res.redirect("admin");
});

// Sign up New User
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  admin
    .auth()
    .createUser({
      email,
      password,
    })
    .then((userRecord) => {
      console.log("Successfully created new user:", userRecord.uid);
      res.status(200).json({ message: "User created successfully" });
    })
    .catch((error) => {
      console.error("Error creating new user:", error);
      res.status(500).json({ error: "Failed to create user" });
    });
});

//CLIENT FORM
app.post("/form", function (req, res) {
  // res.send("Hello There, I can hear you");
  let contract = req.body;
  // console.log(contract);
  let mode = contract.modeOfTeaching;
  let monthlySession = Number(contract.weeklySession) * 4;
  let periodLength = Number(contract.periodLength);

  if (mode == "person" && periodLength === 3) {
    var pricePerLesson = 15;
  } else if (mode == "person" && periodLength === 2.5) {
    var pricePerLesson = 16;
  } else if (mode == "person" && periodLength === 2) {
    var pricePerLesson = 18;
  } else if (mode == "person" && periodLength === 1.5) {
    var pricePerLesson = 20;
  } else {
    var pricePerLesson = 25;
  }

  var totalPrice = monthlySession * periodLength * pricePerLesson;

  res.send("You have agreed to pay " + totalPrice);
});

// READING ENTIRE DOCUMENT
// const snapshot = await db.collection('users').get();
// snapshot.forEach((doc) => {
//   console.log(doc.id, '=>', doc.data());
// });

//READ SINGLE DOC
// const cityRef = db.collection('cities').doc('SF');
// const doc = await cityRef.get();
// if (!doc.exists) {
//   console.log('No such document!');
// } else {
//   console.log('Document data:', doc.data());
// }

//READ SEVERAL DOCS WITH PARAMS
// const citiesRef = db.collection('cities');
// const snapshot = await citiesRef.where('capital', '==', true).get();
// if (snapshot.empty) {
//   console.log('No matching documents.');
//   return;
// }

// snapshot.forEach(doc => {
//   console.log(doc.id, '=>', doc.data());
// });

//Online and Local Server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is Running");
});
