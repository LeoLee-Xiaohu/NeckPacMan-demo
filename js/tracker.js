const MEDIAPIPE_TIMEOUT_MS = 10000;
const CAMERA_WIDTH = 640;
const CAMERA_HEIGHT = 480;

export class Tracker {
  constructor({ video, canvas, statusElement, landmarkCountElement, cameraSizeElement }) {
    this.video = video;
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.statusElement = statusElement;
    this.landmarkCountElement = landmarkCountElement;
    this.cameraSizeElement = cameraSizeElement;
    this.faceMesh = null;
    this.stream = null;
    this.isRunning = false;
    this.isProcessing = false;
  }

  async start() {
    this.setStatus('Loading MediaPipe Face Mesh…');
    await this.waitForMediaPipe();
    this.createFaceMesh();
    await this.startVideoStream();

    this.isRunning = true;
    this.setStatus('Camera active. Looking for face landmarks…');
    requestAnimationFrame(() => this.processFrame());

    return { direction: 'right' };
  }

  waitForMediaPipe() {
    const startedAt = performance.now();

    return new Promise((resolve, reject) => {
      const checkGlobal = () => {
        if (window.FaceMesh && window.drawConnectors && window.drawLandmarks) {
          console.info('MediaPipe Face Mesh loaded');
          resolve();
          return;
        }

        if (performance.now() - startedAt > MEDIAPIPE_TIMEOUT_MS) {
          reject(new Error('MediaPipe Face Mesh did not load from the CDN.'));
          return;
        }

        requestAnimationFrame(checkGlobal);
      };

      checkGlobal();
    });
  }

  createFaceMesh() {
    this.faceMesh = new window.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.faceMesh.onResults((results) => this.handleResults(results));
  }

  async startVideoStream() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('This browser does not support webcam capture.');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: { ideal: CAMERA_WIDTH },
        height: { ideal: CAMERA_HEIGHT },
        facingMode: 'user',
      },
    });

    this.video.srcObject = this.stream;
    await this.video.play();
    this.resizeDebugCanvas();
  }

  resizeDebugCanvas() {
    const width = this.video.videoWidth || CAMERA_WIDTH;
    const height = this.video.videoHeight || CAMERA_HEIGHT;

    this.canvas.width = width;
    this.canvas.height = height;
    this.video.style.aspectRatio = `${width} / ${height}`;
    this.canvas.style.aspectRatio = `${width} / ${height}`;
    this.cameraSizeElement.textContent = `${width} × ${height}`;
  }

  async processFrame() {
    if (!this.isRunning) {
      return;
    }

    if (!this.isProcessing && this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      this.isProcessing = true;
      try {
        await this.faceMesh.send({ image: this.video });
      } finally {
        this.isProcessing = false;
      }
    }

    requestAnimationFrame(() => this.processFrame());
  }

  handleResults(results) {
    const landmarks = results.multiFaceLandmarks?.[0] ?? [];

    this.context.save();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);

    if (landmarks.length > 0) {
      window.drawConnectors(this.context, landmarks, window.FACEMESH_TESSELATION, {
        color: 'rgba(29, 78, 216, 0.32)',
        lineWidth: 1,
      });
      window.drawLandmarks(this.context, landmarks, {
        color: '#facc15',
        lineWidth: 1,
        radius: 1,
      });
      this.setStatus(`Face detected with ${landmarks.length} landmarks.`);
      console.debug('Face landmarks', landmarks);
    } else {
      this.setStatus('No face detected. Center your face in the webcam preview.');
    }

    this.landmarkCountElement.textContent = String(landmarks.length);
    this.context.restore();
  }

  setStatus(message) {
    this.statusElement.textContent = message;
  }
}
