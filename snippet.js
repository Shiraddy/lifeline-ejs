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
//Tutor Application
app.post("/apply", async (req, res) => {
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

    // Check if the user's data already exists in Firestore
    const firestoreDoc = admin
      .firestore()
      .collection("Tutor Applications")
      .doc(userRecord.uid);
    const firestoreDocSnapshot = await firestoreDoc.get();

    if (!firestoreDocSnapshot.exists) {
      // If the data doesn't exist in Firestore, set it
      await firestoreDoc.set({
        email,
        firstName,
        // Add more applicant data here
      });
    }

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
        console.log("Email sent: " + info.response);
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

const express = require("express");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("./path/to/your-service-account-key.json"); // Replace with the path to your Firebase Admin SDK key
const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-storage-bucket-url",
});
const bucket = admin.storage().bucket();

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve your HTML form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle form submission, including file upload
app.post("/apply", upload.single("profilePicture"), async (req, res) => {
  // Your existing application code, including user creation and Firestore update
  // ...

  // Check if a profile picture file was uploaded
  if (req.file) {
    const profilePicture = req.file;
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
    });

    profilePictureStream.end(profilePicture.buffer);
    updatedApplicant.profilePictureURL = profilePictureFilename;
  }
  // ...

  res.render("received", { applicant: firstName });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//NEW CODE
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

    // Create a Firestore collection and document
    const db = admin.firestore();
    const collection = db.collection("Tutor Applications");
    const Application = collection.doc(email);

    // Check if the user's data already exists in Firestore
    const existingData = (await Application.get()).data();

    if (!existingData || isNewUser) {
      // Only update Firestore data if the user doesn't have data in Firestore or is a new user
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
        status: "",
        comment: "",
      };

      // Set the data in Firestore
      await Application.set(updatedApplicant);

      // Check if a profile picture file was uploaded
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
          return res.status(500).send("Error uploading profile picture");
        });

        profilePictureStream.on("finish", () => {
          // Profile picture uploaded successfully
          console.log("Profile picture uploaded");

          // Add the profile picture URL to the Firestore data
          updatedApplicant.profilePictureURL = profilePictureFilename;

          // Continue with the rest of your code
          // Define the email template and send the email
          // ...
          return res.redirect("/received");
        });

        profilePictureStream.end(profilePicture.buffer);
      } else {
        // Continue with the rest of your code
        // Define the email template and send the email
        // ...
        return res.redirect("/received");
      }
    }
  } catch (error) {
    console.error("Error creating/updating user data:", error);
    return res
      .status(500)
      .json({ error: "Application Failed, Check Your Internet and Try Again" });
  }
});

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
      You have a New Tutor Request with the following details:    
    </p>   

    ${client} <br/>
    ${otherContact} <br/>
    ${student} <br/>
    ${level} <br/>
    ${weeklySession} <br/>     
    ${duration} <br/>     
    ${fee} <br/>
    ${contact} <br/>
    ${typeOfContract} <br/>
    ${email} <br/>     

    <pclass="my-2">Kindly attend to it.</pclass=>
    <p class="mt-4">
      Regards.
    </p>
  </div>
