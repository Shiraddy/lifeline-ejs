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
const session = require("express-session");
const http = require("https");
const nodemailer = require("nodemailer");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cookieParser());
app.use(
  session({
    secret: "dgjlgjl524523",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Adjust options as needed
  })
);

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
  storageBucket: "gs://lifeline-edu-site.appspot.com",
});

const db = admin.firestore();
const auth = admin.auth();
// const bucket = admin.storage().bucket();
const bucket = getStorage().bucket();

// Initialize Firebase (if you haven't already done this)
const firebaseConfig = {
  apiKey: "AIzaSyCBifZJX3PdlX-rplxV8NC6NItIG_dCTEM",
  authDomain: "lifeline-edu-site.firebaseapp.com",
  projectId: "lifeline-edu-site",
  storageBucket: "gs://lifeline-edu-site.appspot.com/",
  // storageBucket: "lifeline-edu-site.appspot.com",
  messagingSenderId: "1059969595497",
  appId: "1:1059969595497:web:5e6ee511c2174333ec8af8",
};

firebase.initializeApp(firebaseConfig);

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
const tutorRef = db.collection("Tutor Application").get();
// console.log(tutorRef);

//Middleware to check login state
// app.use((req, res, next) => {
//   if (req.path !== "/login" && !req.session.isLoggedIn) {
//     return res.redirect("/login"); // Redirect to the login page if not logged in
//   } else {
//     next();
//   }
// });

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

//SIGN UP
app.get("/signup", function (req, res) {
  res.render("signup");
});

//REFACTOR
app.get("/refactor", function (req, res) {
  res.render("refactor");
});

//COUNSELLING
app.get("/counselling", function (req, res) {
  res.render("counselling");
});

//CONSULTANCY
app.get("/consultancy", function (req, res) {
  res.render("consultancy");
});

app.get("/post", function (req, res) {
  res.render("post-request");
});

