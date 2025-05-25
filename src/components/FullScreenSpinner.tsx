import { Loader2 } from "lucide-react";

export default function FullScreenSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#EBEDF3]">
      <Loader2 className="h-8 w-8 animate-spin text-[#3F53DD]" />
    </div>
  );
}
