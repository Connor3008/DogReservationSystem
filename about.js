// Logout functionality
const logoutButton = document.querySelector(".logout-button");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    window.location.href = "../login/login.html"; // Adjust this path based on your project structure
  });
}