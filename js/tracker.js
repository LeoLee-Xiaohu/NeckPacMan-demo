const TRACKER_CONFIG = {
  yawThreshold: 0.055,
  pitchThreshold: 0.045,
  calibrationMs: 3000,
  missingFaceMs: 3000,
  trackingIntervalMs: 66,
};

export class Tracker extends EventTarget {
  constructor(video, options = {}) {
    super();
    this.video = video;
    this.config = { ...TRACKER_CONFIG, ...options };
    this.stream = null;
    this.detector = null;
    this.neutral = null;
    this.direction = 'right';
    this.lastFaceSeenAt = performance.now();
    this.lastTrackedAt = 0;
    this.running = false;
    this.animationFrame = null;
  }

  async start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('This browser does not support webcam access. Use Chrome or Edge on desktop.');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' },
      audio: false,
    });

    this.video.srcObject = this.stream;
    await this.video.play();
    await this.loadDetector();
  }

  async loadDetector() {
    if (!window.faceLandmarksDetection || !window.tf) {
      throw new Error('Face tracking libraries failed to load. Check your connection and refresh.');
    }

    await window.tf.setBackend('webgl');
    await window.tf.ready();

    const model = window.faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    this.detector = await window.faceLandmarksDetection.createDetector(model, {
      runtime: 'tfjs',
      refineLandmarks: false,
      maxFaces: 1,
    });
  }

  async calibrate(onProgress = () => {}) {
    const samples = [];
    const startTime = performance.now();

    while (performance.now() - startTime < this.config.calibrationMs) {
      const progress = Math.min(1, (performance.now() - startTime) / this.config.calibrationMs);
      onProgress(progress);
      const pose = await this.detectPose();

      if (pose) {
        samples.push(pose);
      }

      await wait(120);
    }

    if (samples.length < 5) {
      throw new Error('Could not detect your face clearly. Improve lighting and look straight at the camera.');
    }

    this.neutral = averagePose(samples);
    this.lastFaceSeenAt = performance.now();
    onProgress(1);
  }

  run() {
    this.running = true;

    const tick = async (time) => {
      if (!this.running) {
        return;
      }

      if (time - this.lastTrackedAt >= this.config.trackingIntervalMs) {
        this.lastTrackedAt = time;
        await this.trackFrame();
      }

      this.animationFrame = requestAnimationFrame(tick);
    };

    this.animationFrame = requestAnimationFrame(tick);
  }

  async trackFrame() {
    const pose = await this.detectPose();

    if (!pose) {
      if (performance.now() - this.lastFaceSeenAt > this.config.missingFaceMs) {
        this.dispatchStatus('Face not detected — look toward the camera.');
      }
      return;
    }

    this.lastFaceSeenAt = performance.now();
    const direction = this.getDirection(pose);

    if (direction && direction !== this.direction) {
      this.direction = direction;
      this.dispatchEvent(new CustomEvent('direction', { detail: direction }));
    }

    this.dispatchStatus(direction ? `Head direction: ${direction}` : 'Head centered — keep moving or tilt to turn.');
  }

  async detectPose() {
    if (!this.detector || this.video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return null;
    }

    const faces = await this.detector.estimateFaces(this.video, { flipHorizontal: false });
    const keypoints = faces[0]?.keypoints;

    if (!keypoints?.length) {
      return null;
    }

    const leftEye = getKeypoint(keypoints, 33);
    const rightEye = getKeypoint(keypoints, 263);
    const nose = getKeypoint(keypoints, 1);

    if (!leftEye || !rightEye || !nose) {
      return null;
    }

    const eyeDistance = Math.max(1, Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y));
    const eyeCenter = {
      x: (leftEye.x + rightEye.x) / 2,
      y: (leftEye.y + rightEye.y) / 2,
    };

    return {
      yaw: (nose.x - eyeCenter.x) / eyeDistance,
      pitch: (nose.y - eyeCenter.y) / eyeDistance,
    };
  }

  getDirection(pose) {
    if (!this.neutral) {
      return null;
    }

    const yawDelta = pose.yaw - this.neutral.yaw;
    const pitchDelta = pose.pitch - this.neutral.pitch;

    if (Math.abs(yawDelta) > Math.abs(pitchDelta)) {
      if (yawDelta < -this.config.yawThreshold) {
        return 'left';
      }
      if (yawDelta > this.config.yawThreshold) {
        return 'right';
      }
    } else {
      if (pitchDelta < -this.config.pitchThreshold) {
        return 'up';
      }
      if (pitchDelta > this.config.pitchThreshold) {
        return 'down';
      }
    }

    return null;
  }

  stop() {
    this.running = false;

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  dispatchStatus(message) {
    this.dispatchEvent(new CustomEvent('status', { detail: message }));
  }
}

function getKeypoint(keypoints, index) {
  return keypoints.find((point) => point.name === `${index}` || point.index === index) ?? keypoints[index];
}

function averagePose(samples) {
  return samples.reduce(
    (average, sample) => ({
      yaw: average.yaw + sample.yaw / samples.length,
      pitch: average.pitch + sample.pitch / samples.length,
    }),
    { yaw: 0, pitch: 0 },
  );
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
