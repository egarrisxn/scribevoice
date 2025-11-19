export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();

    // Create a new file with a more generic name and type
    // This helps with iOS Safari which can be picky about file extensions
    const file = new File([audioBlob], "recording.webm", {
      type: audioBlob.type || "audio/webm",
    });

    formData.append("file", file);

    console.log("Sending file:", file.name, file.type, file.size);

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.error || `Transcription failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw error;
  }
}

export async function processTranscription(
  transcription: string,
  outputFormat: "notes" | "transcript" | "list" | "summary"
): Promise<string> {
  try {
    const response = await fetch("/api/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcription,
        outputFormat,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.error || `Processing failed: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error processing transcription:", error);
    throw error;
  }
}
