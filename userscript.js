// ==UserScript==
// @name         Miniblox.io Instant Wallpaper Rotator (Optimized)
// @namespace    http://github.com/TheM1ddleM1n
// @description  Instantly rotates wallpapers every reload with preloading and no flicker
// @author       Vicky_arut, TheM1ddleM1n
// @match        https://miniblox.io/
// @grant        none
// @run-at       document-start
// @version      7.1
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
        'https://picsum.photos/id/1031/1920/1080',
        'https://picsum.photos/id/1037/1920/1080',
        'https://picsum.photos/id/1045/1920/1080',
        'https://picsum.photos/id/1051/1920/1080',
        'https://picsum.photos/id/1063/1920/1080',
        'https://picsum.photos/id/1071/1920/1080',
        'https://picsum.photos/id/1073/1920/1080',
        'https://picsum.photos/id/1083/1920/1080',
        'https://picsum.photos/id/1093/1920/1080',
        'https://picsum.photos/id/1103/1920/1080',
        'https://picsum.photos/id/1110/1920/1080',
        'https://picsum.photos/id/112/1920/1080',
        'https://picsum.photos/id/114/1920/1080',
        'https://picsum.photos/id/117/1920/1080',
        'https://picsum.photos/id/119/1920/1080',
        'https://picsum.photos/id/120/1920/1080',
        'https://picsum.photos/id/122/1920/1080',
        'https://picsum.photos/id/124/1920/1080',
        'https://picsum.photos/id/128/1920/1080',
        'https://picsum.photos/id/129/1920/1080',
        'https://picsum.photos/id/130/1920/1080',
        'https://picsum.photos/1920/1080?random=1',
        'https://picsum.photos/1920/1080?random=2',
        'https://picsum.photos/1920/1080?random=3',
        'https://picsum.photos/1920/1080?random=4',
        'https://picsum.photos/1920/1080?random=5',
        'https://picsum.photos/1920/1080?random=6',
        'https://picsum.photos/1920/1080?random=7',
        'https://picsum.photos/1920/1080?random=8',
        'https://picsum.photos/1920/1080?random=9',
        'https://picsum.photos/1920/1080?random=10'
    ];

    const CYCLE_MODE = true; // true = rotate sequentially, false = random
    const INDEX_KEY = 'miniblox_wallpaper_index_v4';

    // === ROTATION LOGIC ===
    let nextIndex;
    if (CYCLE_MODE) {
        const lastIndex = parseInt(localStorage.getItem(INDEX_KEY) || '-1', 10);
        nextIndex = (isNaN(lastIndex) ? 0 : (lastIndex + 1) % PRESETS.length);
    } else {
        nextIndex = Math.floor(Math.random() * PRESETS.length);
    }
    localStorage.setItem(INDEX_KEY, nextIndex.toString());
    const wallpaperUrl = PRESETS[nextIndex];

    // === PRELOAD EARLY ===
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = wallpaperUrl;
    document.head.appendChild(preloadLink);

    // === APPLY WALLPAPER FAST ===
    const style = document.createElement('style');
    style.textContent = `
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background: #222 center/cover no-repeat url("${wallpaperUrl}") !important;
            filter: blur(0px);
            z-index: -1;
            transition: opacity 0.4s ease;
            opacity: 1;
        }
        body {
            background: transparent !important;
        }
        img[src*="/assets/default-DKNlYibk.png"] {
            display: none !important;
        }
    `;
    document.documentElement.prepend(style);

    // === REPLACE DEFAULT BACKGROUNDS ===
    const observer = new MutationObserver(() => {
        for (const img of document.querySelectorAll('img')) {
            if (img.src.includes('/assets/default-DKNlYibk.png')) img.src = wallpaperUrl;
        }
        for (const el of document.querySelectorAll('[style]')) {
            const s = el.getAttribute('style');
            if (s?.includes('default-DKNlYibk.png')) {
                el.setAttribute('style', s.replace(/url\(([^)]+default-DKNlYibk\.png[^)]*)\)/g, `url("${wallpaperUrl}")`));
            }
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style'] }), { once: true });
    } else {
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style'] });
    }

    console.log('%c[Wallpaper Rotator]%c Loaded instantly:', 'color:#4CAF50;font-weight:bold;', 'color:inherit;', wallpaperUrl);
})();
