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

// TUTOR REQUEST FORM
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
    let increment = totalPrice + 50;
    // Update the price display
    $("#calculatedPrice").text(increment.toFixed(2)); // Display with two decimal places
    return totalPrice; // Return the calculated price
  }

  // Calculate the initial price
  calculatePrice();

  // Listen for changes in radio buttons
  $('input[name="weeklySession"]').change(calculatePrice);
  $('input[name="periodLength"]').change(calculatePrice);

  //Form Preview
  $("#preview").click(function () {
    // Capture radio and checkbox values
    // var selectedRadioValues = [];
    // var selectedCheckboxValues = [];

    // $('input[type="radio"][required]').each(function () {
    //   var radioName = $(this).attr("name");
    //   var selectedValue = $(`input[name="${radioName}"]:checked`).val();
    //   selectedRadioValues.push(selectedValue);
    // });

    // $('input[type="checkbox"][required]').each(function () {
    //   if ($(this).is(":checked")) {
    //     selectedCheckboxValues.push($(this).val());
    //   }
    // });

    // var selectedDuration = $(
    //   'input[name="periodLength"]:checked + label'
    // ).text();
    // $("#lessonDurationDisplay").text("Lesson Duration: " + selectedDuration);

    // var selectedCheckboxes = $('input[type="checkbox"][required]:checked');
    // var selectedCheckboxValues = selectedCheckboxes
    //   .map(function () {
    //     return $(this).next("label").text();
    //   })
    //   .get()
    //   .join(", ");
    // $("#studentChallengesDisplay").text(selectedCheckboxValues);

    $("#parentContactDisplay").val($("#parentNumber").val());
    $("#parentEmailDisplay").val($("#parentEmail").val());
    $("#parentNameDisplay").text($("#parentName").val());
    $("#lessonDurationDisplay").val($(".duration").val());
    $("#lessonFrequencyDisplay").val($(".frequency").val());

    //Student Info
    $("#studentLevelDisplay").val($("#studentLevel").val());
    $("#studentNameDisplay").val($("#studentName").val());
    $("#studentAgeDisplay").val($("#studentDOB").val());
    $("#studentClassDisplay").val($("#studentClass").val());
    // $("#studentChallengesDisplay").val($(".challenge").val());

    // Calculate and display the price
    var lessonFee = calculatePrice();
    let increment = lessonFee + 50;
    $("#lessonFeeDisplay").text("GHC" + increment.toFixed(2));

    // $("#student").hide();
    // $("#preview").show();
  });
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

