function submitForm(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  // Reset previous error messages and borders
  emailError.textContent = "";
  emailField.style.border = "1px solid #ddd";
  passwordError.textContent = "";
  passwordField.style.border = "1px solid #ddd";

  if (!email) {
    emailError.textContent = "Please enter your email.";
    emailField.style.border = "1px solid red";
  }

  if (!password) {
    passwordError.textContent = "Please enter your password.";
    passwordField.style.border = "1px solid red";
  }

  if (email && password) {
    // Send data to Express server using Fetch API
    fetch("/api/auth/userLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Successful login, let the server handle the redirection
          // location.reload(); //  refresh the page after successful login
          window.location.replace("/api/chat");
        } else if (response.status === 401) {
          // Handle 401 (Unauthorized) - Invalid credentials
          showError("Invalid credentials. Please try again.");
        } else {
          // Handle other cases (e.g., display a generic error message)
          showError("An error occurred. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("An error occurred. Please try again later.");
      });
  }
}

function showError(message) {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.textContent = message;
  setTimeout(() => {
    errorContainer.textContent = "";
  }, 5000); // Clear the error message after 5 seconds
}
