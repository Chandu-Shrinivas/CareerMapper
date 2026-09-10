import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CareerPaths from './pages/CareerPaths';
import SkillsInventory from './pages/SkillsInventory';
import JobsPage from './pages/JobsPage';
import SavedJobsPage from './pages/SavedJobsPage';
import ApplicationTrackerPage from './pages/ApplicationTrackerPage';
import RoleRoadmapsPage from './pages/RoleRoadmapsPage';
import RoleRoadmapDetailPage from './pages/RoleRoadmapDetailPage';
import MyRoadmapsPage from './pages/MyRoadmapsPage';
import JobPreparationDetailPage from './pages/JobPreparationDetailPage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import WorkspaceLayout from './components/layout/WorkspaceLayout';
import { useAuth } from './hooks/useAuth';
import { Toaster } from './components/ui/sonner';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

interface GuardProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: GuardProps) {
  const { authenticated, getProfile } = useAuth();
  const profile = getProfile();

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!profile || !profile.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: GuardProps) {
  const { authenticated, getProfile } = useAuth();
  const profile = getProfile();

  if (authenticated) {
    if (profile && profile.onboardingCompleted) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
}

function OnboardingRoute({ children }: GuardProps) {
  const { authenticated, getProfile } = useAuth();
  const profile = getProfile();

  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (profile && profile.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<AuthRoute><Landing /></AuthRoute>} />

          {/* Auth Routes */}
          <Route path="/signin" element={<AuthRoute><SignIn /></AuthRoute>} />
          <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><WorkspaceLayout><Dashboard /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/role-roadmaps" element={<ProtectedRoute><WorkspaceLayout><RoleRoadmapsPage /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/role-roadmaps/:slug" element={<ProtectedRoute><WorkspaceLayout><RoleRoadmapDetailPage /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/career-roadmap/:slug" element={<ProtectedRoute><WorkspaceLayout><RoleRoadmapDetailPage /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/my-roadmaps" element={<ProtectedRoute><WorkspaceLayout><MyRoadmapsPage /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/job-preparation/:id" element={<ProtectedRoute><WorkspaceLayout><JobPreparationDetailPage /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/career-paths" element={<ProtectedRoute><WorkspaceLayout><CareerPaths /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><WorkspaceLayout><SkillsInventory /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><WorkspaceLayout><JobsPage /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/saved-jobs" element={<ProtectedRoute><WorkspaceLayout><SavedJobsPage /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/tracker" element={<ProtectedRoute><WorkspaceLayout><ApplicationTrackerPage /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/roadmap" element={<Navigate to="/role-roadmaps" replace />} />
          <Route path="/interview-prep" element={<ProtectedRoute><WorkspaceLayout><InterviewPrepPage /></WorkspaceLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><WorkspaceLayout><Dashboard /></WorkspaceLayout></ProtectedRoute>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster position="top-right" theme="dark" closeButton />
    </div>
  );
}
