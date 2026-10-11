const siteHeader = document.querySelector(".site-header");

const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
    const progressRing = backToTop.querySelector(".scroll-progress-ring");
    const circumference = 2 * Math.PI * 20;
    let progressUpdateRequested = false;

    const updateScrollProgress = () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;

        backToTop.classList.toggle("is-visible", window.scrollY > 160);

        if (progressRing instanceof SVGCircleElement) {
            progressRing.style.strokeDashoffset = String(circumference * (1 - progress));
        }

        progressUpdateRequested = false;
    };

    const scheduleScrollProgressUpdate = () => {
        if (progressUpdateRequested) return;
        progressUpdateRequested = true;
        window.requestAnimationFrame(updateScrollProgress);
    };

    updateScrollProgress();
    window.addEventListener("scroll", scheduleScrollProgressUpdate, { passive: true });
    window.addEventListener("resize", scheduleScrollProgressUpdate);
}

if (siteHeader) {
    const navToggle = siteHeader.querySelector(".nav-toggle");
    const mainNav = siteHeader.querySelector(".main-nav");
    const navToggleLabel = navToggle?.querySelector(".nav-toggle-label");

    if (navToggle && mainNav && navToggleLabel) {
        document.documentElement.classList.add("has-mobile-nav");
    }

    const setMenuOpen = (open) => {
        if (!navToggle || !mainNav || !navToggleLabel) return;
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        navToggleLabel.textContent = open ? "Close" : "Menu";
        siteHeader.classList.toggle("menu-open", open);
    };

    const updateHeaderState = () => {
        siteHeader.classList.toggle("is-scrolled", window.scrollY > 48);
    };

    navToggle?.addEventListener("click", () => {
        setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    mainNav?.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("a")) {
            setMenuOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
            setMenuOpen(false);
            navToggle?.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (event.target instanceof Node && !siteHeader.contains(event.target)) {
            setMenuOpen(false);
        }
    });

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
        if (event.matches) {
            setMenuOpen(false);
        }
    });
}

const revealTargets = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach((target) => revealObserver.observe(target));
    document.documentElement.classList.add("motion-ready");
} else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
}
