# NeckPacMan-demo

NeckPac is a browser-based Pac-Man style proof of concept controlled by head movement. This scaffold sets up the static web app structure, canvas rendering, a 60fps `requestAnimationFrame` game loop, and the SCRUM-75 webcam tracking foundation.

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

## Run Locally

Serve the repository with any static file server, then open the shown URL in a browser:

```bash
python3 -m http.server 8000
```

The canvas should render immediately. Open DevTools to inspect tracker status and landmark logs.

The browser will request webcam permission on load. MediaPipe Face Mesh is loaded asynchronously from CDN scripts in `index.html`, then `js/tracker.js` starts the camera stream and logs detected face landmarks in DevTools. The debug panel mirrors the webcam preview, draws landmark overlays, and keeps the overlay canvas sized to the active video aspect ratio.
