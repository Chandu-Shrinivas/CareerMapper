import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { authService } from '../services/auth';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.signIn(email, password);
      const profile = authService.getProfile();
      if (profile && profile.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await authService.signInWithGoogle();
      const profile = authService.getProfile();
      if (profile && profile.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError('Google authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Column - Desktop Brand Panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-zinc-950 p-16 text-zinc-50 lg:flex border-r border-border">
        <div className="font-display text-xl font-bold tracking-tight">
          CareerMapper
        </div>
        
        <div className="max-w-md space-y-6">
          <h2 className="font-display text-4xl font-semibold leading-tight text-white">
            Turn your skills into a career direction.
          </h2>
          <p className="text-[15px] leading-relaxed text-zinc-400">
            CareerMapper acts as your personalized career navigator, mapping your active proficiencies to high-paying roles across domains.
          </p>
          <ul className="space-y-4 pt-4 text-zinc-300">
            <li className="flex items-start gap-3 text-[14.5px]">
              <CheckCircle2 className="size-5 shrink-0 text-zinc-100" />
              <span>Understand your skills</span>
            </li>
            <li className="flex items-start gap-3 text-[14.5px]">
              <CheckCircle2 className="size-5 shrink-0 text-zinc-100" />
              <span>Discover career paths</span>
            </li>
            <li className="flex items-start gap-3 text-[14.5px]">
              <CheckCircle2 className="size-5 shrink-0 text-zinc-100" />
              <span>Find what to learn next</span>
            </li>
          </ul>
        </div>

        <div className="text-[12px] text-zinc-500">
          © {new Date().getFullYear()} CareerMapper. All rights reserved.
        </div>
      </div>

      {/* Right Column - Sign In Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-[380px] space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-[14px] text-muted-foreground">Continue building your career profile.</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-[13px] text-destructive leading-normal animate-fadeUp">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[12px] font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@careermapper.app"
                  required
                  disabled={loading || googleLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-9 bg-transparent border-input focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[12px] font-semibold">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-[12px] font-medium text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={loading || googleLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 h-9 bg-transparent border-input focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-9 bg-primary text-primary-foreground hover:opacity-90 font-medium cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-1.5 justify-center">
                  <RefreshCw className="size-3.5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading || googleLoading}
            onClick={handleGoogleSignIn}
            className="w-full h-9 border-input bg-transparent hover:bg-muted font-medium flex items-center justify-center gap-2 cursor-pointer"
          >
            {googleLoading ? (
              <RefreshCw className="size-3.5 animate-spin" />
            ) : (
              <>
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <p className="text-center text-[13.5px] text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-foreground underline decoration-1 underline-offset-2">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
