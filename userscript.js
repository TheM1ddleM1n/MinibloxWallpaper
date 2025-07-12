// ==UserScript==
// @name          Change miniblox.io wallpaper (CSS Injection + Config UI + Persistence)
// @namespace     http://codeberg.org/ee6-lang
// @description   Replace wallpaper by injecting a CSS rule, with UI and persistent config
// @author        Vicky_arut, ee6-lang/Coldmc33
// @match         https://miniblox.io/
// @grant         none
// @run-at        document-start
// @license       Redistribution prohibited
// @version       1.5
// ==/UserScript==

(function() {
    'use strict';

    const defaultImageUrl = 'https://i.imgur.com/Vdtct7v.jpeg';
    const savedUrl = localStorage.getItem('customWallpaperUrl');
    let currentWallpaperUrl = savedUrl ? savedUrl : defaultImageUrl;

    const style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);

    function applyWallpaper(url) {
        currentWallpaperUrl = url;
        style.innerHTML = `
            body {
                background-image: url('${url}') !important;
                background-size: cover !important;
                background-position: center center !important;
                background-repeat: no-repeat !important;
            }
            img[src*="/assets/default-DKNlYibk.png"] {
                display: none !important;
            }
        `;
    }

    applyWallpaper(currentWallpaperUrl);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            document.querySelectorAll('img').forEach((img) => {
                if (img.src.includes('/assets/default-DKNlYibk.png')) {
                    img.src = currentWallpaperUrl;
                }
            });
            document.querySelectorAll('[style*="default-DKNlYibk.png"]').forEach((element) => {
                element.style.backgroundImage = `url('${currentWallpaperUrl}')`;
            });
        });
    });

    window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        const configBox = document.createElement('div');
        configBox.style = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #f1f1f1;
            color: #222;
            padding: 12px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: sans-serif;
        `;
        configBox.innerHTML = `
            <label>Wallpaper URL:</label><br>
            <input type="text" id="wallpaperUrl" value="${currentWallpaperUrl}" placeholder="Enter image URL" style="width: 200px; margin: 5px 0;"><br>
            <button id="applyWallpaper" style="margin-top: 5px;">Apply</button>
            <button id="resetWallpaper" style="margin-top: 5px; margin-left: 5px;">Reset</button>
        `;
        document.body.appendChild(configBox);

        document.getElementById('applyWallpaper').onclick = () => {
            const url = document.getElementById('wallpaperUrl').value;
            if (url) {
                localStorage.setItem('customWallpaperUrl', url);
                applyWallpaper(url);
                alert("Wallpaper has been changed");
                location.reload();
            }
        };

        document.getElementById('resetWallpaper').onclick = () => {
            localStorage.removeItem('customWallpaperUrl');
            applyWallpaper(defaultImageUrl);
            alert("Wallpaper reset to default");
            location.reload();
        };
    });
})();
