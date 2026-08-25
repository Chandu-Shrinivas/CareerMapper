export interface User {
  name: string;
  email: string;
  provider: 'demo' | 'google' | 'linkedin';
}

export interface Session {
  authenticated: boolean;
  user: User | null;
}

export interface OnboardingProfile {
  name: string;
  degree: string;
  specialization: string;
  experience: string;
  careerGoal: string;
  interests: string[];
  skills: {
    name: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    source: 'extracted' | 'manual';
  }[];
  domain?: {
    name: string;
    label: string;
    confidence: number;
  };
  onboardingCompleted: boolean;
}

const SESSION_KEY = 'cm_session';
const PROFILE_KEY = 'cm_profile_draft';

export const authService = {
  getSession(): Session {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return { authenticated: false, user: null };
      return JSON.parse(raw);
    } catch {
      return { authenticated: false, user: null };
    }
  },

  setSession(session: Session): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('auth-change'));
  },

  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem('careerProfile');
    window.dispatchEvent(new Event('auth-change'));
  },

  async signIn(email: string, password: string): Promise<User> {
    await new Promise(r => setTimeout(r, 600));

    if (email.trim().toLowerCase() === 'demo@careermapper.app' && password === 'Demo@123') {
      const user: User = {
        name: 'Demo User',
        email: 'demo@careermapper.app',
        provider: 'demo',
      };
      this.setSession({ authenticated: true, user });
      return user;
    }
    throw new Error('Invalid email or password.');
  },

  async signUp(name: string, email: string, password: string): Promise<User> {
    await new Promise(r => setTimeout(r, 600));
    
    if (!name.trim()) throw new Error('Name is required.');
    if (!email.includes('@')) throw new Error('Invalid email format.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');

    const user: User = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      provider: 'demo',
    };
    this.setSession({ authenticated: true, user });
    return user;
  },

  async signInWithGoogle(): Promise<User> {
    await new Promise(r => setTimeout(r, 800));
    const user: User = {
      name: 'Google Demo User',
      email: 'google-demo@careermapper.app',
      provider: 'google',
    };
    this.setSession({ authenticated: true, user });
    return user;
  },

  async signInWithLinkedIn(): Promise<User> {
    await new Promise(r => setTimeout(r, 800));
    const user: User = {
      name: 'LinkedIn Demo User',
      email: 'linkedin-demo@careermapper.app',
      provider: 'linkedin',
    };
    this.setSession({ authenticated: true, user });
    return user;
  },

  async forgotPassword(email: string): Promise<boolean> {
    await new Promise(r => setTimeout(r, 500));
    if (!email.includes('@')) throw new Error('Invalid email format.');
    return true;
  },

  getProfile(): OnboardingProfile | null {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveProfile(profile: OnboardingProfile): void {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  completeOnboarding(): void {
    const profile = this.getProfile();
    if (profile) {
      profile.onboardingCompleted = true;
      this.saveProfile(profile);
    }
  }
};
