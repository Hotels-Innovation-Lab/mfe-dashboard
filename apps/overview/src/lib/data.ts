import type { DateRange } from '@mfe/shared';

// Mock data layer. Replace with real API calls (e.g. TanStack Query + getAccessToken()).

export interface Kpi {
  id: string;
  label: string;
  value: string;
  delta: number;
}

const DAYS: Record<DateRange, number> = { '7d': 7, '30d': 30, '90d': 90 };

export function getKpis(range: DateRange): Kpi[] {
  const days = DAYS[range];
  return [
    { id: 'revenue', label: 'Revenue', value: `$${(days * 4_218).toLocaleString()}`, delta: 12.4 },
    { id: 'orders', label: 'Orders', value: (days * 57).toLocaleString(), delta: 4.1 },
    { id: 'users', label: 'Active users', value: (days * 312).toLocaleString(), delta: -2.3 },
    { id: 'conversion', label: 'Conversion', value: '3.2%', delta: 0.4 },
  ];
}

export const recentActivity = [
  { id: 1, who: 'Alex Kim', what: 'placed order #1042', when: '2m ago' },
  { id: 2, who: 'Priya Shah', what: 'upgraded to Pro', when: '14m ago' },
  { id: 3, who: 'Sam Lee', what: 'placed order #1041', when: '1h ago' },
  { id: 4, who: 'Jordan Diaz', what: 'requested a refund', when: '3h ago' },
];
