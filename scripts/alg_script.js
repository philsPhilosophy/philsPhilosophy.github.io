// Expands drop down elements

document.addEventListener("DOMContentLoaded", async function () {
  var expandableItems = document.querySelectorAll(".expandable");
  for (var i = 0; i < expandableItems.length; i++) {
    expandableItems[i].addEventListener("click", function () {
      this.classList.toggle("expanded");
    });
  }
});
