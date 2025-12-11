/* assets/js/admin.js
  Minimal admin UI interactions for demo
*/
document.addEventListener("DOMContentLoaded", () => {
  const addCarForm = document.querySelector("#add-car-form");
  if (addCarForm) {
    addCarForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Car added (demo). Persist on backend.");
      addCarForm.reset();
    });
  }
});
