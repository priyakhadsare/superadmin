import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, Eye, Edit, Trash2, Search, Plus, Filter, Building2, UserPlus, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const BranchManagement: React.FC = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [error, setError] = useState('');

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'none' | 'true' | 'false'>('none');
  const [includeDeleted, setIncludeDeleted] = useState<'none' | 'true' | 'false'>('false');
  const [searchQuery, setSearchQuery] = useState('');

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  const [isAssignAdminModalOpen, setIsAssignAdminModalOpen] = useState(false);
  const [assignAdminBranchId, setAssignAdminBranchId] = useState<number | null>(null);
  const [assignAdminCompanyId, setAssignAdminCompanyId] = useState<number | null>(null);
  const [isAssigningAdmin, setIsAssigningAdmin] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');
  const [availableAdmins, setAvailableAdmins] = useState<any[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);

  const [isBranchAdminsOpen, setIsBranchAdminsOpen] = useState(false);
  const [branchAdmins, setBranchAdmins] = useState<any[]>([]);
  const [isLoadingBranchAdmins, setIsLoadingBranchAdmins] = useState(false);
  const [selectedBranchName, setSelectedBranchName] = useState('');
  const [selectedBranchIdForAdmins, setSelectedBranchIdForAdmins] = useState<number | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [addFormData, setAddFormData] = useState({
    company_id: '',
    branch_name: '',
    branch_email: '',
    contact_number: '',
    address: ''
  });

  // Fetch Companies for Filter
  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://testing.staffly.space/companies', {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      const data = await response.json();
      if (response.ok) {
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch companies');
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const fetchBranches = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access_token');
      const queryParams = new URLSearchParams();

      if (selectedCompanyId !== 'all') queryParams.append('company_id', selectedCompanyId);
      if (includeDeleted !== 'none') queryParams.append('include_deleted', includeDeleted);
      if (statusFilter !== 'none') queryParams.append('status_filter', statusFilter);

      const url = `https://testing.staffly.space/company-branches?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBranches(Array.isArray(data) ? data : []);
      } else {
        setError(data.message || 'Failed to fetch branches');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [selectedCompanyId, statusFilter, includeDeleted]);

  const handleBranchStatusToggle = async (branchId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      const newStatus = !currentStatus;

      const response = await fetch(`https://testing.staffly.space/company-branches/${branchId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          branch_id: branchId,
          status: newStatus
        })
      });

      if (response.ok) {
        fetchBranches();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update branch status');
      }
    } catch (err) {
      console.error('Branch status update failed');
      alert('Network error. Please try again.');
    }
  };

  const handleBranchDelete = async (branchId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to archive branch "${name}"? This will move it to the deleted records.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/company-branches/${branchId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        alert('Branch archived successfully.');
        fetchBranches();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to archive branch.');
      }
    } catch (err) {
      console.error('Branch delete failed');
      alert('Network error. Please try again.');
    }
  };

  const handleAssignAdminClick = async (branch: any) => {
    setAssignAdminBranchId(branch.branch_id);
    setAssignAdminCompanyId(branch.company_id);
    setSelectedAdminId('');
    setIsAssignAdminModalOpen(true);

    if (branch.company_id) {
      setIsLoadingAdmins(true);
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`https://testing.staffly.space/companies/${branch.company_id}/admins`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setAvailableAdmins(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch admins');
      } finally {
        setIsLoadingAdmins(false);
      }
    }
  };

  const handleAssignAdminSubmit = async () => {
    if (!selectedAdminId || !assignAdminBranchId) {
      alert('Please select an administrator');
      return;
    }

    setIsAssigningAdmin(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/company-branches/${assignAdminBranchId}/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          branch_id: assignAdminBranchId,
          admin_user_id: parseInt(selectedAdminId)
        })
      });

      if (response.ok) {
        alert('Administrator assigned successfully!');
        setIsAssignAdminModalOpen(false);
        fetchBranches();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to assign administrator');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsAssigningAdmin(false);
    }
  };

  const handleViewClick = (branch: any) => {
    setViewData(branch);
    setIsViewModalOpen(true);
  };

  const handleShowBranchAdmins = async (branch: any) => {
    setSelectedBranchName(branch.branch_name);
    setSelectedBranchIdForAdmins(branch.branch_id);
    setIsBranchAdminsOpen(true);
    setIsLoadingBranchAdmins(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/company-branches/${branch.branch_id}/admins`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setBranchAdmins(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch branch admins');
    } finally {
      setIsLoadingBranchAdmins(false);
    }
  };
  const handleAddBranchSubmit = async () => {
    if (!addFormData.company_id || !addFormData.branch_name || !addFormData.branch_email || !addFormData.contact_number) {
      alert('Please fill in all required fields');
      return;
    }

    setIsAddingBranch(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://testing.staffly.space/company-branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          company_id: parseInt(addFormData.company_id),
          branch_name: addFormData.branch_name,
          branch_email: addFormData.branch_email,
          contact_number: addFormData.contact_number,
          address: addFormData.address,
          status: true
        })
      });

      // Simulation mode for dev bypass token
      if (token === 'dev_bypass_token') {
        setTimeout(() => {
          setIsAddModalOpen(false);
          const simulatedBranch = {
            ...addFormData,
            branch_id: Math.floor(Math.random() * 1000) + 100,
            status: true
          };
          setBranches(prev => [simulatedBranch, ...prev]);
          setAddFormData({ company_id: '', branch_name: '', branch_email: '', contact_number: '', address: '' });
          alert('Dev Mode: Branch created successfully (Simulated)');
          setIsAddingBranch(false);
        }, 800);
        return;
      }

      const data = await response.json();
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsAddingBranch(false);
    }
  };

  return (
    <div className="space-y-4 p-4 min-h-screen">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2 border border-slate-200 rounded-lg bg-orange-50">
            <Store className="h-6 w-6 text-orange-600" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Branch Management</h1>
            <p className="text-xs text-slate-500 font-medium tracking-tight">List and manage regional company branches</p>
          </div>
        </div>

        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg h-10 px-4 font-bold transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Branch
        </Button>
      </div>

      <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between p-4 pb-4 border-b space-y-4 md:space-y-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search branches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 w-[240px] rounded-lg border-slate-200 bg-white placeholder:text-slate-400 text-sm focus-visible:ring-orange-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Company Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
              <Building2 className="h-3.5 w-3.5 text-slate-400 ml-2" />
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="h-8 w-[150px] border-none shadow-none bg-transparent font-bold text-slate-700 focus:ring-0 text-xs px-2">
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-lg border-slate-100 max-h-[300px]">
                  <SelectItem value="all" className="font-semibold cursor-pointer">All Companies</SelectItem>
                  {companies.map(c => (
                    <SelectItem key={c.company_id} value={c.company_id.toString()} className="font-semibold cursor-pointer">
                      {c.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-8 w-[90px] border-none shadow-none bg-transparent font-bold text-slate-800 focus:ring-0 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-lg border-slate-100">
                  <SelectItem value="none" className="font-semibold cursor-pointer">All</SelectItem>
                  <SelectItem value="true" className="font-semibold cursor-pointer">Active</SelectItem>
                  <SelectItem value="false" className="font-semibold cursor-pointer">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Deleted Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Archived:</span>
              <Select value={includeDeleted} onValueChange={(val: any) => setIncludeDeleted(val)}>
                <SelectTrigger className="h-8 w-[80px] border-none shadow-none bg-transparent font-bold text-slate-800 focus:ring-0 text-xs">
                  <SelectValue placeholder="Deleted" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-lg border-slate-100">
                  <SelectItem value="false" className="font-semibold cursor-pointer">Hide</SelectItem>
                  <SelectItem value="true" className="font-semibold cursor-pointer">Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={fetchBranches} className="h-9 border-slate-200">
              <Filter className="h-3.5 w-3.5 mr-1.5" /> Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full relative overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-none">
                  <TableHead className="w-[50px] pl-4"><Checkbox /></TableHead>
                  <TableHead className="text-slate-900 font-bold text-sm py-4">ID</TableHead>
                  <TableHead className="text-slate-900 font-bold text-sm">Branch Name</TableHead>
                  <TableHead className="text-slate-900 font-bold text-sm">Email</TableHead>
                  <TableHead className="text-slate-900 font-bold text-sm">Contact Number</TableHead>
                  <TableHead className="text-slate-900 font-bold text-sm">Address</TableHead>
                  <TableHead className="text-slate-900 font-bold text-sm">Status</TableHead>
                  <TableHead className="text-center text-slate-900 font-bold text-sm pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Retrieving Branches...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <p className="text-rose-500 font-bold">{error}</p>
                    </TableCell>
                  </TableRow>
                ) : branches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Store className="h-10 w-10 text-slate-200" />
                        <p className="text-slate-400 font-bold">No branches found matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : branches.filter(b => b.branch_name.toLowerCase().includes(searchQuery.toLowerCase())).map((branch) => (
                  <TableRow key={branch.branch_id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-4"><Checkbox /></TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm py-5">#ID-{branch.branch_id}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">
                      <div>
                        {branch.branch_name}
                        {branch.company_id && (
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Company #{branch.company_id}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700 text-sm">{branch.branch_email}</TableCell>
                    <TableCell className="font-bold text-slate-800 text-sm">{branch.contact_number}</TableCell>
                    <TableCell className="font-medium text-slate-600 text-sm italic overflow-hidden max-w-[200px] whitespace-nowrap overflow-ellipsis">
                      "{branch.address || 'N/A'}"
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleBranchStatusToggle(branch.branch_id, branch.status)}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${branch.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                        title={branch.status ? "Deactivate Branch" : "Activate Branch"}
                      >
                        {branch.status ? 'Active' : 'Inactive'}
                      </button>
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleViewClick(branch)} className="text-slate-600 hover:text-sky-600 transition-colors" title="View Details"><Eye className="h-5 w-5" /></button>
                        <button onClick={() => handleShowBranchAdmins(branch)} className="text-slate-600 hover:text-emerald-600 transition-colors" title="View Assigned Admins"><Shield className="h-5 w-5" /></button>
                        <button onClick={() => handleAssignAdminClick(branch)} className="text-slate-600 hover:text-orange-500 transition-colors" title="Assign Admin"><UserPlus className="h-5 w-5" /></button>
                        <button className="text-slate-600 hover:text-slate-900 transition-colors" title="Edit"><Edit className="h-5 w-5" /></button>
                        <button
                          onClick={() => handleBranchDelete(branch.branch_id, branch.branch_name)}
                          className="text-slate-600 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Branch View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-[420px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
          <DialogHeader className="bg-sky-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left border-b border-sky-100">
            <div className="bg-sky-500 p-3 rounded-xl shadow-lg shadow-sky-100">
              <Store className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800">Branch Details</DialogTitle>
              <DialogDescription className="text-xs text-sky-700 font-bold uppercase tracking-widest mt-0.5">Administrative Overview</DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 bg-white text-left">
            {viewData && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Branch Identity</p>
                    <p className="text-sm font-bold text-slate-900 border-b border-sky-50 pb-1">{viewData.branch_name}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System ID</p>
                    <code className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-500">#{viewData.branch_id}</code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Contact</p>
                    <p className="text-xs font-bold text-slate-700 truncate">{viewData.branch_email}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Voice Link</p>
                    <p className="text-xs font-bold text-slate-700">{viewData.contact_number}</p>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-sky-50">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${viewData.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {viewData.status ? 'Operational' : 'Restricted'}
                    </span>
                  </div>
                </div>
                <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                    Regional Localization
                  </p>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{viewData.address || 'No address provided'}"</p>
                </div>
              </div>
            )}

            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl h-11 w-full"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Admin to Branch Modal */}
      <Dialog open={isAssignAdminModalOpen} onOpenChange={setIsAssignAdminModalOpen}>
        <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
          <DialogHeader className="bg-orange-500 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20">
              <UserPlus className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">Assign Administrator</DialogTitle>
              <DialogDescription className="text-xs text-orange-100 font-bold uppercase tracking-widest mt-0.5">Linking Admin to Branch: #{assignAdminBranchId}</DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-6 bg-white space-y-5 text-left">
            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Target Administrator *</Label>
              <Select value={selectedAdminId} onValueChange={setSelectedAdminId}>
                <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-orange-500">
                  <SelectValue placeholder="Select an Administrator" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100 max-h-[300px]">
                  {isLoadingAdmins ? (
                    <div className="p-4 text-center text-xs font-bold text-slate-400 italic">Syncing corp records...</div>
                  ) : availableAdmins.length === 0 ? (
                    <div className="p-4 text-center text-xs font-bold text-slate-400 italic">No admins available for company.</div>
                  ) : availableAdmins.map((admin) => (
                    <SelectItem key={admin.user_id} value={admin.user_id.toString()} className="font-semibold cursor-pointer">
                      {admin.name} ({admin.designation || 'Admin'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-slate-400 font-medium pl-1 italic">Listing corporate admins for Company #{assignAdminCompanyId}</p>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-11 border-slate-200 font-bold text-slate-600 rounded-xl"
                onClick={() => setIsAssignAdminModalOpen(false)}
              >
                Dismiss
              </Button>
              <Button
                className="h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-100"
                onClick={handleAssignAdminSubmit}
                disabled={isAssigningAdmin || !selectedAdminId}
              >
                {isAssigningAdmin ? 'Processing...' : 'Link Admin'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Branch Admins List Modal */}
      <Dialog open={isBranchAdminsOpen} onOpenChange={setIsBranchAdminsOpen}>
        <DialogContent className="max-w-[700px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
          <DialogHeader className="bg-emerald-600 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20">
              <Shield className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">Branch Administration</DialogTitle>
              <DialogDescription className="text-xs text-emerald-100 font-bold uppercase tracking-widest mt-0.5">Assigned Leaders for {selectedBranchName}</DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-0 bg-white">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-slate-800 text-xs py-4 pl-6">Admin Identity</TableHead>
                  <TableHead className="font-bold text-slate-800 text-xs">Department</TableHead>
                  <TableHead className="font-bold text-slate-800 text-xs text-center pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingBranchAdmins ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Synchronizing personnel records...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : branchAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-20 text-center text-slate-400 font-bold text-xs">No administrators assigned to this branch.</TableCell>
                  </TableRow>
                ) : branchAdmins.map((admin: any) => (
                  <TableRow key={admin.user_id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none mb-1">{admin.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{admin.designation || 'Admin'} • {admin.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700 text-sm italic">"{admin.department || 'N/A'}"</TableCell>
                    <TableCell className="text-right pr-6">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${admin.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {admin.is_active ? 'Operational' : 'Restricted'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-8 h-10 shadow-lg shadow-slate-200"
                onClick={() => setIsBranchAdminsOpen(false)}
              >
                Close Records
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Add Branch Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-[450px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
          <DialogHeader className="bg-orange-500 p-6 flex flex-row items-center gap-4 space-y-0 text-left border-b border-white/10">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20">
              <Plus className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white tracking-tight">Add New Branch</DialogTitle>
              <DialogDescription className="text-xs text-orange-100 font-bold uppercase tracking-widest mt-0.5">Register a new regional presence</DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-6 bg-white space-y-4 text-left font-bold">
            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Parent Company *</Label>
              <select 
                className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                value={addFormData.company_id} 
                onChange={(e) => setAddFormData({ ...addFormData, company_id: e.target.value })}
              >
                <option value="">Select Company</option>
                {companies.map(c => (
                  <option key={c.company_id} value={c.company_id.toString()}>
                    {c.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Branch Name *</Label>
              <Input 
                value={addFormData.branch_name}
                onChange={(e) => setAddFormData({ ...addFormData, branch_name: e.target.value })}
                placeholder="E.g., Mumbai Corporate Office"
                className="h-11 border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email *</Label>
                <Input 
                  value={addFormData.branch_email}
                  onChange={(e) => setAddFormData({ ...addFormData, branch_email: e.target.value })}
                  placeholder="mumbai@company.com"
                  className="h-11 border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Contact *</Label>
                <Input 
                  value={addFormData.contact_number}
                  onChange={(e) => setAddFormData({ ...addFormData, contact_number: e.target.value })}
                  placeholder="+91 9999988888"
                  className="h-11 border-slate-200 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Address</Label>
              <Input 
                value={addFormData.address}
                onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })}
                placeholder="Complete postal address"
                className="h-11 border-slate-200 rounded-xl font-bold"
              />
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-slate-50">
              <Button
                variant="outline"
                className="h-11 border-slate-200 font-bold text-slate-600 rounded-xl"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-11"
                onClick={handleAddBranchSubmit}
                disabled={isAddingBranch}
              >
                {isAddingBranch ? 'Creating...' : 'Register Branch'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BranchManagement;
