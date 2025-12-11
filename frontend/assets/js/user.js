/* assets/js/user.js
  Small interactions for user panel demo
*/
document.addEventListener("DOMContentLoaded", () => {
  // collapse demo
  document.querySelectorAll(".cancel-booking").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Cancel booking? (demo)")) {
        const row = e.target.closest("tr");
        if (row) row.remove();
      }
    });
  });
});
