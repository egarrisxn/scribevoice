// "use client";

// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { saveTranscription } from "@/lib/storage";
// import { processTranscription } from "@/lib/openai";
// import FunCard from "@/components/fun-card";
// import TestRecordAndUpload from "@/components/test/test-record-and-upload";
// import { type OutputFormat, TestFormatSelector } from "@/components/test/test-format-selector";
// import TestTranscriptionOutput from "@/components/test/test-transcription-output";
// import Loader from "@/components/loader";
// import TestTranscriptionsList from "@/components/test/test-transcriptions-list";
// import { v4 as uuidv4 } from "uuid"; //! TEST - LOCAL STORAGE

// export default function TestDashboardCard() {
//   const [rawTranscription, setRawTranscription] = useState("");
//   const [processedOutput, setProcessedOutput] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [outputFormat, setOutputFormat] = useState<OutputFormat>("notes");
//   const [isSaved, setIsSaved] = useState(false); //! TEST - LOCAL STORAGE

//   const handleTranscriptionComplete = async (text: string) => {
//     setRawTranscription(text);
//     try {
//       setIsProcessing(true);
//       const processed = await processTranscription(text, outputFormat);
//       setProcessedOutput(processed);
//     } catch (error) {
//       console.error("Error processing transcription:", error);
//       toast.error("Processing failed", {
//         description: "There was an error processing your transcription. Please try again.",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleFormatChange = async (format: OutputFormat) => {
//     setOutputFormat(format);
//     if (rawTranscription) {
//       try {
//         setIsProcessing(true);
//         const processed = await processTranscription(rawTranscription, format);
//         setProcessedOutput(processed);
//         setIsSaved(false); //! TEST - LOCAL STORAGE
//       } catch (error) {
//         console.error("Error processing transcription:", error);
//         toast.error("Processing failed", {
//           description: "There was an error processing your transcription. Please try again.",
//         });
//       } finally {
//         setIsProcessing(false);
//       }
//     }
//   };

//   //! TEST - LOCAL STORAGE
//   useEffect(() => {
//     if (rawTranscription) {
//       setIsSaved(false);
//     }
//   }, [rawTranscription]);

//   //! TEST - LOCAL STORAGE
//   const handleSaveTranscription = () => {
//     if (!rawTranscription || !processedOutput) return;
//     const words = rawTranscription.split(" ");
//     const title = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");
//     saveTranscription({
//       id: uuidv4(),
//       rawTranscription,
//       processedOutput,
//       outputFormat,
//       timestamp: Date.now(),
//       title,
//     });
//     setIsSaved(true);
//     toast("Your transcription has been saved and can be accessed later.");
//   };

//   return (
//     <div className="mx-auto w-full max-w-3xl space-y-2 px-4">
//       <FunCard className="space-y-8 p-6">
//         <hr className="border-muted" />
//         <TestRecordAndUpload onTranscriptionComplete={handleTranscriptionComplete} />
//         <hr className="border-muted" />
//         <TestFormatSelector onFormatChange={handleFormatChange} />
//         <hr className="border-muted" />
//         {isProcessing ? (
//           <Loader text={"Processing your transcription..."} />
//         ) : rawTranscription ? (
//           <TestTranscriptionOutput
//             rawTranscription={rawTranscription}
//             processedOutput={processedOutput}
//             outputFormat={outputFormat}
//             onSave={handleSaveTranscription} //! TEST - LOCAL STORAGE
//             isSaved={isSaved} //! TEST - LOCAL STORAGE
//           />
//         ) : null}
//       </FunCard>
//       <TestTranscriptionsList />
//     </div>
//   );
// }
