// ==UserScript==
// @name         Ultimate MB.io Wallpaper Enhanced
// @namespace    http://github.com/TheM1ddleM1n
// @description  Custom wallpaper + preview + presets + real-time updates
// @author       Vicky_arut, TheM1ddleM1n
// @match        https://miniblox.io/
// @grant        GM_xmlhttpRequest
// @connect      api.unsplash.com
// @connect      unsplash.com
// @run-at       document-start
// @license      Redistribution prohibited
// @version      5.1
// ==/UserScript==

(function() {
    'use strict';

    const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_API_KEY';
    const defaultImageUrl = 'https://picsum.photos/id/1015/1920/1080';
    const savedUrl = localStorage.getItem('customWallpaperUrl');
    const isDarkMode = localStorage.getItem('configDarkMode') === 'true';
    let currentWallpaperUrl = savedUrl || defaultImageUrl;
    let isConfigVisible = true;
    let wallpaperHistory = JSON.parse(localStorage.getItem('wallpaperHistory') || '[]');
    let imageCache = new Map();

    const style = document.createElement('style');
    style.type = 'text/css';
    document.head.appendChild(style);

    function preloadImages(urls) {
        urls.forEach(url => {
            if (!imageCache.has(url)) {
                const img = new Image();
                img.src = url;
                imageCache.set(url, img);
            }
        });
    }

    function applyWallpaper(url) {
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
                z-index: -1;
                transition: opacity 0.3s ease;
            }
            body {
                background: transparent !important;
            }
            img[src*="/assets/default-DKNlYibk.png"] {
                display: none !important;
            }
        `;
    }

    applyWallpaper(currentWallpaperUrl);

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

    function validateImage(url) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const img = new Image();
            
            img.onload = () => {
                const loadTime = (performance.now() - startTime).toFixed(0);
                resolve({ 
                    valid: true, 
                    loadTime: loadTime,
                    size: `${img.width}x${img.height}`
                });
            };
            
            img.onerror = () => {
                resolve({ 
                    valid: false, 
                    error: 'Failed to load image. Check URL or CORS policy.' 
                });
            };
            
            img.src = url;
            
            setTimeout(() => {
                if (!img.complete) {
                    resolve({ 
                        valid: false, 
                        error: 'Image load timeout (>5s)' 
                    });
                }
            }, 5000);
        });
    }

    function addToHistory(url) {
        wallpaperHistory = wallpaperHistory.filter(u => u !== url);
        wallpaperHistory.unshift(url);
        wallpaperHistory = wallpaperHistory.slice(0, 5);
        localStorage.setItem('wallpaperHistory', JSON.stringify(wallpaperHistory));
    }

    async function searchUnsplash(query) {
        if (UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_API_KEY') {
            return { error: 'Please add your Unsplash API key to the script' };
        }
        
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&client_id=${UNSPLASH_ACCESS_KEY}`,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        resolve({ error: 'Failed to parse Unsplash response' });
                    }
                },
                onerror: () => {
                    resolve({ error: 'Failed to connect to Unsplash' });
                }
            });
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });

        const configBox = document.createElement('div');
        configBox.id = 'wallpaperConfig';
        
        const darkModeStyles = isDarkMode ? `
            background: rgba(30, 30, 30, 0.95);
            color: #fff;
        ` : `
            background: rgba(255, 255, 255, 0.95);
            color: #222;
        `;
        
        configBox.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            ${darkModeStyles}
            padding: 8px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: sans-serif;
            width: 220px;
            transition: transform 0.3s ease, opacity 0.3s ease;
            cursor: move;
            font-size: 12px;
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

        const customPresets = JSON.parse(localStorage.getItem('customPresets') || '{}');
        Object.assign(presets, customPresets);
        preloadImages(Object.values(presets));

        const labelColor = isDarkMode ? '#ccc' : '#222';
        const inputBg = isDarkMode ? '#444' : '#fff';
        const inputColor = isDarkMode ? '#fff' : '#222';
        const inputBorder = isDarkMode ? '#666' : '#ccc';

        configBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; cursor: default;">
                <strong style="font-size: 12px;">🎨 Wallpaper</strong>
                <div>
                    <button id="darkModeToggle" title="Toggle Dark Mode" style="background: none; border: none; cursor: pointer; font-size: 14px; margin-right: 3px;">${isDarkMode ? '☀️' : '🌙'}</button>
                    <button id="toggleConfig" style="background: none; border: none; cursor: pointer; font-size: 16px;">−</button>
                </div>
            </div>
            <div id="configContent">
                <label style="color: ${labelColor}; font-size: 11px;">URL:</label><br>
                <div style="display: flex; gap: 3px; margin: 3px 0;">
                    <input type="text" id="wallpaperUrl" value="${currentWallpaperUrl}" placeholder="Image URL" style="flex: 1; padding: 4px; border-radius: 3px; border: 1px solid ${inputBorder}; background: ${inputBg}; color: ${inputColor}; font-size: 11px;">
                    <button id="favoriteBtn" title="Favorite" style="padding: 4px 8px; border-radius: 3px; border: none; background: #ffc107; cursor: pointer; font-size: 12px;">⭐</button>
                </div>
                
                <div style="display: flex; gap: 3px; margin-bottom: 8px;">
                    <button id="randomBtn" title="Random" style="flex: 1; padding: 4px 8px; border-radius: 3px; border: none; background: #9C27B0; color: white; cursor: pointer; font-size: 11px;">🎲 Random</button>
                </div>
                
                <label style="color: ${labelColor}; font-size: 11px;">Presets:</label><br>
                <select id="presetSelect" style="width: 100%; margin-bottom: 8px; padding: 4px; border-radius: 3px; background: ${inputBg}; color: ${inputColor}; border: 1px solid ${inputBorder}; font-size: 11px;">
                    <option value="">-- Select --</option>
                    ${Object.entries(presets).map(([name, url]) =>
                        `<option value="${url}" ${url === currentWallpaperUrl ? 'selected' : ''}>${name}</option>`
                    ).join('')}
                </select>
                
                <div style="display: flex; gap: 3px; margin-bottom: 8px;">
                    <button id="savePresetBtn" style="flex: 1; padding: 4px; border-radius: 3px; border: none; background: #4CAF50; color: white; cursor: pointer; font-size: 10px;">Save</button>
                    <button id="exportBtn" style="flex: 1; padding: 4px; border-radius: 3px; border: none; background: #FF9800; color: white; cursor: pointer; font-size: 10px;">Export</button>
                    <button id="importBtn" style="flex: 1; padding: 4px; border-radius: 3px; border: none; background: #03A9F4; color: white; cursor: pointer; font-size: 10px;">Import</button>
                </div>
                
                <label style="color: ${labelColor}; font-size: 11px;">History (Last 5):</label><br>
                <div id="historyContainer" style="display: flex; gap: 3px; margin-bottom: 8px; overflow-x: auto;">
                    ${wallpaperHistory.length > 0 ? wallpaperHistory.map(url => 
                        `<img src="${url}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 3px; cursor: pointer; border: 2px solid ${url === currentWallpaperUrl ? '#4CAF50' : 'transparent'};" class="history-thumb" data-url="${url}" title="${url}">`
                    ).join('') : '<span style="color: ${labelColor}; font-size: 10px;">No history yet</span>'}
                </div>
                
                <div style="position: relative;">
                    <img id="previewImg" src="${currentWallpaperUrl}" style="width: 100%; margin: 6px 0; border-radius: 4px; display: block;"><br>
                    <div id="loadingIndicator" style="display: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); color: white; padding: 6px; border-radius: 4px; font-size: 10px;">Loading...</div>
                </div>
                
                <div style="display: flex; gap: 3px; flex-wrap: wrap;">
                    <button id="applyWallpaper" style="flex: 1; padding: 6px; border-radius: 4px; border: none; background: #4CAF50; color: white; cursor: pointer; font-size: 11px;">Apply</button>
                    <button id="resetWallpaper" style="flex: 1; padding: 6px; border-radius: 4px; border: none; background: #f44336; color: white; cursor: pointer; font-size: 11px;">Reset</button>
                </div>
                
                <div style="margin-top: 6px; font-size: 9px; color: ${labelColor === '#ccc' ? '#999' : '#666'};">
                    💡 Press <strong>\\</strong> to toggle
                </div>
            </div>
        `;
        document.body.appendChild(configBox);

        // Dragging functionality
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        configBox.addEventListener('mousedown', (e) => {
            if (e.target.closest('input, button, select, #configContent')) return;
            isDragging = true;
            initialX = e.clientX - configBox.offsetLeft;
            initialY = e.clientY - configBox.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            configBox.style.left = currentX + 'px';
            configBox.style.top = currentY + 'px';
            configBox.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        const configContent = document.getElementById('configContent');
        const toggleBtn = document.getElementById('toggleConfig');
        const previewImg = document.getElementById('previewImg');
        const wallpaperUrlInput = document.getElementById('wallpaperUrl');
        const loadingIndicator = document.getElementById('loadingIndicator');

        function toggleConfigPanel() {
            isConfigVisible = !isConfigVisible;
            if (isConfigVisible) {
                configContent.style.display = 'block';
                toggleBtn.textContent = '−';
            } else {
                configContent.style.display = 'none';
                toggleBtn.textContent = '+';
            }
        }

        toggleBtn.onclick = toggleConfigPanel;

        // Dark mode toggle
        document.getElementById('darkModeToggle').onclick = () => {
            const newDarkMode = !isDarkMode;
            localStorage.setItem('configDarkMode', newDarkMode);
            
            // Update colors without reload
            const labelColor = newDarkMode ? '#ccc' : '#222';
            const inputBg = newDarkMode ? '#444' : '#fff';
            const inputColor = newDarkMode ? '#fff' : '#222';
            const inputBorder = newDarkMode ? '#666' : '#ccc';
            
            if (newDarkMode) {
                configBox.style.background = 'rgba(30, 30, 30, 0.95)';
                configBox.style.color = '#fff';
            } else {
                configBox.style.background = 'rgba(255, 255, 255, 0.95)';
                configBox.style.color = '#222';
            }
            
            document.querySelectorAll('label').forEach(label => label.style.color = labelColor);
            document.querySelectorAll('input[type="text"], select').forEach(input => {
                input.style.background = inputBg;
                input.style.color = inputColor;
                input.style.borderColor = inputBorder;
            });
            
            document.getElementById('darkModeToggle').textContent = newDarkMode ? '☀️' : '🌙';
        };

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.key === '\\') {
                e.preventDefault();
                toggleConfigPanel();
            }
        });

        // Real-time preview
        wallpaperUrlInput.oninput = async () => {
            const url = wallpaperUrlInput.value.trim();
            if (url) {
                loadingIndicator.style.display = 'block';
                const result = await validateImage(url);
                loadingIndicator.style.display = 'none';
                
                if (result.valid) {
                    previewImg.src = url;
                    previewImg.style.border = '2px solid #4CAF50';
                } else {
                    previewImg.style.border = '2px solid #f44336';
                }
            }
        };

        document.getElementById('presetSelect').onchange = async (e) => {
            if (e.target.value) {
                localStorage.setItem('customWallpaperUrl', e.target.value);
                addToHistory(e.target.value);
                location.reload();
            }
        };

        // History thumbnails
        document.querySelectorAll('.history-thumb').forEach(thumb => {
            thumb.onclick = () => {
                localStorage.setItem('customWallpaperUrl', thumb.dataset.url);
                location.reload();
            };
        });

        // Random wallpaper
        document.getElementById('randomBtn').onclick = async () => {
            loadingIndicator.style.display = 'block';
            const randomUrl = `https://picsum.photos/1920/1080?random=${Date.now()}`;
            
            const result = await validateImage(randomUrl);
            loadingIndicator.style.display = 'none';
            
            if (result.valid) {
                localStorage.setItem('customWallpaperUrl', randomUrl);
                addToHistory(randomUrl);
                location.reload();
            }
        };

        // Favorite
        document.getElementById('favoriteBtn').onclick = () => {
            const name = prompt('Enter preset name:');
            if (name) {
                customPresets[name] = wallpaperUrlInput.value;
                localStorage.setItem('customPresets', JSON.stringify(customPresets));
                alert(`✓ Saved "${name}" to presets!`);
                location.reload();
            }
        };

        // Save preset
        document.getElementById('savePresetBtn').onclick = () => {
            const name = prompt('Enter preset name:');
            if (name) {
                customPresets[name] = wallpaperUrlInput.value;
                localStorage.setItem('customPresets', JSON.stringify(customPresets));
                alert(`✓ Preset "${name}" saved!`);
                location.reload();
            }
        };

        // Export settings
        document.getElementById('exportBtn').onclick = () => {
            const settings = {
                url: currentWallpaperUrl,
                customPresets: customPresets,
                history: wallpaperHistory
            };
            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'miniblox-wallpaper-settings.json';
            a.click();
        };

        // Import settings
        document.getElementById('importBtn').onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const settings = JSON.parse(event.target.result);
                        localStorage.setItem('customWallpaperUrl', settings.url);
                        localStorage.setItem('customPresets', JSON.stringify(settings.customPresets));
                        localStorage.setItem('wallpaperHistory', JSON.stringify(settings.history));
                        alert('✓ Settings imported successfully!');
                        location.reload();
                    } catch (err) {
                        alert('✗ Failed to import settings: Invalid file format');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        };

        document.getElementById('applyWallpaper').onclick = async () => {
            const url = wallpaperUrlInput.value.trim();

            if (!url) {
                alert("Please enter a valid URL");
                return;
            }

            loadingIndicator.style.display = 'block';
            const result = await validateImage(url);
            loadingIndicator.style.display = 'none';

            if (!result.valid) {
                alert(`✗ ${result.error}`);
                return;
            }

            addToHistory(url);
            localStorage.setItem('customWallpaperUrl', url);
            
            location.reload();
        };

        document.getElementById('resetWallpaper').onclick = () => {
            localStorage.removeItem('customWallpaperUrl');
            location.reload();
        };
    });
})();
