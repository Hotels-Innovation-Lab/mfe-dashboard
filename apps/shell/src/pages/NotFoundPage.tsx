import { Button } from '@mfe/ui/components/button';
import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Button asChild variant="outline">
        <Link to="/">Back to dashboard</Link>
      </Button>
    </div>
  );
}
