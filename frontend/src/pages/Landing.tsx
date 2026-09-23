import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { authService } from '../services/auth';
import { Logo } from '../components/brand/Logo';

export default function Landing() {
  const navigate = useNavigate();

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Social Auth Loading States
  const [googleLoading, setGoogleLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setSignInLoading(true);

    try {
      await authService.signIn(signInEmail, signInPassword);
      const profile = authService.getProfile();
      if (profile && profile.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err: any) {
      setSignInError(err.message || 'Invalid email or password.');
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    if (signUpPassword !== signUpConfirm) {
      setSignUpError('Passwords do not match.');
      return;
    }

    setSignUpLoading(true);

    try {
      await authService.signUp(signUpName, signUpEmail, signUpPassword);
      navigate('/onboarding');
    } catch (err: any) {
      setSignUpError(err.message || 'Failed to create account.');
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setSignInError(null);
    setSignUpError(null);
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
      setSignInError('Google authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    setSignInError(null);
    setSignUpError(null);
    setLinkedinLoading(true);

    try {
      await authService.signInWithLinkedIn();
      const profile = authService.getProfile();
      if (profile && profile.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setSignInError('LinkedIn authentication failed.');
    } finally {
      setLinkedinLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto px-6 h-14 flex items-center justify-between">
          <Logo size="sm" textClassName="text-sm font-bold text-foreground" />
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <a href="#auth-section" className="hover:text-foreground transition-colors">Get Started</a>
            <span className="h-3 w-px bg-border"></span>
            <Link to="/signin" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center px-6">
        <div className="max-w-[800px] mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1 text-xs text-muted-foreground hover:border-foreground transition-all cursor-pointer">
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">New</span>
            <span>Rules & ML Matching v2 →</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            The Foundation for your Career Design System
          </h1>

          <p className="text-md sm:text-lg text-muted-foreground max-w-[620px] mx-auto leading-relaxed">
            A set of beautifully designed profile builders that you can customize, extend, and build on. Start here to analyze skills and predict domain fit.
          </p>

          <div className="pt-2">
            <a 
              href="#auth-section"
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-semibold text-xs transition-opacity hover:opacity-90 cursor-pointer"
            >
              Build Your Own
              <span className="text-xs">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section id="auth-section" className="py-12 border-t border-border bg-zinc-950/40">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* CARD 1: SIGN IN */}
            <Card className="bg-card border-border shadow-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-bold text-white tracking-tight">Access Account</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Continue building your career profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {signInError && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-[12px] text-destructive leading-normal animate-fadeUp">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{signInError}</span>
                  </div>
                )}

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={signInLoading || googleLoading || linkedinLoading}
                    onClick={handleGoogleAuth}
                    className="h-9 border-input text-xs font-semibold hover:bg-muted bg-transparent flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {googleLoading ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFFFFF"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFFFFF"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FFFFFF"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#FFFFFF"/>
                        </svg>
                        Google
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    disabled={signInLoading || googleLoading || linkedinLoading}
                    onClick={handleLinkedInAuth}
                    className="h-9 border-input text-xs font-semibold hover:bg-muted bg-transparent flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {linkedinLoading ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#FFFFFF"/>
                        </svg>
                        LinkedIn
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-2 text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Or</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-email" className="text-[11px] font-semibold">Email Address</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="demo@careermapper.app"
                      required
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="h-8.5 bg-transparent text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password" className="text-[11px] font-semibold">Password</Label>
                      <Link to="/forgot-password" className="text-[11px] text-muted-foreground hover:text-foreground">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="h-8.5 bg-transparent text-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={signInLoading || googleLoading || linkedinLoading}
                    className="w-full h-9 bg-primary text-primary-foreground hover:opacity-90 font-medium cursor-pointer text-xs"
                  >
                    {signInLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* CARD 2: SIGN UP */}
            <Card className="bg-card border-border shadow-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-bold text-white tracking-tight">Get Started</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Build your career profile and discover matches.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {signUpError && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-[12px] text-destructive leading-normal animate-fadeUp">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <span>{signUpError}</span>
                  </div>
                )}

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={signUpLoading || googleLoading || linkedinLoading}
                    onClick={handleGoogleAuth}
                    className="h-9 border-input text-xs font-semibold hover:bg-muted bg-transparent flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {googleLoading ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFFFFF"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFFFFF"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FFFFFF"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#FFFFFF"/>
                        </svg>
                        Google
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    disabled={signUpLoading || googleLoading || linkedinLoading}
                    onClick={handleLinkedInAuth}
                    className="h-9 border-input text-xs font-semibold hover:bg-muted bg-transparent flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {linkedinLoading ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#FFFFFF"/>
                        </svg>
                        LinkedIn
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative flex items-center py-0.5">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink mx-2 text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">Or</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-[11px] font-semibold">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Jane Doe"
                      required
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="h-8.5 bg-transparent text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-[11px] font-semibold">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="h-8.5 bg-transparent text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password" className="text-[11px] font-semibold">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="h-8.5 bg-transparent text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-confirm" className="text-[11px] font-semibold">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={signUpConfirm}
                        onChange={(e) => setSignUpConfirm(e.target.value)}
                        className="h-8.5 bg-transparent text-xs"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={signUpLoading || googleLoading || linkedinLoading}
                    className="w-full h-9 bg-primary text-primary-foreground hover:opacity-90 font-medium cursor-pointer text-xs"
                  >
                    {signUpLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-zinc-950/20 py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-[1100px] mx-auto px-6">
          © {new Date().getFullYear()} CareerMapper. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
