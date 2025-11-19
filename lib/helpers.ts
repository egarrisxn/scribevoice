export function getMimeType(): string {
  const mimeTypes = [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mp4",
    "audio/mpeg",
  ];
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
