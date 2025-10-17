// ==UserScript==
// @name         Ultimate MB.io Wallpaper Enhanced
// @namespace    http://codeberg.org/TheM1ddleM1n
// @description  Custom wallpaper + preview + presets + effects + real-time updates
// @author       Vicky_arut, TheM1ddleM1n
// @match        https://miniblox.io/
// @grant        none
// @run-at       document-start
// @license      Redistribution prohibited
// @version      4.0
// ==/UserScript==

(function() {
    'use strict';

    const defaultImageUrl = 'https://picsum.photos/id/1015/1920/1080';
    const savedUrl = localStorage.getItem('customWallpaperUrl');
    const savedBlur = localStorage.getItem('wallpaperBlur') || 0;
    const savedBrightness = localStorage.getItem('wallpaperBrightness') || 100;
    let currentWallpaperUrl = savedUrl || defaultImageUrl;
    let isConfigVisible = true;

    const style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);

    // Create background layer that doesn't affect content
    function applyWallpaper(url, blur = 0, brightness = 100) {
        currentWallpaperUrl = url;
        style.innerHTML = `
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: url('${url}') !important;
                background-size: cover !important;
                background-position: center center !important;
                background-repeat: no-repeat !important;
                filter: blur(${blur}px) brightness(${brightness}%);
                z-index: -1;
                transition: filter 0.3s ease, opacity 0.3s ease;
            }
            body {
                background: transparent !important;
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

    // Validate image URL
    function validateImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        const configBox = document.createElement('div');
        configBox.id = 'wallpaperConfig';
        configBox.style = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.95);
            color: #222;
            padding: 12px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: sans-serif;
            width: 280px;
            transition: transform 0.3s ease, opacity 0.3s ease;
        `;

        const presets = {
            'Default': defaultImageUrl,
            'Sky': 'https://picsum.photos/id/1003/1920/1080',
            'Waves': 'https://picsum.photos/id/1025/1920/1080',
            'Neon Grid': 'https://picsum.photos/id/1042/1920/1080',
            'Mountains': 'https://picsum.photos/id/1036/1920/1080',
            'Forest': 'https://picsum.photos/id/1018/1920/1080',
            'City': 'https://picsum.photos/id/1031/1920/1080',
            'Abstract': 'https://picsum.photos/id/1043/1920/1080'
        };

        // Load saved custom presets
        const savedPresets = JSON.parse(localStorage.getItem('customPresets') || '{}');
        Object.assign(presets, savedPresets);

        configBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="font-size: 14px;">🎨 Wallpaper Config</strong>
                <button id="toggleConfig" style="background: none; border: none; cursor: pointer; font-size: 18px;">−</button>
            </div>
            <div id="configContent">
                <label>Wallpaper URL:</label><br>
                <input type="text" id="wallpaperUrl" value="${currentWallpaperUrl}" placeholder="Enter image URL" style="width: 100%; margin: 5px 0; padding: 5px; border-radius: 4px; border: 1px solid #ccc;"><br>
                <label>Presets:</label><br>
                <select id="presetSelect" style="width: 100%; margin-bottom: 10px; padding: 5px; border-radius: 4px;">
                    <option value="">-- Select Preset --</option>
                    ${Object.entries(presets).map(([name, url]) =>
                        `<option value="${url}" ${url === currentWallpaperUrl ? 'selected' : ''}>${name}</option>`
                    ).join('')}
                </select>
                <label>Blur: <span id="blurValue">${savedBlur}px</span></label><br>
                <input type="range" id="blurSlider" min="0" max="20" value="${savedBlur}" style="width: 100%;"><br>
                <label>Brightness: <span id="brightnessValue">${savedBrightness}%</span></label><br>
                <input type="range" id="brightnessSlider" min="30" max="150" value="${savedBrightness}" style="width: 100%;"><br>
                <div style="position: relative;">
                    <img id="previewImg" src="${currentWallpaperUrl}" style="width: 100%; margin: 10px 0; border-radius: 6px; display: block;"><br>
                    <div id="loadingIndicator" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 10px; border-radius: 5px;">Loading...</div>
                </div>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <button id="applyWallpaper" style="flex: 1; padding: 8px; border-radius: 5px; border: none; background: #4CAF50; color: white; cursor: pointer;">Apply</button>
                    <button id="resetWallpaper" style="flex: 1; padding: 8px; border-radius: 5px; border: none; background: #f44336; color: white; cursor: pointer;">Reset</button>
                </div>
                <div style="margin-top: 10px; font-size: 11px; color: #666;">
                    💡 Tip: Press <strong>Ctrl+Shift+W</strong> to toggle this panel
                </div>
            </div>
        `;
        document.body.appendChild(configBox);

        const configContent = document.getElementById('configContent');
        const toggleBtn = document.getElementById('toggleConfig');
        const previewImg = document.getElementById('previewImg');
        const wallpaperUrlInput = document.getElementById('wallpaperUrl');
        const blurSlider = document.getElementById('blurSlider');
        const brightnessSlider = document.getElementById('brightnessSlider');
        const blurValue = document.getElementById('blurValue');
        const brightnessValue = document.getElementById('brightnessValue');
        const loadingIndicator = document.getElementById('loadingIndicator');

        // Toggle config panel
        function toggleConfigPanel() {
            isConfigVisible = !isConfigVisible;
            if (isConfigVisible) {
                configContent.style.display = 'block';
                toggleBtn.textContent = '−';
                configBox.style.transform = 'translateX(0)';
            } else {
                configContent.style.display = 'none';
                toggleBtn.textContent = '+';
            }
        }

        toggleBtn.onclick = toggleConfigPanel;

        // Keyboard shortcut (Ctrl+Shift+W)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'W') {
                e.preventDefault();
                toggleConfigPanel();
            }
        });

        // Real-time preview updates
        wallpaperUrlInput.oninput = async () => {
            const url = wallpaperUrlInput.value.trim();
            if (url) {
                loadingIndicator.style.display = 'block';
                const isValid = await validateImage(url);
                loadingIndicator.style.display = 'none';
                if (isValid) {
                    previewImg.src = url;
                    previewImg.style.border = '2px solid #4CAF50';
                } else {
                    previewImg.style.border = '2px solid #f44336';
                }
            }
        };

        // Real-time blur slider
        blurSlider.oninput = () => {
            const blur = blurSlider.value;
            blurValue.textContent = `${blur}px`;
            previewImg.style.filter = `blur(${blur}px) brightness(${brightnessSlider.value}%)`;
        };

        // Real-time brightness slider
        brightnessSlider.oninput = () => {
            const brightness = brightnessSlider.value;
            brightnessValue.textContent = `${brightness}%`;
            previewImg.style.filter = `blur(${blurSlider.value}px) brightness(${brightness}%)`;
        };

        document.getElementById('presetSelect').onchange = async (e) => {
            if (e.target.value) {
                wallpaperUrlInput.value = e.target.value;
                loadingIndicator.style.display = 'block';
                const isValid = await validateImage(e.target.value);
                loadingIndicator.style.display = 'none';
                if (isValid) {
                    previewImg.src = e.target.value;
                    previewImg.style.border = '2px solid #4CAF50';
                }
            }
        };

        document.getElementById('applyWallpaper').onclick = async () => {
            const url = wallpaperUrlInput.value.trim();
            const blur = blurSlider.value;
            const brightness = brightnessSlider.value;

            if (!url) {
                alert("Please enter a valid URL");
                return;
            }

            loadingIndicator.style.display = 'block';
            const isValid = await validateImage(url);
            loadingIndicator.style.display = 'none';

            if (!isValid) {
                alert("Invalid image URL. Please check the URL and try again.");
                return;
            }

            localStorage.setItem('customWallpaperUrl', url);
            localStorage.setItem('wallpaperBlur', blur);
            localStorage.setItem('wallpaperBrightness', brightness);
            applyWallpaper(url, blur, brightness);
            alert("✅ Wallpaper updated successfully!");
        };

        document.getElementById('resetWallpaper').onclick = () => {
            localStorage.removeItem('customWallpaperUrl');
            localStorage.removeItem('wallpaperBlur');
            localStorage.removeItem('wallpaperBrightness');
            applyWallpaper(defaultImageUrl, 0, 100);
            wallpaperUrlInput.value = defaultImageUrl;
            previewImg.src = defaultImageUrl;
            previewImg.style.filter = 'none';
            previewImg.style.border = 'none';
            blurSlider.value = 0;
            brightnessSlider.value = 100;
            blurValue.textContent = '0px';
            brightnessValue.textContent = '100%';
            alert("✅ Wallpaper reset to default!");
        };
    });
})();
