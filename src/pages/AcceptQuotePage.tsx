import { getPaymentSummary } from "../api/payment";
import {
  acceptPaymentSummary,
  updatePaymentSummary,
} from "../api/paymentActions";
import QuoteCard from "../components/QuoteCard";
import { CURRENCIES, ROUTES } from "../constants";
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

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500">Something went wrong.</p>;

  return (
    <QuoteCard>
      <h2 className="text-lg font-semibold mb-2">Accept Quote</h2>
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">{data?.merchantDisplayName}</p>
        <p className="text-3xl font-bold">
          {data?.displayCurrency.amount} {data?.displayCurrency.currency}
        </p>
        <p className="text-sm text-gray-500">
          Reference: <strong>{data?.reference}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <select
          className="w-full border px-4 py-2 rounded"
          value={selectedCurrency}
          onChange={handleCurrencyChange}
        >
          <option value="">Select Currency</option>
          {CURRENCIES.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        {selectedCurrency && !!data?.paidCurrency?.amount && (
          <>
            <div className="flex justify-between text-sm">
              <span>Amount due</span>
              <span>
                {data.paidCurrency.amount} {data.paidCurrency.currency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Quoted price expires in</span>
              <span>{expiryCountdown}</span>
            </div>
            <button
              onClick={() => acceptMutation.mutate()}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
            >
              Confirm
            </button>
          </>
        )}
      </div>
    </QuoteCard>
  );
}
