# mgashry.com

A responsive personal website for Mohamed Gamal Ashry. It uses plain HTML, CSS, and a small JavaScript file for shared header behavior, so it can be hosted directly on GitHub Pages or any static web host without a build step.

## Pages

- `index.html` — portfolio homepage
- `projects.html` — projects page placeholder, ready for project details
- `privacy-policy.html` — privacy information for the current static site
- `terms.html` — terms for using the website

The legal pages describe the site's current features and third-party links. Review them against your hosting setup and applicable requirements before relying on them as formal legal documents. Update the copyright year in the page footers when needed.

The shared navigation stays pinned at the top while scrolling. After a short scroll, the name collapses and the navigation pills expand; on narrow screens, a keyboard-accessible menu button opens the navigation. The homepage opens with an auto-advancing, manually navigable portfolio carousel. Use its dots, arrow keys, previous/next controls, or touch gestures; autoplay pauses on hover or keyboard focus, and reduced-motion preferences disable autoplay. Sections reveal gently as they enter view, and cards and buttons respond to pointer interaction.

A circular back-to-top control appears as you scroll and tracks page progress around its arrow.

## Preview locally

Open `index.html` in a browser, or serve the repository directory with any static file server.

## Personalize before publishing

- Update the biography and areas of focus in `index.html` to match your experience and current work.
- The contact section links to `mga.ashry@gmail.com` and the LinkedIn profile; update the corresponding links and accessible labels if those details change.
- Replace the Open Graph title and description in the document head if you change the site's introduction.

The site uses Space Grotesk and DM Mono from Google Fonts, with system-font fallbacks if those fonts cannot load.
