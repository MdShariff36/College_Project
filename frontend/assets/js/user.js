/* User panel scripts — read from localStorage and populate UI */

function loadUserDashboard() {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (user) {
    document.getElementById("userName").innerText = user.name || user.email;
  } else {
    // redirect to login if not found
    // window.location.href = '../login.html';
  }

  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]").filter(
    (b) => {
      // for demo: all bookings are visible
      return true;
    }
  );

  document.getElementById("totalBookings").innerText = bookings.length;
  const active = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  ).length;
  document.getElementById("activeBookings").innerText = active;

  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  document.getElementById("savedCars").innerText = wishlist.length;

  // recent bookings
  const recentCon = document.getElementById("recentBookings");
  if (recentCon) {
    recentCon.innerHTML = "";
    if (bookings.length === 0) {
      recentCon.innerHTML = '<p class="muted">You have no bookings.</p>';
    } else {
      const ul = document.createElement("ul");
      bookings
        .slice()
        .reverse()
        .slice(0, 5)
        .forEach((b) => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${b.car}</strong> — ${b.start} to ${b.end} — <em>${b.status}</em>`;
          ul.appendChild(li);
        });
      recentCon.appendChild(ul);
    }
  }
}

function loadMyBookings() {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const container = document.getElementById("bookingsList");
  if (!container) return;
  container.innerHTML = "";
  if (bookings.length === 0) {
    container.innerHTML =
      '<p class="muted">No bookings yet. Make your first booking!</p>';
    return;
  }
  bookings.forEach((b) => {
    const card = document.createElement("article");
    card.className = "car-card";
    card.innerHTML = `
      <div class="card-body">
        <h3>${b.car}</h3>
        <p class="muted">${b.start} → ${b.end}</p>
        <div class="card-row">
          <div class="price">${b.status}</div>
          <div>
            <button class="btn btn-sm" onclick="cancelBooking(${b.id})">Cancel</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function loadWishlist() {
  const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const container = document.getElementById("wishlistGrid");
  if (!container) return;
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = '<p class="muted">No saved cars yet.</p>';
    return;
  }
  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "car-card";
    card.innerHTML = `
      <img src="${item.image || "../assets/images/cars/car1.jpg"}" alt="${
      item.model
    }" />
      <div class="card-body">
        <h3>${item.model}</h3>
        <p class="muted">${item.category} • ${item.transmission}</p>
        <div class="card-row">
          <div class="price">₹${item.price} / day</div>
          <div><button class="btn btn-sm" onclick="removeFromWishlist('${
            item.model
          }')">Remove</button></div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function cancelBooking(id) {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = "cancelled";
    localStorage.setItem("bookings", JSON.stringify(bookings));
    alert("Booking cancelled.");
    loadMyBookings();
    loadUserDashboard();
  }
}

function removeFromWishlist(model) {
  let list = JSON.parse(localStorage.getItem("wishlist") || "[]");
  list = list.filter((i) => i.model !== model);
  localStorage.setItem("wishlist", JSON.stringify(list));
  loadWishlist();
  loadUserDashboard();
}

// Initialize when user pages load
document.addEventListener("DOMContentLoaded", () => {
  loadUserDashboard();
  loadMyBookings();
  loadWishlist();

  // Pre-fill profile form if present
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  if (user) {
    const nameEl = document.getElementById("profileName");
    const emailEl = document.getElementById("profileEmail");
    const phoneEl = document.getElementById("profilePhone");
    const cityEl = document.getElementById("profileCity");
    if (nameEl) nameEl.value = user.name || "";
    if (emailEl) emailEl.value = user.email || "";
    if (phoneEl) phoneEl.value = user.phone || "";
    if (cityEl) cityEl.value = user.city || "";
  }
});
