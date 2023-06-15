var video = document.querySelector("#cameraFeed");
var recordButton = document.querySelector("#recordButton");

var mediaRecorder;
var recordedBlobs = [];

recordButton.addEventListener("click", toggleRecording);

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            prepareRecording(stream);
        })
        .catch(function (error) {
            console.log("Something went wrong!", error);
        });
}

function prepareRecording(stream) {
    recordedBlobs = [];
    var options = { mimeType: "video/webm;codecs=vp9" };

    try {
        mediaRecorder = new MediaRecorder(stream, options);
    } catch (error) {
        console.error("Failed to create MediaRecorder:", error);
        return;
    }

    mediaRecorder.ondataavailable = handleDataAvailable;
}

function toggleRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    recordedBlobs = [];
    console.log("Started recording!");
    mediaRecorder.start();
    recordButton.textContent = "Stop Recording";
}

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function stopRecording() {
    mediaRecorder.stop();
    console.log("Stopped recording!");

    recordButton.textContent = "Record";
    downloadRecording();
}

function downloadRecording() {
    var blob = new Blob(recordedBlobs, { type: "video/webm" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "recording.webm";
    a.click();
    setTimeout(() => { // timeout to revoke url after download
        URL.revokeObjectURL(url);
        a.remove();
    }, 100);
}
