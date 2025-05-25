import { useState } from "react";

type CopyTextProps = {
  value: string;
  display: string;
};

export default function CopyText({ value, display }: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span
      onClick={handleCopy}
      className={`cursor-pointer text-[#3F53DD] text-sm font-medium ${
        copied ? "animate-pulse" : ""
      }`}
    >
      {copied ? "Copied!" : "Copy"}
    </span>
  );
}
