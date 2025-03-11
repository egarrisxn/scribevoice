// import { formatDistanceToNow } from "date-fns";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { TestDeleteButton } from "@/components/test/test-delete-btn"; //! TEST - LOCAL STORAGE
// import { TestCopyButton } from "@/components/test/test-copy-btn"; //! TEST - LOCAL STORAGE
// import { TestDownloadButton } from "@/components/test/test-download-btn"; //! TEST - LOCAL STORAGE

// export interface TestTranscription {
//   id: string;
//   rawTranscription: string;
//   processedOutput: string;
//   outputFormat: string;
//   timestamp: number;
//   title: string;
// }

// interface TranscriptionCardProps {
//   transcription: TestTranscription;
// }

// export function TestTranscriptionCard({ transcription }: TranscriptionCardProps) {
//   return (
//     <Card className="from-background via-background to-accent/40 overflow-hidden rounded bg-gradient-to-t shadow">
//       <CardHeader className="pb-2">
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle className="text-base font-semibold">
//               <h1>{transcription.title.substring(0, 20) + "..."}</h1>
//             </CardTitle>
//             <CardDescription className="mt-0.5 text-sm">
//               <h2>{formatDistanceToNow(new Date(transcription.timestamp), { addSuffix: true })}</h2>
//             </CardDescription>
//           </div>
//           {/* TEST - LOCAL STORAGE */}
//           <TestDeleteButton id={transcription.id} />
//         </div>
//       </CardHeader>
//       <CardContent className="pb-2">
//         <div className="bg-muted/50 max-h-[150px] overflow-y-auto rounded-md p-3 text-sm whitespace-pre-wrap">
//           <p>{transcription.title}</p>
//         </div>
//       </CardContent>
//       <CardFooter className="flex justify-center sm:justify-end sm:pt-1 sm:pb-3">
//         {/* TEST - LOCAL STORAGE */}
//         <TestCopyButton text={transcription.title} id={transcription.id} />
//         {/* TEST - LOCAL STORAGE */}
//         <TestDownloadButton transcription={transcription} />
//       </CardFooter>
//     </Card>
//   );
// }
