# 🎨 Ultimate MiniBlox Wallpaper Rotator

[![Version](https://img.shields.io/badge/version-9.1-4CAF50)](https://github.com/TheM1ddleM1n/MinibloxWallpaper)
[![License](https://img.shields.io/badge/license-Personal%20Use-blue)](https://github.com/TheM1ddleM1n/MinibloxWallpaper)

A **lightweight userscript** that transforms your **[miniblox.io](https://miniblox.io/)** experience with **stunning HD car wallpapers** and smooth transitions!

---

## ✨ Features

✅ **20 Premium Car Wallpapers** — Curated collection of high-quality automotive photography  
✅ **Instant Wallpaper Switching** — Press `\` (backslash) to cycle through wallpapers without reload  
✅ **Smooth Crossfade Transitions** — No white flashing, buttery-smooth image changes  
✅ **Smart Preloading** — All images cached on load for zero-delay switching  
✅ **Custom Wallpaper Support** — Add your own image URLs via console  
✅ **Sequential or Random Mode** — Choose your preferred rotation style  
✅ **Ultra Lightweight** — Minimal performance impact, loads in milliseconds  

---

## 🚀 Installation

### Step 1: Install a Userscript Manager
Choose one of these browser extensions:
- **[Tampermonkey](https://tampermonkey.net/)** (Recommended)
- **[Violentmonkey](https://violentmonkey.github.io/)**
- **[Greasemonkey](https://www.greasespot.net/)** (Firefox only)

### Step 2: Install the Script
**[Click here to install](https://github.com/TheM1ddleM1n/MinibloxWallpaper/raw/main/userscript.js)**

### Step 3: Visit MiniBlox
Go to **[miniblox.io](https://miniblox.io)** and enjoy your new wallpaper!

---

## ⌨️ Keyboard Shortcut

**Press `\` (backslash key)** to instantly cycle to the next wallpaper — no page reload needed!

---

## 🎛️ Configuration

Open your browser console (F12) and use these commands:

### Add Custom Wallpapers
```javascript
minibloxWallpaper.set([
  'https://example.com/car1.jpg',
  'https://example.com/car2.jpg',
  'https://example.com/car3.jpg'
]);
```

### Switch to Random Mode
```javascript
minibloxWallpaper.mode('random');
```

### Switch to Sequential Mode (Default)
```javascript
minibloxWallpaper.mode('cycle');
```

### Clear Custom Wallpapers
```javascript
minibloxWallpaper.clear();
```

### Reset All Settings
```javascript
minibloxWallpaper.reset();
```

---

## 🏎️ Wallpaper Collection

The default collection features 20 stunning car wallpapers from Unsplash, including:
- 🏁 Sports cars and supercars
- 🚗 Luxury vehicles
- 🌃 Various angles and lighting conditions
- 📸 Professional automotive photography

All images are high-quality (1920x1080) and optimized for fast loading.

---

## 🔧 How It Works

1. **Preloading** — All wallpapers are preloaded on page load for instant switching
2. **Dual-Layer System** — Uses CSS `::before` and `::after` pseudo-elements for smooth crossfade
3. **Smart Caching** — Browser caches images automatically for persistent performance
4. **Keyboard Control** — Direct wallpaper switching without page reload

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

- 🐛 **Report bugs** — Found an issue? [Open an issue](https://github.com/TheM1ddleM1n/MinibloxWallpaper/issues)
- 🌟 **Suggest features** — Have an idea? Let us know!
- 📸 **Submit wallpapers** — Share your favorite car images
- 🔧 **Submit pull requests** — Code improvements are appreciated

---

## 👥 Credits

- **Original Author:** [Vicky_arut](https://greasyfork.org/en/users/1371112-vicky-arut) *(GreasyFork)*
- **Enhanced by:** [TheM1ddleM1n](https://github.com/TheM1ddleM1n) *(GitHub)*
- **Wallpapers:** [Unsplash](https://unsplash.com/) *(Free high-quality photography)*

Special thanks to the **MiniBlox community** for feedback and support! ❤️

---

## 📜 License

**Personal use only. Redistribution prohibited.**

Please credit the authors if you fork or modify this project.

---

## 🔗 Links

- 🧩 **[GitHub Repository](https://github.com/TheM1ddleM1n/MinibloxWallpaper)**
- 🚀 **[Latest Release](https://github.com/TheM1ddleM1n/MinibloxWallpaper/releases/latest)**
- 🐛 **[Report Issues](https://github.com/TheM1ddleM1n/MinibloxWallpaper/issues)**
- 💬 **[Discussions](https://github.com/TheM1ddleM1n/MinibloxWallpaper/discussions)**

---

## ❓ FAQ

**Q: The wallpaper isn't showing?**  
A: Make sure your userscript manager is enabled and the script is active on miniblox.io

**Q: Can I use my own wallpapers?**  
A: Yes! Use `minibloxWallpaper.set([...])` in the console with your image URLs.

**Q: Does this work on mobile?**  
A: The script works on mobile browsers that support userscript managers (e.g., Firefox + Tampermonkey).

**Q: Why do some wallpapers load slowly?**  
A: Images are preloaded automatically. If you have slow internet, the first load may take a moment.

**Q: Can I change the keyboard shortcut?**  
A: Not directly through settings, but you can modify the script to use a different key.

---

## 📊 Changelog

### v9.1 (Latest)
- ✨ Added smooth crossfade transitions
- ✨ Implemented instant wallpaper switching with `\` key
- ✨ Added preloading for all wallpapers
- 🐛 Fixed white flashing issue
- 🐛 Replaced broken image links
- ⚡ Improved performance and reduced code size

### v9.0
- ✨ Complete rewrite for better performance
- ✨ Added custom wallpaper support
- ✨ Added console API for easy configuration
- 🔧 Reduced script size by 60%

---

Made with ❤️ for the MiniBlox community!

**Enjoy your new wallpapers!** 🎉
