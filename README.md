# neumorphic widget
A soft UI music and clock widget built with HTML, CSS, and JavaScript. Neumorphic design with live animations, dynamic color theming, and persistent state. 

---

## Live Demo
View Live 🌐
https://ankamahjohnson.github.io/neumorphic.widget/

---

## Features

### Clock
- Live analog clock with real-time ticking hands
- Color syncs and transitions smoothly on every track change

### Music Player
- Upload album covers via tap, bottom button, or drag and drop
- Every newly uploaded cover immediately becomes the active track
- Supports up to 5 covers in a queue
- Prev and next buttons to navigate between tracks
- Play / pause toggle with SVG icon swap
- Animated waveform visualizer active during playback
- Progress bar with click-to-seek and auto-advance to next track
- Volume slider with drag support
- Like button with bounce animation — state saved per track
- Long press the art box to remove the current track
- Track name auto-scrolls (marquee) when too long to fit

### Dynamic Color Theming
- Extracts the dominant color from the uploaded album cover using the Canvas API
- Tints the entire widget — background, shadows, accent, progress fill to match the album mood
- Second hand uses a darkened variant of the accent so it stays visible on any background
- Smooth 1s CSS transitions on every color change

### Persistence
- Uploaded covers and liked states saved to localStorage
- Queue capped at 5 tracks to stay within browser storage limits
- Auto-drops oldest track if storage fills up
- Widget restores your last session on page refresh

---

## Tech Stack

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
---

## 📝
Made with ❤️ as a frontend practice project.
