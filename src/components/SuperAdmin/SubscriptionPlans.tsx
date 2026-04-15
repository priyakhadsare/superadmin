import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  MoreVertical,
  Zap,
  Shield,
  Search,
  Users
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
  const planColors = [
    'bg-amber-100 text-amber-700',
    'bg-slate-100 text-slate-700',
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-rose-100 text-rose-700',
  ];

  const [plans, setPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'true' | 'false'>('all');

  const fetchPlans = async (filter: 'all' | 'true' | 'false' = 'all') => {
    setPlansLoading(true);
    try {
      const token = localStorage.getItem('access_token');
 
      if (token === 'dev_bypass_token') {
        setPlans([]);
        setPlansLoading(false);
        return;
      }
 
      const url = `https://testing.staffly.space/subscriptions/plans?active_only=${filter}`;
      const response = await fetch(url, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });

      if (response.ok) {
        const data = await response.json();
        setPlans(Array.isArray(data) ? data : data.plans || []);
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setPlansLoading(false);
    }
  };

  const fetchPlanById = async (planId: number) => {
    try {
      const token = localStorage.getItem('access_token');
 
      if (token === 'dev_bypass_token') {
        const plan = plans.find(p => p.plan_id === planId) || null;
        return plan;
      }
 
      const response = await fetch(`https://testing.staffly.space/subscriptions/plans/${planId}`, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
 
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('Failed to fetch plan details:', err);
    }
    return null;
  };

  const [companies, setCompanies] = useState<any[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignFormData, setAssignFormData] = useState({
    companyId: '',
    planId: ''
  });
  const [isAssigning, setIsAssigning] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    subscriptionId: 0,
    planId: '',
    isActive: true
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [companySubscriptions, setCompanySubscriptions] = useState<any[]>([]);
  const [isSubsLoading, setIsSubsLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [subSearchQuery, setSubSearchQuery] = useState('');

  const [isBranchAssignModalOpen, setIsBranchAssignModalOpen] = useState(false);
  const [branchAssignFormData, setBranchAssignFormData] = useState({
    companyId: '',
    branchId: '',
    planId: ''
  });
  const [isAssigningBranch, setIsAssigningBranch] = useState(false);
  const [branchesForSelection, setBranchesForSelection] = useState<any[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  const [branchSubscriptions, setBranchSubscriptions] = useState<any[]>([]);
  const [isBranchSubsLoading, setIsBranchSubsLoading] = useState(false);
  const [isBranchUpdateModalOpen, setIsBranchUpdateModalOpen] = useState(false);
  const [branchUpdateFormData, setBranchUpdateFormData] = useState({
    subscriptionId: 0,
    planId: '',
    isActive: true
  });
  const [isUpdatingBranch, setIsUpdatingBranch] = useState(false);

  const fetchBranchSubscriptions = async (branchId?: string) => {
    setIsBranchSubsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
 
      // Developer Simulation Mode
      if (token === 'dev_bypass_token') {
        setBranchSubscriptions([]);
        setIsBranchSubsLoading(false);
        return;
      }
 
      if (!branchId) {
        setBranchSubscriptions([]);
        setIsBranchSubsLoading(false);
        return;
      }

      const url = `https://testing.staffly.space/subscriptions/branch-subscriptions/branch/${branchId}`;
      const response = await fetch(url, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });

      if (response.ok) {
        const data = await response.json();
        setBranchSubscriptions(data ? [data] : []);
      }
    } catch (err) {
      console.error('Failed to fetch branch subscriptions:', err);
    } finally {
      setIsBranchSubsLoading(false);
    }
  };
  const fetchCompanySubscriptions = async (companyId?: string) => {
    setIsSubsLoading(true);
    try {
      const token = localStorage.getItem('access_token');

      // Developer Simulation Mode
      if (token === 'dev_bypass_token') {
        setCompanySubscriptions([]);
        setIsSubsLoading(false);
        return;
      }

      if (!companyId) {
        setCompanySubscriptions([]);
        setIsSubsLoading(false);
        return;
      }

      const url = `https://testing.staffly.space/subscriptions/company-subscriptions/company/${companyId}`;

      const response = await fetch(url, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });

      if (response.ok) {
        const data = await response.json();
        if (companyId) {
          setCompanySubscriptions(data ? [data] : []);
        } else {
          setCompanySubscriptions(Array.isArray(data) ? data : []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch company subscriptions:', err);
    } finally {
      setIsSubsLoading(false);
    }
  };

  const handleSearchSubscriptions = () => {
    if (subSearchQuery.trim()) {
      fetchCompanySubscriptions(subSearchQuery.trim());
    } else {
      fetchCompanySubscriptions();
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://testing.staffly.space/companies', {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        const data = await response.json();
        setCompanies(Array.isArray(data) ? data : []);
      }

      // Developer Simulation Mode
      if (token === 'dev_bypass_token') {
        setCompanies([]);
        return;
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  const fetchBranchesForCompany = async (companyId: string) => {
    if (!companyId) return;
    setIsLoadingBranches(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/company-branches?company_id=${companyId}`, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
 
      if (token === 'dev_bypass_token') {
        setBranchesForSelection([]);
        setIsLoadingBranches(false);
        return;
      }
 
      if (response.ok) {
        const data = await response.json();
        setBranchesForSelection(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    } finally {
      setIsLoadingBranches(false);
    }
  };

  useEffect(() => {
    fetchPlans(activeFilter);
    fetchCompanies();
  }, [activeFilter]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [editPlanId, setEditPlanId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    planName: '',
    numberOfUsers: '',
    price: '',
    tenure: '',
    description: ''
  });

  const handleSubmitPlan = async () => {
    if (!formData.planName || !formData.numberOfUsers || !formData.price || !formData.tenure) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const isEditing = !!editPlanId;
 
      // Simulation mode for dev bypass token
      if (token === 'dev_bypass_token') {
        setTimeout(() => {
          setIsModalOpen(false);
          setEditPlanId(null);
          const simulatedPlan = {
            plan_id: isEditing ? editPlanId : Math.floor(Math.random() * 1000) + 100,
            plan_name: formData.planName,
            max_users: parseInt(formData.numberOfUsers),
            price: parseFloat(formData.price),
            duration_months: parseInt(formData.tenure),
            description: `${formData.planName} (Simulated)`,
            is_active: true
          } as any;
 
          if (!isEditing) {
            setPlans(prev => [simulatedPlan, ...prev]);
          } else {
            setPlans(prev => prev.map(p => p.plan_id === editPlanId ? simulatedPlan : p));
          }
 
          setFormData({ planName: '', numberOfUsers: '', price: '', tenure: '', description: '' });
          alert(`Dev Mode: Subscription plan ${isEditing ? 'updated' : 'created'} successfully (Simulated)`);
          setIsLoading(false);
        }, 800);
        return;
      }
      const url = isEditing
        ? `https://testing.staffly.space/subscriptions/plans/${editPlanId}`
        : 'https://testing.staffly.space/subscriptions/plans';

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          plan_name: formData.planName,
          description: formData.description || `${formData.planName} for ${formData.tenure} months`,
          max_users: parseInt(formData.numberOfUsers),
          price: parseFloat(formData.price),
          duration_months: parseInt(formData.tenure),
          ...(isEditing ? { is_active: true } : {})
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        setEditPlanId(null);
        setFormData({
          planName: '',
          numberOfUsers: '',
          price: '',
          tenure: '',
          description: ''
        });
        alert(`Subscription plan ${isEditing ? 'updated' : 'created'} successfully!`);
      } else {
        alert(data.message || data.detail || `Failed to ${isEditing ? 'update' : 'create'} subscription plan`);
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = async (planId: number) => {
    setIsLoading(true);
    const planData = await fetchPlanById(planId);
    setIsLoading(false);
    if (planData) {
      setEditPlanId(planData.plan_id);
      setFormData({
        planName: planData.plan_name || '',
        numberOfUsers: String(planData.max_users || ''),
        price: String(parseFloat(planData.price || '0')),
        tenure: String(planData.duration_months || '1'),
        description: planData.description || ''
      });
      setIsModalOpen(true);
    } else {
      alert('Failed to load plan details. Please try again.');
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
 
      if (token === 'dev_bypass_token') {
        setTimeout(() => {
          setPlans(prev => prev.filter(p => p.plan_id !== planId));
          alert('Dev Mode: Subscription plan deleted successfully (Simulated)');
        }, 500);
        return;
      }
 
      const response = await fetch(`https://testing.staffly.space/subscriptions/plans/${planId}`, {
        method: 'DELETE',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });

      if (response.status === 204 || response.ok) {
        alert('Subscription plan deleted successfully.');
        fetchPlans(activeFilter);
      } else {
        const errorData = await response.json().catch(() => null);
        alert(errorData?.message || errorData?.detail || 'Failed to delete subscription plan');
      }
    } catch (err) {
      alert('Network error while deleting. Please try again.');
    }
  };

  const handleAssignPlan = async () => {
    if (!assignFormData.companyId || !assignFormData.planId) {
      alert('Please select both a company and a plan');
      return;
    }

    setIsAssigning(true);
    try {
      const token = localStorage.getItem('access_token');
 
      if (token === 'dev_bypass_token') {
        setTimeout(() => {
          setIsAssignModalOpen(false);
          setAssignFormData({ companyId: '', planId: '' });
          alert('Dev Mode: Plan assigned successfully (Simulated)');
          setIsAssigning(false);
        }, 500);
        return;
      }
 
      const response = await fetch('https://testing.staffly.space/subscriptions/company-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          company_id: parseInt(assignFormData.companyId),
          plan_id: parseInt(assignFormData.planId)
        })
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        alert('Subscription plan assigned successfully!');
        setIsAssignModalOpen(false);
        setAssignFormData({ companyId: '', planId: '' });
        fetchCompanySubscriptions();
      } else {
        alert(data?.message || data?.detail || 'Failed to assign subscription plan');
      }
    } catch (err) {
      alert('Network error while assigning plan. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAssignBranchSubscription = async () => {
    if (!branchAssignFormData.branchId || !branchAssignFormData.planId) {
      alert('Please select both a branch and a plan');
      return;
    }

    setIsAssigningBranch(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://testing.staffly.space/subscriptions/branch-subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          branch_id: parseInt(branchAssignFormData.branchId),
          plan_id: parseInt(branchAssignFormData.planId)
        })
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        alert('Branch subscription assigned successfully!');
        setIsBranchAssignModalOpen(false);
        setBranchAssignFormData({ companyId: '', branchId: '', planId: '' });
      } else {
        alert(data?.message || data?.detail || 'Failed to assign branch subscription');
      }
    } catch (err) {
      alert('Network error while assigning branch plan. Please try again.');
    } finally {
      setIsAssigningBranch(false);
    }
  };

  const handleUpdateSubscriptionClick = (sub: any) => {
    setUpdateFormData({
      subscriptionId: sub.subscription_id || 0,
      planId: String(sub.plan_id || ''),
      isActive: sub.is_active !== undefined ? sub.is_active : true
    });
    setIsUpdateModalOpen(true);
  };

  const handleViewSubscriptionDetails = async (id: number, type: 'company' | 'branch' = 'company') => {
    setIsLoadingDetail(true);
    setDetailData(null);
    setIsDetailModalOpen(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!id) return;
      const url = type === 'company'
        ? `https://testing.staffly.space/subscriptions/company-subscriptions/company/${id}`
        : `https://testing.staffly.space/subscriptions/branch-subscriptions/branch/${id}`;

      const response = await fetch(url, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      if (response.ok) {
        const data = await response.json();
        setDetailData(data);
      }
    } catch (err) {
      console.error(`Failed to fetch ${type} subscription details:`, err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleUpdateCompanySubscription = async () => {
    if (!updateFormData.planId) {
      alert('Please select a plan');
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('access_token');
 
      // Developer Simulation Mode
      if (token === 'dev_bypass_token') {
        alert('Company subscription updated successfully (Simulated)!');
        setIsUpdateModalOpen(false);
        setIsUpdating(false);
        return;
      }
 
      const response = await fetch(`https://testing.staffly.space/subscriptions/company-subscriptions/${updateFormData.subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          plan_id: parseInt(updateFormData.planId),
          is_active: updateFormData.isActive
        })
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        alert('Company subscription updated successfully!');
        setIsUpdateModalOpen(false);
        fetchCompanySubscriptions();
      } else {
        alert(data?.message || data?.detail || 'Failed to update company subscription');
      }
    } catch (err) {
      alert('Network error while updating subscription. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateBranchSubscription = async () => {
    if (!branchUpdateFormData.planId) {
      alert('Please select a plan');
      return;
    }

    setIsUpdatingBranch(true);
    try {
      const token = localStorage.getItem('access_token');
 
      // Developer Simulation Mode
      if (token === 'dev_bypass_token') {
        alert('Branch subscription updated successfully (Simulated)!');
        setIsBranchUpdateModalOpen(false);
        setIsUpdatingBranch(false);
        return;
      }
 
      const response = await fetch(`https://testing.staffly.space/subscriptions/branch-subscriptions/${branchUpdateFormData.subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          plan_id: parseInt(branchUpdateFormData.planId),
          is_active: branchUpdateFormData.isActive
        })
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        alert('Branch subscription updated successfully!');
        setIsBranchUpdateModalOpen(false);
        fetchBranchSubscriptions();
      } else {
        alert(data?.message || data?.detail || 'Failed to update branch subscription');
      }
    } catch (err) {
      alert('Network error while updating branch subscription. Please try again.');
    } finally {
      setIsUpdatingBranch(false);
    }
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {(['all', 'true', 'false'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeFilter === filter
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {filter === 'all' ? 'All Plans' : filter === 'true' ? 'Active' : 'Inactive'}
            </button>
          ))}
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
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {editPlanId ? 'Update Subscription Plan' : 'Create Subscription Plan'}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  {editPlanId ? 'Modify the existing pricing tier.' : 'Set up a new pricing tier for the platform.'}
                </DialogDescription>
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
                <Label htmlFor="description" className="text-sm font-bold text-slate-900">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what's included in this plan..."
                  className="bg-orange-50/50 border-slate-200 rounded-lg min-h-[80px] text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  onClick={handleSubmitPlan}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (editPlanId ? 'Update Plan' : '+ Create Plan')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {plansLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-slate-200 bg-white animate-pulse">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-slate-100 mb-4" />
                <div className="h-6 w-32 bg-slate-100 rounded mb-2" />
                <div className="h-8 w-24 bg-slate-100 rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map(j => <div key={j} className="h-4 bg-slate-100 rounded" />)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium border border-dashed border-slate-200 rounded-2xl">
          <Shield className="h-10 w-10 mx-auto mb-3 text-slate-300" />
          No subscription plans found. Create your first plan above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const colorClass = planColors[index % planColors.length];
            const colorBg = colorClass.split(' ')[0];
            const colorText = colorClass.split(' ')[1];
            return (
              <Card key={plan.plan_id} className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col group">
                <CardHeader className="text-left relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${colorBg} ${colorText}`}>
                      <Shield className="h-5 w-5" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleEditClick(plan.plan_id)}>
                          <Edit className="h-4 w-4" /> Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer" onClick={() => handleDeletePlan(plan.plan_id)}>
                          <Trash2 className="h-4 w-4" /> Delete Plan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">{plan.plan_name}</CardTitle>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">₹{parseFloat(plan.price).toLocaleString('en-IN')}</span>
                    <span className="text-slate-500 text-sm">/{plan.duration_months} mo</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 text-left pb-8">
                  <div className="space-y-3">
                    {plan.description && (
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        <span className="font-medium">{plan.description}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="font-medium">Up to {plan.max_users?.toLocaleString()} users</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="font-medium">{plan.duration_months} month{plan.duration_months !== 1 ? 's' : ''} validity</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className={`h-5 w-5 shrink-0 ${plan.is_active ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className={`font-bold ${plan.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full font-bold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl py-6">
                    Manage Limitations
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="border-slate-200 dark:border-slate-800 bg-white overflow-hidden shadow-sm">
        <CardHeader className="text-left bg-slate-50/50 border-b border-slate-100 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Active Subscriptions</CardTitle>
              <CardDescription>Real-time monitor of organizations and their current tiers.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Enter Company ID..."
                  className="pl-10 bg-white border-slate-200 rounded-xl"
                  value={subSearchQuery}
                  onChange={(e) => setSubSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubscriptions()}
                />
              </div>
              <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="font-bold border-orange-200 text-orange-600 hover:bg-orange-50 bg-white">
                    Assign Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] bg-white">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-xl font-bold text-slate-900">Assign Plan to Company</DialogTitle>
                    <DialogDescription>
                      Select an organization and a subscription tier to activate.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-bold text-slate-700">Company</label>
                      <select
                        className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                        value={assignFormData.companyId}
                        onChange={(e) => setAssignFormData({ ...assignFormData, companyId: e.target.value })}
                      >
                        <option value="">Select a company</option>
                        {companies.map(company => (
                          <option key={company.company_id} value={company.company_id}>
                            {company.company_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-bold text-slate-700">Subscription Plan</label>
                      <select
                        className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                        value={assignFormData.planId}
                        onChange={(e) => setAssignFormData({ ...assignFormData, planId: e.target.value })}
                      >
                        <option value="">Select a plan</option>
                        {plans.map(plan => (
                          <option key={plan.plan_id} value={plan.plan_id}>
                            {plan.plan_name} (₹{plan.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
                    <Button
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
                      onClick={handleAssignPlan}
                      disabled={isAssigning}
                    >
                      {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isBranchAssignModalOpen} onOpenChange={setIsBranchAssignModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="font-bold border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-white">
                    Assign Branch Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] bg-white">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-xl font-bold text-slate-900">Assign Plan to Branch</DialogTitle>
                    <DialogDescription>
                      Select specific branch and a subscription tier to activate.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2 text-left">
                      <label className="text-sm font-bold text-slate-700">Company</label>
                      <select
                        className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                        value={branchAssignFormData.companyId}
                        onChange={(e) => {
                          const cid = e.target.value;
                          setBranchAssignFormData({ ...branchAssignFormData, companyId: cid, branchId: '' });
                          fetchBranchesForCompany(cid);
                        }}
                      >
                        <option value="">Select a company</option>
                        {companies.map(company => (
                          <option key={company.company_id} value={company.company_id}>
                            {company.company_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm font-bold text-slate-700">Branch</label>
                      <select
                        className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm disabled:opacity-50"
                        value={branchAssignFormData.branchId}
                        onChange={(e) => setBranchAssignFormData({ ...branchAssignFormData, branchId: e.target.value })}
                        disabled={!branchAssignFormData.companyId || isLoadingBranches}
                      >
                        <option value="">{isLoadingBranches ? 'Searching...' : 'Select a branch'}</option>
                        {branchesForSelection.map(branch => (
                          <option key={branch.branch_id} value={branch.branch_id}>
                            {branch.branch_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm font-bold text-slate-700">Subscription Plan</label>
                      <select
                        className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                        value={branchAssignFormData.planId}
                        onChange={(e) => setBranchAssignFormData({ ...branchAssignFormData, planId: e.target.value })}
                      >
                        <option value="">Select a plan</option>
                        {plans.map(plan => (
                          <option key={plan.plan_id} value={plan.plan_id}>
                            {plan.plan_name} (₹{plan.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button variant="outline" onClick={() => setIsBranchAssignModalOpen(false)}>Cancel</Button>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                      onClick={handleAssignBranchSubscription}
                      disabled={isAssigningBranch}
                    >
                      {isAssigningBranch ? 'Assigning...' : 'Assign to Branch'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                {isSubsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <div className="h-4 w-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                        Loading subscriptions...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : companySubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                      No active company subscriptions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  companySubscriptions.map((sub, i) => (
                    <TableRow key={sub.subscription_id || i} className="hover:bg-slate-50/50 transition-colors border-slate-100 font-bold">
                      <TableCell className="py-5 pl-8 text-slate-900">
                        {sub.company?.company_name || `Company #${sub.company_id}`}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-bold bg-orange-50 text-orange-600 border-none px-3">
                          {sub.plan?.plan_name || `Plan #${sub.plan_id}`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium">
                        {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${sub.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={`text-sm font-bold ${sub.is_active ? 'text-slate-700' : 'text-slate-400'}`}>
                            {sub.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSubscriptionDetails(sub.company_id, 'company')}
                          className="font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg mr-2"
                        >
                          Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateSubscriptionClick(sub)}
                          className="font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Company Subscription Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
          <DialogHeader className="bg-blue-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left border-b border-blue-100">
            <div className="bg-blue-500 p-3 rounded-xl shadow-lg shadow-blue-200">
              <Edit className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">Update Subscription</DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-500">Modify subscription plan and account status.</DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-5 text-left">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Select New Plan *</Label>
              <Select
                value={updateFormData.planId}
                onValueChange={(val) => setUpdateFormData({ ...updateFormData, planId: val })}
              >
                <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 transition-all">
                  <SelectValue placeholder="Choose a subscription plan" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100 p-1">
                  {plans.map(plan => (
                    <SelectItem key={plan.plan_id} value={String(plan.plan_id)} className="rounded-lg py-2.5 font-bold cursor-pointer hover:bg-slate-50">
                      <div className="flex flex-col">
                        <span>{plan.plan_name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">₹{parseFloat(plan.price).toLocaleString()} • {plan.duration_months} Months</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isSubActive" className="text-sm font-bold text-slate-800 cursor-pointer">Subscription Status</Label>
                <p className="text-[10px] text-slate-500 font-medium">Enable or disable access for this organization.</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isSubActive"
                  checked={updateFormData.isActive}
                  onChange={(e) => setUpdateFormData({ ...updateFormData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" className="font-bold rounded-xl border-slate-200" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 shadow-lg shadow-blue-100 transition-all active:scale-95"
              onClick={handleUpdateCompanySubscription}
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Update Subscription'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
          <DialogHeader className="bg-orange-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
            <div className="bg-orange-500 p-3 rounded-xl shadow-lg shadow-orange-100">
              <Zap className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800">Subscription Analysis</DialogTitle>
              <DialogDescription className="text-xs text-orange-700 font-bold uppercase tracking-widest mt-0.5">Real-time Entitlement Verification</DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 bg-white text-left">
            {isLoadingDetail ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="w-8 h-8 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-400 italic">Analyzing credentials...</p>
              </div>
            ) : detailData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Plan</p>
                    <p className="text-sm font-black text-slate-900">{detailData.plan?.plan_name || 'N/A'}</p>
                    <p className="text-[10px] text-orange-600 font-bold mt-1">₹{parseFloat(detailData.plan?.price || '0').toLocaleString()} / {detailData.plan?.duration_months}mo</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <Badge className={`font-black uppercase tracking-widest text-[9px] ${detailData.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {detailData.is_active ? 'Authorized' : 'Suspended'}
                    </Badge>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">ID: #{detailData.subscription_id}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg"><Users className="h-4 w-4 text-indigo-600" /></div>
                      <span className="text-sm font-bold text-slate-700">User Capacity</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{detailData.plan?.max_users?.toLocaleString() || 0} Licensed</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg"><Zap className="h-4 w-4 text-blue-600" /></div>
                      <span className="text-sm font-bold text-slate-700">Activation Date</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{detailData.start_date ? new Date(detailData.start_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-50 rounded-lg"><Shield className="h-4 w-4 text-rose-600" /></div>
                      <span className="text-sm font-bold text-slate-700">Renewal Date</span>
                    </div>
                    <span className="text-sm font-black text-rose-600">{detailData.end_date ? new Date(detailData.end_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest mb-1">Plan Description</p>
                  <p className="text-xs font-medium text-amber-900/80 leading-relaxed italic">
                    "{detailData.plan?.description || 'Standard subscription tier with default feature set.'}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 font-bold italic">No data found for this company.</div>
            )}

            <div className="pt-2 text-center">
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-12 h-11 w-full shadow-lg"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close Analysis
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Card className="border-slate-200 dark:border-slate-800 bg-white overflow-hidden shadow-sm">
        <CardHeader className="text-left bg-emerald-50/50 border-b border-emerald-100 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-emerald-900">Branch Subscriptions</CardTitle>
              <CardDescription>Localized monitoring of branch-specific entitlements.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto text-left">
            <Table>
              <TableHeader className="bg-emerald-50/20">
                <TableRow className="hover:bg-transparent border-emerald-100">
                  <TableHead className="font-bold text-emerald-900 py-4 pl-8">Branch Identity</TableHead>
                  <TableHead className="font-bold text-emerald-900">Assigned Plan</TableHead>
                  <TableHead className="font-bold text-emerald-900">Period</TableHead>
                  <TableHead className="font-bold text-emerald-900">Status</TableHead>
                  <TableHead className="text-right font-bold text-emerald-900 pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isBranchSubsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-slate-500">
                        <div className="h-4 w-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                        Syncing branch data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : branchSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                      No branch-specific subscriptions assigned.
                    </TableCell>
                  </TableRow>
                ) : (
                  branchSubscriptions.map((sub, i) => (
                    <TableRow key={sub.subscription_id || i} className="hover:bg-emerald-50/30 transition-colors border-emerald-50 font-bold">
                      <TableCell className="py-5 pl-8 text-slate-900">
                        {sub.branch?.branch_name || `Branch #${sub.branch_id}`}
                        <p className="text-[10px] text-slate-400 font-medium">Internal ID: {sub.subscription_id}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-bold border-emerald-200 text-emerald-700 bg-emerald-50/50">
                          {sub.plan?.plan_name || `Plan #${sub.plan_id}`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium text-xs">
                        {sub.start_date ? new Date(sub.start_date).toLocaleDateString() : 'N/A'} - {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${sub.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={`text-[11px] font-black uppercase tracking-wider ${sub.is_active ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {sub.is_active ? 'Authorized' : 'Suspended'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSubscriptionDetails(sub.branch_id, 'branch')}
                          className="font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg mr-2"
                        >
                          Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBranchUpdateFormData({
                              subscriptionId: sub.subscription_id,
                              plan_id: String(sub.plan_id),
                              isActive: sub.is_active
                            } as any);
                            setIsBranchUpdateModalOpen(true);
                          }}
                          className="font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                        >
                          Modify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Branch Subscription Modal */}
      <Dialog open={isBranchUpdateModalOpen} onOpenChange={setIsBranchUpdateModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
          <DialogHeader className="bg-emerald-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left border-b border-emerald-100">
            <div className="bg-emerald-500 p-3 rounded-xl shadow-lg shadow-emerald-200">
              <Zap className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">Modify Branch Access</DialogTitle>
              <DialogDescription className="text-sm font-medium text-emerald-600">Update localized subscription parameters.</DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-5 text-left">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Select New Plan *</Label>
              <Select
                value={branchUpdateFormData.planId}
                onValueChange={(val) => setBranchUpdateFormData({ ...branchUpdateFormData, planId: val })}
              >
                <SelectTrigger className="w-full h-12 bg-slate-50 border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-400 transition-all">
                  <SelectValue placeholder="Choose a subscription plan" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100 p-1">
                  {plans.map(plan => (
                    <SelectItem key={plan.plan_id} value={String(plan.plan_id)} className="rounded-lg py-2.5 font-bold cursor-pointer hover:bg-slate-50">
                      <div className="flex flex-col">
                        <span>{plan.plan_name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">₹{parseFloat(plan.price).toLocaleString()} • {plan.duration_months} Months</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="branchIsActive" className="text-sm font-bold text-slate-800 cursor-pointer">Access Status</Label>
                <p className="text-[10px] text-slate-500 font-medium">Control entitlement status for this branch.</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="branchIsActive"
                  checked={branchUpdateFormData.isActive}
                  onChange={(e) => setBranchUpdateFormData({ ...branchUpdateFormData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50/50 flex justify-end gap-3 border-t border-slate-100">
            <Button variant="outline" className="font-bold rounded-xl border-slate-200" onClick={() => setIsBranchUpdateModalOpen(false)}>Cancel</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-8 shadow-lg shadow-emerald-100 transition-all active:scale-95"
              onClick={handleUpdateBranchSubscription}
              disabled={isUpdatingBranch}
            >
              {isUpdatingBranch ? 'Syncing...' : 'Update Entitlement'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlans;
