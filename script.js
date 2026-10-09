/* =========================================
   MOBILE NAVIGATION
   ========================================= */

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');


function openNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    navigation.classList.add('open');

    menuButton.setAttribute(
        'aria-expanded',
        'true'
    );

    menuButton.setAttribute(
        'aria-label',
        'Close navigation'
    );
}


function closeNavigation(returnFocus = false) {
    if (!menuButton || !navigation) {
        return;
    }

    navigation.classList.remove('open');

    menuButton.setAttribute(
        'aria-expanded',
        'false'
    );

    menuButton.setAttribute(
        'aria-label',
        'Open navigation'
    );

    if (returnFocus) {
        menuButton.focus();
    }
}


function toggleNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    const isOpen =
        menuButton.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
        closeNavigation();
    } else {
        openNavigation();
    }
}


if (menuButton && navigation) {

    /* Open or close navigation from menu button */

    menuButton.addEventListener(
        'click',
        toggleNavigation
    );


    /* Close navigation after selecting a link */

    navigation
        .querySelectorAll('a')
        .forEach((link) => {

            link.addEventListener(
                'click',
                () => {
                    closeNavigation();
                }
            );

        });


    /* Close navigation with Escape key */

    document.addEventListener(
        'keydown',
        (event) => {

            const isOpen =
                menuButton.getAttribute(
                    'aria-expanded'
                ) === 'true';

            if (
                event.key === 'Escape' &&
                isOpen
            ) {
                closeNavigation(true);
            }

        }
    );


    /* Close navigation when clicking outside */

    document.addEventListener(
        'click',
        (event) => {

            const isOpen =
                menuButton.getAttribute(
                    'aria-expanded'
                ) === 'true';

            if (!isOpen) {
                return;
            }

            const clickedNavigation =
                navigation.contains(event.target);

            const clickedButton =
                menuButton.contains(event.target);

            if (
                !clickedNavigation &&
                !clickedButton
            ) {
                closeNavigation();
            }

        }
    );


    /* Reset mobile navigation when switching to desktop */

    window.addEventListener(
        'resize',
        () => {

            if (window.innerWidth > 900) {
                closeNavigation();
            }

        }
    );

}


/* =========================================
   SCROLL REVEAL
   ========================================= */

const revealElements =
    document.querySelectorAll('.reveal');


if ('IntersectionObserver' in window) {

    const revealObserver =
        new IntersectionObserver(

            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        if (entry.isIntersecting) {

                            entry.target
                                .classList
                                .add('visible');

                            observer.unobserve(
                                entry.target
                            );
                        }

                    }
                );

            },

            {
                threshold: 0.12
            }

        );


    revealElements.forEach(
        (element) => {

            revealObserver.observe(
                element
            );

        }
    );

} else {

    /* Fallback for browsers without IntersectionObserver */

    revealElements.forEach(
        (element) => {

            element.classList.add(
                'visible'
            );

        }
    );

}


/* =========================================
   AUTOMATIC FOOTER YEAR
   ========================================= */

const yearElement =
    document.getElementById(
        'current-year'
    );


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}
