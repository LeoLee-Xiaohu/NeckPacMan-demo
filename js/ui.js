export class UI {
  constructor(root) {
    this.root = root;
    this.startScreen = root.querySelector('[data-screen="start"]');
    this.calibrationScreen = root.querySelector('[data-screen="calibration"]');
    this.errorScreen = root.querySelector('[data-screen="error"]');
    this.winScreen = root.querySelector('[data-screen="win"]');
    this.status = root.querySelector('[data-status]');
    this.score = root.querySelector('[data-score]');
    this.pellets = root.querySelector('[data-pellets]');
    this.progress = root.querySelector('[data-progress]');
    this.finalScore = root.querySelector('[data-final-score]');
    this.errorMessage = root.querySelector('[data-error-message]');
    this.startButtons = root.querySelectorAll('[data-start]');
  }

  onStart(callback) {
    this.startButtons.forEach((button) => {
      button.addEventListener('click', callback);
    });
  }

  show(screenName) {
    this.root.querySelectorAll('[data-screen]').forEach((screen) => {
      screen.hidden = screen.dataset.screen !== screenName;
    });
  }

  hideScreens() {
    this.root.querySelectorAll('[data-screen]').forEach((screen) => {
      screen.hidden = true;
    });
  }

  setScore(score, pelletsLeft) {
    this.score.textContent = `Score: ${score}`;
    this.pellets.textContent = `${pelletsLeft} dots left`;
  }

  setStatus(message) {
    this.status.textContent = message;
  }

  setCalibrationProgress(progress) {
    this.progress.style.setProperty('--progress', `${Math.round(progress * 100)}%`);
    this.progress.textContent = `${Math.round(progress * 100)}%`;
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.show('error');
  }

  showWin(score) {
    this.finalScore.textContent = `Final Score: ${score}`;
    this.show('win');
  }
}
