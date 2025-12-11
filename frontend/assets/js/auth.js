/* assets/js/auth.js
  Simple front-end placeholders for login/register forms
*/
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.querySelector("[name=email]").value;
      alert(`Logged in as ${email} (demo). Replace with real auth.`);
      window.location.href = "user/dashboard.html";
    });
  }

  const regForm = document.querySelector("#register-form");
  if (regForm) {
    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Registration completed (demo). Please implement server logic.");
      window.location.href = "login.html";
    });
  }
});
