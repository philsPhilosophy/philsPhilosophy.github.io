// Objects with ID date_today will have current date displayed
const today = new Date();
const date = today.toLocaleDateString();

document.getElementById("date_today").innerHTML = date;
