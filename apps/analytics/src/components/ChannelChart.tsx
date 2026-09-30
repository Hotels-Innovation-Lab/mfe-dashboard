import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@mfe/ui/components/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const config = {
  visits: { label: 'Visits', color: 'var(--chart-3)' },
} satisfies ChartConfig;

export function ChannelChart({ data }: { data: { channel: string; visits: number }[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="channel" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="visits" fill="var(--color-visits)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
