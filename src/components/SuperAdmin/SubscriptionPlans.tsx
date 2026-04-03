import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2,
  MoreVertical,
  Zap,
  Shield,
  Search
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const SubscriptionPlans: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans] = useState([
    {
      id: 1,
      name: 'Gold',
      price: '99',
      period: 'month',
      features: ['Up to 50 employees', 'Advanced analytics', 'Email support', 'Custom reporting'],
      status: 'Active',
      color: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      id: 2,
      name: 'Silver',
      price: '49',
      period: 'month',
      features: ['Up to 20 employees', 'Basic analytics', 'Help center access'],
      status: 'Active',
      color: 'bg-slate-100 text-slate-700 border-slate-200'
    },
    {
      id: 3,
      name: 'Platinum',
      price: '199',
      period: 'month',
      features: ['Unlimited employees', 'Priority support', 'Dedicated account manager', 'All advanced modules'],
      status: 'Active',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    }
  ]);

  const [formData, setFormData] = useState({
    planName: '',
    numberOfUsers: '',
    price: '',
    tenure: ''
  });

  const handleCreatePlan = () => {
    console.log('Creating plan:', formData);
    setIsModalOpen(false);
    setFormData({
      planName: '',
      numberOfUsers: '',
      price: '',
      tenure: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="h-6 w-6 text-orange-500" />
            Subscription Plans
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage global pricing and feature sets for your organizations.
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 font-bold shadow-lg shadow-orange-200 dark:shadow-none">
              <Plus className="mr-2 h-4 w-4" /> New Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-xl bg-white">
            <DialogHeader className="bg-orange-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left border-b border-orange-100">
              <div className="bg-orange-500 p-3 rounded-xl shadow-lg shadow-orange-200">
                <Plus className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-bold text-slate-900">Create Subscription Plan</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">Set up a new pricing tier for the platform.</DialogDescription>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4 text-left">
              <div className="space-y-1.5">
                <Label htmlFor="planName" className="text-sm font-bold text-slate-900">
                  Plan Name *
                </Label>
                <Input
                  id="planName"
                  placeholder="E.g., Platinum"
                  className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="users" className="text-sm font-bold text-slate-900">
                  Number of Users *
                </Label>
                <Input
                  id="users"
                  type="number"
                  placeholder="E.g., 150"
                  className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                  value={formData.numberOfUsers}
                  onChange={(e) => setFormData({ ...formData, numberOfUsers: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-sm font-bold text-slate-900">
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="E.g., 10000"
                  className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tenure" className="text-sm font-bold text-slate-900">
                  Tenure (Months) *
                </Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, tenure: value })}
                  value={formData.tenure}
                >
                  <SelectTrigger className="bg-orange-50/50 border-slate-200 rounded-lg h-10 font-bold text-slate-700 focus:ring-1 focus:ring-orange-400">
                    <SelectValue placeholder="Select Months" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-lg border-slate-100 font-bold text-slate-800">
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 pb-2">
                <Button
                  variant="outline"
                  className="bg-orange-50 hover:bg-orange-100 text-slate-900 border-none font-bold rounded-lg px-8 h-10 w-[140px]"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg px-6 h-10 w-[180px]"
                  onClick={handleCreatePlan}
                >
                  + Create Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col group">
            <CardHeader className="text-left relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${plan.color.split(' ')[0]} ${plan.color.split(' ')[1]}`}>
                  <Shield className="h-5 w-5" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem className="gap-2">
                      <Edit className="h-4 w-4" /> Edit Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-red-600">
                      <Trash2 className="h-4 w-4" /> Delete Plan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">${plan.price}</span>
                <span className="text-slate-500 text-sm">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 text-left pb-8">
              <div className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
              <Button variant="outline" className="w-full font-bold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl py-6">
                Manage Limitations
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-white overflow-hidden shadow-sm">
        <CardHeader className="text-left bg-slate-50/50 border-b border-slate-100 py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Active Subscriptions</CardTitle>
              <CardDescription>Real-time monitor of organizations and their current tiers.</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search companies..." className="pl-10 bg-white border-slate-200 rounded-xl" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto text-left">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-bold text-slate-900 py-4 pl-8">Organization</TableHead>
                  <TableHead className="font-bold text-slate-900">Current Plan</TableHead>
                  <TableHead className="font-bold text-slate-900">Start Date</TableHead>
                  <TableHead className="font-bold text-slate-900">Status</TableHead>
                  <TableHead className="text-right font-bold text-slate-900 pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: 'Acme Corporation', plan: 'Gold', date: 'Jan 15, 2023', status: 'Active' },
                  { name: 'Globex Inc', plan: 'Platinum', date: 'Mar 22, 2023', status: 'Active' },
                  { name: 'Soylent Corp', plan: 'Silver', date: 'May 10, 2023', status: 'Active' },
                  { name: 'Initech', plan: 'Gold', date: 'Jun 01, 2023', status: 'Active' },
                ].map((org, i) => (
                  <TableRow key={i} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                    <TableCell className="font-bold py-5 pl-8 text-slate-900">{org.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-bold bg-orange-50 text-orange-600 border-none px-3">
                        {org.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 font-medium">{org.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-sm font-bold text-slate-700">{org.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="sm" className="font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPlans;
