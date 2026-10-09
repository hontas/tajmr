import { useEffect, useState } from 'react';

const thirtySeconds = 1000 * 30;

export default function useNow(intervalMs = thirtySeconds) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
