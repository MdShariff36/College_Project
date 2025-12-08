/* Simple auth simulation using localStorage */

// Register
function registerSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;
  const phone = document.getElementById("regPhone").value;
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find((u) => u.email === email)) {
    alert("Email already registered. Please login.");
    return false;
  }
  const user = { id: Date.now(), name, email, pass, phone };
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(user));
  alert("Registration successful. Redirecting to dashboard.");
  window.location.href = "user/dashboard.html";
  return false;
}

// Login
function loginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPass").value;
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email && u.pass === pass);
  if (!user) {
    alert("Invalid credentials.");
    return false;
  }
  localStorage.setItem("currentUser", JSON.stringify(user));
  alert("Login successful.");
  window.location.href = "user/dashboard.html";
  return false;
}

// Profile save
function saveProfile(e) {
  e.preventDefault();
  const name = document.getElementById("profileName").value;
  const email = document.getElementById("profileEmail").value;
  const phone = document.getElementById("profilePhone").value;
  const city = document.getElementById("profileCity").value;
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  user.name = name;
  user.email = email;
  user.phone = phone;
  user.city = city;
  localStorage.setItem("currentUser", JSON.stringify(user));

  // update user in users array
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx !== -1) users[idx] = user;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Profile saved.");
  return false;
}

function logoutUser() {
  localStorage.removeItem("currentUser");
  alert("Logged out.");
  window.location.href = "../index.html";
}
