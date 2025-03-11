// "use client";

// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { getSavedTranscriptions } from "@/lib/storage";
// import { Button } from "@/components/ui/button";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import FunCard from "@/components/fun-card";
// import { TestTranscriptionCard } from "@/components/test/test-transcription-card"; //! TEST - LOCAL STORAGE

// export interface TestTranscription {
//   id: string;
//   rawTranscription: string;
//   processedOutput: string;
//   outputFormat: string;
//   timestamp: number;
//   title: string;
// }

// export default function TestTranscriptionsList() {
//   const [transcriptions, setTranscriptions] = useState<TestTranscription[]>([]);
//   const [isOpen, setIsOpen] = useState(false);

//   //! TEST - LOCAL STORAGE
//   useEffect(() => {
//     const loadTranscriptions = () => {
//       const saved = getSavedTranscriptions();
//       setTranscriptions(saved);
//     };
//     loadTranscriptions();
//     window.addEventListener("storage", loadTranscriptions);
//     return () => {
//       window.removeEventListener("storage", loadTranscriptions);
//     };
//   }, []);

//   if (transcriptions.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       <Collapsible
//         open={isOpen}
//         onOpenChange={setIsOpen}
//         className="border-accent group relative rounded-md border-2 bg-white dark:bg-zinc-900"
//       >
//         <FunCard className="p-6">
//           <hr className="border-muted" />
//           <div className="flex items-center justify-between py-6">
//             <CollapsibleTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="flex cursor-pointer items-center gap-2 text-base leading-none font-semibold"
//               >
//                 {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
//                 <span>Saved Transcriptions ({transcriptions.length})</span>
//               </Button>
//             </CollapsibleTrigger>
//           </div>
//           <hr className="border-muted" />
//           <CollapsibleContent>
//             <div className="py-6">
//               <ScrollArea className="h-[400px]">
//                 <div className="space-y-4">
//                   {transcriptions.map((transcription) => (
//                     <TestTranscriptionCard key={transcription.id} transcription={transcription} />
//                   ))}
//                 </div>
//               </ScrollArea>
//             </div>
//             <hr className="border-muted" />
//           </CollapsibleContent>
//         </FunCard>
//       </Collapsible>
//     </>
//   );
// }
