import type { DateRange } from '@mfe/shared';

// Mock data layer. Replace with real API calls (e.g. TanStack Query + getAccessToken()).

const DAYS: Record<DateRange, number> = { '7d': 7, '30d': 30, '90d': 90 };

/** Deterministic PRNG so charts are stable between renders and in tests. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

export interface TrafficPoint {
  date: string;
  desktop: number;
  mobile: number;
}

export function getTraffic(range: DateRange): TrafficPoint[] {
  const days = DAYS[range];
  const random = seeded(days);
  const today = new Date();

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i));
    return {
      date: date.toISOString().slice(0, 10),
      desktop: Math.round(200 + random() * 300),
      mobile: Math.round(150 + random() * 250),
    };
  });
}

export function getChannels(range: DateRange) {
  const scale = DAYS[range];
  return [
    { channel: 'Organic', visits: 186 * scale },
    { channel: 'Paid', visits: 125 * scale },
    { channel: 'Social', visits: 98 * scale },
    { channel: 'Email', visits: 64 * scale },
    { channel: 'Referral', visits: 41 * scale },
  ];
}
