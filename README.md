# NeckPacMan-demo

NeckPac is a browser-based Pac-Man style proof of concept controlled by head movement. It uses an HTML Canvas for gameplay and MediaPipe/TensorFlow.js face landmarks in the browser for webcam-based direction control.

## Features

- Start, camera permission, 3-second calibration, gameplay, win, and restart flow.
- 21×21 fixed maze with pellets on open corridors.
- Continuous Pac-Man movement controlled by head direction.
- Score updates at 10 points per pellet and a final win screen.
- Client-side webcam processing only; no backend or video upload.
- Keyboard fallback with Arrow keys or WASD for testing.

## Run Locally

Serve the repository with any static file server, then open the shown URL in Chrome or Edge:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`, click **Start Game**, allow camera access, and look straight at the camera during calibration. After calibration, turn your head left, right, up, or down to steer.

## Notes

- The first load downloads TensorFlow.js and the face landmarks model from CDN.
- Good lighting and a front-facing webcam improve tracking reliability.
- If camera permission is denied, the app shows an error screen with a retry button.
- The game is fully static and can be deployed to GitHub Pages, Vercel, Netlify, or any static host.

## Project Structure

```text
neck-pac/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── game.js
│   ├── player.js
│   ├── maze.js
│   ├── tracker.js
│   └── ui.js
├── assets/
│   └── .gitkeep
├── docs/
│   └── PRD.md
└── README.md
```
