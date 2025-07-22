// --- IMPORTANT ---
// Replace these with your own Cloudinary details
const CLOUD_NAME = "dps0g5ftz";
const UPLOAD_PRESET = "unsigned";

const startBtn = document.getElementById("startBtn");
const canvas = document.getElementById("snakeGame");

let mediaRecorder;
let chunks = [];

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  startBtn.textContent = "Requesting camera...";
  chunks = [];

  try {
    // Request webcam + mic access
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      uploadVideo(videoBlob);
    };

    mediaRecorder.start();
    startBtn.textContent = "Recording... Play the game!";
    
    // Start the Snake game
    startGame();

    // Automatically stop recording after 30 seconds
    setTimeout(() => {
      mediaRecorder.stop();
      startBtn.textContent = "Uploading video...";
    }, 30000);

  } catch (err) {
    alert("Could not start recording: " + err);
    startBtn.disabled = false;
    startBtn.textContent = "Start";
  }
});

// Upload to Cloudinary unsigned upload endpoint
async function uploadVideo(blob) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    alert("Upload complete!\n\nVideo URL:\n" + data.secure_url);
    startBtn.textContent = "Start";
    startBtn.disabled = false;
  } catch (err) {
    alert("Upload failed: " + err);
    startBtn.textContent = "Start";
    startBtn.disabled = false;
  }
}