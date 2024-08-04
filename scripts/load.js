// Script which loads navbar from central source

document.addEventListener("DOMContentLoaded", async function () {
  async function load_navbar() {
    const navbar = await fetch("/elements/navbar.html");
    const text = await navbar.text();

    document.querySelectorAll("#navbar-section").forEach((elem) => {
      elem.innerHTML = text;
    });
  }

  async function load_header() {
    const header = await fetch("/elements/page_header.html");
    const text = await header.text();

    document.querySelectorAll("#header-section").forEach((elem) => {
      elem.innerHTML = text;
    });
  }

  async function load_footer() {
    const footer = await fetch("/elements/footer.html");
    const text = await footer.text();

    document.querySelectorAll("#footer-section").forEach((elem) => {
      elem.innerHTML = text;
    });
  }

  load_navbar();
  load_header();
  load_footer();
});
