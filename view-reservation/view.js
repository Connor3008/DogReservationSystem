// Fetch reservations and display them in the table
function fetchReservations() {
  fetch('http://localhost:3000/reservations')
    .then(response => response.json())
    .then(data => {
      const reservationList = document.getElementById("reservationList");
      reservationList.innerHTML = ""; // Clear existing list

      if (data.length === 0) {
        reservationList.innerHTML = `<tr><td colspan="8">No reservations found.</td></tr>`;
        return;
      }

      data.forEach(reservation => {
        const row = document.createElement("tr");
        row.id = `reservation-${reservation.id}`; // Set a unique ID for the row

        row.innerHTML = `
          <td>${reservation.confirmation_number}</td>
          <td>${reservation.dog_name}</td>
          <td>${reservation.owner_name}</td>
          <td>${reservation.breed}</td>
          <td>${reservation.age}</td>
          <td>${reservation.special_requirements || "None"}</td>
          <td>${reservation.date}</td>
          <td class="action-buttons">
            <button class="edit-btn" onclick="editReservation(${reservation.id})">Edit</button>
            <button class="delete-btn" onclick="deleteReservation(${reservation.id})">Delete</button>
            <button class="checkin-btn" onclick="checkInReservation(${reservation.id})">Check In</button>
          </td>
        `;

        reservationList.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error fetching reservations:", error);
      alert("An error occurred while fetching reservations.");
    });
}

// Edit Reservation (open a modal or form to edit the reservation)
function editReservation(id) {
  const dogName = prompt("Enter new dog name:");
  const ownerName = prompt("Enter new owner name:");
  const breed = prompt("Enter new breed:");
  const age = prompt("Enter new age:");
  const specialReq = prompt("Enter new special requirements (or leave blank):");
  const date = prompt("Enter new date (YYYY-MM-DD):");

  if (!dogName || !ownerName || !breed || !age || !date) {
    alert("All fields are required for editing.");
    return;
  }

  fetch(`http://localhost:3000/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dogName, ownerName, breed, age, specialReq, date }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Reservation updated successfully') {
        alert("Reservation updated successfully!");
        fetchReservations(); // Refresh the table
      }
    })
    .catch(error => {
      console.error("Error editing reservation:", error);
      alert("An error occurred while editing the reservation.");
    });
}

// Delete Reservation
function deleteReservation(id) {
  if (!confirm("Are you sure you want to delete this reservation?")) return;

  fetch(`http://localhost:3000/reservations/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Reservation deleted successfully') {
        document.getElementById(`reservation-${id}`).remove(); // Remove the row from the table
        alert("Reservation deleted successfully!");
      }
    })
    .catch(error => {
      console.error("Error deleting reservation:", error);
      alert("An error occurred while deleting the reservation.");
    });
}

// Fetch reservations on page load
document.addEventListener("DOMContentLoaded", fetchReservations);

// Logout functionality
const logoutButton = document.querySelector(".logout-button");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    window.location.href = "../login/login.html"; // Adjust this path based on your project structure
  });
}

// Check In Reservation (placeholder functionality)
function checkInReservation(id) {
  alert(`You have successfully checked in your pet with reservation ID: ${id}`);
}

function checkoutReservations(id){
  window.location.href = `../payment/payment.html?reservationId=${id}`;
}
