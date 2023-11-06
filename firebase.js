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
