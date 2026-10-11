const siteHeader = document.querySelector(".site-header");

const journey = document.querySelector("[data-journey]");

if (journey) {
    const track = journey.querySelector(".journey-track");
    const slides = Array.from(journey.querySelectorAll(".journey-slide"));
    const pagination = document.querySelector(".journey-pagination");
    const pageButtons = pagination ? Array.from(pagination.querySelectorAll("button")) : [];
    const currentLabel = document.querySelector(".journey-current");
    const previousButton = document.querySelector(".journey-prev");
    const nextButton = document.querySelector(".journey-next");
    const playButton = document.querySelector(".journey-play");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (track && slides.length && pageButtons.length === slides.length && currentLabel && previousButton && nextButton && playButton) {
        let activeIndex = 0;
        let userPaused = reducedMotion.matches;
        let hovered = false;
        let focused = false;
        let inViewport = false;
        let autoplayTimer;
        let scrollSyncTimer;

        const updateAutoplayState = () => {
            const autoplayEnabled = !userPaused && !hovered && !focused && inViewport && !reducedMotion.matches && !document.hidden;
            playButton.setAttribute("aria-label", autoplayEnabled ? "Pause automatic slides" : "Play automatic slides");
            playButton.title = autoplayEnabled ? "Pause automatic slides" : "Play automatic slides";
            track.setAttribute("aria-live", autoplayEnabled ? "off" : "polite");
            playButton.hidden = reducedMotion.matches;
            window.clearTimeout(autoplayTimer);

            if (autoplayEnabled) {
                autoplayTimer = window.setTimeout(() => {
                    setActiveSlide((activeIndex + 1) % slides.length);
                }, 6500);
            }
        };

        const setActiveSlide = (index, behavior = "smooth", shouldScroll = true) => {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === activeIndex;
                slide.classList.toggle("is-active", isActive);
                slide.inert = !isActive;
                slide.setAttribute("aria-hidden", String(!isActive));
                pageButtons[slideIndex].setAttribute("aria-current", isActive ? "step" : "false");
            });
            const label = pageButtons[activeIndex].getAttribute("aria-label").replace(/^Show /, "");
            currentLabel.textContent = label.charAt(0).toUpperCase() + label.slice(1);

            if (shouldScroll) {
                track.scrollTo({ left: slides[activeIndex].offsetLeft, behavior: reducedMotion.matches ? "auto" : behavior });
            }

            updateAutoplayState();
        };

        const syncActiveSlideToScroll = () => {
            if (!track.clientWidth) return;
            const nextIndex = Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));

            if (nextIndex !== activeIndex) {
                setActiveSlide(nextIndex, "auto", false);
            }
        };

        track.addEventListener("scroll", () => {
            window.clearTimeout(scrollSyncTimer);
            scrollSyncTimer = window.setTimeout(syncActiveSlideToScroll, 160);
        }, { passive: true });

        pageButtons.forEach((button, index) => {
            button.addEventListener("click", () => setActiveSlide(index));
        });
        previousButton.addEventListener("click", () => setActiveSlide(activeIndex - 1));
        nextButton.addEventListener("click", () => setActiveSlide(activeIndex + 1));
        playButton.addEventListener("click", () => {
            userPaused = !userPaused;
            updateAutoplayState();
        });

        journey.addEventListener("keydown", (event) => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                setActiveSlide(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
            }
        });

        journey.addEventListener("pointerenter", () => {
            hovered = true;
            updateAutoplayState();
        });
        journey.addEventListener("pointerleave", () => {
            hovered = false;
            updateAutoplayState();
        });
        journey.addEventListener("focusin", () => {
            focused = true;
            updateAutoplayState();
        });
        journey.addEventListener("focusout", (event) => {
            if (event.relatedTarget instanceof Node && journey.contains(event.relatedTarget)) return;
            focused = false;
            updateAutoplayState();
        });

        document.addEventListener("visibilitychange", updateAutoplayState);
        reducedMotion.addEventListener("change", (event) => {
            if (event.matches) userPaused = true;
            updateAutoplayState();
        });

        if ("IntersectionObserver" in window) {
            const journeyObserver = new IntersectionObserver(([entry]) => {
                inViewport = entry.isIntersecting;
                updateAutoplayState();
            }, { threshold: 0.25 });
            journeyObserver.observe(journey);
        } else {
            inViewport = true;
        }

        setActiveSlide(0, "auto");
    }
}

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
