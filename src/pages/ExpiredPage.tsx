import QuoteCard from "../components/QuoteCard";
import { AlertTriangle } from "lucide-react";

export default function ExpiredPage() {
  return (
    <QuoteCard>
      <div className="flex flex-col items-center space-y-4 text-center text-[#0A1628] p-4">
        <div className="bg-[#FF7051] rounded-full p-3">
          <AlertTriangle className="text-white w-6 h-6" />
        </div>
        <h1 className="text-[20px] font-semibold leading-[28px]">
          Payment details expired
        </h1>
        <p className="text-[#556877] text-[14px] leading-[22px] max-w-[280px]">
          The payment details for your transaction have expired.
        </p>
      </div>
    </QuoteCard>
  );
}
