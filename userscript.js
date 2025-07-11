// ==UserScript==
// @name          Change miniblox.io wallpaper (CSS Injection)
// @namespace     http://codeberg.org/ee6-lang
// @description   Replace wallpaper by injecting a CSS rule!
// @author        Vicky_arut, ee6-lang/Coldmc33
// @match         https://miniblox.io/
// @grant         none
// @run-at        document-start
// @license       Redistribution prohibited
// @version       1.1
// ==/UserScript==

(function() {
    'use strict';

    // new wallpaper (gif possible!!)
    const newImageUrl = 'https://i.imgur.com/Vdtct7v.jpeg';

    // The selector for the element that has the wallpaper.
    // You might need to adjust this if miniblox.io uses a different element.
    // Common candidates: 'body', 'html', '#app', or a specific container div.
    const wallpaperSelector = 'body'; // Start with 'body', it's often the main background.

    // Create a style element
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        ${wallpaperSelector} {
            background-image: url('${newImageUrl}') !important;
            background-size: cover !important; /* Ensures the image covers the whole area */
            background-position: center center !important; /* Centers the image */
            background-repeat: no-repeat !important; /* Prevents repeating */
        }
        /* If there's an overlay or another element obscuring, you might need to target it */
        /* For example, if there's a div with a semi-transparent background: */
        /*
        div[style*="default-DKNlYibk.png"] {
            background-image: url('${newImageUrl}') !important;
            background-size: cover !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;
        }
        */
        /* If an <img> tag is the wallpaper, you can hide it or override its source */
        img[src*="/assets/default-DKNlYibk.png"] {
            display: none !important; /* Hide the original image */
            /* Or try overriding its src directly, though CSS background is often better for wallpapers */
            /* content: url('${newImageUrl}') !important; */
        }
    `;

    // Append the style element to the head or body
    document.head.appendChild(style);

    // --- Original MutationObserver (keep for completeness, but CSS inject is primary) ---
    // The MutationObserver part might still be useful if images are loaded *after* initial CSS
    // or for other elements, but the CSS injection is generally more robust for backgrounds.
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            const images = document.querySelectorAll('img');
            images.forEach((img) => {
                if (img.src.includes('/assets/default-DKNlYibk.png')) {
                    img.src = newImageUrl; // Replace image
                }
            });

            const backgroundElements = document.querySelectorAll('[style*="default-DKNlYibk.png"]');
            backgroundElements.forEach((element) => {
                element.style.backgroundImage = `url(${newImageUrl})`;
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true // Also observe attribute changes, in case style is added/changed
    });

})();
