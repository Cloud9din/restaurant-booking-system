// ==================================================
// RESTAURANT BOOKING MANAGEMENT DASHBOARD
// ==================================================

const STORAGE_KEY = "restaurantBookings";


// =========================
// ELEMENTS
// =========================

const tableBody =
  document.getElementById("bookings-table-body");

const emptyBookings =
  document.getElementById("empty-bookings");

const resultCount =
  document.getElementById("booking-result-count");

const totalBookingsElement =
  document.getElementById("total-bookings");

const todayBookingsElement =
  document.getElementById("today-bookings");

const totalGuestsElement =
  document.getElementById("total-guests");

const confirmedBookingsElement =
  document.getElementById("confirmed-bookings");

const searchInput =
  document.getElementById("booking-search");

const statusFilter =
  document.getElementById("status-filter");

const sortFilter =
  document.getElementById("sort-filter");


// Edit modal

const editModal =
  document.getElementById("edit-modal");

const editForm =
  document.getElementById("edit-booking-form");

const closeModalButton =
  document.getElementById("close-modal");

const cancelEditButton =
  document.getElementById("cancel-edit");


// Delete modal

const deleteModal =
  document.getElementById("delete-modal");

const cancelDeleteButton =
  document.getElementById("cancel-delete");

const confirmDeleteButton =
  document.getElementById("confirm-delete");


// Mobile menu

const mobileMenuButton =
  document.getElementById("mobile-menu-button");

const navigation =
  document.querySelector(".navigation");


// Booking waiting to be deleted

let bookingToDelete = null;


// =========================
// GET BOOKINGS
// =========================

function getBookings() {

  const savedBookings =
    localStorage.getItem(STORAGE_KEY);

  if (!savedBookings) {
    return [];
  }

  try {

    return JSON.parse(savedBookings);

  } catch (error) {

    console.error(
      "Unable to read bookings:",
      error
    );

    return [];

  }

}


// =========================
// SAVE BOOKINGS
// =========================

function saveBookings(bookings) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(bookings)
  );

}


// =========================
// TODAY'S DATE
// =========================

