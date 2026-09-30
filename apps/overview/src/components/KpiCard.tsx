import { Badge } from '@mfe/ui/components/badge';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@mfe/ui/components/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

import type { Kpi } from '../lib/data';

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const up = kpi.delta >= 0;
  const Icon = up ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader>
        <CardDescription>{kpi.label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{kpi.value}</CardTitle>
        <CardAction>
          <Badge variant="outline" className={up ? 'text-emerald-600' : 'text-destructive'}>
            <Icon />
            {up ? '+' : ''}
            {kpi.delta}%
          </Badge>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
