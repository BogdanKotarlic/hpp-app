import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function QuoteCard({ children }: Props) {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl bg-white shadow-md">
      {children}
    </div>
  );
}
