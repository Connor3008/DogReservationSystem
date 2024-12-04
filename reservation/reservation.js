let reservations = [];
let editIndex = null; // Store the index of the reservation being edited


// Function to add a reservation

function addReservation() {
  const dogName = document.getElementById("dogName").value;
  const ownerName = document.getElementById("ownerName").value;
  const breed = document.getElementById("breed").value;
  const age = document.getElementById("age").value;
  const specialReq = document.getElementById("specialReq").value;
  const date = document.getElementById("date").value;


  // Validate required fields

  if (!dogName || !ownerName || !breed || !age || !date) {
    alert("Please fill in all required fields.");
    return;
  }


  // Check if age is a valid number
  if (isNaN(age) || age <= 0) {
    alert("Please enter a valid age.");
    return;
  }

  const reservationData = { dogName, ownerName, breed, age, specialReq, date };

  // Send the reservation data to the server
  fetch('http://localhost:3000/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reservationData),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Reservation added successfully') {
        alert(`Reservation added successfully! Confirmation number: ${data.confirmationNumber}`);
      } else {
        alert("Error adding reservation: " + data.message);
      }
    })
    .catch(error => {
      console.error("Error adding reservation:", error);
      alert("An error occurred while adding the reservation.");
    });

  // Clear form fields after submission
  document.getElementById("dogName").value = "";
  document.getElementById("ownerName").value = "";
  document.getElementById("breed").value = "";
  document.getElementById("age").value = "";
  document.getElementById("specialReq").value = "";
  document.getElementById("date").value = "";

}

// Function to display existing reservations (fetch from backend)
function displayReservations() {
  fetch('http://localhost:3000/reservations')
    .then(response => response.json())
    .then(data => {
      const reservationList = document.getElementById("reservationList");
      reservationList.innerHTML = ""; // Clear existing list

      if (data.length === 0) {
        reservationList.innerHTML = "<tr><td colspan='7'>No reservations found.</td></tr>";
      }

      data.forEach((reservation) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${reservation.confirmationNumber}</td>
          <td>${reservation.dogName}</td>
          <td>${reservation.ownerName}</td>
          <td>${reservation.breed}</td>
          <td>${reservation.age}</td>
          <td>${reservation.specialReq || 'None'}</td>
          <td>${reservation.date}</td>
        `;
        reservationList.appendChild(row);
      });
    })
    .catch(error => {
      console.error("Error fetching reservations:", error);
      alert("An error occurred while fetching the reservations.");
    });
}

// Logout functionality
const logoutButton = document.querySelector(".logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    window.location.href = "login/login.html"; // Adjust this path based on your project structure
  });
}
