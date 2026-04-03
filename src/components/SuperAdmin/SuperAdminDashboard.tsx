import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Building2, UserPlus, HandCoins, CalendarDays, FileQuestion } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip
} from 'recharts';

const dataGrowth = [
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 20 },
  { name: 'March', value: 30 },
];

const dataRevenue = [
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 20 },
  { name: 'March', value: 30 },
];

const dataUsers = [
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 20 },
  { name: 'March', value: 30 },
];

const SuperAdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState({ total: 0, active: 0, inactive: 0 });
  const [adminCounts, setAdminCounts] = useState({ total: 0, active: 0, inactive: 0 });
  const [roleCounts, setRoleCounts] = useState<any>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const [saRes, aRes, roleRes] = await Promise.all([
          fetch('https://staffly.space/super-admin/dashboard/super-admin-counts', { headers }),
          fetch('https://staffly.space/super-admin/dashboard/admin-counts', { headers }),
          fetch('https://staffly.space/super-admin/dashboard/users-by-role-created-by-admin', { headers })
        ]);

        if (saRes.ok) {
          const saData = await saRes.json();
          setCounts(saData);
        }
        if (aRes.ok) {
          const aData = await aRes.json();
          setAdminCounts(aData);
        }
        if (roleRes.ok) {
          const roleData = await roleRes.json();
          setRoleCounts(roleData);
        }
      } catch (err) {
        console.error('Error fetching counts:', err);
      }
    };
    fetchCounts();
  }, []);

  const stats = [
    { title: 'Total Companies', value: '34', style: 'bg-[#6ee7b7] border-[#059669]' },
    { title: 'Active Companies', value: '31', style: 'bg-[#fde047] border-[#ca8a04]' },
    { title: 'Total Users', value: '1,240', style: 'bg-[#2dd4bf] border-[#0f766e]' },
    { title: 'Monthly Revenue', value: '₹3.4L', style: 'bg-[#818cf8] border-[#4338ca]' },
    { title: 'Expiring Subscriptions', value: '3', style: 'bg-[#fb923c] border-[#c2410c]' },
  ];

  const actions = [
    { name: 'Super Admins', icon: User },
    { name: 'Companies', icon: Building2 },
    { name: 'Admin', icon: UserPlus },
    { name: 'Salary', icon: HandCoins },
    { name: 'Subscriptions', icon: CalendarDays },
    { name: 'Enquiries', icon: FileQuestion },
  ];

  return (
    <div className="space-y-12 bg-white min-h-screen p-6">
      
      {/* Top Banner Stats */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Business Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-b-[8px] ${stat.style} text-slate-900 shadow-sm`}
            >
              <span className="text-sm font-bold text-center leading-tight mb-2">{stat.title}</span>
              <span className="text-2xl font-black">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Super Admin & Admin Counts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Super Admin Summary */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Super Admin Summary</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="p-3 bg-blue-50 rounded-xl w-fit">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                <p className="text-2xl font-black text-slate-900">{counts.total}</p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="p-3 bg-emerald-50 rounded-xl w-fit">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</p>
                <p className="text-2xl font-black text-slate-900">{counts.active}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="p-3 bg-rose-50 rounded-xl w-fit">
                <User className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inactive</p>
                <p className="text-2xl font-black text-slate-900">{counts.inactive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Administrator Summary */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Administrator Summary</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="p-3 bg-indigo-50 rounded-xl w-fit">
                <UserPlus className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Admins</p>
                <p className="text-2xl font-black text-slate-900">{adminCounts.total}</p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="p-3 bg-teal-50 rounded-xl w-fit">
                <UserPlus className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Admins</p>
                <p className="text-2xl font-black text-slate-900">{adminCounts.active}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="p-3 bg-amber-50 rounded-xl w-fit">
                <UserPlus className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inactive Admins</p>
                <p className="text-2xl font-black text-slate-900">{adminCounts.inactive}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Breakdown Summary */}
      {roleCounts && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Organizational Role Breakdown</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(roleCounts).map(([role, stats]: [string, any]) => (
              <div key={role} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl group-hover:scale-110 transition-transform ${
                    role === 'Admin' ? 'bg-orange-50 text-orange-600' :
                    role === 'HR' ? 'bg-indigo-50 text-indigo-600' :
                    role === 'Manager' ? 'bg-sky-50 text-sky-600' :
                    role === 'TeamLead' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">{role}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-end justify-between border-b border-slate-50 pb-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Total</p>
                    <p className="text-xl font-black text-slate-900">{stats.total}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-emerald-600">{stats.active}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Act</p>
                    </div>
                    <div className="space-y-0.5 border-x border-slate-100">
                      <p className="text-xs font-bold text-rose-600">{stats.inactive}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Inact</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-400">{stats.resigned}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Exit</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-6">
        {actions.map((action, index) => (
          <button 
            key={index} 
            className="flex flex-col items-center justify-center p-4 h-[120px] w-[120px] bg-white border border-slate-300 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-400 transition-all group"
          >
            <action.icon className="h-10 w-10 text-slate-900 mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span className="text-xs font-medium text-slate-700 text-center">{action.name}</span>
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Chart 1: Company Growth */}
        <div className="flex flex-col items-center">
          <Card className="w-full border shadow-sm rounded-none">
            <CardContent className="p-4 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGrowth} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="value" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <span className="mt-4 text-sm font-medium text-slate-600">Company Growth</span>
        </div>

        {/* Chart 2: Revenue Graph */}
        <div className="flex flex-col items-center">
          <Card className="w-full border shadow-sm rounded-none">
            <CardContent className="p-4 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataRevenue} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="value" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <span className="mt-4 text-sm font-medium text-slate-600">Revenue Graph</span>
        </div>

        {/* Chart 3: Active Users */}
        <div className="flex flex-col items-center">
          <Card className="w-full border shadow-sm rounded-none">
            <CardContent className="p-4 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataUsers} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="value" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <span className="mt-4 text-sm font-medium text-slate-600">Active Users</span>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
