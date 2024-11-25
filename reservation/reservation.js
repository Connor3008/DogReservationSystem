const reservations = [];

    function addReservation() {
      const dogName = document.getElementById("dogName").value;
      const ownerName = document.getElementById("ownerName").value;
      const breed = document.getElementById("breed").value;
      const age = document.getElementById("age").value;
      const specialReq = document.getElementById("specialReq").value;
      const date = document.getElementById("date").value;
      const confirmationNumber = `CN${Math.floor(100000 + Math.random() * 900000)}`;
      
      if (!dogName || !ownerName || !breed || !age || !date) {
        alert("Please fill in all required fields.");
        return;
      }

      const reservation = { confirmationNumber, dogName, ownerName, breed, age, specialReq, date };
      reservations.push(reservation);
      displayReservations();
      
      document.getElementById("dogName").value = "";
      document.getElementById("ownerName").value = "";
      document.getElementById("breed").value = "";
      document.getElementById("age").value = "";
      document.getElementById("specialReq").value = "";
      document.getElementById("date").value = "";

      const confirmationDisplay = document.getElementById("confirmationDisplay");
      confirmationDisplay.textContent = `Your confirmation number is: ${confirmationNumber}`;
      confirmationDisplay.style.display = "block";
    }

    function displayReservations() {
      const reservationList = document.getElementById("reservationList");
      reservationList.innerHTML = ""; 
      
      reservations.forEach((reservation) => {
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

// Logout functionality
const logoutButton = document.querySelector(".logout-button");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    window.location.href = "login/login.html"; // Adjust this path based on your project structure
  });
}