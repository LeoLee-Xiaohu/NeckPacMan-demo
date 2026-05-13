export function setStatus(message) {
  return message;
}

export class CalibrationOverlay {
  constructor(root = document.body) {
    this.root = root;
    this.element = document.createElement('div');
    this.element.className = 'calibration-overlay';
    this.element.setAttribute('role', 'status');
    this.element.setAttribute('aria-live', 'polite');
    this.element.innerHTML = `
      <div class="calibration-card">
        <p class="calibration-label">Calibration</p>
        <h2>Hold your head neutral</h2>
        <p class="calibration-copy">Keep your neck relaxed while we capture your baseline.</p>
        <div class="calibration-countdown">3</div>
      </div>
    `;

    this.countdownElement = this.element.querySelector('.calibration-countdown');
  }

  show() {
    if (!this.element.isConnected) {
      this.root.append(this.element);
    }
  }

  update(secondsRemaining) {
    this.countdownElement.textContent = String(secondsRemaining);
  }

  hide() {
    this.element.remove();
  }
}
