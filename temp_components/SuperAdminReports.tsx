import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Filter, 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Users, 
  Building2,
  FileText,
  Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

const dataSubscriptions = [
  { name: 'Basic', value: 400 },
  { name: 'Pro', value: 300 },
  { name: 'Enterprise', value: 300 },
];

const COLORS = ['#3FA2F6', '#B6EADA', '#0f172a'];

const dataGrowth = [
  { month: 'Jan', organizations: 45, revenue: 12000 },
  { month: 'Feb', organizations: 52, revenue: 15000 },
  { month: 'Mar', organizations: 61, revenue: 18000 },
  { month: 'Apr', organizations: 68, revenue: 22000 },
  { month: 'May', organizations: 75, revenue: 26000 },
  { month: 'Jun', organizations: 84, revenue: 31000 },
];

const SuperAdminReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            System Reports & Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Global performance metrics and subscription distributions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="default" size="sm" className="h-9 gap-2 bg-[#3FA2F6] hover:bg-[#358cdb]">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Avg. Retention', value: '98.5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'New Onboarding', value: '+12%', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Total Active Users', value: '1,452', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'Reports Generated', value: '245', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Revenue vs Organizations Growth</CardTitle>
            <CardDescription>Performance tracking for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar yAxisId="left" dataKey="organizations" name="Organizations" fill="#3FA2F6" radius={[4, 4, 0, 0]} barSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#B6EADA" strokeWidth={3} dot={{ r: 4 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Subscription Mix</CardTitle>
            <CardDescription>Active plans distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataSubscriptions}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {dataSubscriptions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-lg font-bold">Detailed System Logs</CardTitle>
          <CardDescription>Recent administrative actions and global events</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Triggered By</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { event: 'Global Salary Config Update', company: 'All', user: 'Vipul Patil (SA)', time: '2026-03-23 10:20', status: 'Success' },
                  { event: 'New Subscription Plan Created', company: 'System', user: 'Vipul Patil (SA)', time: '2026-03-22 15:45', status: 'Success' },
                  { event: 'Acme Corp Onboarding', company: 'Acme Corp', user: 'System Bot', time: '2026-03-21 09:12', status: 'Success' },
                  { event: 'Bulk Admin Password Reset', company: 'Globex Inc', user: 'Security Module', time: '2026-03-20 22:30', status: 'In Review' },
                  { event: 'Database Backup Completed', company: 'System', user: 'Cron Job', time: '2026-03-20 03:00', status: 'Success' },
                ].map((log, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{log.event}</td>
                    <td className="px-6 py-4 text-slate-600">{log.company}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{log.user}</td>
                    <td className="px-6 py-4 text-slate-500 tabular-nums">{log.time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        log.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
            <Button variant="ghost" size="sm" className="text-blue-600 font-bold hover:bg-blue-50">
              View All Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminReports;
