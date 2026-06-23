# neumorphic widget
A soft UI music and clock widget built with vanilla HTML, CSS, and JavaScript. No libraries, no frameworks — pure neumorphic design with live animations, dynamic color theming, and persistent state. 

---

## Live Demo
View Live 🌐
https://ankamahjohnson.github.io/neumorphic.widget/

---

## Features

### Clock
- Live analog clock with real-time ticking hands
- Second hand and center dot always visible — darkened variant of the album's dominant color
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
- Skips pixels that are too dark or too light for a more accurate result
- Tints the entire widget — background, shadows, accent, progress fill — to match the album mood
- Second hand uses a darkened variant of the accent so it stays visible on any background
- Smooth 1s CSS transitions on every color change

### Persistence
- Uploaded covers and liked states saved to localStorage
- Queue capped at 5 tracks to stay within browser storage limits
- Auto-drops oldest track if storage fills up
- Widget restores your last session on page refresh

---

## Tech Stack

| Layer   | Technology |
|---------|------------|
| Markup  | HTML5 |
| Styling | CSS3 (neumorphism, keyframes, CSS variables, transitions) |
| Logic   | Vanilla JavaScript (ES6) |
| Icons   | Inline SVG |
| Storage | localStorage API |
| Color   | Canvas API (pixel sampling) |

---

## 📝
Made with ❤️ as a frontend practice project.
