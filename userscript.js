// ==UserScript==
// @name         ultimate MB.io wallpaper
// @namespace    http://codeberg.org/ee6-lang
// @description  Custom wallpaper + preview + presets + effects
// @author       Vicky_arut, ModuleMaster64
// @match        https://miniblox.io/
// @grant        none
// @run-at       document-start
// @license      Redistribution prohibited
// @version      3.1
// ==/UserScript==

(function() {
    'use strict';

    const defaultImageUrl = 'https://picsum.photos/id/1015/1920/1080';
    const savedUrl = localStorage.getItem('customWallpaperUrl');
    const savedBlur = localStorage.getItem('wallpaperBlur') || 0;
    const savedBrightness = localStorage.getItem('wallpaperBrightness') || 100;
    let currentWallpaperUrl = savedUrl || defaultImageUrl;

    const style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);

    function applyWallpaper(url, blur = 0, brightness = 100) {
        currentWallpaperUrl = url;
        style.innerHTML = `
            body {
                background-image: url('${url}') !important;
                background-size: cover !important;
                background-position: center center !important;
                background-repeat: no-repeat !important;
                filter: blur(${blur}px) brightness(${brightness}%);
            }
            img[src*="/assets/default-DKNlYibk.png"] {
                display: none !important;
            }
        `;
    }

    applyWallpaper(currentWallpaperUrl, savedBlur, savedBrightness);

    const observer = new MutationObserver(() => {
        document.querySelectorAll('img').forEach((img) => {
            if (img.src.includes('/assets/default-DKNlYibk.png')) {
                img.src = currentWallpaperUrl;
            }
        });
        document.querySelectorAll('[style*="default-DKNlYibk.png"]').forEach((el) => {
            el.style.backgroundImage = `url('${currentWallpaperUrl}')`;
        });
    });

    window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        const configBox = document.createElement('div');
        configBox.style = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #fff;
            color: #222;
            padding: 12px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: sans-serif;
            width: 280px;
        `;

        const presets = {
            'Default': defaultImageUrl,
            'Sky': 'https://picsum.photos/id/1003/1920/1080',
            'Waves': 'https://picsum.photos/id/1025/1920/1080',
            'Neon Grid': 'https://picsum.photos/id/1042/1920/1080'
        };

        configBox.innerHTML = `
            <label>Wallpaper URL:</label><br>
            <input type="text" id="wallpaperUrl" value="${currentWallpaperUrl}" placeholder="Enter image URL" style="width: 100%; margin: 5px 0;"><br>
            <label>Presets:</label><br>
            <select id="presetSelect" style="width: 100%; margin-bottom: 10px;">
                ${Object.entries(presets).map(([name, url]) =>
                    `<option value="${url}" ${url === currentWallpaperUrl ? 'selected' : ''}>${name}</option>`
                ).join('')}
            </select>
            <label>Blur:</label><br>
            <input type="range" id="blurSlider" min="0" max="10" value="${savedBlur}" style="width: 100%;"><br>
            <label>Brightness:</label><br>
            <input type="range" id="brightnessSlider" min="50" max="150" value="${savedBrightness}" style="width: 100%;"><br>
            <img id="previewImg" src="${currentWallpaperUrl}" style="width: 100%; margin: 10px 0; border-radius: 6px;"><br>
            <button id="applyWallpaper" style="margin-top: 5px;">Apply</button>
            <button id="resetWallpaper" style="margin-top: 5px; margin-left: 5px;">Reset</button>
        `;
        document.body.appendChild(configBox);

        const previewImg = document.getElementById('previewImg');
        const wallpaperUrlInput = document.getElementById('wallpaperUrl');
        wallpaperUrlInput.oninput = () => {
            previewImg.src = wallpaperUrlInput.value;
        };

        document.getElementById('presetSelect').onchange = (e) => {
            wallpaperUrlInput.value = e.target.value;
            previewImg.src = e.target.value;
        };

        document.getElementById('applyWallpaper').onclick = () => {
            const url = wallpaperUrlInput.value;
            const blur = document.getElementById('blurSlider').value;
            const brightness = document.getElementById('brightnessSlider').value;
            localStorage.setItem('customWallpaperUrl', url);
            localStorage.setItem('wallpaperBlur', blur);
            localStorage.setItem('wallpaperBrightness', brightness);
            applyWallpaper(url, blur, brightness);
            alert("Wallpaper updated");
            location.reload();
        };

        document.getElementById('resetWallpaper').onclick = () => {
            localStorage.removeItem('customWallpaperUrl');
            localStorage.removeItem('wallpaperBlur');
            localStorage.removeItem('wallpaperBrightness');
            applyWallpaper(defaultImageUrl, 0, 100);
            wallpaperUrlInput.value = defaultImageUrl;
            previewImg.src = defaultImageUrl;
            alert("Wallpaper reset to default");
            location.reload();
        };
    });
})();
