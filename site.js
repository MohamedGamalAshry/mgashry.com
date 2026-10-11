const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
    const updateHeaderState = () => {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 48);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
}
