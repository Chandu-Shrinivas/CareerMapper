import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { authService } from '../services/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-[400px] rounded-xl border border-border bg-card p-8 shadow-soft space-y-6">
        <div className="space-y-1.5">
          <Link
            to="/signin"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="size-3.5" />
            Back to Sign In
          </Link>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Forgot your password?</h1>
          <p className="text-[13.5px] text-muted-foreground leading-relaxed">
            Enter your email and we'll help you reset your password.
          </p>
        </div>

        {success ? (
          <div className="space-y-4 pt-1 animate-fadeUp">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4 text-[13.5px] text-foreground leading-normal">
              <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Check your email</p>
                <p className="mt-1 text-muted-foreground">
                  Password reset instructions have been requested for <span className="font-semibold text-foreground">{email}</span>.
                </p>
              </div>
            </div>
            <Link
              to="/signin"
              className="block w-full text-center py-2 bg-primary text-primary-foreground hover:opacity-90 font-medium rounded-lg text-[13.5px]"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-[13px] text-destructive leading-normal animate-fadeUp">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[12px] font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@careermapper.app"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-9 bg-transparent border-input focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-9 bg-primary text-primary-foreground hover:opacity-90 font-medium cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-1.5 justify-center">
                  <RefreshCw className="size-3.5 animate-spin" />
                  Sending link...
                </span>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
