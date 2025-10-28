// ==UserScript==
// @name         Miniblox.io Auto Wallpaper Rotator (v7.2 Optimized)
// @namespace    http://github.com/TheM1ddleM1n
// @description  Automatically changes wallpaper every reload — smoother loading, smarter caching, and improved performance.
// @author       Vicky_arut, TheM1ddleM1n
// @match        https://miniblox.io/
// @grant        none
// @run-at       document-start
// @version      7.2
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURATION ===
    const PRESETS = [
        'https://picsum.photos/id/1003/1920/1080',
        'https://picsum.photos/id/1015/1920/1080',
        'https://picsum.photos/id/1018/1920/1080',
        'https://picsum.photos/id/1021/1920/1080',
        'https://picsum.photos/id/1036/1920/1080',
        'https://picsum.photos/id/1043/1920/1080',
        'https://picsum.photos/id/1056/1920/1080',
        'https://picsum.photos/id/1069/1920/1080',
        'https://picsum.photos/id/1074/1920/1080',
        'https://picsum.photos/id/1084/1920/1080',
        'https://picsum.photos/id/1080/1920/1080',
        'https://picsum.photos/id/110/1920/1080',
        'https://picsum.photos/id/111/1920/1080',
        'https://picsum.photos/id/112/1920/1080',
        'https://picsum.photos/id/113/1920/1080',
        'https://picsum.photos/id/114/1920/1080',
        'https://picsum.photos/id/115/1920/1080',
        'https://picsum.photos/id/116/1920/1080',
        'https://picsum.photos/id/117/1920/1080',
        'https://picsum.photos/id/118/1920/1080',
        'https://picsum.photos/id/119/1920/1080'
    ];

    const BACKUP_URLS = [
        'https://picsum.photos/1920/1080?random=20',
        'https://picsum.photos/1920/1080?random=21',
        'https://picsum.photos/1920/1080?random=22'
    ];

    const CYCLE_MODE = true;
    const INDEX_KEY = 'miniblox_wallpaper_index_v3';
    const MAX_RETRIES = 3;

    // === INDEX SELECTION ===
    let nextIndex;
    if (CYCLE_MODE) {
        const lastIndex = parseInt(localStorage.getItem(INDEX_KEY) || '-1', 10);
        nextIndex = (isNaN(lastIndex) ? 0 : (lastIndex + 1) % PRESETS.length);
    } else {
        nextIndex = Math.floor(Math.random() * PRESETS.length);
    }
    localStorage.setItem(INDEX_KEY, nextIndex.toString());

    let wallpaperUrl = PRESETS[nextIndex];

    // === LOCAL CACHING ===
    const preloadImage = (url) => {
        const img = new Image();
        img.src = url;
    };
    PRESETS.forEach(preloadImage);

    // === VERIFY IMAGE URL WORKS ===
    async function verifyImage(url, retries = 0) {
        try {
            const res = await fetch(url, { method: 'HEAD' });
            if (res.ok) return url;
            throw new Error('Bad response');
        } catch {
            if (retries < MAX_RETRIES) {
                const fallback = BACKUP_URLS[Math.floor(Math.random() * BACKUP_URLS.length)];
                console.warn(`[Wallpaper Rotator] Failed to load ${url}, retrying with backup ${fallback}`);
                return verifyImage(fallback, retries + 1);
            } else {
                console.error('[Wallpaper Rotator] All fallbacks failed.');
                return 'https://picsum.photos/1920/1080';
            }
        }
    }

    // === MAIN EXECUTION ===
    verifyImage(wallpaperUrl).then((verifiedUrl) => {
        wallpaperUrl = verifiedUrl;

        const style = document.createElement('style');
        style.textContent = `
            body::before {
                content: '';
                position: fixed;
                top: 0; left: 0;
                width: 100%; height: 100%;
                background-image: url("${wallpaperUrl}") !important;
                background-size: cover !important;
                background-position: center center !important;
                background-repeat: no-repeat !important;
                aspect-ratio: 16/9;
                z-index: -1;
                transition: opacity 0.5s ease;
            }
            body {
                background: transparent !important;
            }
            img[src*="/assets/default-DKNlYibk.png"] {
                display: none !important;
            }
        `;
        (document.head || document.documentElement).prepend(style);

        // === DEBOUNCED MUTATION OBSERVER ===
        let debounceTimer;
        const applyFixes = () => {
            document.querySelectorAll('img').forEach(img => {
                if (img.src && img.src.includes('/assets/default-DKNlYibk.png')) {
                    img.src = wallpaperUrl;
                }
            });
            document.querySelectorAll('[style]').forEach(el => {
                const s = el.getAttribute('style');
                if (s && s.includes('default-DKNlYibk.png')) {
                    el.setAttribute('style', s.replace(/url\(([^)]+default-DKNlYibk\.png[^)]*)\)/g, `url("${wallpaperUrl}")`));
                }
            });
        };

        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(applyFixes, 200);
        });

        const startObserver = () => {
            observer.observe(document.documentElement || document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'style']
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startObserver, { once: true });
        } else {
            startObserver();
        }

        console.log('%c[Miniblox Wallpaper Rotator]%c Applied wallpaper:', 'color:#4CAF50;font-weight:bold;', 'color:inherit;', wallpaperUrl);
    });
})();
