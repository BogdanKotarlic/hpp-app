import { useEffect, useState } from "react";

export function useCountdown(targetTimestamp: number | undefined) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    getRemaining(targetTimestamp)
  );

  useEffect(() => {
    if (!targetTimestamp) return;

    const update = () => setSecondsLeft(getRemaining(targetTimestamp));

    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return {
    formatted: formatTimeLeft(secondsLeft),
    secondsLeft,
    hasExpired: secondsLeft === 0,
  };
}

function getRemaining(timestamp: number | undefined) {
  if (!timestamp) return 0;
  return Math.max(0, Math.floor((timestamp - Date.now()) / 1000));
}

function formatTimeLeft(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
