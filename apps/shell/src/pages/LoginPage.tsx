import { useAuthStore } from '@mfe/shared';
import { Button } from '@mfe/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@mfe/ui/components/card';
import { Input } from '@mfe/ui/components/input';
import { Label } from '@mfe/ui/components/label';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

export function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      await login(String(form.get('email')), String(form.get('password')));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="contents">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Mock auth: any email and password will do.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? 'Signing in…' : 'Sign in'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
