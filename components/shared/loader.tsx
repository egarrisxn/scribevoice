import { Loader2 } from "lucide-react";

export default function Loader({ text = "Loading..." }) {
  return (
    <section className="flex items-center justify-center">
      <Loader2 className="text-primary size-8 animate-spin" />
      <span className="ml-2 text-lg">{text}</span>
    </section>
  );
}
