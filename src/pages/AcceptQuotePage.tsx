import { getPaymentSummary } from "../api/payment";
import {
  acceptPaymentSummary,
  updatePaymentSummary,
} from "../api/paymentActions";
import FullScreenSpinner from "../components/FullScreenSpinner";
import QuoteCard from "../components/QuoteCard";
import { CURRENCIES, CURRENCY_LABELS, ROUTES } from "../constants";
import { useCountdown } from "../hooks/useCountdown";
import { PaymentSummary } from "../types/payment";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AcceptQuotePage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const { data, isLoading, isError, refetch } = useQuery<PaymentSummary>({
    queryKey: ["summary", uuid],
    queryFn: () => getPaymentSummary(uuid!),
    enabled: !!uuid,
    refetchInterval: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: (currency: string) => updatePaymentSummary(uuid!, currency),
    onSuccess: () => refetch(),
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptPaymentSummary(uuid!),
    onSuccess: () => navigate(ROUTES.pay(uuid!)),
  });

  const {
    formatted: expiryCountdown,
    secondsLeft,
    hasExpired,
  } = useCountdown(data?.acceptanceExpiryDate);

  const prevSecondsRef = useRef(secondsLeft);

  useEffect(() => {
    if (data?.status === "EXPIRED") navigate(ROUTES.expired(uuid!));
    if (data?.quoteStatus === "ACCEPTED") navigate(ROUTES.pay(uuid!));
  }, [data, navigate, uuid]);

  useEffect(() => {
    if (prevSecondsRef.current > 0 && hasExpired && selectedCurrency) {
      updateMutation.mutate(selectedCurrency);
    }
    prevSecondsRef.current = secondsLeft;
  }, [hasExpired, selectedCurrency, updateMutation, secondsLeft]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value;
    setSelectedCurrency(currency);
    updateMutation.mutate(currency);
  };

  const handleConfirm = () => {
    if (hasExpired) {
      navigate(ROUTES.expired(uuid!));
      return;
    }

    acceptMutation.mutate();
  };

  if (isLoading) return <FullScreenSpinner />;
  if (isError)
    return <p className="text-center text-red-500">Something went wrong.</p>;

  return (
    <QuoteCard>
      <div className="text-center mb-4 text-[#0A1628]">
        <p className="font-medium text-[20px] leading-[28px]">
          {data?.merchantDisplayName}
        </p>

        <div className="flex items-baseline justify-center gap-1">
          <span className="text-[32px] leading-[40px] font-semibold">
            {data?.displayCurrency.amount}
          </span>
          <span className="text-[20px] leading-[40px] font-semibold">
            {data?.displayCurrency.currency}
          </span>
        </div>

        <p className="text-[14px] leading-[22px] text-[#556877] mt-4">
          For reference number:{" "}
          <span className="font-medium text-[#0A1628]">{data?.reference}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="currency"
            className="text-[14px] leading-[22px] text-[#0A1628] block"
          >
            Pay with
          </label>
          <select
            className="w-full h-14 px-4 py-4 rounded border border-gray-300 text-[#0A1628] text-sm"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
          >
            <option value="">Select Currency</option>
            {CURRENCIES.map((cur) => (
              <option key={cur} value={cur}>
                {CURRENCY_LABELS[cur]}
              </option>
            ))}
          </select>
        </div>

        {selectedCurrency && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-[#556877]">Amount due</span>
              <span className="min-w-[80px] flex items-center justify-end">
                {updateMutation.isPending ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#3F53DD] border-t-transparent" />
                ) : (
                  <>
                    {data?.paidCurrency.amount} {data?.paidCurrency.currency}
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#556877]">Quoted price expires in</span>
              <span className="min-w-[80px] flex items-center justify-end">
                {updateMutation.isPending ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#3F53DD] border-t-transparent" />
                ) : (
                  expiryCountdown
                )}
              </span>
            </div>
            <button
              onClick={handleConfirm}
              disabled={acceptMutation.isPending}
              className={`w-full h-10 mt-4 px-4 rounded text-white ${
                acceptMutation.isPending
                  ? "bg-[#3F53DD]/70 cursor-not-allowed"
                  : "bg-[#3F53DD] hover:bg-indigo-700"
              }`}
            >
              {acceptMutation.isPending ? "Processing..." : "Confirm"}
            </button>
          </>
        )}
      </div>
    </QuoteCard>
  );
}