function getTodayDate() {

  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


// =========================
// FORMAT DATE
// =========================

function formatBookingDate(dateString) {

  if (!dateString) {
    return "";
  }

  const date =
    new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


// =========================
// ESCAPE USER CONTENT
// =========================

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// =========================
// UPDATE STATISTICS
// =========================

function updateStatistics(bookings) {

  const today =
    getTodayDate();


  const totalBookings =
    bookings.length;


  const todayBookings =
    bookings.filter(
      booking =>
        booking.date === today &&
        booking.status !== "Cancelled"
    ).length;


  const totalGuests =
    bookings
      .filter(
        booking =>
          booking.status !== "Cancelled"
      )
      .reduce(
        (total, booking) =>
          total +
          Number(booking.guests || 0),
        0
      );


  const confirmedBookings =
    bookings.filter(
      booking =>
        booking.status === "Confirmed"
    ).length;


  totalBookingsElement.textContent =
    totalBookings;

  todayBookingsElement.textContent =
    todayBookings;

  totalGuestsElement.textContent =
    totalGuests;

  confirmedBookingsElement.textContent =
    confirmedBookings;

}


// =========================
// FILTER BOOKINGS
// =========================

function getFilteredBookings() {

  let bookings = getBookings();


  const searchValue =
    searchInput.value
      .trim()
      .toLowerCase();


  const selectedStatus =
    statusFilter.value;


  const selectedSort =
    sortFilter.value;


  // Search

  if (searchValue) {

    bookings =
      bookings.filter(booking => {

        const searchableContent = `
          ${booking.id || ""}
          ${booking.name || ""}
          ${booking.email || ""}
          ${booking.phone || ""}
          ${booking.date || ""}
        `.toLowerCase();

        return searchableContent.includes(
          searchValue
        );

      });

  }


  // Status Filter

  if (selectedStatus !== "all") {

    bookings =
      bookings.filter(
        booking =>
          booking.status ===
          selectedStatus
      );

  }


  // Sort

  if (selectedSort === "newest") {

    bookings.sort((a, b) => {

      return new Date(
        b.createdAt || 0
      ) -
      new Date(
        a.createdAt || 0
      );

    });

  }


  if (selectedSort === "date") {

    bookings.sort((a, b) => {

      const first =
        `${a.date}T${a.time || "00:00"}`;

      const second =
        `${b.date}T${b.time || "00:00"}`;

      return (
        new Date(first) -
        new Date(second)
      );

    });

  }


  if (selectedSort === "name") {

    bookings.sort((a, b) => {

      return String(
        a.name || ""
      ).localeCompare(
        String(b.name || "")
      );

    });

  }


  return bookings;

}


// =========================
// CREATE TABLE ROW
// =========================

function createBookingRow(booking) {

  const row =
    document.createElement("tr");


  const statusClass =
    booking.status === "Cancelled"
      ? "status-cancelled"
      : "status-confirmed";


  row.innerHTML = `

    <td>

      <span class="booking-reference">
        ${escapeHTML(booking.id)}
      </span>

    </td>


    <td>

      <span class="customer-name">
        ${escapeHTML(booking.name)}
      </span>

      <span class="customer-email">
        ${escapeHTML(booking.email)}
      </span>

    </td>


    <td>

      <span class="booking-date">
        ${formatBookingDate(
          booking.date
        )}
      </span>

      <span class="booking-time">
        ${escapeHTML(booking.time)}
      </span>

    </td>


    <td>

      ${escapeHTML(booking.guests)}

    </td>


    <td>

      <span
        class="status-badge ${statusClass}"
      >
        ${escapeHTML(booking.status)}
      </span>

    </td>


    <td>

      <div class="action-buttons">

        <button
          type="button"
          class="edit-button"
          data-id="${escapeHTML(booking.id)}"
        >
          Edit
        </button>


        <button
          type="button"
          class="delete-button"
          data-id="${escapeHTML(booking.id)}"
        >
          Delete
        </button>

      </div>

    </td>

  `;


  return row;

}


// =========================
// RENDER BOOKINGS
// =========================

function renderBookings() {

  const allBookings =
    getBookings();

  const filteredBookings =
    getFilteredBookings();


  // Update statistics using all bookings

  updateStatistics(allBookings);


  // Clear table

  tableBody.innerHTML = "";


  // Result count

  resultCount.textContent =
    `${filteredBookings.length} ${
      filteredBookings.length === 1
        ? "booking"
        : "bookings"
    }`;


  // Empty state

  if (filteredBookings.length === 0) {

    emptyBookings.classList.add("show");

    return;

  }


  emptyBookings.classList.remove("show");


  // Render rows

  filteredBookings.forEach(
    booking => {

      const row =
        createBookingRow(booking);

      tableBody.appendChild(row);

    }
  );


  addTableButtonEvents();

}


// =========================
// TABLE BUTTON EVENTS
// =========================

function addTableButtonEvents() {


  // Edit buttons

  document
    .querySelectorAll(".edit-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openEditModal(
            button.dataset.id
          );

        }
      );

    });


  // Delete buttons

  document
    .querySelectorAll(".delete-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openDeleteModal(
            button.dataset.id
          );

        }
      );

    });

}


// =========================
// OPEN EDIT MODAL
// =========================

function openEditModal(bookingId) {

  const bookings =
    getBookings();

  const booking =
    bookings.find(
      item =>
        item.id === bookingId
    );


  if (!booking) {
    return;
  }


  document.getElementById(
    "edit-id"
  ).value = booking.id;


  document.getElementById(
    "edit-name"
  ).value = booking.name || "";


  document.getElementById(
    "edit-email"
  ).value = booking.email || "";


  document.getElementById(
    "edit-phone"
  ).value = booking.phone || "";


  document.getElementById(
    "edit-date"
  ).value = booking.date || "";


  document.getElementById(
    "edit-time"
  ).value = booking.time || "";


  document.getElementById(
    "edit-guests"
  ).value = booking.guests || 1;


  document.getElementById(
    "edit-status"
  ).value =
    booking.status || "Confirmed";


  document.getElementById(
    "edit-requests"
  ).value =
    booking.requests || "";


  editModal.classList.add("open");

  editModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

}