</body>
</html>
`;

const client = parent;
const otherContact = "Other Contact Info";
const student = "Student Name";
const level = "Student Level";
const weeklySession = "Weekly Session Info";
const duration = "Tutoring Duration";
const fee = "Ghc" + totalPrice;
const contact = "Contact Info";
const typeOfContract = "Contract Type";
const email = "Email Address";
const applicantName = "Lifeline";

const personalizedEmail = emailTemplate
  .replace(/{applicantName}/g, applicantName)
  .replace(/\${firstName}/g, firstName)
  .replace(/\${client}/g, client)
  .replace(/\${otherContact}/g, otherContact)
  .replace(/\${student}/g, student)
  .replace(/\${level}/g, level)
  .replace(/\${weeklySession}/g, weeklySession)
  .replace(/\${duration}/g, duration)
  .replace(/\${fee}/g, fee)
  .replace(/\${contact}/g, contact)
  .replace(/\${typeOfContract}/g, typeOfContract)
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

app.post("/email", async function (req, res) {
  try {
    const emailData = req.body;
    const date = emailData.date;
    const subject = emailData.subject;
    const message = emailData.message;
    const sendTo = emailData.sendTo;

    // Email Addresses
    const tutorEmail = [];
    const applicantEmail = [];
    const all = [];

    // Retrieve applicant email addresses
    const applicantEmailAddresses = await db
      .collection("TutorApplications")
      .where("category", "==", "applicant")
      .get();

    applicantEmailAddresses.forEach((doc) => {
      applicantEmail.push({
        id: doc.id,
      });
    });

    // Retrieve all email addresses
    const allEmails = await db.collection("TutorApplications").get();

    allEmails.forEach((doc) => {
      all.push({
        id: doc.id,
      });
    });

    // Retrieve tutor email addresses
    const tutorEmailAddresses = await db
      .collection("TutorApplications")
      .where("category", "==", "tutor")
      .get();

    tutorEmailAddresses.forEach((doc) => {
      tutorEmail.push({
        id: doc.id,
      });
    });

    // Assuming 'Email' is a collection in the database to store emails
    const savedEmail = await db.collection("Emails").add(emailData); // Changed collection name to 'Emails'
    console.log(savedEmail);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const nodemailer = require("nodemailer"); // Import nodemailer if not imported already

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

// Set up the session middleware
app.use(
  session({
    store: new FirestoreStore({
      database: admin.firestore(),
      expirationMs: 86400000,
      collection: "sessions",
    }),
    secret: "dgjlgjl524523",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
      secure: true,
      httpOnly: true,
    },
  })
);

app.use(
  session({
    store: new FirestoreStore({
      database: db,
      expiration: 86400000, // Session expiration time in milliseconds (optional)
      collection: "sessions", // Collection name for sessions (optional)
    }),
    secret: "dgjlgjl524523",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000, // Session cookie expiration time in milliseconds (optional)
      secure: true, // Set to true if your app is served over HTTPS (recommended for production)
      httpOnly: true, // Reduce the risk of XSS attacks by preventing client-side access to cookies
    },
  })
);

app.use(
  session({
    store: new FirestoreStore({
      database: db,
      expiration: 86400000,
      collection: "sessions",
    }),
    secret: "dgjlgjl524523",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
      secure: true,
      httpOnly: true,
    },
  })
);

let contracts;
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate user with provided email and password
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (email === "lifelineedusolutions@gmail.com" && password === "LES12345") {
      // For the admin user
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

      application.forEach((doc) => {
        applications.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      if (!tutor.empty) {
        tutor.forEach((doc) => {
          tutors.push({
            id: doc.id,
            data: doc.data(),
          });
        });
      }

      const noOfApplicants = applications.length;
      const noOfTutors = tutors.length;

      // Render the admin page for the admin user
      res.render("admin", {
        dayOfWeek: date, // Define 'date' elsewhere in your code
        todo: todoLists, // You need to define todoLists
        applicants: noOfApplicants,
        applications: applications,
        noOfTutors: noOfTutors,
        tutors: tutors,
        profileName: profileName,
        fullName: fullName,
        profile: profileData,
        offers: contracts,
      });
    } else {
      contracts = [];
      offers.forEach((doc) => {
        contracts.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      // Regular user login
      // Fetch user-related data from Firestore
      const profile = db.collection("Tutor Applications").doc(email);
      const doc = await profile.get();

      if (doc.exists) {
        // Document exists for regular users, fetch and render tutor page
        const profileData = doc.data();
        const fullName = profileData.lastName + " " + profileData.firstName;
        const profileName = fullName.toUpperCase();

        // Fetch other necessary data for regular users
        // For example, fetching offers
        const offers = await db.collection("Offers").get();

        res.render("tutor", {
          profileName: profileName,
          fullName: fullName,
          profile: profileData,
          offers: contracts,
        });
      } else {
        // Handle case where the user is not found in the database
        res.render("login", {
          email,
          error: "User not found. Please sign up or check your credentials.",
        });
      }
    }
  } catch (error) {
    console.error("Login Failed:", error.message);
    // Handle other errors during login
    res.render("login", {
      email,
      error: "An error occurred during login. Please try again.",
    });
  }
});

app.post("/apply", upload.single("profilePicture"), async (req, res) => {
  const { email, password } = req.body;
  const firstName = req.body.firstName;
  const subject = "Lifeline Tutor Application";

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
          password: hashedPassword, // Use the hashed password
        });
        isNewUser = true;
      } else {
        throw error; // Re-throw the error for other cases
      }
    }

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



