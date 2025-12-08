/* Admin frontend simulation using localStorage */

// Simple admin login (demo)
function adminLogin(e) {
  e.preventDefault();
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;
  // DO NOT use in production. This is a frontend demo.
  if (user === "admin" && pass === "admin123") {
    localStorage.setItem("adminAuth", "true");
    window.location.href = "dashboard.html";
    return false;
  }
  alert("Invalid admin credentials. Use admin / admin123 for demo.");
  return false;
}

// Add car
function addCar(e) {
  e.preventDefault();
  const model = document.getElementById("carModel").value;
  const category = document.getElementById("carCategory").value;
  const transmission = document.getElementById("carTransmission").value;
  const price = document.getElementById("carPrice").value;
  const image =
    document.getElementById("carImage").value ||
    "../assets/images/cars/car1.jpg";

  const cars = JSON.parse(localStorage.getItem("cars") || "[]");
  cars.push({ id: Date.now(), model, category, transmission, price, image });
  localStorage.setItem("cars", JSON.stringify(cars));
  alert("Car added.");
  window.location.href = "cars.html";
  return false;
}

// Load admin dashboard stats and lists
function loadAdminDashboard() {
  const cars = JSON.parse(localStorage.getItem("cars") || "[]");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");

  const statCars = document.getElementById("statCars");
  const statUsers = document.getElementById("statUsers");
  const statBookings = document.getElementById("statBookings");

  if (statCars) statCars.innerText = cars.length;
  if (statUsers) statUsers.innerText = users.length;
  if (statBookings) statBookings.innerText = bookings.length;

  // populate recent bookings
  const rb = document.getElementById("adminRecentBookings");
  if (rb) {
    rb.innerHTML = "";
    if (bookings.length === 0) {
      rb.innerHTML = '<p class="muted">No bookings yet.</p>';
    } else {
      const ul = document.createElement("ul");
      bookings
        .slice()
        .reverse()
        .slice(0, 8)
        .forEach((b) => {
          const li = document.createElement("li");
          li.innerHTML = `${b.car} — ${b.start} → ${b.end} — <strong>${b.status}</strong>`;
          ul.appendChild(li);
        });
      rb.appendChild(ul);
    }
  }
}

// Populate cars list in admin/cars.html
function loadAdminCars() {
  const cars = JSON.parse(localStorage.getItem("cars") || "[]");
  const el = document.getElementById("carsTable");
  if (!el) return;
  el.innerHTML = "";
  if (cars.length === 0) {
    el.innerHTML = '<p class="muted">No cars yet. Add a car.</p>';
    return;
  }
  const table = document.createElement("table");
  table.style.width = "100%";
  table.innerHTML = `<thead><tr><th>Model</th><th>Category</th><th>Transmission</th><th>Price</th><th>Actions</th></tr></thead>`;
  const tbody = document.createElement("tbody");
  cars.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${c.model}</td><td>${c.category}</td><td>${c.transmission}</td><td>₹${c.price}</td>
      <td>
        <button class="btn btn-sm" onclick='editCar("${c.id}")'>Edit</button>
        <button class="btn btn-sm" onclick='deleteCar("${c.id}")'>Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  el.appendChild(table);
}

function editCar(id) {
  const cars = JSON.parse(localStorage.getItem("cars") || "[]");
  const car = cars.find((c) => c.id == id);
  if (!car) {
    alert("Car not found");
    return;
  }
  // quick prompt edit (demo)
  const model = prompt("Model", car.model);
  const price = prompt("Price", car.price);
  if (model) car.model = model;
  if (price) car.price = price;
  localStorage.setItem("cars", JSON.stringify(cars));
  loadAdminCars();
}

function deleteCar(id) {
  let cars = JSON.parse(localStorage.getItem("cars") || "[]");
  cars = cars.filter((c) => c.id != id);
  localStorage.setItem("cars", JSON.stringify(cars));
  loadAdminCars();
}

// Load bookings list for admin/bookings.html
function loadAdminBookings() {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const el = document.getElementById("allBookings");
  if (!el) return;
  el.innerHTML = "";
  if (bookings.length === 0) {
    el.innerHTML = '<p class="muted">No bookings.</p>';
    return;
  }
  const table = document.createElement("table");
  table.style.width = "100%";
  table.innerHTML = `<thead><tr><th>Booking ID</th><th>Car</th><th>Customer</th><th>Dates</th><th>Status</th><th>Action</th></tr></thead>`;
  const tbody = document.createElement("tbody");
  bookings.forEach((b) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${b.id}</td><td>${b.car}</td><td>${b.name} (${
      b.phone || "—"
    })</td><td>${b.start} → ${b.end}</td>
      <td>${b.status}</td>
      <td>
        <button class="btn btn-sm" onclick="updateBookingStatus(${
          b.id
        }, 'confirmed')">Confirm</button>
        <button class="btn btn-sm" onclick="updateBookingStatus(${
          b.id
        }, 'cancelled')">Cancel</button>
      </td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  el.appendChild(table);
}

function updateBookingStatus(id, status) {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings[idx].status = status;
    localStorage.setItem("bookings", JSON.stringify(bookings));
    loadAdminBookings();
    loadAdminDashboard();
  }
}

// Load users list in admin/users.html
function loadAdminUsers() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const el = document.getElementById("usersTable");
  if (!el) return;
  el.innerHTML = "";
  if (users.length === 0) {
    el.innerHTML = '<p class="muted">No registered users.</p>';
    return;
  }
  const table = document.createElement("table");
  table.style.width = "100%";
  table.innerHTML = `<thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr></thead>`;
  const tbody = document.createElement("tbody");
  users.forEach((u) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${u.name}</td><td>${u.email}</td><td>${
      u.phone || "—"
    }</td>
      <td><button class="btn btn-sm" onclick='deleteUser("${
        u.id
      }")'>Delete</button></td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  el.appendChild(table);
}

function deleteUser(id) {
  if (!confirm("Delete user permanently?")) return;
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  users = users.filter((u) => u.id != id);
  localStorage.setItem("users", JSON.stringify(users));
  loadAdminUsers();
}

// Sample report download
function downloadSampleReport() {
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  let csv = "id,car,name,phone,start,end,status\n";
  bookings.forEach((b) => {
    csv += `${b.id},"${b.car}","${b.name}",${b.phone || ""},${b.start},${
      b.end
    },${b.status}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bookings_report.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Initialize admin pages
document.addEventListener("DOMContentLoaded", () => {
  loadAdminDashboard();
  loadAdminCars();
  loadAdminBookings();
  loadAdminUsers();
});
