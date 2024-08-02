// Script which loads navbar from central source

document.addEventListener("DOMContentLoaded", async function() {
    async function load_navbar() {
        const element = document.getElementById("navbar-section");

        const navbar = await fetch("../elements/navbar.html");
        const text = await navbar.text();
        console.log("hello");
        element.innerHTML = text;

        return;
    }

    async function load_header() {
        const element = document.getElementById("header-section");

        const navbar = await fetch("../elements/page_header.html");
        const text = await navbar.text();
        
        element.innerHTML = text;

        return;
    }

    load_navbar();
    load_header();
});
