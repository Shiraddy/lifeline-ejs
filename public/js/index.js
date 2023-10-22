//Button in Tuition (After Offers)
$(".offer-btn").on("click", function () {
  $(".form-apply").slideToggle();
});

//Button in Contact Section (To show Mobile Number)
$(".phone-btn").on("click", function () {
  $(".phone").slideToggle();
});

//Button in Contact Section (To show email)
$(".email-btn").on("click", function () {
  $(".email").slideToggle();
});

//Tutor Apply Toggle (To show form)
$("#tutorApply").on("click", function () {
  $("#tutorApplication").slideToggle(),
    $("#inviteText").hide(),
    $("#form-header").removeClass("banner").addClass("client-banner");
});

//Tutor Apply Toggle (To show Contact)
$("#tutorContactBtn").on("click", function () {
  $(".tutorContact").slideToggle();
});

//working code
// $(document).ready(function () {
//   const sections = $(".form-section");
//   let currentSection = 0;

//   // Function to show the current section and hide the others
//   function showSection(sectionIndex) {
//     sections.hide();
//     $(sections[sectionIndex]).show();
//     currentSection = sectionIndex;
//   }

//   // Initialize the form with the first section
//   showSection(currentSection);

//   // Handle next section button click
//   $(".next-section").click(function (e) {
//     e.preventDefault();

//     // Check if the required inputs in the current section are populated
//     const currentInputs = $(sections[currentSection]).find("input[required]");
//     let isCurrentSectionValid = true;

//     currentInputs.each(function () {
//       const input = $(this);
//       if (input.val().trim() === "") {
//         isCurrentSectionValid = false;
//         input.next(".error-message").show().text("This field is required");
//       } else {
//         input.next(".error-message").hide(); // Hide the error message
//       }
//     });

//     // Check email format and password confirmation only in the first section
//     if (currentSection === 0) {
//       const emailInput = $(sections[currentSection]).find(
//         "input[type='email']"
//       );
//       const email = emailInput.val().trim();
//       const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//       if (!emailPattern.test(email)) {
//         isCurrentSectionValid = false;
//         emailInput
//           .next(".error-message")
//           .show()
//           .text("Please enter a valid email address");
//       } else {
//         emailInput.next(".error-message").hide();
//       }

//       const passwordInput = $(sections[currentSection]).find(
//         "input[name='password']"
//       );
//       const confirmPasswordInput = $(sections[currentSection]).find(
//         "input[name='password-confirm']"
//       );
//       const password = passwordInput.val().trim();
//       const confirmPassword = confirmPasswordInput.val().trim();

//       if (password !== confirmPassword) {
//         isCurrentSectionValid = false;
//         confirmPasswordInput
//           .next(".error-message")
//           .show()
//           .text("Passwords do not match");
//       } else {
//         confirmPasswordInput.next(".error-message").hide();
//       }
//     }

//     if (isCurrentSectionValid) {
//       // Move to the next section if it's not the last section
//       if (currentSection < sections.length - 1) {
//         showSection(currentSection + 1);
//       }
//     }
//   });

//   // Handle previous section button click
//   $(".prev-section").click(function (e) {
//     e.preventDefault();

//     // Move to the previous section
//     showSection(currentSection - 1);
//   });

//   // Handle form submission (you can add your submission logic here)
//   $("#multi-section-form").submit(function (e) {
//     e.preventDefault();
//     alert("Form submitted successfully!");
//   });
// });

