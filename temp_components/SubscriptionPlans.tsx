import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
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

const SubscriptionPlans: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans] = useState<{
    id: number;
    name: string;
    price: string;
    employees: number | string;
    features: string[];
    status: string;
  }[]>([
    {
      id: 1,
      name: 'Basic',
      price: '₹999/month',
      employees: 20,
      features: ['Attendance', 'Payroll'],
      status: 'Active',
    },
    {
      id: 2,
      name: 'Pro',
      price: '₹1999/month',
      employees: 100,
      features: ['All HR Features', 'Project Management'],
      status: 'Active',
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 'Custom',
      employees: 'Unlimited',
      features: ['Full System', 'Custom Modules', 'Dedicated Support'],
      status: 'Active',
    },
  ]);

  const [formData, setFormData] = useState({
    planName: '',
    numberOfUsers: '',
    price: '',
    tenure: ''
  });

  const handleCreatePlan = () => {
    // Logic to add the plan
    console.log('Creating plan:', formData);
    setIsModalOpen(false);
    // Reset form
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Subscription Plans
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Create and manage pricing plans available for companies.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none rounded-3xl">
            <div className="bg-[#DDEBFF] p-6 flex items-center gap-4">
              <div className="bg-[#3B82F6] p-3 rounded-xl shadow-lg shadow-blue-200">
                <Plus className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[#1E293B]">Create Subscription Plan</h2>
                <p className="text-sm text-[#475569]">Fill in the required fields marked with *</p>
              </div>
            </div>

            <div className="p-8 space-y-6 bg-white">
              <div className="space-y-2">
                <Label htmlFor="planName" className="text-base font-semibold text-[#1E293B]">
                  Plan Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="planName"
                  placeholder="E.g., Platinum"
                  className="bg-[#DDEBFF] border-none h-12 rounded-xl text-slate-700 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="users" className="text-base font-semibold text-[#1E293B]">
                  Number of Users <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="users"
                  type="number"
                  placeholder="E.g., 150"
                  className="bg-[#DDEBFF] border-none h-12 rounded-xl text-slate-700 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400"
                  value={formData.numberOfUsers}
                  onChange={(e) => setFormData({ ...formData, numberOfUsers: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-base font-semibold text-[#1E293B]">
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="E.g., 10000"
                  className="bg-[#DDEBFF] border-none h-12 rounded-xl text-slate-700 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure" className="text-base font-semibold text-[#1E293B]">
                  Tenure (Months) <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => setFormData({ ...formData, tenure: value })}
                  value={formData.tenure}
                >
                  <SelectTrigger className="bg-[#DDEBFF] border-none h-12 rounded-xl text-slate-700 focus:ring-1 focus:ring-blue-400">
                    <SelectValue placeholder="Select Months" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  variant="ghost"
                  className="flex-1 bg-[#DDEBFF] hover:bg-[#CFE2FF] text-[#1E293B] font-semibold h-12 rounded-xl"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold h-12 rounded-xl"
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
          <Card key={plan.id} className="relative flex flex-col justify-between border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                  {plan.status}
                </span>
              </div>
              <CardDescription className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                {plan.price}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="text-sm font-medium">
                  Employees Allowed: <span className="font-bold text-blue-600">{plan.employees}</span>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-slate-500">Includes:</span>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <Button variant="outline" className="flex-1"><Edit className="h-4 w-4 mr-2" /> Edit</Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;