// Admin Page
let tutors;
let applications;
app.get("/admin", async function (req, res) {
  try {
    // Database Query
    const application = await db
      .collection("Tutor Applications")
      .where("category", "==", "applicant")
      .get();

    const tutor = await db
      .collection("Tutor Applications")
      .where("category", "==", "tutor")
      .get();

    const applications = [];
    const tutors = [];

    // Store the applications data in the variable
    application.forEach((doc) => {
      applications.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    // Store the tutor data in the variable

    if (tutor.empty) {
      console.log("No matching tutor documents.");
      return;
    }

    tutor.forEach((doc) => {
      tutors.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    // console.log(tutors);

    const noOfApplicants = applications.length;
    const noOfTutors = tutors.length;

    res.render("admin", {
      dayOfWeek: date, // Define 'date' elsewhere in your code
      todo: todoLists, // You need to define todoLists
      applicants: noOfApplicants,
      applications: applications,
      noOfTutors: noOfTutors,
      tutors: tutors, // Add the tutors data to the template
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle DELETE requests to delete an application by ID
app.delete("/admin/delete/:id", async function (req, res) {
  const applicationId = req.params.id;

  try {
    // Use the applicationId to delete the application from the database
    await db.collection("Tutor Applications").doc(applicationId).delete();

    res.status(204).send(); // 204 No Content response, indicating successful deletion
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle GET requests to fetch details of an application by ID
app.get("/admin/details/:id", async function (req, res) {
  const applicationId = req.params.id;

  try {
    // Retrieve the application details from the database based on the provided ID
    const applicationDoc = await db
      .collection("Tutor Applications")
      .doc(applicationId)
      .get();

    if (!applicationDoc.exists) {
      // If the document does not exist, return a 404 status code
      res.status(404).json({ error: "Application not found" });
    } else {
      const applicationData = applicationDoc.data();
      // Send the application details as a JSON response
      res.json(applicationData);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle POST requests to update an application by ID
app.post("/admin/update/:id", async function (req, res) {
  const applicationId = req.params.id;
  const updatedData = req.body;

  try {
    await db
      .collection("Tutor Applications")
      .doc(applicationId)
      .update(updatedData);

    res.status(200).json({ message: "Application updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// console.log(applications);

// app.get("/admin/:update", function (req, res) {
//   let typed = _.lowerCase(req.params.update);
//   console.log(typed);
//   res.send("Admin params seen");
// });

app.post("/message", async function (req, res) {
  const messageData = req.body;
  try {
    const messageRef = await db.collection("Messages").add(messageData); // Use add() to add a new document with the message data
    console.log("Message added with ID: ", messageRef.id);
    res.render("post-message"); // Render a success page or response
  } catch (error) {
    console.error("Error Sending Message:", error);
    res.status(500).json({ error: "Error Sending Message" }); // Respond with an error status and message
  }
});

//EMAIL POST REQUEST
var tutorEmail;
app.post("/email", async function (req, res) {
  let email = req.body;
  let date = email.date;
  let subject = email.subject;
  let message = email.message;
  let who = email.sendTo;

  try {
    // Database Query
    // let applicantEmailAddresses = await db
    //   .collection("Tutor Applications")
    //   .where("category", "==", "applicant")
    //   .get();
    // // Store the applications data in the variable
    // applicantEmailAddresses.forEach((doc) => {
    //   applicantEmail.push({
    //     id: doc.id,
    //   });
    // });
    // let allEmails = await db.collection("Tutor Applications").get();
    // allEmails.forEach((doc) => {
    //   all.push({
    //     id: doc.id,
    //   });
    // });
    // let tutorEmailAddresses = await db
    //   .collection("Tutor Applications")
    //   .where("category", "==", "tutor")
    //   .get();
    // tutorEmailAddresses.forEach((doc) => {
    //   tutorEmail.push({
    //     id: doc.id,
    //   });
    // });
    // let tutorEmail = [];
    // let applicantEmail = [];
    // let all = [];
    // console.log(tutorEmail);
    // const email = await db.collection("Email").add(email);
    // console.log(tutors);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Tutor Application
app.post("/apply", upload.single("profilePicture"), async (req, res) => {
  const { email, password } = req.body;
  const firstName = req.body.firstName;
  const subject = "Lifeline Tutor Application";

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

    // console.log("Successfully retrieved or created user:", userRecord);

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
        category: "applicant",
        status: "active",
        comment: " ",
      };

      if (req.file) {
        const profilePicture = req.file;

        // Upload the profile picture to Firebase Storage
        const profilePictureFilename = `profile-pictures/${email}/${profilePicture.originalname}`;
        const profilePictureFile = bucket.file(profilePictureFilename);
        const profilePictureStream = profilePictureFile.createWriteStream({
          metadata: {
            contentType: profilePicture.mimetype,
          },
        });

        profilePictureStream.on("error", (err) => {
          console.error(err);
          res.status(500).send("Error uploading profile picture");
        });

        profilePictureStream.on("finish", () => {
          console.log("Profile picture uploaded");

          // Add the profile picture URL to the Firestore data
          updatedApplicant.profilePictureURL = profilePictureFilename;
          Application.set(updatedApplicant);
        });

        profilePictureStream.end(profilePicture.buffer);
      } else {
        Application.set(updatedApplicant);
      }
    }

    // Check if a profile picture file was uploaded

    // Define the email template with a placeholder for the applicant's name
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LIFELINE EMAIL</title>
        <style>
          /* Custom email styles */
          .email {
            max-width: 600px; /* Set a maximum width for the email content */
            margin: 0 auto;   /* Center the email content */
            padding: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email">
          <p class="mb-4">Dear ${firstName},</p>

          <p>
            We want to express our gratitude for your application to join our tuition service as a tutor. Your dedication and the effort you've put into your application have not gone unnoticed.
          </p>

          <p>
            We have received your application and are in the process of reviewing it. We understand the importance of your qualifications and experience, and we are excited about the possibility of having you join our team.
          </p>

          <p>
            Our selection process is thorough, and it includes reviewing applications and conducting interviews. If you are selected for an interview, we will reach out to you in the coming weeks to coordinate a suitable date and time.
          </p>

          <p>
            We kindly ask for your patience during this process, as we have received a high number of applications. If you have any questions or concerns, please don't hesitate to reach out to us at
            <a href="tel:0246011004">0246011004</a> or
            <a href="tel:0243934353">0243934353</a>.
          </p>

          <p class="mt-4">
            Regards,<br />Lifeline Educational Solution Limited.
          </p>
        </div>
      </body>
      </html>
    `;

    const applicantName = firstName;
    const personalizedEmail = emailTemplate.replace(
      /{applicantName}/g,
      applicantName
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lifelineedusolutions@gmail.com",
        pass: "hazw czvg ijak uigj",
      },
    });

    const mailOptions = {
      from: "lifelineedusolutions@gmail.com",
      to: email,
      subject: subject,
      html: personalizedEmail,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log("Email sent: " + info.response);
      }
    });

    res.render("received", { applicant: firstName });
  } catch (error) {
    console.error("Error creating/updating user data:", error);
    res
      .status(500)
      .json({ error: "Application Failed, Check Your Internet and Try Again" });
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

    req.session.isLoggedIn = true;
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

app.get("/logout", (req, res) => {
  res.clearCookie("sessionID");
  res.redirect("/login");
});

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
app.post("/form", async function (req, res) {
  try {
    let contract = req.body;
    let contact = contract.contact;
    let otherContact = contract.emergencyContactNumber;
    let weeklySession = contract.weeklySession;
    let level = contract.level;
    let email = contract.email;
    let stage = contract.class;
    let parent = contract.parent;
    let student = contract.student;
    let mode = contract.modeOfTeaching;
    let monthlySession = Number(contract.weeklySession) * 4;
    let periodLength = Number(contract.periodLength);
    var pricePerLesson;

    if (mode == "person" && periodLength == 3) {
      pricePerLesson = 15;
    } else if (mode == "person" && periodLength == 2.5) {
      pricePerLesson = 16;
    } else if (mode == "person" && periodLength == 2) {
      pricePerLesson = 18;
    } else if (mode == "person" && periodLength == 1.5) {
      pricePerLesson = 20;
    } else {
      pricePerLesson = 25;
    }

    var totalPrice = monthlySession * periodLength * pricePerLesson;

    const request = db.collection("Request For Tutor").doc();

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

    const requestData = {
      category: "request",
      status: "",
      tutor: "",
      pastTutors: [],
      fees: totalPrice,
      ...filteredData, // Include the filtered data fields
    };

    // Use a try-catch block for Firestore operations
    try {
      await request.set(requestData);
      res.render("post-request", {
        parent: parent,
        student: student,
      });

      // ... (rest of the code for sending the email)
    } catch (error) {
      console.error("Error writing to Firestore:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }

    // Define the email template with a placeholder for the applicant's name
    const emailTemplate = `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LIFELINE EMAIL</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    integrity="sha384-rHyoN1iRsVXV4nD0JutelWpjoudMwe3N6bZ/xq5t8UEBpIboFMI7xjBOhFp6M9xj"
    crossorigin="anonymous">
  <style>
    /* Custom email styles */
    .email {
      max-width: 600px; /* Set a maximum width for the email content */
      margin: 0 auto;   /* Center the email content */
      padding: 20px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="email text-center">
      <p class="mb-4">Dear ${parent},</p>

      <p>
        We have received a formal request for a tutor, and the pertinent details
         are as follows:
      </p>

      <div class="my-2">
        <p>Name of Client: ${parent}</p>
        <p>Client Contact: <a href="tel:${contact}">${contact}</a></p>
        <p>Emergency Contact: <a href="tel:${otherContact}">${otherContact}</a></p>
        <p>Email: <a href="mailto:${email}">${email}</a></p>
        <p>Charges: ${totalPrice}</p>
      </div>

      <div class="mb-2">
        <p>Name of Ward: ${student}</p>
        <p>Level of Ward: ${level}</p>
        <p>Class of Ward: ${stage}</p>
        <p>Lesson Duration: ${periodLength}</p>
        <p>Sessions Per Week: ${weeklySession}</p>
      </div>

      <p class="my-2">Kindly attend to it.</p>
      <p class="mt-4">
        Regards.
      </p>
    </div>
  </div>
</body>

</html>

    `;
    const personalizedEmail = emailTemplate
      .replace(/\${client}/g, parent)
      .replace(/\${otherContact}/g, otherContact)
      .replace(/\${student}/g, student)
      .replace(/\${level}/g, level)
      .replace(/\${stage}/g, stage)
      .replace(/\${weeklySession}/g, weeklySession)
      .replace(/\${duration}/g, periodLength)
      .replace(/\${fee}/g, totalPrice)
      .replace(/\${contact}/g, contact)
      .replace(/\${email}/g, email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lifelineedusolutions@gmail.com",
        pass: "hazw czvg ijak uigj",
      },
    });

    const mailOptions = {
      from: "lifelineedusolutions@gmail.com",
      to: "lifelineedusolutions@gmail.com",
      cc: "shirazadnan53@gmail.com",
      subject: "Request For Tutor",
      html: personalizedEmail,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(400).json({ success: false, message: "Bad Request" });
  }
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

//Random word with definition Api
// const quotes = {
//   method: "GET",
//   hostname: "random-words-with-pronunciation.p.rapidapi.com",
//   port: null,
//   path: "/word",
//   headers: {
//     "X-RapidAPI-Key": "6aa49fe548mshb15e91fba5dcfe0p1c875bjsnc34566ffe4f8",
//     "X-RapidAPI-Host": "random-words-with-pronunciation.p.rapidapi.com",
//   },
// };

// const request = http.request(quotes, function (res) {
//   const chunks = [];

//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on("end", function () {
//     const body = Buffer.concat(chunks);
//     console.log(body.toString());
//   });
// });

// request.end();

//Online and Local Server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is Running");
});
