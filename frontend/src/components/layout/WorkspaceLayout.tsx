import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  BarChart2, Compass, Layers, Briefcase, Settings, HelpCircle, LogOut, Menu, User
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  Sheet, SheetTrigger, SheetContent, SheetTitle, SheetHeader 
} from '../ui/sheet';
import { authService } from '../../services/auth';
import { AIAssistant } from '../AIAssistant';

const DRAFT_KEY = 'cm_profile_draft';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRoleSlug = searchParams.get('role');
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const rawDraft = localStorage.getItem(DRAFT_KEY);
    if (rawDraft) {
      try {
        setProfile(JSON.parse(rawDraft));
      } catch (e) {}
    }
  }, [location]);

  const handleSignOut = () => {
    authService.clearSession();
    navigate('/signin');
  };

  const handleEditSkills = () => {
    try {
      const draftRaw = localStorage.getItem(DRAFT_KEY);
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        draft.step = 3;
        draft.onboardingStep = 3;
        draft.onboardingCompleted = false;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      }
    } catch (e) {}
    navigate('/onboarding');
  };

  const navItems = [
    { 
      label: 'Career Analysis', 
      path: '/dashboard', 
      icon: BarChart2,
      active: location.pathname === '/dashboard',
      disabled: false 
    },
    { 
      label: 'Career Paths', 
      path: '/career-paths', 
      icon: Compass,
      active: location.pathname === '/career-paths',
      disabled: false 
    },
    { 
      label: 'Skills', 
      path: '/skills', 
      icon: Layers,
      active: location.pathname === '/skills',
      disabled: false 
    },
    { 
      label: 'Jobs', 
      path: '/jobs', 
      icon: Briefcase,
      active: location.pathname === '/jobs',
      disabled: false 
    }
  ];

  const userInitials = profile?.profile?.fullName
    ? profile.profile.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'US';

  const userEmail = authService.getSession().user?.email || 'demo@careermapper.app';

  // Get current section label for breadcrumb
  const getCurrentSectionLabel = () => {
    if (location.pathname === '/dashboard') {
      if (selectedRoleSlug) {
        const formattedRole = selectedRoleSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return `Career Analysis / ${formattedRole}`;
      }
      return 'Career Analysis';
    }
    if (location.pathname === '/career-paths') return 'Career Paths';
    if (location.pathname === '/skills') return 'Skills Inventory';
    if (location.pathname === '/jobs') return 'Job Intelligence & Search';
    return 'CareerMapper';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex">
      
      {/* Desktop Sidebar (Persistent left side) */}
      <aside className="hidden md:flex flex-col justify-between w-56 bg-zinc-950 border-r border-zinc-900 shrink-0 select-none">
        <div className="flex flex-col space-y-6 py-6 px-4">
          <span className="font-display font-black text-sm tracking-widest text-white uppercase px-3 block">CareerMapper</span>
          
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <div 
                    key={item.label} 
                    className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-zinc-600 cursor-not-allowed select-none rounded"
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                    <Badge variant="outline" className="ml-auto text-[8px] border-zinc-800 text-zinc-600 scale-90 py-0 px-1 bg-transparent">SOON</Badge>
                  </div>
                );
              }
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.path === '/dashboard') {
                      setSearchParams({});
                      navigate('/dashboard');
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded cursor-pointer transition-all ${
                    item.active 
                      ? 'bg-zinc-900 text-white border border-zinc-800' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40 border border-transparent'
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col py-4 px-4 border-t border-zinc-900 bg-zinc-950">
          <nav className="space-y-1 pb-3 text-zinc-400 text-xs font-semibold">
            <span className="flex items-center gap-3 px-3 py-2 opacity-35 cursor-not-allowed"><User className="size-4" />Profile</span>
            <span className="flex items-center gap-3 px-3 py-2 opacity-35 cursor-not-allowed"><Settings className="size-4" />Settings</span>
            <span className="flex items-center gap-3 px-3 py-2 opacity-35 cursor-not-allowed"><HelpCircle className="size-4" />Help</span>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-2 rounded hover:bg-zinc-900/60 transition-colors cursor-pointer border border-transparent hover:border-zinc-900 select-none">
                <Avatar className="size-8 border border-zinc-800 shrink-0">
                  <AvatarFallback className="text-[10px] font-bold bg-zinc-900 text-zinc-100">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5 truncate text-left">
                  <span className="text-[11px] font-bold text-white block truncate">{profile?.profile?.fullName || 'User'}</span>
                  <span className="text-[10px] text-zinc-500 block truncate">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 bg-zinc-900 border-zinc-800 rounded-md shadow-lg mb-1" align="start">
              <DropdownMenuLabel className="font-bold text-white truncate text-[11px]">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem onClick={handleEditSkills} className="focus:bg-zinc-800 cursor-pointer text-zinc-300 text-xs">
                Edit Skills
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuItem onClick={handleSignOut} className="focus:bg-zinc-800 cursor-pointer text-destructive hover:bg-destructive/10 text-xs">
                <LogOut className="mr-2 size-3.5" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        
        {/* Top Header Bar */}
        <header className="border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md h-14 flex items-center justify-between px-6 sticky top-0 z-40 select-none">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="size-9 p-0 border border-zinc-900 hover:bg-zinc-900">
                    <Menu className="size-4 text-white" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-zinc-950 border-zinc-900 text-zinc-100 p-6 flex flex-col justify-between" side="left">
                  <div className="space-y-6">
                    <SheetHeader className="pb-4 border-b border-zinc-900">
                      <SheetTitle className="font-display font-extrabold text-sm tracking-wider uppercase text-white">
                        CareerMapper
                      </SheetTitle>
                    </SheetHeader>
                    <nav className="flex flex-col gap-4 text-xs font-bold text-zinc-400">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        if (item.disabled) {
                          return (
                            <div key={item.label} className="flex items-center gap-3 py-2 opacity-35 cursor-not-allowed">
                              <Icon className="size-4" />
                              <span>{item.label}</span>
                            </div>
                          );
                        }
                        return (
                          <button 
                            key={item.label}
                            onClick={() => { 
                              if (item.path === '/dashboard') {
                                setSearchParams({});
                              }
                              navigate(item.path); 
                              setIsMobileMenuOpen(false); 
                            }}
                            className={`flex items-center gap-3 py-2 text-left hover:text-white transition-colors ${item.active ? 'text-white' : ''}`}
                          >
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                  <div className="pt-6 border-t border-zinc-900 space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 border border-zinc-800">
                        <AvatarFallback className="text-[10px] font-bold bg-zinc-900 text-zinc-100">{userInitials}</AvatarFallback>
                      </Avatar>
                      <div className="truncate text-left text-xs">
                        <span className="font-bold text-white block truncate">{profile?.profile?.fullName || 'User'}</span>
                        <span className="text-[10px] text-zinc-500 block truncate">{userEmail}</span>
                      </div>
                    </div>
                    <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start h-9 text-xs text-destructive hover:bg-destructive/10">
                      <LogOut className="mr-2 size-4" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Breadcrumb current section name */}
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{getCurrentSectionLabel()}</span>
          </div>

          {/* Right menu avatar (desktop only, optional helper shortcut) */}
          <div className="hidden md:flex items-center gap-2">
          </div>
        </header>

        {/* Content workspace window */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </div>

      </div>

      {/* Global AI Assistant */}
      <AIAssistant />

    </div>
  );
}


