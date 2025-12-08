/* Common site JS (public) */

// mobile menu toggle (simple)
function toggleMobileMenu() {
  const nav = document.querySelector(".main-nav");
  if (!nav) return;
  nav.style.display = nav.style.display === "flex" ? "none" : "flex";
}

// Quick search on home page
function quickSearch(e) {
  e.preventDefault();
  const city = document.getElementById("qs-location").value;
  const start = document.getElementById("qs-start").value;
  const end = document.getElementById("qs-end").value;
  const cat = document.getElementById("qs-category").value;
  // Simple redirect to cars page with query params
  const params = new URLSearchParams({ city, start, end, cat });
  window.location.href = "cars.html?" + params.toString();
  return false;
}

// Booking form handler (booking.html)
function submitBookingForm(e) {
  e.preventDefault();
  const car = document.getElementById("bookCar").value || "Not specified";
  const start = document.getElementById("bookStart").value;
  const end = document.getElementById("bookEnd").value;
  const name = document.getElementById("bookName").value;
  const phone = document.getElementById("bookPhone").value;

  const booking = {
    id: Date.now(),
    car,
    start,
    end,
    name,
    phone,
    status: "pending",
  };
  // store in localStorage demo
  const all = JSON.parse(localStorage.getItem("bookings") || "[]");
  all.push(booking);
  localStorage.setItem("bookings", JSON.stringify(all));
  alert("Booking submitted — check My Bookings for details.");
  window.location.href = "user/my-bookings.html";
  return false;
}

// Contact form handler
function submitContactForm(e) {
  e.preventDefault();
  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const msg = document.getElementById("contactMessage").value;
  // demo: store contact messages locally
  const msgs = JSON.parse(localStorage.getItem("messages") || "[]");
  msgs.push({ id: Date.now(), name, email, msg });
  localStorage.setItem("messages", JSON.stringify(msgs));
  alert("Thanks — we received your message. We will be in touch.");
  e.target.reset();
  return false;
}

// Newsletter
function newsletterSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("newsletterEmail").value;
  const subs = JSON.parse(localStorage.getItem("newsletter") || "[]");
  subs.push({ id: Date.now(), email });
  localStorage.setItem("newsletter", JSON.stringify(subs));
  alert("Subscribed — check your inbox for coupons.");
  window.location.href = "index.html";
  return false;
}

// Simple helper: parse query string for pre-filling booking page
function prefillBookingFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const car = params.get("car");
  if (car) {
    const input = document.getElementById("bookCar");
    if (input) input.value = car;
  }
}

// Run on pages
document.addEventListener("DOMContentLoaded", () => {
  prefillBookingFromQuery();
});
