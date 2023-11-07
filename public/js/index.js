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

// TUTOR APPLICATION FORM
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
  // $("#multi-section-form").submit(function () {});

  $("#applySubmit").on("click", function () {
    $("#applyLoad").removeClass("d-none");
  });
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
  // Function to calculate and update the price
  function calculatePrice() {
    let mode = $("input[name=modeOfTeaching]:checked").val();
    // console.log(mode);
    let weeklySession = $('input[name="weeklySession"]:checked').val();
    let periodLength = $('input[name="periodLength"]:checked').val();
    let monthlySession = weeklySession * 4;
    let pricePerLesson;

    // Calculate the total price
    // var totalPrice = monthlySession * periodLength * pricePerLesson;
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

// Second working code with spinner
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

//Login Spinner
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

$(document).ready(function () {
  // Add a click event handler to all delete buttons
  $(".delete-row").click(function () {
    const row = $(this).closest("tr");
    const applicationId = row.data("application-id");

    // Make an AJAX request to delete the application
    $.ajax({
      type: "DELETE",
      url: `/admin/delete/${applicationId}`,
      success: function (data, textStatus, jqXHR) {
        if (jqXHR.status === 204) {
          // Successful deletion, remove the row from the DOM
          row.remove();
        } else {
          console.log("Unable to delete");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle any network or request errors
      },
    });
  });
});

$(document).ready(function () {
  // Add a click event handler to all "view-details" buttons
  $(".view-details").click(function () {
    const row = $(this).closest("tr"); // Get the parent row of the clicked button
    const applicationId = row.data("application-id"); // Assuming you have a data attribute for the application ID

    // Make an AJAX request to fetch data for the specific application
    $.ajax({
      type: "GET",
      url: `/admin/details/${applicationId}`, // Adjust the URL to your server endpoint
      dataType: "json", // Assuming the response is in JSON format
      success: function (data) {
        // Update the form fields with the fetched data
        $("#firstName").val(data.firstName);
        $("#lastName").val(data.lastName);
        $("#tutorEmail").val(data.email);
        $("#gender").val(data.gender);
        $("#contact").val(data.contact);
        $("#tutorOtherContact").val(data.altContact);
        $("#status").val(data.studentStatus);
        $("#school").val(data.school);

        // Show the modal
        // Replace this with your modal display code (e.g., using Bootstrap modal functions)
        $("#detail").modal("show");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle any errors, e.g., display an error message
        console.log("Error:", errorThrown);
      },
    });
  });
});

$(document).ready(function () {
  // Add a click event handler to all "update-data" buttons
  $(".update-data").click(function () {
    const row = $(this).closest("tr"); // Get the parent row of the clicked button
    const applicationId = row.data("application-id"); // Assuming you have a data attribute for the application ID
    const form = $("#update"); // Get the form element

    // Make an AJAX request to fetch data for the specific application
    $.ajax({
      type: "GET",
      url: `/admin/details/${applicationId}`, // Adjust the URL to your server endpoint
      dataType: "json", // Assuming the response is in JSON format
      success: function (data) {
        // Populate the form fields with the fetched data
        form.find("#firstName").val(data.firstName);
        form.find("#lastName").val(data.lastName);
        form.find("#tutorEmail").val(data.email);
        form.find("#DoB").val(data.DoB);
        form.find("#contact").val(data.contact);
        form.find("#YoC").val(data.YoC);
        form.find("#coursed").val(data.coursed);
        form.find("#gps").val(data.gps);
        form.find("#level").val(data.level);
        form.find("#aboutMedia").val(data.aboutMedia);
        form.find("#rating").val(data.rating);
        form.find("#studentStatus").val(data.studentStatus);
        form.find("#category").val(data.category);
        form.find("select[name='status']").val(data.status);
        form.find("#emergency").val(data.emergency);
        form.find("#status").val(data.status);
        form.find("#location").val(data.location);
        form.find("#schoolCompleted").val(data.schoolCompleted);

        // Show the modal
        // Replace this with your modal display code (e.g., using Bootstrap modal functions)
        // For example: $('#update').modal('show');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // Handle any errors, e.g., display an error message
        console.log("Error:", errorThrown);
      },
    });
  });

  // Add a submit event handler to the update form
  $("#update").submit(function (event) {
    event.preventDefault();

    const form = $(this);
    const formData = form.serialize(); // Serialize the form data

    // Make an AJAX request to submit the updated data
    $.ajax({
      type: "PUT", // You can use POST or PUT depending on your server implementation
      url: "/admin/update/:id", // Adjust the URL to your server endpoint for updates
      data: formData,
      success: function () {
        // Handle a successful update, e.g., display a success message
        console.log("Data updated successfully");
        // Close the modal if needed
        $("#update").modal("hide");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error:", errorThrown);
      },
    });
  });
});