// =========================
// CLOSE EDIT MODAL
// =========================

function closeEditModal() {

  editModal.classList.remove("open");

  editModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";

}


// =========================
// SAVE EDITED BOOKING
// =========================

editForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const bookingId =
      document.getElementById(
        "edit-id"
      ).value;


    const bookings =
      getBookings();


    const bookingIndex =
      bookings.findIndex(
        booking =>
          booking.id === bookingId
      );


    if (bookingIndex === -1) {
      return;
    }


    bookings[bookingIndex] = {

      ...bookings[bookingIndex],

      name:
        document.getElementById(
          "edit-name"
        ).value.trim(),

      email:
        document.getElementById(
          "edit-email"
        ).value.trim(),

      phone:
        document.getElementById(
          "edit-phone"
        ).value.trim(),

      date:
        document.getElementById(
          "edit-date"
        ).value,

      time:
        document.getElementById(
          "edit-time"
        ).value,

      guests:
        Number(
          document.getElementById(
            "edit-guests"
          ).value
        ),

      status:
        document.getElementById(
          "edit-status"
        ).value,

      requests:
        document.getElementById(
          "edit-requests"
        ).value.trim(),

      updatedAt:
        new Date().toISOString()

    };


    saveBookings(bookings);

    closeEditModal();

    renderBookings();

  }
);


// =========================
// EDIT MODAL BUTTONS
// =========================

closeModalButton.addEventListener(
  "click",
  closeEditModal
);


cancelEditButton.addEventListener(
  "click",
  closeEditModal
);


// Close when clicking overlay

editModal
  .querySelector(".modal-overlay")
  .addEventListener(
    "click",
    closeEditModal
  );


// =========================
// DELETE MODAL
// =========================

function openDeleteModal(bookingId) {

  bookingToDelete =
    bookingId;


  deleteModal.classList.add(
    "open"
  );


  deleteModal.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";

}


// =========================
// CLOSE DELETE MODAL
// =========================

function closeDeleteModal() {

  deleteModal.classList.remove(
    "open"
  );


  deleteModal.setAttribute(
    "aria-hidden",
    "true"
  );


  bookingToDelete = null;


  document.body.style.overflow = "";

}


// =========================
// CONFIRM DELETE
// =========================

confirmDeleteButton.addEventListener(
  "click",
  () => {

    if (!bookingToDelete) {
      return;
    }


    const bookings =
      getBookings();


    const updatedBookings =
      bookings.filter(
        booking =>
          booking.id !==
          bookingToDelete
      );


    saveBookings(
      updatedBookings
    );


    closeDeleteModal();

    renderBookings();

  }
);


// Cancel delete

cancelDeleteButton.addEventListener(
  "click",
  closeDeleteModal
);


// Overlay delete close

deleteModal
  .querySelector(".modal-overlay")
  .addEventListener(
    "click",
    closeDeleteModal
  );


// =========================
// SEARCH & FILTER EVENTS
// =========================

searchInput.addEventListener(
  "input",
  renderBookings
);


statusFilter.addEventListener(
  "change",
  renderBookings
);


sortFilter.addEventListener(
  "change",
  renderBookings
);


// =========================
// MOBILE MENU
// =========================

mobileMenuButton.addEventListener(
  "click",
  () => {

    navigation.classList.toggle(
      "open"
    );


    mobileMenuButton.textContent =
      navigation.classList.contains(
        "open"
      )
        ? "✕"
        : "☰";

  }
);


// Close menu after clicking link

document
  .querySelectorAll(
    ".navigation a"
  )
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        navigation.classList.remove(
          "open"
        );

        mobileMenuButton.textContent =
          "☰";

      }
    );

  });


// =========================
// ESCAPE KEY CLOSES MODALS
// =========================

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      if (
        editModal.classList.contains(
          "open"
        )
      ) {

        closeEditModal();

      }


      if (
        deleteModal.classList.contains(
          "open"
        )
      ) {

        closeDeleteModal();

      }

    }

  }
);


// =========================
// INITIAL LOAD
// =========================

renderBookings();
