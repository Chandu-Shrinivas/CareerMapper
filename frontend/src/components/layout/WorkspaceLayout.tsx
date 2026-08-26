import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  BarChart2, Compass, Layers, Briefcase, Settings, HelpCircle, LogOut, User, ChevronDown, Bookmark, ClipboardList
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  SidebarInset
} from '../ui/sidebar';
import { authService } from '../../services/auth';
import { AIAssistant } from '../AIAssistant';

const DRAFT_KEY = 'cm_profile_draft';

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRoleSlug = searchParams.get('role');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {}
  }, []);

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
    },
    { 
      label: 'Saved Jobs', 
      path: '/saved-jobs', 
      icon: Bookmark,
      active: location.pathname === '/saved-jobs',
      disabled: false 
    },
    { 
      label: 'Tracker', 
      path: '/tracker', 
      icon: ClipboardList,
      active: location.pathname === '/tracker',
      disabled: false 
    }
  ];

  const userInitials = profile?.profile?.fullName
    ? profile.profile.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'US';

  const userEmail = authService.getSession().user?.email || 'demo@careermapper.app';

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
    if (location.pathname === '/saved-jobs') return 'Saved Jobs';
    if (location.pathname === '/tracker') return 'Application Tracker';
    return 'CareerMapper';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-50 flex w-full">
        {/* Collapsible Sidebar */}
        <Sidebar className="border-r border-zinc-900 bg-zinc-950" collapsible="icon">
          <SidebarHeader className="p-4 border-b border-zinc-900/60 bg-zinc-950 shrink-0">
            <span className="font-display font-black text-xs tracking-widest text-white uppercase block select-none group-data-[collapsible=icon]:hidden">
              CareerMapper
            </span>
            <span className="font-display font-black text-xs tracking-widest text-emerald-500 uppercase hidden group-data-[collapsible=icon]:block select-none text-center">
              CM
            </span>
          </SidebarHeader>
          
          <SidebarContent className="bg-zinc-950 px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2 block group-data-[collapsible=icon]:hidden">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton 
                          isActive={item.active}
                          onClick={() => {
                            if (item.path === '/dashboard') {
                              setSearchParams({});
                              navigate('/dashboard');
                            } else {
                              navigate(item.path);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded cursor-pointer transition-all border border-transparent ${
                            item.active 
                              ? 'bg-zinc-900 text-white border-zinc-800' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                          }`}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2 block group-data-[collapsible=icon]:hidden">
                Configure
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-zinc-650 cursor-not-allowed opacity-40">
                      <User className="size-4 shrink-0" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-zinc-650 cursor-not-allowed opacity-40">
                      <Settings className="size-4 shrink-0" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-zinc-650 cursor-not-allowed opacity-40">
                      <HelpCircle className="size-4 shrink-0" />
                      <span>Help</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-zinc-900 bg-zinc-950">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-2 rounded hover:bg-zinc-900/60 transition-colors cursor-pointer border border-transparent hover:border-zinc-900 select-none">
                  <Avatar className="size-8 border border-zinc-800 shrink-0">
                    <AvatarFallback className="text-[10px] font-bold bg-zinc-900 text-zinc-100">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5 truncate text-left flex-1 group-data-[collapsible=icon]:hidden">
                    <span className="text-[11px] font-bold text-white block truncate">{profile?.profile?.fullName || 'User'}</span>
                    <span className="text-[10px] text-zinc-500 block truncate">{userEmail}</span>
                  </div>
                  <ChevronDown className="size-4 text-zinc-500 group-data-[collapsible=icon]:hidden shrink-0" />
                </button>
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
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Sidebar Inset / Main Content */}
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-zinc-950">
          {/* Top Header Bar */}
          <header className="border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md h-14 flex items-center justify-between px-6 sticky top-0 z-40 select-none w-full">
            <div className="flex items-center gap-3">
              {/* Sidebar trigger */}
              <SidebarTrigger className="text-zinc-400 hover:text-white border border-zinc-900 bg-zinc-900/40 size-8 p-0" />
              <Separator orientation="vertical" className="h-4 bg-zinc-900" />
              {/* Breadcrumb current section name */}
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{getCurrentSectionLabel()}</span>
            </div>
            <div className="flex items-center gap-2"></div>
          </header>

          {/* Content workspace window */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </SidebarInset>

        {/* Global AI Assistant */}
        <AIAssistant />
      </div>
    </SidebarProvider>
  );
}


