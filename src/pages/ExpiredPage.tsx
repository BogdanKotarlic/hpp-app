import QuoteCard from "../components/QuoteCard";

export default function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EBEDF3] px-4">
      <QuoteCard>
        <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Quote Expired
        </h1>
        <p className="text-gray-700 mb-2 text-center">
          The quote you were trying to access is no longer valid.
        </p>
        <p className="text-gray-500 text-sm text-center">
          Please go back to the merchant and generate a new one.
        </p>
      </QuoteCard>
    </div>
  );
}