// $(document).ready(function () {
//   "#bookBtn".click(function () {
//     "#message".slideToggle();
//   });
// });

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
        $("#location").val(data.location);
        $("#tutorEmail").val(data.email);
        $("#gender").val(data.gender);
        $("#contact").val(data.contact);
        $("#tutorOtherContact").val(data.altContact);
        $("#studentStatusOfApplicant").val(data.studentStatus);

        $("#schoolAttending").val(data.school_attending);
        $("#levelOfApplicant").val(data.level);
        $("#course").val(data.coursing);
        $("#certicatePursuing").val(data.certPurs);

        $("#schoolCompleted").val(data.schoolCompleted);
        $("#yearCompleted").val(data.YoC);
        $("#courseStudied").val(data.coursed);
        $("#certificateAttained").val(data.cAt);

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
    const form = $("#update");

    // Make an AJAX request to fetch data for the specific application
    $.ajax({
      type: "GET",
      url: `/admin/details/${applicationId}`,
      dataType: "json",
      success: function (data) {
        // Populate the form fields with the fetched data
        // form.find("#firstName").val(data.firstName);
        // form.find("#lastName").val(data.lastName);
        // form.find("#tutorEmail").val(data.email);
        // form.find("#contact").val(data.contact);
        // form.find("#YoC").val(data.YoC);
        // form.find("#coursed").val(data.coursed);
        // form.find("#gps").val(data.gps);
        // form.find("#level").val(data.level);
        // form.find("#aboutMedia").val(data.aboutMedia);
        // form.find("#rating").val(data.rating);
        // form.find("#studentStatus").val(data.studentStatus);
        // form.find("#category").val(data.category);
        // form.find("select[name='status']").val(data.status);
        // form.find("#emergency").val(data.emergency);
        // form.find("#status").val(data.status);
        // form.find("#location").val(data.location);
        // form.find("#schoolCompleted").val(data.schoolCompleted);

        $("#firstName").val(data.firstName);
        $("#lastName").val(data.lastName);
        $("#location").val(data.location);
        $("#tutorEmail").val(data.email);
        $("#gender").val(data.gender);
        $("#DoB").val(data.DoB);
        $("#contact").val(data.contact);
        $("#tutorOtherContact").val(data.altContact);
        $("#studentStatusOfApplicant").val(data.studentStatus);

        $("#schoolAttending").val(data.school_attending);
        $("#levelOfApplicant").val(data.level);
        $("#course").val(data.coursing);
        $("#certicatePursuing").val(data.certPurs);

        $("#schoolAttended").val(data.schoolCompleted);
        $("#yearCompleted").val(data.YoC);
        $("#courseStudied").val(data.coursed);
        $("#certificateAttained").val(data.cAt);

        // Show the modal
        // Replace this with your modal display code (e.g., using Bootstrap modal functions)
        $("#update").modal("show");
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

    // Enable fields temporarily to retrieve their values
    $("#firstName").prop("disabled", false);
    $("#lastName").prop("disabled", false);

    const form = $(this);
    const formData = form.serializeArray(); // Serialize the form data as an array

    const updatedData = {};
    formData.forEach((field) => {
      updatedData[field.name] = field.value; // Convert serialized data to JSON object
    });

    // Retrieve the email value as the row ID
    const rowId = $("#tutorEmail").val();

    // Include firstName and lastName in the updatedData object
    updatedData.firstName = $("#firstName").val();
    updatedData.lastName = $("#lastName").val();
    updatedData.rowId = rowId;

    // Disable fields again after collecting their values
    $("#firstName").prop("disabled", true);
    $("#lastName").prop("disabled", true);

    // Perform AJAX request with updatedData including firstName and lastName
    $.ajax({
      type: "PUT",
      url: "/admin/update/" + rowId,
      contentType: "application/json",
      data: JSON.stringify(updatedData),
      success: function (response) {
        console.log("Data updated successfully");
        $("#update").modal("hide");

        const toastMessage = $("#toastMessage");
        if (response.updated) {
          toastMessage.text("Data updated successfully");
          showSuccessToast();
        } else {
          toastMessage.text("Error updating data");
          showErrorToast();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error:", errorThrown);
        const toastMessage = $("#toastMessage");
        toastMessage.text("Error: " + errorThrown);
        showErrorToast();
      },
    });
  });

  function showSuccessToast() {
    const toastContainer = $("#toastContainer");
    toastContainer.removeClass("bg-danger").addClass("bg-success");
    var toast = new bootstrap.Toast(document.getElementById("toastContainer"));
    toast.show();
  }

  function showErrorToast() {
    const toastContainer = $("#toastContainer");
    toastContainer.removeClass("bg-success").addClass("bg-danger");
    var toast = new bootstrap.Toast(document.getElementById("toastContainer"));
    toast.show();
  }
});

//Admin Doc
$(document).ready(function () {
  $("#adminEmail").click(function (event) {
    event.preventDefault();
    // Serialize form data
    var formData = $("#emailForm").serialize();

    // AJAX request to handle form submission
    $.ajax({
      type: "POST",
      url: "/email",
      data: formData,
      success: function (response) {
        // Show success message
        $("#responseMessage").html(
          '<div class="success-message">' + response.message + "</div>"
        );
      },
      error: function (xhr, status, error) {
        // Show error message
        $("#responseMessage").html(
          '<div class="error-message">Error: ' + error + "</div>"
        );
      },
    });
  });
});

// client table
// $(document).ready(function () {
//   $.ajax({
//     method: "GET",
//     url: "data/clients",
//     dataType: "json",
//     success: function (response) {
//       if (response.error) {
//         // Handle error message
//         console.log(response.error);
//       } else {
//         // Assuming response is an array of client objects
//         const clients = response; // Assuming response is an array
//         const clientCount = clients.length;
//         $("#clientCount").text(`${clientCount}`);

//         // Clear the table body before adding new data
//         $("#table-container tbody").empty();

//         // Iterate through each client and populate the table
//         clients.forEach(function (client, index) {
//           const tableRow = `
//           <tr>
//           <td>${index + 1}</td>
//           <td>${client.parent}</td>
//           <td>${client.contact}</td>
//           <td>${client.student}</td>
//           <td>${client.relationship}</td>
//           <td>${client.weeklySession}</td>
//           <td>${client.fees}</td>
//           <td>${client.tutor}</td>
//         </tr>
//           `;
//           // Append the table row to the table body
//           $("#table-container tbody").append(tableRow);
//         });
//       }
//     },
//     error: function (xhr, status, error) {
//       // Show error message
//       console.log(status, xhr, error);
//     },
//   });

