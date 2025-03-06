// export interface SavedTranscription {
//   id: string;
//   rawTranscription: string;
//   processedOutput: string;
//   outputFormat: string;
//   timestamp: number;
//   title: string;
// }

// export function saveTranscription(transcription: SavedTranscription): void {
//   const savedTranscriptions = getSavedTranscriptions();
//   savedTranscriptions.unshift(transcription);
//   localStorage.setItem("ScribeVoice-transcriptions", JSON.stringify(savedTranscriptions));
// }

// export function getSavedTranscriptions(): SavedTranscription[] {
//   const saved = localStorage.getItem("ScribeVoice-transcriptions");
//   return saved ? JSON.parse(saved) : [];
// }

// export function deleteTranscription(id: string): void {
//   const savedTranscriptions = getSavedTranscriptions();
//   const filtered = savedTranscriptions.filter((t) => t.id !== id);
//   localStorage.setItem("ScribeVoice-transcriptions", JSON.stringify(filtered));
// }

// export function clearAllTranscriptions(): void {
//   localStorage.removeItem("ScribeVoice-transcriptions");
// }
