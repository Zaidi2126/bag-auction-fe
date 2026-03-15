import { useState, useEffect } from "react";

/**
 * Auction start: 11:00 PM UAE time, March 16.
 * UAE = UTC+4
 */
export const AUCTION_START_DATE = new Date("2026-03-16T23:00:00+04:00");

export const AUCTION_START_LABEL = "March 16, 2026 at 11:00 PM (UAE)";

/** Set VITE_FORCE_AUCTION_LIVE=true in .env to show auction as live for testing. Remove when done. */
export const FORCE_AUCTION_LIVE = import.meta.env.VITE_FORCE_AUCTION_LIVE === "true";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
  totalSeconds: number;
}

function getCountdown(now: Date, start: Date): CountdownParts {
  const totalMs = start.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const isStarted = totalSeconds <= 0;

  if (isStarted) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true, totalSeconds: 0 };
  }

  const days = Math.floor(totalSeconds / 86400);
  const remainder = totalSeconds % 86400;
  const hours = Math.floor(remainder / 3600);
  const remainder2 = remainder % 3600;
  const minutes = Math.floor(remainder2 / 60);
  const seconds = remainder2 % 60;

  return { days, hours, minutes, seconds, isStarted: false, totalSeconds };
}

/**
 * Returns countdown to AUCTION_START_DATE, updating every second.
 */
export function useCountdownToStart(): CountdownParts {
  const [parts, setParts] = useState(() => getCountdown(new Date(), AUCTION_START_DATE));

  useEffect(() => {
    const tick = () => setParts(getCountdown(new Date(), AUCTION_START_DATE));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return parts;
}
