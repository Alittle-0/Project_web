(function () {
    const logo = document.querySelector(".menu__logo");
    const menu = document.querySelector(".menu");

    logo.addEventListener("click", () => {
        menu.classList.toggle("menu--open");
    });
})();