// Tutor Application Form Validation
$(document).ready(function () {
  const sections = $(".form-section");
  let currentSection = 0;

  // Function to show the current section and hide the others
  function showSection(sectionIndex) {
    sections.hide();
    $(sections[sectionIndex]).show();
    currentSection = sectionIndex;
  }

  // Initialize the form with the first section
  showSection(currentSection);

  // Handle next section button click
  $(".next-section").click(function (e) {
    e.preventDefault();

    // Check if the required inputs in the current section are populated
    const currentInputs = $(sections[currentSection]).find("input[required]");
    let isCurrentSectionValid = true;

    currentInputs.each(function () {
      const input = $(this);
      if (input.val().trim() === "") {
        isCurrentSectionValid = false;
        input.next(".error-message").show().text("This field is required");
      } else {
        input.next(".error-message").hide(); // Hide the error message
      }
    });

    // Check email format and password confirmation only in the first section
    if (currentSection === 0) {
      const emailInput = $(sections[currentSection]).find(
        "input[type='email']"
      );
      const email = emailInput.val().trim();
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(email)) {
        isCurrentSectionValid = false;
        emailInput
          .next(".error-message")
          .show()
          .text("Please enter a valid email address");
      } else {
        emailInput.next(".error-message").hide();
      }

      const passwordInput = $(sections[currentSection]).find(
        "input[name='password']"
      );
      const confirmPasswordInput = $(sections[currentSection]).find(
        "input[name='password-confirm']"
      );
      const password = passwordInput.val().trim();
      const confirmPassword = confirmPasswordInput.val().trim();

      if (password !== confirmPassword) {
        isCurrentSectionValid = false;
        confirmPasswordInput
          .next(".error-message")
          .show()
          .text("Passwords do not match");
      } else {
        confirmPasswordInput.next(".error-message").hide();
      }

      // Check password length
      if (password.length < 6) {
        isCurrentSectionValid = false;
        passwordInput
          .next(".error-message")
          .show()
          .text("Password must be 6 characters or more");
      } else {
        passwordInput.next(".error-message").hide();
      }
    }

    if (isCurrentSectionValid) {
      // Move to the next section if it's not the last section
      if (currentSection < sections.length - 1) {
        showSection(currentSection + 1);
      }
    }
  });

  // Handle previous section button click
  $(".prev-section").click(function (e) {
    e.preventDefault();

    // Move to the previous section
    showSection(currentSection - 1);
  });

  // Handle form submission (you can add your submission logic here)
  // $("#multi-section-form").submit(function (e) {
  //   e.preventDefault();
  //   alert("Form submitted successfully!");
  // });
});

// Tutor Request Form Validation
$(document).ready(function () {
  // Hide all fieldsets except the first one
  $(".form-field").not(":first").hide();

  // Handle the "Next" button click
  $(".nextBtn").click(function () {
    var currentSection = $(this).closest(".form-field");
    var nextSection = currentSection.next(".form-field");

    // Find all required fields in the current section
    var requiredFields = currentSection.find(
      "input[required], select[required], textarea[required]"
    );

    // Remove any existing error messages
    currentSection.find(".error-message").hide();

    // Check if any required fields are empty
    var emptyRequiredFields = requiredFields.filter(function () {
      if ($(this).is("select")) {
        // For select elements, check if the selected option is empty
        return !$(this).val();
      } else if ($(this).is(":radio")) {
        // For radio inputs, check if none are checked
        var radioGroupName = $(this).attr("name");
        return !$(`input[name="${radioGroupName}"]:checked`).length > 0;
      } else if ($(this).is(":checkbox")) {
        // For checkbox inputs, check if none are checked
        return !$(this).prop("checked");
      } else {
        return !$(this).val();
      }
    });

    // Display error messages only for empty required fields
    emptyRequiredFields.each(function () {
      $(this).next(".error-message").css("color", "red").show();
    });

    if (emptyRequiredFields.length === 0) {
      // Move to the next section if there are no empty required fields
      currentSection.hide();
      nextSection.show();
    }
  });

  // Handle the "Previous" button click
  $(".prevBtn").click(function () {
    var currentSection = $(this).closest(".form-field");
    var prevSection = currentSection.prev(".form-field");

    // Hide the current section and show the previous one
    currentSection.hide();
    prevSection.show();
  });

  // Handle input field changes to hide error messages
  $("input[required], select[required], textarea[required]").on(
    "input",
    function () {
      if ($(this).val()) {
        $(this).next(".error-message").hide();
      }
    }
  );

  // Handle select elements to hide error messages
  $("select[required]").on("change", function () {
    if ($(this).val()) {
      $(this).next(".error-message").hide();
    }
  });

  // Handle radio and checkbox inputs to hide error messages
  $('input[type="radio"][required], input[type="checkbox"][required]').on(
    "change",
    function () {
      var radioGroupName = $(this).attr("name");
      $(`input[name="${radioGroupName}"]`).each(function () {
        $(this).next(".error-message").hide();
      });
    }
  );
});

//Subject Select Multiple
$("#option").on("ready", function () {
  $("#studentSubjects").multiselect();
});

//In-person and Online Button Switch
$("#onlineClick").on("click", function () {
  $("#online").show();
});

//Parent and Tutor Faq
$("#tutorFaqBtn").on("click", function () {
  $("#parentFaq").hide();
  $("#tutorFaq").show();
});

//YES & NO CLICK
// $("#radiobtn1").on("click", function () {
//   $("#challenge").hide();
// });

// $("#radiobtn2").on("click", function () {
//   $("#challenge").show();
// });

//Graduate & Undergraduate Toggle
$("#gradbtn").on("click", function () {
  $("#undergrad").hide();
  $("#grad").show();
});

$("#undergradbtn").on("click", function () {
  $("#grad").hide();
  $("#undergrad").show();
});

$("#parentFaqBtn").on("click", function () {
  $("#tutorFaq").hide();
  $("#parentFaq").show();
});

