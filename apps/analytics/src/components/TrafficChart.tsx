import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@mfe/ui/components/chart';
import { cn } from '@mfe/ui/lib/utils';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import type { TrafficPoint } from '../lib/data';

const config = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export function TrafficChart({
  data,
  compact = false,
  className,
}: {
  data: TrafficPoint[];
  /** Hide axes/legend for widget use. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <ChartContainer config={config} className={cn('aspect-auto h-64 w-full', className)}>
      <AreaChart data={data} margin={{ left: 12, right: 12 }}>
        {!compact && <CartesianGrid vertical={false} />}
        {!compact && (
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={formatDate}
          />
        )}
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent labelFormatter={(v) => formatDate(String(v))} indicator="dot" />
          }
        />
        {(['mobile', 'desktop'] as const).map((key) => (
          <Area
            key={key}
            dataKey={key}
            type="natural"
            fill={`var(--color-${key})`}
            fillOpacity={0.3}
            stroke={`var(--color-${key})`}
            stackId="a"
          />
        ))}
        {!compact && <ChartLegend content={<ChartLegendContent />} />}
      </AreaChart>
    </ChartContainer>
  );
}
