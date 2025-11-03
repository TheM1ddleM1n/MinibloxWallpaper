// ==UserScript==
// @name         Miniblox.io Auto Wallpaper Rotator (v9.1 Smooth)
// @namespace    http://github.com/TheM1ddleM1n
// @description  Lightweight wallpaper rotator with smooth transitions and no flashing.
// @author       Vicky_arut, TheM1ddleM1n
// @match        https://miniblox.io/
// @grant        none
// @run-at       document-start
// @version      9.1
// ==/UserScript==

(function() {
    'use strict';

    // === WALLPAPER COLLECTION (VERIFIED CARS) ===
    const DEFAULT_WALLPAPERS = [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1537984822441-cff330075342?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=1920&h=1080&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&q=80',
    ];

    // === LOAD CONFIGURATION ===
    const custom = JSON.parse(localStorage.getItem('miniblox_custom_wallpapers') || '[]');
    const wallpapers = Array.isArray(custom) && custom.length > 0 ? custom : DEFAULT_WALLPAPERS;
    const cycleMode = localStorage.getItem('miniblox_cycle_mode') !== 'false';

    // === PRELOAD ALL WALLPAPERS ===
    wallpapers.forEach(function(url) {
        const img = new Image();
        img.src = url;
    });

    // === SELECT WALLPAPER ===
    let index;
    if (cycleMode) {
        const last = parseInt(localStorage.getItem('miniblox_wallpaper_index') || '-1');
        index = (last + 1) % wallpapers.length;
        localStorage.setItem('miniblox_wallpaper_index', index);
    } else {
        index = Math.floor(Math.random() * wallpapers.length);
    }

    const wallpaper = wallpapers[index];

    // === APPLY WALLPAPER WITH SMOOTH TRANSITION ===
    const style = document.createElement('style');
    style.textContent = `
        body::before,
        body::after {
            content: '';
            position: fixed;
            inset: 0;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            z-index: -1;
        }
        body::before {
            background-image: url("${wallpaper}");
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
        }
        body::after {
            background-image: url("${wallpaper}");
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        body.transitioning::before {
            opacity: 0;
        }
        body.transitioning::after {
            opacity: 1;
        }
        body {
            background: #000 !important;
        }
        img[src*="default-DKNlYibk.png"],
        [style*="default-DKNlYibk.png"] {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(style);

    // === KEYBOARD SHORTCUT (Press \ to change wallpaper) ===
    document.addEventListener('keydown', function(e) {
        if (e.key === '\\' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            const target = e.target;
            // Ignore if typing in input/textarea
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            e.preventDefault();

            // Cycle to next wallpaper
            const current = parseInt(localStorage.getItem('miniblox_wallpaper_index') || '0');
            const next = (current + 1) % wallpapers.length;
            localStorage.setItem('miniblox_wallpaper_index', next);

            // Get the new wallpaper URL
            const nextWall = wallpapers[next];

            // Update ::after with new image
            const beforeMatch = style.textContent.match(/body::before[^}]*background-image: url\("([^"]+)"\)/);
            const currentBefore = beforeMatch ? beforeMatch[1] : wallpaper;

            style.textContent = style.textContent.replace(
                /body::after[^}]*background-image: url\("[^"]+"\)/,
                'body::after {\n            background-image: url("' + nextWall + '")'
            );

            // Start transition
            document.body.classList.add('transitioning');

            // After transition completes, swap images
            setTimeout(function() {
                style.textContent = style.textContent.replace(
                    /body::before[^}]*background-image: url\("[^"]+"\)/,
                    'body::before {\n            background-image: url("' + nextWall + '")'
                );
                document.body.classList.remove('transitioning');
            }, 500);

            console.log('%c[Miniblox] Wallpaper changed (' + (next + 1) + '/' + wallpapers.length + ')', 'color:#4CAF50');
        }
    });

    // === CONSOLE API ===
    window.minibloxWallpaper = {
        set: function(urls) {
            localStorage.setItem('miniblox_custom_wallpapers', JSON.stringify(urls));
            location.reload();
        },
        clear: function() {
            localStorage.removeItem('miniblox_custom_wallpapers');
            location.reload();
        },
        mode: function(m) {
            localStorage.setItem('miniblox_cycle_mode', m === 'cycle');
            location.reload();
        },
        reset: function() {
            localStorage.removeItem('miniblox_wallpaper_index');
            localStorage.removeItem('miniblox_cycle_mode');
            localStorage.removeItem('miniblox_custom_wallpapers');
            location.reload();
        }
    };

    console.log('%c[Miniblox Wallpaper]%c ' + wallpaper, 'color:#4CAF50;font-weight:bold', 'color:#666');
})();