//   $("#prospectsBtn").click(function () {
//     $.ajax({
//       method: "GET",
//       url: "data/prospects",
//       dataType: "json",
//       success: function (response) {
//         if (response.error) {
//           // Handle error message
//           console.log(response.error);
//         } else {
//           // Assuming response is an array of client objects
//           const clients = response; // Assuming response is an array

//           // Clear the table body before adding new data
//           $("#table-container tbody").empty();

//           // Iterate through each client and populate the table
//           clients.forEach(function (client, index) {
//             const tableRow = `
//               <tr>
//                 <td>${index + 1}</td>
//                 <td>${client.parent}</td>
//                 <td>${client.contact}</td>
//                 <td>${client.student}</td>
//                 <td>${client.relationship}</td>
//                 <td>${client.weeklySession}</td>
//                 <td>${client.fees}</td>
//                 <td>${client.tutor}</td>
//               </tr>
//             `;
//             // Append the table row to the table body
//             $("#table-container tbody").append(tableRow);
//           });
//         }
//       },
//       error: function (xhr, status, error) {
//         // Show error message
//         console.log(status, xhr, error);
//       },
//     });
//   });

//   $("#clientsBtn").click(function () {
//     $.ajax({
//       method: "GET",
//       url: "data/clients",
//       dataType: "json",
//       success: function (response) {
//         if (response.error) {
//           // Handle error message
//           console.log(response.error);
//         } else {
//           // Assuming response is an array of client objects
//           const clients = response; // Assuming response is an array
//           const clientCount = clients.length;
//           $("#clientCount").text(`${clientCount}`);

//           // Clear the table body before adding new data
//           $("#table-container tbody").empty();

//           // Iterate through each client and populate the table
//           clients.forEach(function (client, index) {
//             const tableRow = `
//               <tr>
//                 <td>${index + 1}</td>
//                 <td>${client.parent}</td>
//                 <td>${client.contact}</td>
//                 <td>${client.student}</td>
//                 <td>${client.relationship}</td>
//                 <td>${client.weeklySession}</td>
//                 <td>${client.fees}</td>
//                 <td>${client.tutor}</td>
//               </tr>
//             `;
//             // Append the table row to the table body
//             $("#table-container tbody").append(tableRow);
//           });
//         }
//       },
//       error: function (xhr, status, error) {
//         // Show error message
//         console.log(status, xhr, error);
//       },
//     });
//   });
// });

//Table Responsive
$(document).ready(function () {
  if (window.innerWidth < 1028) {
    $(".resource").removeClass("table").addClass("table-sm");
  }
});

$(window).resize(function () {
  if (window.innerWidth < 1028) {
    $(".resource").removeClass("table").addClass("table-sm");
  } else {
    $(".resource").addClass("table").removeClass("table-sm");
  }
});

//Search Bars
$(document).ready(function () {
  $("#lesResSearch").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#lesResCentre tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $("#gesResSearch").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#gesResCentre tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $("#lBtn").click(function () {
    $("#lesResource").toggle();
  });
});