$("#inPersonClick").on("click", function () {
  $("#online").hide();
});

//Tutor Request Form Show
$("#tutorRequestBtn").on("click", function () {
  $("#tutorRequest").slideToggle(),
    $("#requestText").hide(),
    $("#banner").removeClass("banner").addClass("client-banner");
});

// PRICE CALCULATION
$(document).ready(function () {
  // Price per lesson (you can set your own price here)
  // var pricePerLesson = 0;

  // Function to calculate and update the price
  function calculatePrice() {
    var mode = $("input[name=modeOfTeaching]:checked").val();
    // console.log(mode);
    var weeklySession = $('input[name="weeklySession"]:checked').val();
    var periodLength = $('input[name="periodLength"]:checked').val();
    var monthlySession = weeklySession * 4;

    // Calculate the total price
    // var totalPrice = monthlySession * periodLength * pricePerLesson;
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

    // Update the price display
    $("#calculatedPrice").text(totalPrice.toFixed(2)); // Display with two decimal places
    // $("#calculatedPrice").text("Hello"); // Display with two decimal places
  }

  // Calculate the initial price
  calculatePrice();

  // Listen for changes in radio buttons
  $('input[name="weeklySession"]').change(calculatePrice);
  $('input[name="periodLength"]').change(calculatePrice);
});

//Login Validation (Working code)
// $(document).ready(function () {
//   $("#login-form").on("submit", function (e) {
//     e.preventDefault();
//     const email = $("#email").val();
//     const password = $("#password").val();

//     $.ajax({
//       url: "/login",
//       method: "POST",
//       contentType: "application/json",
//       data: JSON.stringify({ email, password }),
//       success: function () {
//         // Handle successful login, if needed
//       },
//       error: function (xhr) {
//         console.log(
//           "AJAX error:",
//           xhr.status,
//           xhr.statusText,
//           xhr.responseJSON
//         );
//         const errorMessage = xhr.responseJSON.error;
//         console.log(errorMessage);
//         $("#error-message").text(errorMessage);
//       },
//     });
//   });
// });

//Second working code with spinner
// $(document).ready(function () {
//   $("#login-form").on("submit", function (e) {
//     e.preventDefault();

//     // Show the loading spinner
//     $("#loading-spinner").removeClass("d-none");

//     const email = $("#email").val();
//     const password = $("#password").val();

//     $.ajax({
//       url: "/login",
//       method: "POST",
//       contentType: "application/json",
//       data: JSON.stringify({ email, password }),
//       success: function () {
//         // Redirect to the tutor page on successful login
//         // window.location.href = "/tutor";
//         // Hide the loading spinner when done
//         $("#loading-spinner").addClass("d-none");
//       },
//       error: function (xhr) {
//         console.log(
//           "AJAX error:",
//           xhr.status,
//           xhr.statusText,
//           xhr.responseJSON
//         );
//         const errorMessage = xhr.responseJSON.error;
//         console.log(errorMessage);
//         $("#error-message").text(errorMessage);

//         // Hide the loading spinner on error
//         $("#loading-spinner").addClass("d-none");
//       },
//     });
//   });
// });

$("#submitbtn").on("click", function () {
  $("#loading-spinner").removeClass("d-none");
});

//Profile Picture In Tutor Application
$("#profilePic").click(function (e) {
  $("#imageUpload").click();
});

function fasterPreview(uploader) {
  if (uploader.files && uploader.files[0]) {
    $("#profilePic").attr("src", window.URL.createObjectURL(uploader.files[0]));
  }
}

$("#imageUpload").change(function () {
  fasterPreview(this);
});

// ADMIN MODAL
// $(document).ready(function () {
//   // Get the modal and its content
//   const modal = $("#detail");
//   const modalContent = modal.find(".modal-body");

//   // Add a click event handler to the "expand" buttons
//   $('.btn[data-bs-target="#detail"]').click(function () {
//     // Get the applicant data from the data-application attribute
//     const applicationData = JSON.parse($(this).data("application"));

//     // Populate modal fields with applicant data
//     modalContent.find("#firstName").val(applicationData.data.firstName);
//     modalContent.find("#lastName").val(applicationData.data.lastName);
//     modalContent.find("#tutorEmail").val(applicationData.data.tutorEmail);
//     modalContent.find("#gender").val(applicationData.data.gender);
//     modalContent.find("#contact").val(applicationData.data.contact);
//     modalContent
//       .find("#tutorOtherContact")
//       .val(applicationData.data.altContact);
//     modalContent.find("#status").val(applicationData.data.studentStatus);
//     modalContent.find("#school").val(applicationData.data.school);

//     // Show the modal
//     modal.modal("show");
//   });
// });
