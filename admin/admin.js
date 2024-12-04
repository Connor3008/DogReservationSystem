// Fetch and display reservations when the admin page is loaded
window.onload = function() {
  const role = JSON.parse(localStorage.getItem('loggedInUserRole')).role;

  if (role !== 'admin') {
    window.location.href = "login/login.html"; // Redirect to login if not admin
  }

  fetchReservations();
};

// Fetch all reservations from the backend
function fetchReservations() {
  fetch('http://localhost:3000/reservations')
    .then(response => response.json())
    .then(data => {
      displayReservations(data.reservations);
    })
    .catch(error => {
      console.error("Error fetching reservations:", error);
      alert("An error occurred while fetching reservations.");
    });
}

// Display reservations in the table
function displayReservations(reservations) {
  const reservationList = document.getElementById("reservationList");
  reservationList.innerHTML = ""; // Clear existing reservations

  reservations.forEach(reservation => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${reservation.confirmationNumber}</td>
      <td>${reservation.dogName}</td>
      <td>${reservation.ownerName}</td>
      <td>${reservation.breed}</td>
      <td>${reservation.age}</td>
      <td>${reservation.specialReq}</td>
      <td>${reservation.date}</td>
    `;
    reservationList.appendChild(row);
  });
}

// Filter reservations based on the search input
function filterReservations() {
  const searchValue = document.getElementById("searchBar").value.toLowerCase();
  const rows = document.querySelectorAll("#reservationList tr");

  rows.forEach(row => {
    const dogName = row.cells[1].textContent.toLowerCase();
    const ownerName = row.cells[2].textContent.toLowerCase();
    
    if (dogName.includes(searchValue) || ownerName.includes(searchValue)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}
