# 🍽️ ReserveTable — Restaurant Booking System

A modern and responsive restaurant reservation application built with **HTML, CSS and JavaScript**.

ReserveTable allows customers to create restaurant reservations and provides a separate booking management dashboard where reservations can be searched, filtered, edited, cancelled and deleted.

This project was created as part of my web development portfolio to demonstrate practical front-end development skills and JavaScript DOM manipulation.

---

## 🌐 Live Demo

**Live Website:**  

[https://github.com/Cloud9din/restaurant-booking-system](https://cloud9din.github.io/restaurant-booking-system/)


## ✨ Features

### Customer Booking

- Responsive restaurant booking form
- Customer name, email and phone number
- Booking date selection
- Booking time selection
- Number of guests
- Special requests and dietary information
- Prevents selection of past dates
- Form validation
- Automatic booking reference generation
- Reservation confirmation message
- Mobile-friendly navigation

### Booking Management Dashboard

- View all restaurant reservations
- Total booking statistics
- Today's booking count
- Total guest count
- Confirmed booking count
- Search reservations
- Filter by booking status
- Sort reservations by:
  - Newest booking
  - Reservation date
  - Customer name
- Edit existing reservations
- Change booking status
- Cancel reservations
- Delete reservations
- Confirmation modal before deletion
- Responsive dashboard design

---

## 🛠️ Technologies Used

- **HTML5** — page structure and semantic markup
- **CSS3** — responsive design, layouts and styling
- **JavaScript** — application functionality and DOM manipulation
- **LocalStorage** — browser-based reservation storage
- **Git & GitHub** — version control and project hosting
- **GitHub Pages** — live project deployment

---

## 💻 Application Flow

The application follows this simple booking process:

```text
Customer Booking Form
        ↓
Form Validation
        ↓
Create Booking Object
        ↓
Generate Booking Reference
        ↓
Save to LocalStorage
        ↓
Display Confirmation
        ↓
Booking Dashboard
        ↓
Search / Filter / Edit / Cancel / Delete
