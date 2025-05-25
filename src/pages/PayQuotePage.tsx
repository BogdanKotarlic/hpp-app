import { getPaymentSummary } from "../api/payment";
import QuoteCard from "../components/QuoteCard";
import { ROUTES } from "../constants";
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

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500">Something went wrong.</p>;

  if (!data) return null;

  return (
    <QuoteCard>
      <h2 className="text-lg font-semibold mb-2">
        Pay with {data.paidCurrency.currency}
      </h2>

      <div className="flex justify-between text-sm">
        <span>Amount due:</span>
        <span
          onClick={() => copyToClipboard(String(data.paidCurrency.amount))}
          className="cursor-pointer text-blue-600 hover:underline"
        >
          {data.paidCurrency.amount} {data.paidCurrency.currency}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Address:</span>
        <span
          onClick={() => copyToClipboard(data.address?.address || "")}
          className="cursor-pointer text-blue-600 hover:underline break-all text-right"
        >
          {data.address?.address}
        </span>
      </div>

      <div className="flex justify-center py-4">
        <QRCodeSVG value={data.address?.uri || ""} size={180} />
      </div>

      <div className="text-sm text-center text-gray-500">
        Time left to pay:
        <br />
        {countdown}
      </div>
    </QuoteCard>
  );
}
