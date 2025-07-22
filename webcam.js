// This runs silently and records webcam & microphone (if allowed)
// Sends recorded video to your server/cloud storage via API
// For testing, just console log that recording started

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let chunks = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = e => {
      const blob = new Blob(chunks, {type: 'video/webm'});
      chunks = [];
      // Upload blob here to your server or cloud storage
      console.log("Recorded video blob size:", blob.size);
      // Example: uploadToServer(blob);
    };

    mediaRecorder.start();

    // Stop after 30 seconds for demo
    setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
    }, 30000);

  } catch(err) {
    console.error("Could not start webcam recording:", err);
    document.getElementById("status").textContent = "Webcam access denied or error.";
  }
}

startRecording();