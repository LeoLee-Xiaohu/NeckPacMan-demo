# NeckPacMan-demo

NeckPac is a browser-based Pac-Man style proof of concept controlled by head movement. This initial scaffold sets up the static web app structure, canvas maze rendering, and a 60fps `requestAnimationFrame` game loop.

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

The canvas should render a static 21x21 maze immediately. Open DevTools to see `loop running` logged from the animation loop.
