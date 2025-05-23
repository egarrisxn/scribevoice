"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useRecorder, useFileUpload } from "@/lib/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RecordButton from "@/components/main/record-btn";
import UploadButton from "@/components/main/upload-btn";

export default function RecordAndUpload({
  onTranscriptionComplete,
  onUsageLimitReached, // --- NEW PROP ---
}: {
  onTranscriptionComplete: (text: string) => void;
  onUsageLimitReached: () => void; // --- NEW PROP TYPE ---
}) {
  // Pass onUsageLimitReached down to useRecorder and useFileUpload
  const recorder = useRecorder(onTranscriptionComplete, onUsageLimitReached);
  const fileUpload = useFileUpload(onTranscriptionComplete, onUsageLimitReached);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
    setIsMobile(isMobileDevice);
  }, []);

  return (
    <div className="space-y-2 py-2">
      <h1 className="text-center font-semibold lg:text-lg">
        {isMobile ? "Browser Not Supported" : "Record or Upload Audio"}
      </h1>
      <div className="flex flex-col items-center gap-0.5">
        {(recorder.error || fileUpload.error) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{recorder.error || fileUpload.error}</AlertDescription>
          </Alert>
        )}
        {isMobile && (
          <Alert className="mb-4">
            <AlertCircle className="size-4" />
            <AlertTitle>Mobile Device Notice</AlertTitle>
            <AlertDescription>
              Real-time voice recording is optimized for desktop browsers. Please utilize the file
              upload option for mobile devices.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-4 lg:flex-row">
          <RecordButton {...recorder} />
          <UploadButton {...fileUpload} />
        </div>
      </div>
      <p className="text-muted-foreground mx-auto max-w-[30rem] pt-4 text-center text-xs lg:text-sm">
        {isMobile ? (
          <>
            Direct audio recording is not supported by your current browser. Consider using a
            compatible browser such as Chrome or Firefox.
          </>
        ) : recorder.isMediaRecorderSupported ? (
          <>
            Initiate recording by clicking the record button. Speak clearly into the microphone.
            Terminate recording to process your audio.
            <br />
            <span className="font-semibold">Alternatively, upload a pre-recorded audio file.</span>
          </>
        ) : (
          <>
            Direct audio recording is not supported by your current browser. Consider using a
            compatible browser such as Chrome or Firefox.
          </>
        )}
      </p>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { AlertCircle } from "lucide-react";
// import { useRecorder, useFileUpload } from "@/lib/hooks";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import RecordButton from "@/components/main/record-btn";
// import UploadButton from "@/components/main/upload-btn";

// export default function RecordAndUpload({
//   onTranscriptionComplete,
// }: {
//   onTranscriptionComplete: (text: string) => void;
// }) {
//   const recorder = useRecorder(onTranscriptionComplete);
//   const fileUpload = useFileUpload(onTranscriptionComplete);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const userAgent = navigator.userAgent.toLowerCase();
//     const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
//     setIsMobile(isMobileDevice);
//   }, []);

//   return (
//     <div className="space-y-2 py-2">
//       <h1 className="text-center font-semibold lg:text-lg">
//         {isMobile ? "Browser Not Supported" : "Record or Upload Audio"}
//       </h1>
//       <div className="flex flex-col items-center gap-0.5">
//         {recorder.error && (
//           <Alert variant="destructive" className="mb-4">
//             <AlertCircle className="size-4" />
//             <AlertTitle>Recording Error</AlertTitle>
//             <AlertDescription>{recorder.error}</AlertDescription>
//           </Alert>
//         )}
//         {isMobile && (
//           <Alert className="mb-4">
//             <AlertCircle className="size-4" />
//             <AlertTitle>Mobile Device Notice</AlertTitle>
//             <AlertDescription>
//               Real-time voice recording is optimized for desktop browsers. Please utilize the file
//               upload option for mobile devices.
//             </AlertDescription>
//           </Alert>
//         )}
//         <div className="flex flex-col gap-4 lg:flex-row">
//           <RecordButton {...recorder} />
//           <UploadButton {...fileUpload} />
//         </div>
//       </div>
//       <p className="text-muted-foreground mx-auto max-w-[30rem] pt-4 text-center text-xs lg:text-sm">
//         {isMobile ? (
//           <>
//             Direct audio recording is not supported by your current browser. Consider using a
//             compatible browser such as Chrome or Firefox.
//           </>
//         ) : recorder.isMediaRecorderSupported ? (
//           <>
//             Initiate recording by clicking the record button. Speak clearly into the microphone.
//             Terminate recording to process your audio.
//             <br />
//             <span className="font-semibold">Alternatively, upload a pre-recorded audio file.</span>
//           </>
//         ) : (
//           <>
//             Direct audio recording is not supported by your current browser. Consider using a
//             compatible browser such as Chrome or Firefox.
//           </>
//         )}
//       </p>
//     </div>
//   );
// }
