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
// const createPopper = require("@popperjs/core");
// const cors = require("cors");
// app.use(cors());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const session = require("cookie-session");
const https = require("https");
const nodemailer = require("nodemailer");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

app.use(cookieParser());

// app.use(
//   session({
//     secret: "dgjlgjl524523",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Adjust options as needed
//   })
// );

app.set("trust proxy", 1);

app.use(
  session({
    cookie: {
      secure: true,
      maxAge: 60000,
    },
    // store: new admin.firestore(),
    secret: "dgjlgjl524523",
    saveUninitialized: true,
    resave: false,
  })
);

// app.use(function (req, res, next) {
//   if (!req.session) {
//     return next(new Error("Oh no")); //handle error
//   }
//   next(); //otherwise continue
// });

//Lodash
var _ = require("lodash");
// var _ = require("lodash/core");
var array = require("lodash/array");
var object = require("lodash/fp/object");

//FireBase
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
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

app.get("/tuition", function (req, res) {
  res.render("tuition");
});

app.get("/about", function (req, res) {
  res.render("about-us");
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
// app.get("/form", function (req, res) {
//   res.render("form");
// });

//Client Form
app.get("/carousel", function (req, res) {
  res.render("carousel");
});

// FAQ Page
app.get("/faq", function (req, res) {
  res.render("faq");
});

//SIGN UP
app.get("/signup", function (req, res) {
  res.render("signup");
});

//CODE OF CONDUCT
app.get("/code", function (req, res) {
  res.render("code");
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

app.get("/lifeline", function (req, res) {
  res.render("lifeline");
});

// Admin Page

let tutors;
let applications;
let prospectData;
let clientData;
app.post("/admin", async function (req, res) {
  const { email, password } = req.body;
  const hardcodedAdminEmail = "lifelineedusolutions@gmail.com";
  const hardcodedAdminPassword = "LES12345";

  try {
    const applications = [];
    const tutors = [];
    const clientData = [];
    const prospectData = [];

    // Check if the provided email and password match the hardcoded admin credentials
    if (email !== hardcodedAdminEmail || password !== hardcodedAdminPassword) {
      throw new Error("Invalid email or password");
    }

    // Simulating a successful login by setting a flag isAdminLoggedIn to true
    // You might want to handle sessions or other authentication mechanisms in a real application
    const isAdminLoggedIn = true;

    if (!isAdminLoggedIn) {
      throw new Error("Failed to log in as admin");
    }

    // Database Query
    const applicationSnapshot = await db
      .collection("Tutor Applications")
      .where("category", "==", "applicant")
      .get();

    const tutorSnapshot = await db
      .collection("Tutor Applications")
      .where("category", "==", "tutor")
      .get();

    const clientsSnapshot = await db
      .collection("Request For Tutor")
      .where("category", "==", "client")
      .get();

    clientsSnapshot.forEach((doc) => {
      clientData.push({
        id: doc.id,
        data: doc.data(),
      });
      // console.log(clientData);
    });

    const prospectsSnapshot = await db
      .collection("Request For Tutor")
      .where("category", "==", "request")
      .get();

    prospectsSnapshot.forEach((doc) => {
      prospectData.push({
        id: doc.id,
        data: doc.data(),
      });
      // console.log(prospectData);
    });

    // console.log(clientData);

    applicationSnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    if (tutorSnapshot.empty) {
      console.log("No matching tutor documents.");
      return;
    }

    tutorSnapshot.forEach((doc) => {
      tutors.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    const noOfContracts = clientData.length;
    const noOfProspects = prospectData.length;
    const noOfApplicants = applications.length;
    const noOfTutors = tutors.length;

    res.render("admin", {
      dayOfWeek: date, // Define 'date' elsewhere in your code
      todo: [], // You need to define todoLists
      applicants: noOfApplicants,
      applications: applications,
      noOfTutors: noOfTutors,
      tutors: tutors,
      clients: clientData,
      noOfContracts: noOfContracts,
      prospects: prospectData,
      noOfProspects: noOfProspects,
    });
  } catch (error) {
    console.error("Login Failed:", error.message);
    // Handle authentication failure
    res.render("lifeline", {
      email,
      error: "Invalid email or password. Please try again.",
    });
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
app.put("/admin/update/:id", async function (req, res) {
  const applicationId = req.params.id;
  const updatedData = req.body;
  const tutor = req.body.firstName;
  const tutor_status = req.body.qualification;
  const email = req.body.rowId;

  try {
    await db
      .collection("Tutor Applications")
      .doc(applicationId)
      .update(updatedData);

    const updateEmail = `
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
        <p class="mb-4">Dear ${tutor},</p>
  
        <p>
          We are writing to officially inform you that your <span class="fw-bolder text-primary">tutor status</span>  with Lifeline Educational Solutions has been updated. Your current tutor status now is as follows:
        </p>

        <div class="mb-2">
        <p>Tutor Status: ${tutor_status}</p>
      </div>

        <p>Please contact management if you have any challenges.</p>
  
       
        <p class="mt-4">
          Regards.
        </p>
      </div>
    </div>
  </body>
  
  </html>
  
      `;
    const personalizedEmail = updateEmail
      .replace(/\${tutor}/g, tutor)
      .replace(/\${tutor_status}/g, tutor_status);

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
      cc: "shirazadnan53@gmail.com",
      subject: "Tutor Status Update",
      html: personalizedEmail,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log("Email sent: " + info.response);
      }
    });

    // Sending a custom success message
    res
      .status(200)
      .json({ message: "Application updated successfully", updated: true });
  } catch (error) {
    console.error("Error:", error); // Log the specific error
    res.status(500).json({ error: "Internal Server Error", updated: false });
  }
});

//Get Prospect List
app.get("/data/prospects", async function (req, res) {
  try {
    const prospectsSnapshot = await db
      .collection("Request For Tutor")
      .where("category", "==", "request")
      .get();

    const prospectData = [];
    prospectsSnapshot.forEach((doc) => {
      prospectData.push(doc.data());
      // console.log(prospectData);
    });
    return res.json(prospectData);
  } catch (error) {
    // Handle server errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/data/clients", async function (req, res) {
  try {
    const prospectsSnapshot = await db
      .collection("Request For Tutor")
      .where("category", "==", "client")
      .get();

    const clientData = [];
    prospectsSnapshot.forEach((doc) => {
      clientData.push(doc.data());
      // console.log(clientData);
    });
    return res.json(clientData);
  } catch (error) {
    // Handle server errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/admin/studentInfo/:id", async function (req, res) {
  const clientId = req.params.id;

  try {
    const studentSnapshot = await db
      .collection("Request For Tutor")
      .doc(clientId)
      .get();

    if (!studentSnapshot.exists) {
      return res.status(404).json({ error: "Student not found" });
    }

    const studentData = studentSnapshot.data();
    return res.json(studentData);
  } catch (error) {
    console.error("Error fetching student:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/admin/contractUpdate/:id", async function (req, res) {
  const clientId = req.params.id;
  const updatedData = req.body;
  // console.log(clientId, updatedData);

  try {
    await db.collection("Request For Tutor").doc(clientId).update(updatedData);

    // Sending a custom success message
    res
      .status(200)
      .json({ message: "Application updated successfully", updated: true });
  } catch (error) {
    res.status(500).json({ error: "Error updating Data", updated: false });
  }
});

//Fetch Prospects Data
// app.get("/admin/details/prospects", async function (req, res) {
//   try {
//     const prospectsSnapshot = await db
//       .collection("Request For Tutor")
//       .where("category", "==", "request")
//       .get();

//     const prospectData = [];
//     prospectsSnapshot.forEach((doc) => {
//       prospectData.push(doc.data());
//       console.log(prospectData);
//     });
//     return res.json(prospectData);
//   } catch (error) {
//     // Handle server errors
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// console.log(applications);

// app.get("/admin/:update", function (req, res) {
//   let typed = _.lowerCase(req.params.update);
//   console.log(typed);
//   res.send("Admin params seen");
// });

app.post("/message", async function (req, res) {
  const messageData = req.body;
  let subject = messageData.subject,
    parent = messageData.name,
    message = messageData.message,
    contact = messageData.contact;

  try {
    const messageRef = await db.collection("Messages").add(messageData); // Use add() to add a new document with the message data
    // console.log("Message added with ID: ", messageRef.id);
    res.render("post-message"); // Render a success page or response
  } catch (error) {
    console.error("Error Sending Message:", error);
    res.status(500).json({ error: "Error Sending Message" }); // Respond with an error status and message
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lifelineedusolutions@gmail.com",
        pass: "hazw czvg ijak uigj",
      },
    });

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
      <p class="mb-4">Dear Lifeline,</p>

      <p>
        You have a message from ${parent}. 
        The pertinent details are as follows:
      </p>

      <div class="my-2">
        <p>Subject: ${subject}</p>
        <p>Message: ${message}</p>
        
        <p>Client Contact: <a href="tel:${contact}">${contact}</a></p>
      </div>

      <p class="my-2">Kindly attend to it.</p>

      <p class="mt-4">
        Regards. <br/>
        Lifeline.
      </p>
    </div>
  </div>
</body>

</html>

    `;
    const personalizedEmail = emailTemplate
      .replace(/\${parent}/g, parent)
      .replace(/\${subject}/g, subject)
      .replace(/\${message}/g, message)
      .replace(/\${contact}/g, contact);

    const mailOptions = {
      from: "lifelineedusolutions@gmail.com",
      to: "lifelineedusolutions@gmail.com",
      cc: "shirazadnan53@gmail.com",
      subject: "Message",
      html: emailTemplate,
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

//EMAIL POST REQUEST
app.post("/email", async function (req, res) {
  try {
    const emailData = req.body;
    const date = emailData.date;
    const subject = emailData.subject;
    const message = emailData.message;
    let sendTo = emailData.sendTo;

    // Capitalize the first letter of sendTo
    sendTo = sendTo.charAt(0).toUpperCase() + sendTo.slice(1).toLowerCase();

    let recipientEmails = [];

    // Logic to fetch recipient emails based on 'sendTo'
    if (sendTo === "All") {
      // Fetch all email addresses
      const allEmailsSnapshot = await db.collection("Tutor Applications").get();

      allEmailsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email) {
          recipientEmails.push(data.email);
        }
      });
    } else if (sendTo === "Tutor") {
      // Fetch tutor email addresses
      const tutorEmailSnapshot = await db
        .collection("Tutor Applications")
        .where("category", "==", "tutor")
        .get();

      tutorEmailSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email) {
          recipientEmails.push(data.email);
        }
      });
    } else if (sendTo === "Applicant") {
      // Fetch applicant email addresses
      const applicantEmailSnapshot = await db
        .collection("Tutor Applications")
        .where("category", "==", "applicant")
        .get();

      applicantEmailSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email) {
          recipientEmails.push(data.email);
        }
      });
    }
    // Add other recipient categories if needed (clients, prospects, etc.)

    // Prepare email template with proper placeholders
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
          <p class="mb-4">Dear ${sendTo},</p>
    
          <p>
            ${message}    
          </p>   
    
          <p class="mt-4">
            Regards.
          </p>
        </div>
      </body>
      </html>
    `;

    // Replace placeholders in the email template
    const personalizedEmail = emailTemplate.replace(/\${sendTo}/g, sendTo);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lifelineedusolutions@gmail.com",
        pass: "hazw czvg ijak uigj",
      },
    });

    const mailOptions = {
      from: "lifelineedusolutions@gmail.com",
      date: date,
      to: recipientEmails.join(", "), // Join recipient emails with commas
      cc: "shirazadnan53@gmail.com",
      subject: subject,
      html: personalizedEmail,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({ message: "Email sent successfully" });
      }
    });
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
          req.body[key] !== "" &&
          key !== "password" &&
          key !== "password-confirm"
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
        contracts: [],
        comment: [],
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
          // console.log("Profile picture uploaded");

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
let tutorNotice;
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
    // console.log(doc);

    // Database Query
    const offers = await db.collection("Offers").get();
    const notices = await db.collection("Notices").get();

    // Store the applications data in the variable
    contracts = [];
    tutorNotice = [];
    offers.forEach((doc) => {
      contracts.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    notices.forEach((doc) => {
      tutorNotice.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    // console.log(contracts);

    if (!doc.exists) {
      console.log("No such document!");
    } else {
      let profileData = doc.data();
      // console.log(profileData);
      let fullName = profileData.lastName + " " + profileData.firstName;
      let imageUrl = profileData.profilePictureUrl;
      let storageUrl = "https://gs://lifeline-edu-site.appspot.com/" + imageUrl;
      // profilePicture.src = storageUrl;
      // console.log(storageUrl);

      let profileName = fullName.toUpperCase();

      res.render("tutor", {
        profileName: profileName,
        fullName: fullName,
        profile: profileData,
        offers: contracts,
        date: date,
        // profilePicture: profilePicture,
        notices: tutorNotice,
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

app.post("/tutor/dictionary", (req, res) => {
  const word = req.body.word; // Access the 'word' field from the form

  const options = {
    hostname: "api.dictionaryapi.dev",
    path: `/api/v2/entries/en/${word}`,
    method: "GET",
  };

  const request = https.request(options, (apiResponse) => {
    let data = "";

    apiResponse.on("data", (chunk) => {
      data += chunk;
    });

    apiResponse.on("end", () => {
      try {
        const parsedData = JSON.parse(data);
        // console.log(parsedData);
        res.json(parsedData);
      } catch (error) {
        res.status(500).json({ error: "Error parsing API response" });
      }
    });
  });

  request.on("error", (error) => {
    res.status(500).json({ error: error.message });
  });

  request.end();
});

//POST CONTRACT
app.post("/contract", async function (req, res) {
  const contractType = req.body;
  const offers = db.collection("Offers").doc();

  try {
    let offer = {
      data: contractType,
      availability: "available",
      posted: new date(),
    };
    // Assuming "contractType" is an object and you want to store it in the Firestore document.
    await offers.set(offer);

    res.send("Contract Posted");
  } catch (error) {
    console.error("Error posting contract:", error);
    res.status(500).send("Error posting contract");
  }
});

//NOTICE
// let notices;
app.post("/notice", async function (req, res) {
  try {
    const noticeData = req.body;

    // Create a new document reference in the "Notices" collection
    const noticeRef = db.collection("Notices").doc();

    // Set the notice data to the Firestore document
    await noticeRef.set(noticeData);

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
    let increment = totalPrice + 50;

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
      remuneration: "",
      tutor_email: "",
      tutor_contact: "",
      pastTutors: [],
      comments: [],
      discount: "",
      fees: increment,
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
        <p>Charges: ${increment}</p>
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
      .replace(/\${increment}/g, increment)
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

//Counselling Form
app.post("/counselling-form", async function (req, res) {
  const request = req.body;
  const mode = request.preferredMode;
  const urgency = request.urgency;
  const duration = parseFloat(request.preferredDuration);

  let baseCharge = 0;

  if (mode === "Phone Call" && duration === 0.5) {
    baseCharge = 100;
  } else if (mode === "Phone Call" && duration === 1) {
    baseCharge = 150;
  } else if (mode === "Phone Call" && duration === 1.5) {
    baseCharge = 200;
  } else if (mode === "Phone Call" && duration === 2) {
    baseCharge = 300;
  } else if (mode === "In-person" && duration === 0.5) {
    baseCharge = 200;
  } else if (mode === "In-person" && duration === 1) {
    baseCharge = 300;
  } else if (mode === "In-person" && duration === 1.5) {
    baseCharge = 400;
  } else if (mode === "In-person" && duration === 2) {
    baseCharge = 500;
  } else if (mode === "WhatsApp" && duration === 0.5) {
    baseCharge = 100;
  } else if (mode === "WhatsApp" && duration === 1) {
    baseCharge = 150;
  } else if (mode === "WhatsApp" && duration === 1.5) {
    baseCharge = 200;
  } else if (mode === "WhatsApp" && duration === 2) {
    baseCharge = 250;
  }

  let urgencyIncrement = 0;

  if (urgency === "Urgent") {
    urgencyIncrement = 0.5;
  } else if (urgency === "Moderately Urgent") {
    urgencyIncrement = 0.3;
  }

  // Calculate total price including urgency increment
  let totalPrice = baseCharge * (1 + urgencyIncrement);
  let counsellorPay = (totalPrice * 0.65).toFixed(2);
  let lifelinePay = (totalPrice - counsellorPay).toFixed(2);
  // console.log("The client is paying Ghc " + totalPrice);
  // console.log("The counsellor is receiving " + counsellorPay);
  // console.log("Lifeline is income is " + lifelinePay);

  const clientData = {
    counselee: request.parentName || request.childName,
    contact: request.parentContact || request.studentContact,
    other_contact: request.parentAltContact || "",
    email: request.studentEmail || request.parentEmail,
    child_name: request.childName || "",
    age: request.childAge || "",
    school: request.childSchool || "",
    grade: request.childGrade || "",
    reason: request.reason || "",
    special_request: request.specialRequest || "",
    date: request.preferredDate || "",
    mode: mode,
    duration: duration,
    urgency: urgency,
    notes: [],
    appointments: [],
    progress: [],
    recommendation: [],
    status: "",
    Fees: [],
    Remuneration: counsellorPay,
    Revenue: lifelinePay,
  };

  const client = clientData.counselee;
  const contact = clientData.contact;
  const other_contact = clientData.other_contact;
  const email = clientData.email;
  const reason = clientData.reason;
  const date = clientData.date;
  // console.log(clientData);

  try {
    // Save the client data to Firestore
    const docRef = await db.collection("Counselling Request").add(clientData);

    const clientName = clientData.counselee || "Anonymous";

    res.render("post-counselling", { counselee: clientName });

    // Define the email template with a placeholder for the applicant's name
    const counsellorEmail = `
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
    <p class="mb-4">Dear Counselor,</p>

    <p>
      We have a New Counselling Request with the following details:    
    </p>   

    <p>Name of Client: ${client} </p>
    <p>Clients contact: <a href="tel:${contact}"> ${contact} </a></p>
    <p>Other contact: <a href="tel:${other_contact}">${other_contact} </a></p>
    <p>Email Address: ${email}</p>
    <p>Preferred Mode of Counselling: ${mode}</p>
    <p>Date: ${date}</p>
    <p>Urgency of matter: ${urgency}</p>
    <p>Reason for counselling: ${reason}    </p>
  

    <p class="my-2">Kindly visit your dashboard for more details.</p>
    <p class="mt-4">
      Regards.
    </p>
  </div>
</body>
</html>
`;

    const personalizedEmail = counsellorEmail

      .replace(/\${client}/g, client)
      .replace(/\${contact}/g, contact)
      .replace(/\${email}/g, email)
      .replace(/\${other_contact}/g, other_contact)
      .replace(/\${urgency}/g, urgency)
      .replace(/\${mode}/g, mode)
      .replace(/\${reason}/g, reason);

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
      cc: "ruhi.ziblim@gmail.com",
      subject: "Counselling Request",
      html: personalizedEmail,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error, info);
      } else {
        // console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.error("Error adding counseling request:", error);
    // Handle error scenario here
  }
});

//Add Data to FireStore
// await db.collection('cities').doc('new-city-id').set(data); //Use set if I want to have a unique doc id.
// Add a new document with a generated id.
// let country = {
//   name: 'Tokyo',
//   country: 'Japan'
// }
// const res = await db.collection('cities').add();

// console.log('Added document with ID: ', res.id);

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

//Merge New Data with Old
//const cityRef = db.collection('cities').doc('BJ');
// const res = await cityRef.set({
//   capital: true
// }, { merge: true });

//UPDATE DOCUMENT
// const cityRef = db.collection('cities').doc('DC');

// // Set the 'capital' field of the city
// const res = await cityRef.update({capital: true});

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

// const http = require('https');

//Online and Local Server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is Running");
});
