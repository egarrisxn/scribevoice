export function getMimeType(): string {
  const mimeTypes = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/mp4", "audio/mpeg"];
  for (const type of mimeTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "audio/webm"; // Default fallback
}

export function createAudioBlob(audioChunks: Blob[]): Blob {
  return new Blob(audioChunks, { type: getMimeType() });
}

// export function formatTime(seconds: number): string {
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = seconds % 60;
//   return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
// }

// export function createAudioURL(audioBlob: Blob): string {
//   return URL.createObjectURL(audioBlob);
// }
