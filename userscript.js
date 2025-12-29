// ==UserScript==
// @name         Miniblox.io Auto Wallpaper Rotator (v10.0 Clean)
// @namespace    http://github.com/TheM1ddleM1n
// @description  Clean, flash-free wallpaper rotator with smooth transitions.
// @author       Vicky_arut, TheM1ddleM1n
// @match        https://miniblox.io/
// @grant        none
// @run-at       document-start
// @version      10.0
// @homepageURL  https://github.com/TheM1ddleM1n/MinibloxWallpaper
// @downloadURL  https://github.com/TheM1ddleM1n/MinibloxWallpaper/raw/main/userscript.js
// @updateURL    https://github.com/TheM1ddleM1n/MinibloxWallpaper/raw/main/userscript.js
// ==/UserScript==

(function () {
    'use strict';

    /* =======================
       DEFAULT WALLPAPERS
    ======================= */

    const DEFAULT_WALLPAPERS = [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop&q=80&fm=jpg',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1920&h=1080&fit=crop&q=80&fm=jpg',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&h=1080&fit=crop&q=80&fm=jpg',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920&h=1080&fit=crop&q=80&fm=jpg',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1920&h=1080&fit=crop&q=80&fm=jpg'
    ];

    /* =======================
       LOAD SETTINGS
    ======================= */

    const wallpapers = (() => {
        try {
            const custom = JSON.parse(localStorage.getItem('miniblox_custom_wallpapers') || '[]');
            return Array.isArray(custom) && custom.length ? custom : DEFAULT_WALLPAPERS;
        } catch {
            return DEFAULT_WALLPAPERS;
        }
    })();

    const cycleMode = localStorage.getItem('miniblox_cycle_mode') !== 'false';
    const fadeMs = parseInt(localStorage.getItem('miniblox_fade_ms') || '500');
    const rotateInterval = parseInt(localStorage.getItem('miniblox_rotate_interval') || '0');

    /* =======================
       PRELOAD (DECODE SAFE)
    ======================= */

    function preload(url) {
        const img = new Image();
        img.src = url;
        return img.decode?.().catch(() => {}) || Promise.resolve();
    }

    wallpapers.forEach(preload);

    /* =======================
       PICK INITIAL WALLPAPER
    ======================= */

    let index;
    if (cycleMode) {
        const last = parseInt(localStorage.getItem('miniblox_wallpaper_index') || '-1');
        index = (last + 1) % wallpapers.length;
        localStorage.setItem('miniblox_wallpaper_index', index);
    } else {
        index = Math.floor(Math.random() * wallpapers.length);
    }

    let currentWallpaper = wallpapers[index];

    /* =======================
       INJECT CSS
    ======================= */

    const style = document.createElement('style');
    style.textContent = `
        body {
            --wallpaper-current: url("${currentWallpaper}");
            --wallpaper-next: url("${currentWallpaper}");
            background: #000 !important;
        }

        body::before,
        body::after {
            content: '';
            position: fixed;
            inset: 0;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            z-index: -1;
            transition: opacity ${fadeMs}ms ease-in-out;
        }

        body::before {
            background-image: var(--wallpaper-current);
            opacity: 1;
        }

        body::after {
            background-image: var(--wallpaper-next);
            opacity: 0;
        }

        body.transitioning::before { opacity: 0; }
        body.transitioning::after  { opacity: 1; }

        img[src*="default-DKNlYibk.png"],
        [style*="default-DKNlYibk.png"] {
            display: none !important;
        }
    `;

    (document.head || document.documentElement).appendChild(style);

    /* =======================
       WALLPAPER SWITCH LOGIC
    ======================= */

    function nextWallpaper() {
        const current = parseInt(localStorage.getItem('miniblox_wallpaper_index') || '0');
        const next = (current + 1) % wallpapers.length;
        localStorage.setItem('miniblox_wallpaper_index', next);

        const nextWall = wallpapers[next];

        document.body.style.setProperty('--wallpaper-next', `url("${nextWall}")`);
        document.body.classList.add('transitioning');

        setTimeout(() => {
            document.body.style.setProperty('--wallpaper-current', `url("${nextWall}")`);
            document.body.classList.remove('transitioning');
            currentWallpaper = nextWall;
        }, fadeMs);

        console.log(
            `%c[Miniblox] Wallpaper ${next + 1}/${wallpapers.length}`,
            'color:#4CAF50'
        );
    }

    /* =======================
       KEYBOARD SHORTCUT
    ======================= */

    document.addEventListener('keydown', e => {
        if (e.key !== '\\' || e.ctrlKey || e.altKey || e.metaKey) return;

        const t = e.target;
        if (
            t.tagName === 'INPUT' ||
            t.tagName === 'TEXTAREA' ||
            t.isContentEditable ||
            document.querySelector('[contenteditable="true"]')
        ) return;

        e.preventDefault();
        nextWallpaper();
    });

    /* =======================
       AUTO ROTATE (OPTIONAL)
    ======================= */

    if (rotateInterval > 0) {
        setInterval(nextWallpaper, rotateInterval);
    }

    /* =======================
       CONSOLE API
    ======================= */

    window.minibloxWallpaper = {
        set(urls) {
            localStorage.setItem('miniblox_custom_wallpapers', JSON.stringify(urls));
            location.reload();
        },
        clear() {
            localStorage.removeItem('miniblox_custom_wallpapers');
            location.reload();
        },
        mode(m) {
            localStorage.setItem('miniblox_cycle_mode', m === 'cycle');
            location.reload();
        },
        fade(ms) {
            localStorage.setItem('miniblox_fade_ms', ms);
            location.reload();
        },
        rotate(ms) {
            localStorage.setItem('miniblox_rotate_interval', ms);
            location.reload();
        },
        reset() {
            [
                'miniblox_wallpaper_index',
                'miniblox_cycle_mode',
                'miniblox_custom_wallpapers',
                'miniblox_fade_ms',
                'miniblox_rotate_interval'
            ].forEach(k => localStorage.removeItem(k));
            location.reload();
        }
    };

    console.log(
        '%c[Miniblox Wallpaper v10.0]%c Loaded',
        'color:#4CAF50;font-weight:bold',
        'color:#666'
    );
})();
