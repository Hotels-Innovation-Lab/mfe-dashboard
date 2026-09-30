// Utilities-only CSS: the shell provides preflight + theme values.
import '@mfe/ui/styles/remote.css';

import { DATE_RANGES, usePreferencesStore } from '@mfe/shared';
import { Button } from '@mfe/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@mfe/ui/components/card';
import { Link, Navigate, Route, Routes } from 'react-router';

import { KpiCard } from './components/KpiCard';
import { getKpis, recentActivity } from './lib/data';

/** Mounted by the shell at `/overview/*`; routes below are relative to that. */
export default function OverviewApp() {
  return (
    <Routes>
      <Route index element={<OverviewPage />} />
      <Route path="activity" element={<ActivityPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}

function OverviewPage() {
  const dateRange = usePreferencesStore((s) => s.dateRange);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">{DATE_RANGES[dateRange]}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="activity">View activity</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {getKpis(dateRange).map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </div>
  );
}

function ActivityPage() {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm">
        <Link to="..">← Back to overview</Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex justify-between py-3 text-sm">
                <span>
                  <span className="font-medium">{item.who}</span> {item.what}
                </span>
                <span className="text-muted-foreground">{item.when}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
