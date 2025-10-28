// ==UserScript==
// @name         Miniblox.io Auto Wallpaper Rotator (v7.1 Optimized)
// @namespace    http://github.com/TheM1ddleM1n
// @description  Automatically changes wallpaper every reload — smooth, stable, and customizable
// @author       Vicky_arut, TheM1ddleM1n
// @match        https://miniblox.io/
// @grant        none
// @run-at       document-start
// @version      7.1
// ==/UserScript==

(function () {
    'use strict';

    // === CONFIGURATION ===
    const CONFIG = {
        CYCLE_MODE: true, // true = sequential, false = random
        INDEX_KEY: 'miniblox_wallpaper_index_v4',
        HISTORY_KEY: 'miniblox_wallpaper_history',
        CUSTOM_KEY: 'miniblox_custom_wallpapers',
        MAX_HISTORY: 10
    };

    // === WALLPAPER SOURCES ===
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
        'https://picsum.photos/id/1090/1920/1080',
        'https://picsum.photos/1920/1080?random=1',
        'https://picsum.photos/1920/1080?random=2',
        'https://picsum.photos/1920/1080?random=3',
        'https://picsum.photos/1920/1080?random=4',
        'https://picsum.photos/1920/1080?random=5'
    ];

    // === MERGE USER CUSTOM WALLPAPERS (if any) ===
    const custom = JSON.parse(localStorage.getItem(CONFIG.CUSTOM_KEY) || '[]');
    const WALLPAPERS = [...PRESETS, ...custom];

    // === WALLPAPER INDEX LOGIC ===
    const getNextIndex = () => {
        if (CONFIG.CYCLE_MODE) {
            const last = parseInt(localStorage.getItem(CONFIG.INDEX_KEY) || '-1', 10);
            const next = (isNaN(last) ? 0 : (last + 1) % WALLPAPERS.length);
            localStorage.setItem(CONFIG.INDEX_KEY, next);
            return next;
        } else {
            let history = JSON.parse(localStorage.getItem(CONFIG.HISTORY_KEY) || '[]');
            let next;
            do {
                next = Math.floor(Math.random() * WALLPAPERS.length);
            } while (history.includes(next) && history.length < WALLPAPERS.length);
            history.push(next);
            if (history.length > CONFIG.MAX_HISTORY) history.shift();
            localStorage.setItem(CONFIG.HISTORY_KEY, JSON.stringify(history));
            return next;
        }
    };

    const wallpaperUrl = WALLPAPERS[getNextIndex()];

    // === PRELOAD IMAGE EARLY ===
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = wallpaperUrl;
    document.head.appendChild(preloadLink);

    // === FALLBACK COLOR ===
    document.documentElement.style.backgroundColor = '#111';

    // === CREATE STYLE ELEMENT ===
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --miniblox-wallpaper: url("${wallpaperUrl}");
        }
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background: var(--miniblox-wallpaper) center/cover no-repeat;
            z-index: -1;
            opacity: 0;
            animation: fadeIn 0.7s ease forwards;
        }
        body {
            background: transparent !important;
        }
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        img[src*="/assets/default-DKNlYibk.png"] {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).prepend(style);

    // === LOAD + APPLY WITH FAILSAFE ===
    const img = new Image();
    img.onload = () => applyWallpaper(wallpaperUrl);
    img.onerror = () => {
        console.warn('[Wallpaper Rotator] Failed to load:', wallpaperUrl);
        const fallback = 'https://picsum.photos/1920/1080?random=' + Math.floor(Math.random() * 1000);
        applyWallpaper(fallback);
    };
    img.src = wallpaperUrl;

    function applyWallpaper(url) {
        document.documentElement.style.setProperty('--miniblox-wallpaper', `url("${url}")`);
    }

    // === DOM WATCHER (REPLACES DEFAULT BACKGROUNDS) ===
    const observer = new MutationObserver(() => {
        for (const img of document.querySelectorAll('img')) {
            if (img.src && img.src.includes('/assets/default-DKNlYibk.png')) {
                img.src = wallpaperUrl;
            }
        }
        for (const el of document.querySelectorAll('[style]')) {
            const s = el.getAttribute('style');
            if (s && s.includes('default-DKNlYibk.png')) {
                el.setAttribute('style', s.replace(/url\(([^)]+default-DKNlYibk\.png[^)]*)\)/g, `url("${wallpaperUrl}")`));
            }
        }
    });

    const startObserver = () => {
        observer.observe(document.documentElement, {
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

    console.log('%c[MiniBlox Wallpaper Rotator]%c Wallpaper applied:', 'color:#4CAF50;font-weight:bold;', 'color:inherit;', wallpaperUrl);
})();