//SEARCH BARS
$("document").ready(function () {
  $("#tutorSearchBar").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tutorData tr, #applicantsData tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

$("document").ready(function () {
  $("#clientSearchBar").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#clientsData tr, #prospectsData tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

$(document).ready(function () {
  $(".student-link").on("click", function (event) {
    event.preventDefault();
    const clientId = $(this).data("clientid");
    const prospectId = $(this).data("prospectid");

    // Check if client ID or prospect ID is present
    const studentId = clientId || prospectId;

    // Make AJAX GET request to fetch student info based on the ID
    $.ajax({
      url: `/admin/studentInfo/${studentId}`, // Route for the request
      type: "GET",
      success: function (data) {
        // Assuming data contains the necessary student information
        const modalBody = $("#modalBody");

        // Populate modal fields with retrieved data
        $("#pName").val(data.parent);
        $("#pRelationship").val(data.relationship);
        $("#pContact").val(data.contact);
        $("#pCategory").val(data.category);
        $("#pEmail").val(data.email);
        $("#pFee").val(data.fees);
        $("#pSessions").val(data.weeklySession);
        $("#pMode").val(data.modeOfTeaching);
        $("#remuneration").val(data.remuneration);
        $("#pOther").val(data.altContact || data.emergencyContactNumber);
        $("#contractStarted").val(data.starting_date);
        $("#sfirstName").val(data.student);
        $("#sdob").val(data.DoB);
        $("#sSex").val(data.sex);
        $("#sLevel").val(data.level);
        $("#sClass").val(data.class);
        $("#schoolStudentAttends").val(data.schoolName);
        $("#sChallenges").val(data.challenge);
        $("#tGoals").val(data.preferredSubjects);
        $("#tutorAssigned").val(data.tutor);
        $("#tutorAssignedContact").val(data.tutor_contact);

        // Show the modal
        $("#studentInfo").modal("show");
      },
      error: function (xhr, status, error) {
        console.error(error);
        // Handle errors if any
      },
    });
  });
});

//Table Disabled Remover
$(document).ready(function () {
  $("#editContract").click(function () {
    $("#contractUpdate")
      .find("input:disabled, textarea:disabled radio:disabled")
      .removeClass("disabled")
      .prop("disabled", false);
  });
});

//Contract Update
$(document).ready(function () {
  let rowId; // Declaring rowId variable to store the clientId

  // Event listener for clicking table rows to retrieve clientId
  $("table").on("click", "tr", function () {
    rowId = $(this).find("td.d-none").text(); // Access hidden column content (clientId)
    console.log("Clicked Client ID:", rowId);
  });

  // Form submission handling
  $("#contractUpdate").submit(function (event) {
    event.preventDefault();

    const form = $(this);
    const formData = form.serializeArray(); // Serialize the form data as an array

    const updatedData = {};

    formData.forEach((field) => {
      updatedData[field.name] = field.value; // Convert serialized data to JSON object
    });

    // Add the retrieved clientId to the updatedData object
    updatedData.rowId = rowId;

    // AJAX call to send form data along with clientId to the backend
    $.ajax({
      type: "PUT",
      url: "/admin/contractUpdate/" + rowId,
      contentType: "application/json",
      data: JSON.stringify(updatedData),
      success: function (response) {
        console.log("Data updated successfully");
        $("#studentInfo").modal("hide");

        const toastMessage = $("#toastMessage");
        if (response.updated) {
          toastMessage.text("Data updated successfully");
          showSuccessToast();
        } else {
          toastMessage.text("Error updating data");
          showErrorToast();
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error:", errorThrown);
        const toastMessage = $("#toastMessage");
        toastMessage.text("Error: " + errorThrown);
        showErrorToast();
      },
    });
  });
});

//ADMIN PANEL
$(document).ready(function () {
  // Clients button click event
  $("#clientsTableBtn").click(function () {
    $("#clientsData").show(); // Show Clients table
    $("#prospectsData").hide(); // Hide Prospects table
  });

  // Prospects button click event
  $("#prospectsTableBtn").click(function () {
    $("#prospectsData").show(); // Show Prospects table
    $("#clientsData").hide(); // Hide Clients table
  });

  $("#prospectsData").hide();

  $("#applicantTableBtn").click(function () {
    $("#applicantsData").show(); // Show Prospects table
    $("#tutorData").hide(); // Hide Clients table
  });

  $("#tutorTableBtn").click(function () {
    $("#tutorData").show(); // Show Prospects table
    $("#applicantsData").hide(); // Hide Clients table
  });

  $("#applicantsData").hide();

  $("#emailBtn").click(function () {
    $("#emailForm").show(); // Show Prospects table
    $("#noteForm").hide(); // Hide Clients table
    $("#offerForm").hide(); // Hide Clients table
  });

  $("#noteBtn").click(function () {
    $("#noteForm").show(); // Show Prospects table
    $("#emailForm").hide(); // Hide Clients table
    $("#offerForm").hide(); // Hide Clients table
  });

  $("#offerBtn").click(function () {
    $("#offerForm").show(); // Show Prospects table
    $("#emailForm").hide(); // Hide Clients table
    $("#noteForm").hide(); // Hide Clients table
  });

  $("#noteForm").hide();
  $("#emailForm").hide();

  $("#progressBtn").click(function () {
    $("#progress").show(); // Show Prospects table
    $("#logsheet").hide(); // Hide Clients table
  });

  $("#logsheetBtn").click(function () {
    $("#logsheet").show(); // Show Prospects table
    $("#progress").hide(); // Hide Clients table
  });

  $("#progress").hide();
});

$(document).ready(function () {
  $(".dic-spin").hide();
  $("#searchForm").submit(function (event) {
    event.preventDefault();
    $(".dic-spin").show();
    const word = $('input[name="word"]').val();

    $.ajax({
      url: "/tutor/dictionary",
      method: "POST",
      data: { word: word },
      success: function (data) {
        displayResults(data);
        $(".dic-spin").hide();
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  });

  function displayResults(data) {
    const resultsDiv = $("#results");
    resultsDiv.empty();

    // Create an inner div to contain the content
    const innerDiv = $('<div class="inner-content"></div>');

    data.forEach((entry) => {
      innerDiv.append(`<h2 class="mb-3">${entry.word}</h2>`);

      entry.meanings.forEach((meaning) => {
        innerDiv.append(`<h3 class="mb-2">${meaning.partOfSpeech}</h3>`);

        meaning.definitions.forEach((definition) => {
          innerDiv.append(
            `<p><strong>Definition:</strong> ${definition.definition}</p>`
          );
          if (definition.synonyms.length > 0) {
            innerDiv.append(
              `<p><strong>Synonyms:</strong> ${definition.synonyms.join(
                ", "
              )}</p>`
            );
          }
          if (definition.antonyms.length > 0) {
            innerDiv.append(
              `<p><strong>Antonyms:</strong> ${definition.antonyms.join(
                ", "
              )}</p>`
            );
          }
          if (definition.example) {
            innerDiv.append(
              `<p><strong>Example:</strong> ${definition.example}</p>`
            );
          }
        });
      });

      entry.phonetics.forEach((phonetic) => {
        innerDiv.append(`<p><strong>Phonetic:</strong> ${phonetic.text}</p>`);
        if (phonetic.audio) {
          innerDiv.append(
            `<audio controls class="mb-3"><source src="${phonetic.audio}" type="audio/mpeg"></audio>`
          );
        }
      });
    });

    // Append the inner div to the resultsDiv
    resultsDiv.append(innerDiv);

    // // Set height and overflow for the inner div
    // innerDiv.css({
    //   height: "100%",
    //   "overflow-y": "scroll",
    //   border: "1px solid #ccc",
    //   padding: "10px",
    // });

    // // Set height for resultsDiv
    // resultsDiv.css({
    //   height: "60%",
    //   overflow: "hidden",
    // });
  }
});

//CALCULATION FOR GUIDANCE AND COUNSELLING
$(document).ready(function () {
  function calculatePrice() {
    const mode = $("#preferredMode").val();
    const durationInput = $("#preferredDuration").val();
    const duration = parseFloat(durationInput);

    let baseCharge = 0;

    // Example calculation based on mode and duration
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
    // Add other conditions as needed

    // console.log("Base charge:", baseCharge);

    // Apply urgency increment
    let urgencyIncrement = 0;
    const urgency = $("#urgency").val();

    if (urgency === "Urgent") {
      urgencyIncrement = 0.3;
    } else if (urgency === "Moderately Urgent") {
      urgencyIncrement = 0.2;
    }

    // console.log("Urgency increment:", urgencyIncrement);

    // Calculate total price including urgency increment
    let totalPrice = baseCharge * (1 + urgencyIncrement);

    // console.log("Total price:", totalPrice);

    // Display the calculated price in the priceDisplay div
    $("#price").text(`Charges: ${totalPrice.toFixed(2)} Cedis`);
  }

  // Event listeners for changes in mode, duration, and urgency
  $("#preferredMode, #preferredDuration, #urgency").change(function () {
    // console.clear(); // Clear console for better debugging
    calculatePrice();
  });
});

//Counselling Form
$(document).ready(function () {
  $("#counselling-form").hide();
  $(".studentContactDetails").hide();
  $(".counselspin").hide();

  $(".bookSession").click(function () {
    $("#counselling-form").slideToggle();
    $(".counsellingIntro").slideToggle();
  });

  $(".studentCounsellingBtn").click(function () {
    $(".parentCounselling").hide();
    $(".studentContactDetails").show();
  });
  $(".parentCounsellingBtn").click(function () {
    $(".parentCounselling").show();
    $(".studentContactDetails").hide();

    $("#counselSubmit").click(function () {
      $(".counselspin").show();
    });
  });

  // $("#counselling-form").submit(function (e) {
  //   e.preventDefault();

  //   const form = $(this);
  //   const formData = form.serializeArray();

  //   $.ajax({
  //     type: "POST",
  //     url: "guidance/counselling",
  //     contentType: "application/json",
  //     data: JSON.stringify(formData),
  //     success: function () {
  //       alert("Form Data Sent");
  //     },
  //   });
  // });
});

$(document).ready(function () {
  $(".tutorFormRegister").hide();

  $(".allTuitionDataBtn").on("click", function () {
    // $(".allTuitionData").hide();
    $(".tutorFormRegister").slideToggle();
    $(".allTuitionData").slideToggle();
    // $("#privateTuitionPage").removeClass("banner");
    // addClass("client-banner");
  });
});
