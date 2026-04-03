import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard';
import CompanyManagement from './components/SuperAdmin/CompanyManagement';
import SuperAdminManagement from './components/SuperAdmin/SuperAdminManagement';
import AdminManagement from './components/SuperAdmin/AdminManagement';
import GlobalUsers from './components/SuperAdmin/GlobalUsers';
import SubscriptionPlans from './components/SuperAdmin/SubscriptionPlans';
import GlobalSalaryStructure from './components/SuperAdmin/GlobalSalaryStructure';
import SuperAdminReports from './components/SuperAdmin/SuperAdminReports';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  LayoutDashboard, 
  Building2, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Settings, 
  FileBarChart,
  UserCheck,
  ChevronRight
} from 'lucide-react';

import SuperAdminLogin from './components/SuperAdmin/SuperAdminLogin';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: SuperAdminDashboard },
    { id: 'companies', label: 'Companies', icon: Building2, component: CompanyManagement },
    { id: 'global-users', label: 'Global Users', icon: Users, component: GlobalUsers },
    { id: 'super-admins', label: 'Super Admins', icon: UserCheck, component: SuperAdminManagement },
    { id: 'admins', label: 'Admin Management', icon: ShieldCheck, component: AdminManagement },
    { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard, component: SubscriptionPlans },
    { id: 'salary-structure', label: 'Salary Structure', icon: Settings, component: GlobalSalaryStructure },
    { id: 'reports', label: 'Reports', icon: FileBarChart, component: SuperAdminReports },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || SuperAdminDashboard;

  if (!user) {
    return <SuperAdminLogin />;
  }

  return (
      <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col shadow-sm">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">SuperAdmin</h2>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Enterprise Suite</p>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-6 flex-1 overflow-y-auto">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-none' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-500'}`} />
                    <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
                      {item.label}
                    </span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Vipul Patil</p>
                <p className="text-xs text-slate-500 truncate">Super Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-slate-950 flex flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
             <div className="md:hidden flex items-center gap-2">
                <div className="bg-orange-500 p-1.5 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">SuperAdmin</span>
             </div>
             
             <div className="hidden md:block">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <span>Dashboard</span>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-slate-900 dark:text-slate-100 font-bold capitalize">{activeTab.replace('-', ' ')}</span>
                </div>
             </div>

             <div className="flex items-center gap-4">
                <div className="md:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white">
                      {menuItems.map((item) => (
                        <DropdownMenuItem 
                          key={item.id} 
                          onClick={() => setActiveTab(item.id)}
                          className="gap-3 py-2.5 cursor-pointer"
                        >
                          <item.icon size={18} className="text-slate-400" />
                          <span className="font-medium">{item.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex border-slate-200 text-slate-600 font-bold h-9 bg-white">
                  Support
                </Button>
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 cursor-pointer overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Vipul+Patil&background=f97316&color=fff" alt="Profile" />
                </div>
             </div>
          </header>
          
          <div className="p-8 max-w-7xl mx-auto w-full">
            <ActiveComponent />
          </div>
        </main>
      </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
