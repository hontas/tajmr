import { useEffect, useState } from 'react';

const thirtySeconds = 1000 * 30;

// The current time as state, refreshed every `intervalMs`, so render stays pure.
export default function useNow(intervalMs = thirtySeconds) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
