// Function to check Enter key press on login page
function checkEnter(event) {
  if (event.key === "Enter") {
    login();
  }
}

// Login function
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  // Send login credentials to backend via POST request
  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === "Invalid credentials") {
      alert("Incorrect username or password.");
    } else {
      // On successful login
      userRole = data.role;
      alert(`Logged in as ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`);

      // Save user role in local storage
      localStorage.setItem("loggedInUserRole", JSON.stringify({username: username, role: data.role}));
      // Check for Admin role
      if (userRole === 'admin') {
        window.location.href = "../admin/admin.html"
      } else {
      // Redirect to the reservation page
      window.location.href = "../index.html";
      }
    }
  })
  .catch(error => {
    console.error("Error logging in:", error);
    alert("An error occurred while logging in.");
  });
}

// Show the registration page
function showRegisterPage() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("registerPage").style.display = "block";
  document.getElementById("registerErrorMessage").style.display = "none";
}

// Go back to the login page
function goToLogin() {
  document.getElementById("registerPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
}

// Register a new user
function register() {
  const newUsername = document.getElementById("newUsername").value;
  const newPassword = document.getElementById("newPassword").value;
  const errorMessage = document.getElementById("registerErrorMessage");

  if (!newUsername || !newPassword) {
    errorMessage.textContent = "Please fill in both fields.";
    errorMessage.style.display = "block";
    return;
  }

  // Send new user data to backend via POST request
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: newUsername, password: newPassword, role: 'user' })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === "Username already exists.") {
      errorMessage.textContent = "Username already exists. Choose another.";
      errorMessage.style.display = "block";
    } else {
      window.alert("Registration successful! Please log in.");
      goToLogin();
    }
  })
  .catch(error => {
    console.error("Error registering:", error);
    alert("An error occurred during registration.");
  });
}
