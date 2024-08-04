// Objects with ID date_today will have current date displayed

document.addEventListener("DOMContentLoaded", async function () {
  const today = new Date();
  const date = today.toLocaleDateString();

  document.querySelectorAll("#date_today").forEach((elem) => {
    elem.innerHTML = date;
  });
});
