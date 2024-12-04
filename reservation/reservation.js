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


  // Check if we're editing an existing reservation
  if (editIndex !== null) {
    // Update the existing reservation
    reservations[editIndex] = {
      confirmationNumber: reservations[editIndex].confirmationNumber, // Keep the same confirmation number
      dogName,
      ownerName,
      breed,
      age,
      specialReq,
      date
    };
    
    alert("Reservation updated!");
    editIndex = null; // Reset the edit index
    document.getElementById("addReservationButton").textContent = "Add Reservation"; // Change button text back to "Add Reservation"
  } else {
    // Create a new reservation
    const confirmationNumber = `CN${Math.floor(100000 + Math.random() * 900000)}`;
    const reservation = { confirmationNumber, dogName, ownerName, breed, age, specialReq, date };
    reservations.push(reservation);
    
    const confirmationDisplay = document.getElementById("confirmationDisplay");
    confirmationDisplay.textContent = `Your confirmation number is: ${confirmationNumber}`;
    confirmationDisplay.style.display = "block";
  }
  
  clearForm();
  displayReservations();
}

// Display the reservations in the table
function displayReservations() {
  const reservationList = document.getElementById("reservationList");
  reservationList.innerHTML = ""; // Clear the current list
  
  reservations.forEach((reservation, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${reservation.confirmationNumber}</td>
      <td>${reservation.dogName}</td>
      <td>${reservation.ownerName}</td>
      <td>${reservation.breed}</td>
      <td>${reservation.age}</td>
      <td>${reservation.specialReq}</td>
      <td>${reservation.date}</td>
      <td>
        <button class="btn" onclick="editReservation(${index})">Edit</button>
      </td>
    `;
    reservationList.appendChild(row);
  });
}

// Edit an existing reservation
function editReservation(index) {
  const reservation = reservations[index];
  
  // Pre-fill the form with the existing reservation data
  document.getElementById("dogName").value = reservation.dogName;
  document.getElementById("ownerName").value = reservation.ownerName;
  document.getElementById("breed").value = reservation.breed;
  document.getElementById("age").value = reservation.age;
  document.getElementById("specialReq").value = reservation.specialReq;
  document.getElementById("date").value = reservation.date;
  
  // Set the edit index to the current reservation being edited
  editIndex = index;
  
  // Change the "Add Reservation" button to "Update Reservation"
  document.getElementById("addReservationButton").textContent = "Update Reservation";
}

// Clear the form after adding/updating a reservation
function clearForm() {
  document.getElementById("dogName").value = "";
  document.getElementById("ownerName").value = "";
  document.getElementById("breed").value = "";
  document.getElementById("age").value = "";
  document.getElementById("specialReq").value = "";
  document.getElementById("date").value = "";
  
  // Reset button text if editing is canceled
  document.getElementById("addReservationButton").textContent = "Add Reservation";
=========

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
>>>>>>>>> Temporary merge branch 2
}

// Logout functionality
const logoutButton = document.querySelector(".logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    window.location.href = "login/login.html"; // Adjust this path based on your project structure
  });
}
