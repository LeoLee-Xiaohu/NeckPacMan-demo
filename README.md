# NeckPacMan-demo

NeckPac is a browser-based Pac-Man style proof of concept controlled by head movement. This scaffold sets up the static web app structure, canvas rendering, a 21x21 maze definition, a hidden webcam preview placeholder, and a 60fps `requestAnimationFrame` game loop.

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

The canvas should render immediately with a 21x21 maze, wall tiles, starter pellets, and Pac-Man centered on the grid. The tracking preview panel reserves space for webcam feedback while keeping the video feed hidden until tracking is implemented.

## SCRUM-211 Handoff Notes

- ES modules are split across `js/main.js`, `js/game.js`, `js/maze.js`, `js/player.js`, `js/tracker.js`, and `js/ui.js` to match the SCRUM-75 PRD structure.
- `js/maze.js` exports `MAZE_SIZE`, tile constants, and `MAZE_LAYOUT`, a fixed 21x21 grid using `1` for walls and `0` for paths.
- `index.html` includes `#gameCanvas` plus `#trackingVideo`; CSS reserves tracker space and hides the video initially for future calibration feedback.
- No build step or package install is required for this POC scaffold.
