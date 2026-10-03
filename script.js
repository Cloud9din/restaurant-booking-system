// =========================
// ELEMENTS
// =========================

const bookingForm = document.getElementById("booking-form");
const successMessage = document.getElementById("success-message");
const dateInput = document.getElementById("date");
const mobileMenuButton = document.getElementById("mobile-menu-button");
const navigation = document.querySelector(".navigation");


// =========================
// SET MINIMUM BOOKING DATE
// =========================

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

const todayFormatted = `${year}-${month}-${day}`;

dateInput.min = todayFormatted;


// =========================
// MOBILE MENU
// =========================

mobileMenuButton.addEventListener("click", () => {

  navigation.classList.toggle("open");

  if (navigation.classList.contains("open")) {
    mobileMenuButton.textContent = "✕";
  } else {
    mobileMenuButton.textContent = "☰";
  }

});


// Close mobile menu after clicking a link

document.querySelectorAll(".navigation a").forEach((link) => {

  link.addEventListener("click", () => {

    navigation.classList.remove("open");

    mobileMenuButton.textContent = "☰";

  });

});


// =========================
// CREATE BOOKING ID
// =========================

function createBookingId() {

  const randomNumber =
    Math.floor(1000 + Math.random() * 9000);

  return `RT-${randomNumber}`;

}


// =========================
// GET EXISTING BOOKINGS
// =========================

function getBookings() {

  const savedBookings =
    localStorage.getItem("restaurantBookings");

  if (!savedBookings) {
    return [];
  }

  return JSON.parse(savedBookings);

}


// =========================
// SAVE BOOKINGS
// =========================

function saveBookings(bookings) {

  localStorage.setItem(
    "restaurantBookings",
    JSON.stringify(bookings)
  );

}


// =========================
// FORM SUBMISSION
// =========================

bookingForm.addEventListener("submit", (event) => {

  event.preventDefault();


  // Get form values

  const name =
    document.getElementById("name").value.trim();

  const email =
    document.getElementById("email").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const date =
    document.getElementById("date").value;

  const time =
    document.getElementById("time").value;

  const guests =
    document.getElementById("guests").value;

  const requests =
    document.getElementById("requests").value.trim();


  // =========================
  // BASIC VALIDATION
  // =========================

  if (
    !name ||
    !email ||
    !phone ||
    !date ||
    !time ||
    !guests
  ) {

    successMessage.classList.add("show");

    successMessage.style.background = "#fff1f0";
    successMessage.style.borderColor = "#f0b7b2";
    successMessage.style.color = "#a3322a";

    successMessage.textContent =
      "Please complete all required fields.";

    return;

  }


  // =========================
  // CREATE BOOKING OBJECT
  // =========================

  const newBooking = {

    id: createBookingId(),

    name: name,

    email: email,

    phone: phone,

    date: date,

    time: time,

    guests: Number(guests),

    requests: requests,

    status: "Confirmed",

    createdAt:
      new Date().toISOString()

  };


  // =========================
  // SAVE BOOKING
  // =========================

  const bookings = getBookings();

  bookings.push(newBooking);

  saveBookings(bookings);


  // =========================
  // SHOW CONFIRMATION
  // =========================

  successMessage.classList.add("show");

  successMessage.style.background = "#eef8f2";
  successMessage.style.borderColor = "#b9dbc9";
  successMessage.style.color = "#1f7a4d";

  successMessage.innerHTML = `
    Reservation confirmed.<br>
    Booking reference:
    <strong>${newBooking.id}</strong>
  `;


  // Reset form

  bookingForm.reset();

  dateInput.min = todayFormatted;


  // Scroll confirmation into view

  successMessage.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });


  // Console message for development

  console.log(
    "Reservation saved:",
    newBooking
  );

});
