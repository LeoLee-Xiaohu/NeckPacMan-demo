export class Tracker {
  constructor() {
    this.currentPose = { yaw: 0, pitch: 0 };
    this.neutralBaseline = null;
  }

  start() {
    return Promise.resolve({ direction: 'right' });
  }

  getPose() {
    return { ...this.currentPose };
  }

  updatePose({ yaw = this.currentPose.yaw, pitch = this.currentPose.pitch } = {}) {
    this.currentPose = { yaw, pitch };
  }

  setNeutralBaseline(baseline) {
    this.neutralBaseline = { ...baseline };
  }

  getNeutralBaseline() {
    return this.neutralBaseline ? { ...this.neutralBaseline } : null;
  }
}
