import { useState, useEffect } from 'react';
import { authService, type Session, type OnboardingProfile } from '../services/auth';

export function useAuth() {
  const [session, setSession] = useState<Session>(() => authService.getSession());

  useEffect(() => {
    const handleAuthChange = () => {
      setSession(authService.getSession());
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  return {
    authenticated: session.authenticated,
    user: session.user,
    signOut: () => authService.clearSession(),
    getProfile: () => authService.getProfile(),
    saveProfile: (p: OnboardingProfile) => authService.saveProfile(p),
    completeOnboarding: () => authService.completeOnboarding(),
  };
}
