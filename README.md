# 🎨 Ultimate MiniBlox Wallpaper Rotator

[![Version](https://img.shields.io/badge/version-10.0-4CAF50)](https://github.com/TheM1ddleM1n/MinibloxWallpaper)
[![License](https://img.shields.io/badge/license-Personal%20Use-blue)](https://github.com/TheM1ddleM1n/MinibloxWallpaper)

A **clean, flash-free userscript** that transforms your **[miniblox.io](https://miniblox.io/)** experience with **stunning HD car wallpapers**, **true smooth crossfades**, and **zero UI flicker**.

---

## ✨ Features (v10.0 Clean Edition)

- ✅ Premium HD car wallpapers (curated automotive photography)
- ✅ Instant wallpaper switching with `\` (backslash)
- ✅ True smooth crossfade (dual-layer CSS, no flashing)
- ✅ Decode-safe image preloading
- ✅ Custom wallpaper URL support
- ✅ Cycle or random rotation modes
- ✅ Configurable fade duration
- ✅ Optional auto-rotate timer
- ✅ Ultra lightweight & GPU-friendly
- ✅ Clean architecture (CSS variables, no regex hacks)

---

## 🚀 Installation

### Step 1: Install a userscript manager

- **[Tampermonkey](https://tampermonkey.net/)** (recommended)
- **[Violentmonkey](https://violentmonkey.github.io/)**
- **[Greasemonkey](https://www.greasespot.net/)** (Firefox only)

### Step 2: Install the script

➡ **[Click here to install](https://github.com/TheM1ddleM1n/MinibloxWallpaper/raw/main/userscript.js)**

### Step 3: Visit MiniBlox

Open **https://miniblox.io** — wallpapers apply instantly.

---

## ⌨️ Keyboard Shortcut

Press **`\` (backslash)** to instantly switch to the next wallpaper.

- No reload  
- No flicker  
- Automatically disabled while typing in chat or inputs  

---

## 🎛️ Configuration (Console API)

Open DevTools (`F12`) → **Console**

### Set custom wallpapers

```js
minibloxWallpaper.set([
  'https://example.com/car1.jpg',
  'https://example.com/car2.jpg'
]);
```

## 🏎️ Wallpaper Collection
The default collection includes HD Unsplash automotive photography, featuring:

- 🏁 Sports cars & supercars

- 🚗 Luxury vehicles

- 🌃 Night & studio lighting

- 📸 Professional 1920×1080 images

- Images are optimized for fast decoding and smooth transitions.

## 🔧 How It Works (v10 Architecture)
- Decode-safe preload
- Images are fully decoded before being displayed.

- Dual-layer rendering
- Uses body::before (current) and body::after (next).

- CSS variables
--wallpaper-current and --wallpaper-next handle transitions cleanly.

- GPU-friendly transitions
- Opacity-only animations for smooth performance.

- Zero DOM mutation
- No observers, no layout thrashing, no injected elements.

## 🤝 Contributing
Contributions are welcome:

- 🐛 Bug reports — open an issue

- 💡 Feature suggestions

- 📸 Wallpaper submissions (HD automotive only)

- 🔧 Pull requests (clean, readable code)

## 👥 Credits
Original Author:
Vicky_arut — [Greasyfork - vicky-arut](https://greasyfork.org/en/users/1371112-vicky-arut)

Clean Edition & Enhancements:
TheM1ddleM1n — [Github - TheM1ddleM1n](https://github.com/TheM1ddleM1n)

Wallpapers:
[Unsplash](https://unsplash.com)

Special thanks to the MiniBlox community ❤️

## 📜 License
Personal use only. Redistribution prohibited.

Please credit the authors if you fork or modify.

## 🔗 Links
[GitHub Repository](https://github.com/TheM1ddleM1n/MinibloxWallpaper)

[Latest Release](https://github.com/TheM1ddleM1n/MinibloxWallpaper/releases/latest)

[Report Issues](https://github.com/TheM1ddleM1n/MinibloxWallpaper/issues)

## 📊 Changelog
v10.0 — Clean Edition (Latest)
✨ Full refactor using CSS variables

✨ True crossfade with dual-layer rendering

✨ Decode-safe preloading

✨ Configurable fade duration

✨ Optional auto-rotation timer

🐛 Eliminated flicker and white flashing

🧼 Removed regex-based CSS editing

⚡ Improved performance and maintainability

## v9.1
✨ Added smooth transitions

✨ Keyboard switching

🐛 Fixed broken images

**Made with ❤️ for the MiniBlox community.**

**Enjoy your wallpapers! 🎉**
