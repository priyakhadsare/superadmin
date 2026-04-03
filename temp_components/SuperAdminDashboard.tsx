import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, IndianRupee, Activity, CalendarClock } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';

const dataGrowth = [
  { name: 'Jan', companies: 4 },
  { name: 'Feb', companies: 7 },
  { name: 'Mar', companies: 12 },
  { name: 'Apr', companies: 18 },
  { name: 'May', companies: 25 },
  { name: 'Jun', companies: 34 },
];

const dataRevenue = [
  { name: 'Jan', revenue: 40000 },
  { name: 'Feb', revenue: 65000 },
  { name: 'Mar', revenue: 120000 },
  { name: 'Apr', revenue: 180000 },
  { name: 'May', revenue: 250000 },
  { name: 'Jun', revenue: 340000 },
];

const dataUsers = [
  { name: 'Acme Corp', users: 400 },
  { name: 'Globex Inc', users: 300 },
  { name: 'Soylent', users: 300 },
  { name: 'Initech', users: 200 },
];

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Total Companies', value: '34', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Companies', value: '31', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Total Users', value: '1,240', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Monthly Revenue', value: '₹3.4L', icon: IndianRupee, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Expiring Subscriptions', value: '3', icon: CalendarClock, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Super Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Welcome back, {user?.name}. Manage all companies and global settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-slate-200 dark:border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Revenue Graph</CardTitle>
            <CardDescription>Monthly recurring revenue across all subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Company Growth</CardTitle>
            <CardDescription>Onboarded organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGrowth}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="companies" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
            <CardDescription>User distribution across top companies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataUsers}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Global system events and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '10 mins ago', msg: 'New company "Initech" onboarded', type: 'info', color: 'bg-blue-100 text-blue-600' },
                { time: '1 hour ago', msg: 'Subscription updated for "Globex Inc"', type: 'success', color: 'bg-emerald-100 text-emerald-600' },
                { time: '3 hours ago', msg: 'Acme Corp admin reset password', type: 'warning', color: 'bg-amber-100 text-amber-600' },
                { time: '1 day ago', msg: 'Soylent Enterprise plan activated', type: 'success', color: 'bg-emerald-100 text-emerald-600' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.msg}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
