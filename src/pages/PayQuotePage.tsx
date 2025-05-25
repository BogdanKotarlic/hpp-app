import { getPaymentSummary } from "../api/payment";
import CopyText from "../components/CopyText";
import FullScreenSpinner from "../components/FullScreenSpinner";
import QuoteCard from "../components/QuoteCard";
import { CURRENCY_LABELS, ROUTES } from "../constants";
import { useCountdown } from "../hooks/useCountdown";
import { PaymentSummary } from "../types/payment";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PayQuotePage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<PaymentSummary>({
    queryKey: ["summary", uuid],
    queryFn: () => getPaymentSummary(uuid!),
    refetchInterval: 5000,
    enabled: !!uuid,
  });

  const { formatted: countdown, hasExpired } = useCountdown(data?.expiryDate);

  useEffect(() => {
    if (!uuid || !data) return;
    
    if (data.status === "EXPIRED" || hasExpired) {
      navigate(ROUTES.expired(uuid));
    }
  }, [data, navigate, uuid, hasExpired]);

  if (isLoading) return <FullScreenSpinner />;
  if (isError)
    return <p className="text-center text-red-500">Something went wrong.</p>;
  if (!data) return null;

  const shortenedAddress = data.address?.address
    ? `${data.address.address.slice(0, 8)}...${data.address.address.slice(-6)}`
    : "";

  return (
    <QuoteCard>
      <h2 className="text-xl font-semibold text-center text-[#0A1628]">
        Pay with{" "}
        {CURRENCY_LABELS[data.paidCurrency.currency ?? ""] ||
          data.paidCurrency.currency}
      </h2>

      <p className="text-sm text-center text-[#556877] mt-4 mb-10 max-w-[300px] mx-auto">
        To complete this payment send the amount due to the{" "}
        {data.paidCurrency.currency} address provided below.
      </p>

      <div className="flex justify-between items-center border-y border-[#E2E8F0] py-3 text-sm">
        <span className="text-[#556877]">Amount due</span>
        <span className="text-[#0A1628] font-medium flex items-center gap-1">
          {data.paidCurrency.amount} {data.paidCurrency.currency}
          <CopyText value={String(data.paidCurrency.amount)} display="Copy" />
        </span>
      </div>

      <div className="flex justify-between items-center pt-4 text-sm">
        <span className="text-[#556877]">
          {data.paidCurrency.currency} address
        </span>
        <span className="text-[#0A1628] font-medium flex items-center gap-1">
          {shortenedAddress}
          <CopyText value={data.address?.address || ""} display="Copy" />
        </span>
      </div>

      <div className="flex justify-center py-6">
        <QRCodeSVG value={data.address?.uri || ""} size={140} />
      </div>

      <p className="text-xs text-center text-[#556877] break-all mb-4">
        {data.address?.address}
      </p>

      <div className="flex justify-between items-center border-y border-[#E2E8F0] py-3 text-sm">
        <span className="text-[#556877]">Time left to pay</span>
        <span className="text-[#0A1628] font-medium">{countdown}</span>
      </div>
    </QuoteCard>
  );
}
