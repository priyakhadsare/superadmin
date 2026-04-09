import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Eye, Edit, Trash2, XCircle, Search, Plus, Paperclip, UserPlus, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { MapPin, Store, Users, UserCircle, BarChart3, PieChart } from 'lucide-react';

const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [viewError, setViewError] = useState('');

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [branchError, setBranchError] = useState('');
  const [selectedBranchCompanyId, setSelectedBranchCompanyId] = useState<number | null>(null);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [selectedAdminCompanyId, setSelectedAdminCompanyId] = useState<number | null>(null);

  const [selectedSummaryCompanyId, setSelectedSummaryCompanyId] = useState<number | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [isAssignAdminModalOpen, setIsAssignAdminModalOpen] = useState(false);
  const [assignAdminBranchId, setAssignAdminBranchId] = useState<number | null>(null);
  const [isAssigningAdmin, setIsAssigningAdmin] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');

  const [isBranchAdminsOpen, setIsBranchAdminsOpen] = useState(false);
  const [branchAdmins, setBranchAdmins] = useState<any[]>([]);
  const [isLoadingBranchAdmins, setIsLoadingBranchAdmins] = useState(false);
  const [selectedBranchNameForAdmins, setSelectedBranchNameForAdmins] = useState('');

  const [isBranchFormOpen, setIsBranchFormOpen] = useState(false);
  const [editBranchId, setEditBranchId] = useState<number | null>(null);
  const [branchFormData, setBranchFormData] = useState({
    branch_name: '',
    branch_email: '',
    contact_number: '',
    address: '',
    status: true
  });
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [branchFormError, setBranchFormError] = useState('');

  const [isBranchViewOpen, setIsBranchViewOpen] = useState(false);
  const [branchViewData, setBranchViewData] = useState<any>(null);
  const [isLoadingBranchView, setIsLoadingBranchView] = useState(false);
  const [branchViewError, setBranchViewError] = useState('');

  const [includeDeleted, setIncludeDeleted] = useState<'none' | 'true' | 'false'>('none');
  const [statusFilter, setStatusFilter] = useState<'none' | 'true' | 'false'>('none');
  const [branchIncludeDeleted, setBranchIncludeDeleted] = useState<'none' | 'true' | 'false'>('false');
  const [branchStatusFilter, setBranchStatusFilter] = useState<'none' | 'true' | 'false'>('none');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    company_name: '',
    company_email: '',
    contact_number: '',
    address: '',
    gst_no: '',
    status: true
  });

  const fetchCompanies = async () => {
    setIsLoadingList(true);
    try {
      const token = localStorage.getItem('access_token');

      const queryParams = new URLSearchParams();
      if (includeDeleted !== 'none') queryParams.append('include_deleted', includeDeleted);
      if (statusFilter !== 'none') queryParams.append('status_filter', statusFilter);

      const url = `https://testing.staffly.space/companies?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch companies');
    } finally {
      setIsLoadingList(false);
    }
  };

  React.useEffect(() => {
    fetchCompanies();
  }, [includeDeleted, statusFilter]);

  const handleEditClick = (company: any) => {
    setEditCompanyId(company.company_id);
    setFormData({
      company_name: company.company_name || '',
      company_email: company.company_email || '',
      contact_number: company.contact_number || '',
      address: company.address || '',
      gst_no: company.gst_no || '',
      status: company.status ?? true
    });
    setIsModalOpen(true);
  };

  const handleViewClick = async (companyId: number) => {
    setIsLoadingView(true);
    setViewData(null);
    setViewError('');
    setIsViewModalOpen(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/companies/${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();
      if (response.ok) {
        setViewData(data);
      } else {
        setViewError(data.message || 'Failed to fetch company details');
      }
    } catch (err) {
      setViewError('Network error. Please try again.');
    } finally {
      setIsLoadingView(false);
    }
  };

  const fetchBranches = async (companyId: number) => {
    setIsLoadingBranches(true);
    setBranchError('');
    try {
      const token = localStorage.getItem('access_token');

      const queryParams = new URLSearchParams();
      queryParams.append('company_id', companyId.toString());
      if (branchIncludeDeleted !== 'none') queryParams.append('include_deleted', branchIncludeDeleted);
      if (branchStatusFilter !== 'none') queryParams.append('status_filter', branchStatusFilter);

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
        setBranchError(data.message || 'Failed to fetch branches');
      }
    } catch (err) {
      setBranchError('Network error. Please try again.');
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const handleBranchesClick = (companyId: number) => {
    setBranches([]);
    setSelectedBranchCompanyId(companyId);
    setIsBranchModalOpen(true);
    fetchBranches(companyId);
  };

  React.useEffect(() => {
    if (isBranchModalOpen && selectedBranchCompanyId) {
      fetchBranches(selectedBranchCompanyId);
    }
  }, [branchIncludeDeleted, branchStatusFilter]);

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
        if (selectedBranchCompanyId) fetchBranches(selectedBranchCompanyId);
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
        if (selectedBranchCompanyId) fetchBranches(selectedBranchCompanyId);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to archive branch.');
      }
    } catch (err) {
      console.error('Branch delete failed');
      alert('Network error. Please try again.');
    }
  };

  const handleAdminsClick = async (companyId: number) => {
    setIsLoadingAdmins(true);
    setAdmins([]);
    setAdminError('');
    setSelectedAdminCompanyId(companyId);
    setIsAdminModalOpen(true);
    try {
      const token = localStorage.getItem('access_token');
      const url = `https://testing.staffly.space/companies/${companyId}/admins`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();
      if (response.ok) {
        const adminList = Array.isArray(data) ? data : [];
        setAdmins(adminList);
      } else {
        setAdminError(data.message || 'Failed to fetch admins');
      }
    } catch (err) {
      setAdminError('Network error. Please try again.');
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  const handleAssignAdminClick = async (branchId: number) => {
    if (!selectedBranchCompanyId) return;

    setAssignAdminBranchId(branchId);
    setSelectedAdminId('');
    setIsAssignAdminModalOpen(true);

    if (admins.length === 0 || selectedAdminCompanyId !== selectedBranchCompanyId) {
      setIsLoadingAdmins(true);
      setAdminError('');
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`https://testing.staffly.space/companies/${selectedBranchCompanyId}/admins`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setAdmins(Array.isArray(data) ? data : []);
          setSelectedAdminCompanyId(selectedBranchCompanyId);
        }
      } catch (err) {
        console.error('Failed to fetch admins for assignment');
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
        alert('Administrator assigned to branch successfully!');
        setIsAssignAdminModalOpen(false);
        if (selectedBranchCompanyId) fetchBranches(selectedBranchCompanyId);
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

  const handleSummaryClick = async (companyId: number) => {
    setIsLoadingSummary(true);
    setSummaryData(null);
    setSummaryError('');
    setSelectedSummaryCompanyId(companyId);
    setIsSummaryModalOpen(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/companies/${companyId}/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setSummaryData(data);
      } else {
        setSummaryError(data.message || 'Failed to fetch summary');
      }
    } catch (err) {
      setSummaryError('Network error');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleShowBranchAdmins = async (branch: any) => {
    setSelectedBranchNameForAdmins(branch.branch_name);
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

  const handleViewBranchClick = async (branchId: number) => {
    setIsLoadingBranchView(true);
    setBranchViewData(null);
    setBranchViewError('');
    setIsBranchViewOpen(true);
    try {
      const token = localStorage.getItem('access_token');
      const url = `https://testing.staffly.space/company-branches/${branchId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBranchViewData(data);
      } else {
        setBranchViewError(data.message || 'Failed to fetch branch profile');
      }
    } catch (err) {
      setBranchViewError('Network error. Please try again.');
    } finally {
      setIsLoadingBranchView(false);
    }
  };

  const handleEditBranchClick = (branch: any) => {
    setEditBranchId(branch.branch_id);
    setBranchFormData({
      branch_name: branch.branch_name,
      branch_email: branch.branch_email,
      contact_number: branch.contact_number,
      address: branch.address,
      status: branch.status
    });
    setBranchFormError('');
    setIsBranchFormOpen(true);
  };

  const handleBranchSubmit = async () => {
    if (!branchFormData.branch_name || !branchFormData.branch_email || !branchFormData.contact_number) {
      setBranchFormError('Please fill in required fields');
      return;
    }

    setIsCreatingBranch(true);
    setBranchFormError('');
    try {
      const token = localStorage.getItem('access_token');
      const isEditing = !!editBranchId;
      const url = isEditing
        ? `https://testing.staffly.space/company-branches/${editBranchId}`
        : 'https://testing.staffly.space/company-branches';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...(isEditing ? { branch_id: editBranchId } : { company_id: selectedBranchCompanyId }),
          ...branchFormData
        })
      });

      if (response.ok) {
        setIsBranchFormOpen(false);
        setEditBranchId(null);
        setBranchFormData({ branch_name: '', branch_email: '', contact_number: '', address: '', status: true });
        if (selectedBranchCompanyId) fetchBranches(selectedBranchCompanyId);
        alert(isEditing ? 'Branch updated successfully!' : 'Branch created successfully!');
      } else {
        const data = await response.json();
        setBranchFormError(data.message || 'Failed to process request');
      }
    } catch (err) {
      setBranchFormError('Network error. Please try again.');
    } finally {
      setIsCreatingBranch(false);
    }
  };

  const handleDeleteClick = async (companyId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to archive "${name}"? This will move it to the deleted records.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        alert('Company archived successfully.');
        fetchCompanies();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to archive company.');
      }
    } catch (err) {
      console.error('Delete request failed');
      alert('Network error. Please try again.');
    }
  };

  const handleStatusToggle = async (companyId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      const newStatus = !currentStatus;

      const response = await fetch(`https://testing.staffly.space/companies/${companyId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          company_id: companyId,
          status: newStatus
        })
      });

      if (response.ok) {
        fetchCompanies();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update company status');
      }
    } catch (err) {
      console.error('Status update failed');
      alert('Network error. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.company_name || !formData.company_email || !formData.contact_number) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const isEditing = !!editCompanyId;
      const url = isEditing
        ? `https://testing.staffly.space/companies/${editCompanyId}`
        : 'https://testing.staffly.space/companies';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          ...(isEditing ? { company_id: editCompanyId } : {}),
          ...formData
        }),
      });

      // Simulation mode for dev bypass token
      if (token === 'dev_bypass_token') {
        setTimeout(() => {
          setIsModalOpen(false);
          setEditCompanyId(null);
          const simulatedCompany = {
            ...formData,
            company_id: isEditing ? editCompanyId : Math.floor(Math.random() * 1000) + 100,
            created_at: new Date().toISOString()
          };
          
          if (!isEditing) {
            setCompanies(prev => [simulatedCompany, ...prev]);
          } else {
            setCompanies(prev => prev.map(c => c.company_id === editCompanyId ? simulatedCompany : c));
          }
          
          setFormData({ company_name: '', company_email: '', contact_number: '', address: '', gst_no: '', status: true });
          alert(`Dev Mode: Company ${isEditing ? 'updated' : 'created'} successfully (Simulated)`);
          setIsLoading(false);
        }, 800);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        setEditCompanyId(null);
        setFormData({
          company_name: '',
          company_email: '',
          contact_number: '',
          address: '',
          gst_no: '',
          status: true
        });
        fetchCompanies();
        alert(isEditing ? 'Company updated successfully!' : 'Company created successfully!');
      } else {
        if (response.status === 401) {
          setError('Invalid or expired token. Please log out and sign in using your real OTP.');
        } else {
          setError(data.message || data.detail || `Failed to ${isEditing ? 'update' : 'create'} company`);
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 min-h-screen">

      {/* Header Card */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 text-left">
          <div className="p-2 border border-slate-200 rounded-lg bg-slate-50">
            <Briefcase className="h-6 w-6 text-slate-800" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight text-left">Company Management</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* View Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-[480px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
              <DialogHeader className="bg-sky-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                <div className="bg-sky-500 p-3 rounded-xl shadow-lg shadow-sky-100">
                  <Eye className="h-6 w-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-800">Business Profile</DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 font-medium">Full diagnostic and administrative records.</DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6 bg-white text-left">
                {isLoadingView ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 italic">Retrieving profile...</p>
                  </div>
                ) : viewError ? (
                  <div className="p-4 bg-rose-50 text-rose-600 text-center rounded-xl font-bold text-xs border border-rose-100 italic">
                    {viewError}
                  </div>
                ) : viewData ? (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Name</p>
                      <p className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-1">{viewData.company_name}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database ID</p>
                      <code className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-500">#{viewData.company_id}</code>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Email</p>
                      <p className="text-sm font-bold text-slate-900">{viewData.company_email}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact number</p>
                      <p className="text-sm font-bold text-slate-900">{viewData.contact_number}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${viewData.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {viewData.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created on</p>
                      <p className="text-[11px] font-medium text-slate-600">{viewData.created_at ? new Date(viewData.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="col-span-2 space-y-1 pt-2 border-t border-slate-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Address</p>
                      <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{viewData.address || 'No address provided'}"</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GST compliance NO.</p>
                      <p className="text-sm font-black text-slate-950 tracking-tight">{viewData.gst_no || 'NOT REGISTERED'}</p>
                    </div>
                  </div>
                ) : null}

                <div className="pt-4 text-center border-t border-slate-50">
                  <Button
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-12 h-11 w-full"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close Record
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Branches Modal */}
          <Dialog open={isBranchModalOpen} onOpenChange={setIsBranchModalOpen}>
            <DialogContent className="max-w-[700px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
              <DialogHeader className="bg-emerald-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left border-b border-emerald-100/50">
                <div className="bg-emerald-500 p-3 rounded-xl shadow-lg shadow-emerald-100">
                  <MapPin className="h-6 w-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-800">Branch Network</DialogTitle>
                  <DialogDescription className="text-xs text-emerald-700 font-bold uppercase tracking-widest mt-0.5">Location Registry - ID: {selectedBranchCompanyId}</DialogDescription>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <div className="flex items-center gap-1.5 bg-emerald-100/50 p-1 rounded-lg">
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest pl-1.5">Status:</span>
                    <Select value={branchStatusFilter} onValueChange={(val: any) => setBranchStatusFilter(val)}>
                      <SelectTrigger className="h-7 w-[80px] border-none shadow-none bg-transparent font-bold text-emerald-900 focus:ring-0 text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl shadow-lg border-emerald-100">
                        <SelectItem value="none" className="font-semibold cursor-pointer text-xs">All</SelectItem>
                        <SelectItem value="true" className="font-semibold cursor-pointer text-xs">Active</SelectItem>
                        <SelectItem value="false" className="font-semibold cursor-pointer text-xs">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1.5 bg-emerald-100/50 p-1 rounded-lg">
                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest pl-1.5">Archived:</span>
                    <Select value={branchIncludeDeleted} onValueChange={(val: any) => setBranchIncludeDeleted(val)}>
                      <SelectTrigger className="h-7 w-[80px] border-none shadow-none bg-transparent font-bold text-emerald-900 focus:ring-0 text-[10px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl shadow-lg border-emerald-100">
                        <SelectItem value="false" className="font-semibold cursor-pointer text-xs">Hide</SelectItem>
                        <SelectItem value="true" className="font-semibold cursor-pointer text-xs">Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => {
                      setEditBranchId(null);
                      setBranchFormData({ branch_name: '', branch_email: '', contact_number: '', address: '', status: true });
                      setBranchFormError('');
                      setIsBranchFormOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-9 px-4 font-bold transition-all active:scale-95"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Add
                  </Button>
                </div>
              </DialogHeader>

              <div className="p-0 bg-white text-left">
                {isLoadingBranches ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 italic">Syncing regional databases...</p>
                  </div>
                ) : branchError ? (
                  <div className="p-10 text-center">
                    <p className="text-rose-500 font-bold">{branchError}</p>
                  </div>
                ) : branches.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-50/30">
                    <Store className="h-12 w-12 text-slate-200 mb-3" />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">No localized branches recorded.</p>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow className="border-b border-emerald-50">
                          <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-6">Branch Identity</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Localization</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Status</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest pr-6 text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {branches.map((branch) => (
                          <TableRow key={branch.branch_id} className="hover:bg-emerald-50/30 transition-colors border-b border-emerald-50/50">
                            <TableCell className="pl-6 py-4">
                              <p className="text-sm font-bold text-slate-900">{branch.branch_name}</p>
                              <p className="text-[10px] font-bold text-slate-400">#{branch.branch_id}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-xs font-bold text-slate-700">{branch.branch_email}</p>
                              <p className="text-[11px] font-medium text-slate-500">{branch.contact_number}</p>
                            </TableCell>
                            <TableCell>
                              <p className="text-xs font-bold text-slate-600 italic">"{branch.address || 'N/A'}"</p>
                            </TableCell>
                            <TableCell className="pl-2">
                              <button
                                onClick={() => handleBranchStatusToggle(branch.branch_id, branch.status)}
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${branch.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                                title={branch.status ? "Deactivate Branch" : "Activate Branch"}
                              >
                                {branch.status ? 'Active' : 'Inactive'}
                              </button>
                            </TableCell>
                            <TableCell className="pr-6 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewBranchClick(branch.branch_id)}
                                  className="text-slate-400 hover:text-sky-600 transition-colors"
                                  title="View Branch Profile"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleShowBranchAdmins(branch)}
                                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                                  title="View Branch Leaders"
                                >
                                  <Shield className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleAssignAdminClick(branch.branch_id)}
                                  className="text-slate-400 hover:text-orange-500 transition-colors"
                                  title="Assign Admin"
                                >
                                  <UserPlus className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEditBranchClick(branch)}
                                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                                  title="Edit Branch"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleBranchDelete(branch.branch_id, branch.branch_name)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Archive Branch"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <Button
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-10 h-10 shadow-lg shadow-slate-200"
                    onClick={() => setIsBranchModalOpen(false)}
                  >
                    Close Registry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create Branch Modal */}
          <Dialog open={isBranchFormOpen} onOpenChange={setIsBranchFormOpen}>
            <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
              <DialogHeader className="bg-emerald-600 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">
                  <MapPin className="h-6 w-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    {editBranchId ? 'Modify Regional Hub' : 'New Regional Hub'}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-emerald-100 font-bold uppercase tracking-widest mt-0.5">
                    {editBranchId ? `Updating Registry ID: ${editBranchId}` : `Location Provisioning - ID: ${selectedBranchCompanyId}`}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-6 bg-white space-y-4 text-left">
                <div className="space-y-1.5">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Local Branch Name *</Label>
                  <Input
                    placeholder="E.g., Head Branch"
                    className="bg-slate-50 border-slate-200 h-10 font-bold text-slate-900 focus-visible:ring-emerald-500"
                    value={branchFormData.branch_name}
                    onChange={(e) => setBranchFormData({ ...branchFormData, branch_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Regional Email *</Label>
                  <Input
                    placeholder="E.g., branch@company.com"
                    className="bg-slate-50 border-slate-200 h-10 font-bold text-slate-900 focus-visible:ring-emerald-500"
                    value={branchFormData.branch_email}
                    onChange={(e) => setBranchFormData({ ...branchFormData, branch_email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mobile/Tele *</Label>
                  <Input
                    placeholder="E.g., 9023635233"
                    className="bg-slate-50 border-slate-200 h-10 font-bold text-slate-900 focus-visible:ring-emerald-500"
                    value={branchFormData.contact_number}
                    onChange={(e) => setBranchFormData({ ...branchFormData, contact_number: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">Complete Location</Label>
                  <Input
                    placeholder="E.g., Mumbai, India"
                    className="bg-slate-50 border-slate-200 h-10 font-bold text-slate-900 focus-visible:ring-emerald-500"
                    value={branchFormData.address}
                    onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
                  />
                </div>

                {branchFormError && <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">{branchFormError}</p>}

                <div className="pt-2 grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-11 border-slate-200 font-bold text-slate-600 rounded-xl"
                    onClick={() => setIsBranchFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                    onClick={handleBranchSubmit}
                    disabled={isCreatingBranch}
                  >
                    {isCreatingBranch ? 'Saving Registry...' : (editBranchId ? 'Update Branch' : 'Add Branch')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Admins Modal */}
          <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
            <DialogContent className="max-w-[700px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
              <DialogHeader className="bg-slate-900 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                  <UserCircle className="h-6 w-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white">Administrative Access</DialogTitle>
                  <DialogDescription className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Corporate Governance - Company: {selectedAdminCompanyId}</DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-0 bg-white">
                {isLoadingAdmins ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400 italic">Authenticating admin records...</p>
                  </div>
                ) : adminError ? (
                  <div className="p-10 text-center">
                    <p className="text-rose-500 font-bold">{adminError}</p>
                  </div>
                ) : admins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-50/10">
                    <Users className="h-12 w-12 text-slate-200 mb-3" />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic font-bold">No registered administrators found.</p>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-slate-50 z-10">
                        <TableRow className="border-b border-slate-200">
                          <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-6">Profile</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Responsibility</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact Point</TableHead>
                          <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest pr-6">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {admins.map((admin) => (
                          <TableRow key={admin.user_id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                            <TableCell className="pl-6 py-4">
                              <div className="flex items-center gap-3 text-left">
                                <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 border border-white shadow-sm overflow-hidden text-xs">
                                  {admin.profile_photo ? <img src={admin.profile_photo} alt="P" className="h-full w-full object-cover" /> : admin.name?.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{admin.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">ID: {admin.employee_id || 'N/A'}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-left">
                              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{admin.designation || 'ADMIN'}</p>
                              <p className="text-[11px] font-bold text-emerald-600 uppercase">{admin.department || 'Management'}</p>
                            </TableCell>
                            <TableCell className="text-left">
                              <p className="text-[11px] font-bold text-slate-700">{admin.email}</p>
                              <p className="text-[10px] font-medium text-slate-400 italic">PH: {admin.phone}</p>
                            </TableCell>
                            <TableCell className="pr-6">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${admin.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {admin.is_active ? 'ONLINE' : 'OFFLINE'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="p-4 bg-slate-900 text-center flex items-center justify-between px-8">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[.25em]">Authorized Personnel Only</p>
                  <Button
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold rounded-xl px-10 h-10 transition-all active:scale-95"
                    onClick={() => setIsAdminModalOpen(false)}
                  >
                    Seal Records
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Summary Modal */}
          <Dialog open={isSummaryModalOpen} onOpenChange={setIsSummaryModalOpen}>
            <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
              <DialogHeader className="bg-orange-600 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">
                  <BarChart3 className="h-6 w-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">Executive Summary</DialogTitle>
                  <DialogDescription className="text-xs text-orange-200 font-bold uppercase tracking-widest mt-0.5">Performance Metrics - ID: {selectedSummaryCompanyId}</DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-6 bg-white space-y-6 text-left">
                {isLoadingSummary ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-8 h-8 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregating Statistics...</p>
                  </div>
                ) : summaryError ? (
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-center font-bold text-xs">
                    {summaryError}
                  </div>
                ) : summaryData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-tight">Total Network</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{summaryData.total_branches}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 italic">Branches Total</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50 text-center">
                        <p className="text-[10px] font-black text-emerald-600/70 uppercase tracking-widest mb-1 leading-tight">Live Status</p>
                        <p className="text-3xl font-black text-emerald-700 tracking-tighter">{summaryData.active_branches}</p>
                        <p className="text-[9px] font-bold text-emerald-600/70 uppercase mt-1 italic">Connected Nodes</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-tight font-black">Admin Coverage</p>
                        </div>
                        <p className="text-sm font-black text-slate-900">{summaryData.branches_with_admin} <span className="text-[10px] text-slate-400">Branches</span></p>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl border border-rose-100/30">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                          <p className="text-xs font-bold text-slate-700 uppercase tracking-tight font-black">Admin Gap</p>
                        </div>
                        <p className="text-sm font-black text-rose-700">{summaryData.branches_without_admin} <span className="text-[10px] text-rose-300">Vacant</span></p>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-indigo-900 rounded-2xl shadow-xl shadow-indigo-100">
                        <div>
                          <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[.2em] mb-0.5">Staffing Level</p>
                          <p className="text-xs font-bold text-white uppercase tracking-tight">Total Assigned Admins</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                          <p className="text-xl font-black text-white">{summaryData.total_assigned_admins}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <Button
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg shadow-slate-200 transition-all active:scale-95"
                  onClick={() => setIsSummaryModalOpen(false)}
                >
                  Confirm Analytics
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
                      ) : admins.length === 0 ? (
                        <div className="p-4 text-center text-xs font-bold text-slate-400 italic">No admins available for company.</div>
                      ) : admins.map((admin) => (
                        <SelectItem key={admin.user_id} value={admin.user_id.toString()} className="font-semibold cursor-pointer">
                          {admin.name} ({admin.designation || 'Admin'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-slate-400 font-medium pl-1 italic">Listing corporate admins for Company #{selectedBranchCompanyId}</p>
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

          {/* Branch View Modal */}
          <Dialog open={isBranchViewOpen} onOpenChange={setIsBranchViewOpen}>
            <DialogContent className="max-w-[420px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
              <DialogHeader className="bg-sky-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                <div className="bg-sky-500 p-3 rounded-xl shadow-lg shadow-sky-100">
                  <Store className="h-6 w-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-800">Regional Profile</DialogTitle>
                  <DialogDescription className="text-xs text-sky-700 font-bold uppercase tracking-widest mt-0.5">Administrative Insights Hub</DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-6 bg-white text-left">
                {isLoadingBranchView ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Syncing local records...</p>
                  </div>
                ) : branchViewError ? (
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-center font-bold text-xs border border-rose-100 italic">
                    {branchViewError}
                  </div>
                ) : branchViewData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Branch Identity</p>
                        <p className="text-sm font-bold text-slate-900 border-b border-sky-50 pb-1">{branchViewData.branch_name}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System ID</p>
                        <code className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-black text-slate-500">#{branchViewData.branch_id}</code>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Contact</p>
                        <p className="text-xs font-bold text-slate-700 truncate">{branchViewData.branch_email}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Voice Link</p>
                        <p className="text-xs font-bold text-slate-700">{branchViewData.contact_number}</p>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-sky-50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${branchViewData.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {branchViewData.status ? 'Operational' : 'Restricted'}
                        </span>
                      </div>
                      <div className="space-y-1 text-right pt-2 border-t border-sky-50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Provisioned On</p>
                        <p className="text-xs font-black text-slate-600">{branchViewData.created_at ? new Date(branchViewData.created_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <MapPin className="h-2.5 w-2.5 text-sky-500" /> Regional Localization
                      </p>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{branchViewData.address || 'No address provided in registry'}"</p>
                    </div>
                  </div>
                ) : null}

                <Button
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl h-11 w-full shadow-lg shadow-sky-100 transition-all active:scale-95 border-b-2 border-slate-950"
                  onClick={() => setIsBranchViewOpen(false)}
                >
                  Confirm & Seal
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create/Edit Modal */}
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
              setEditCompanyId(null);
              setFormData({ company_name: '', company_email: '', contact_number: '', address: '', gst_no: '', status: true });
            }
          }}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditCompanyId(null);
                  setFormData({ company_name: '', company_email: '', contact_number: '', address: '', gst_no: '', status: true });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 flex items-center gap-2"
              >
                <Plus className="mr-1 h-4 w-4" /> Company
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[480px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
              <DialogHeader className="bg-orange-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                <div className="bg-orange-500 p-3 rounded-xl shadow-lg shadow-orange-100">
                  {editCompanyId ? <Edit className="h-6 w-6 text-white" strokeWidth={3} /> : <Plus className="h-6 w-6 text-white" strokeWidth={3} />}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 leading-tight">
                    {editCompanyId ? 'Update Company' : 'Create New Company'}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-700 font-medium mt-0.5">Fill in the required fields marked with *</DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4 text-left">
                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900 uppercase tracking-tight">Company Name *</Label>
                  <Input
                    placeholder="E.g., Amazon"
                    className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900 uppercase tracking-tight">Company Email *</Label>
                  <Input
                    placeholder="E.g., amazon@gmail.com"
                    className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                    value={formData.company_email}
                    onChange={(e) => setFormData({ ...formData, company_email: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900 uppercase tracking-tight">Contact Number *</Label>
                  <Input
                    placeholder="E.g., 9023635263"
                    className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900 uppercase tracking-tight">Address / City *</Label>
                  <Input
                    placeholder="E.g., Mumbai"
                    className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900 uppercase tracking-tight">GST Number</Label>
                  <Input
                    placeholder="E.g., 27QPDIE7385Y5Z1"
                    className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                    value={formData.gst_no}
                    onChange={(e) => setFormData({ ...formData, gst_no: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-900 uppercase tracking-tight">Status *</Label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === true}
                        onChange={() => setFormData({ ...formData, status: true })}
                        className="h-4 w-4 text-slate-900 border-slate-400 focus:ring-slate-900 accent-slate-800"
                      />
                      <span className="text-sm font-bold text-slate-900">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === false}
                        onChange={() => setFormData({ ...formData, status: false })}
                        className="h-4 w-4 text-slate-900 border-slate-400 focus:ring-slate-900 accent-slate-800"
                      />
                      <span className="text-sm font-bold text-slate-900">Inactive</span>
                    </label>
                  </div>
                </div>

                {error && <p className="text-xs font-bold text-rose-500 text-center animate-pulse">{error}</p>}

                <div className="flex items-center justify-center gap-6 pt-4 pb-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-orange-50 hover:bg-orange-100 text-slate-900 border-none font-bold rounded-lg px-8 h-10 w-[140px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg px-6 h-10 w-[180px]"
                  >
                    {isLoading ? 'Processing...' : (editCompanyId ? 'Save Changes' : '+ Create Company')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-4 border-b-0 space-y-0">
          <h2 className="text-xl font-bold text-slate-800">Companies</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-[200px] rounded-lg border-slate-200 bg-white placeholder:text-slate-400 text-sm focus-visible:ring-orange-400"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Status:</span>
              <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                <SelectTrigger className="h-7 w-[90px] border-none shadow-none bg-transparent font-bold text-slate-800 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-lg border-slate-100">
                  <SelectItem value="none" className="font-semibold cursor-pointer">All</SelectItem>
                  <SelectItem value="true" className="font-semibold cursor-pointer">Active</SelectItem>
                  <SelectItem value="false" className="font-semibold cursor-pointer">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Archived:</span>
              <Select value={includeDeleted} onValueChange={(val: any) => setIncludeDeleted(val)}>
                <SelectTrigger className="h-7 w-[90px] border-none shadow-none bg-transparent font-bold text-slate-800 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-lg border-slate-100">
                  <SelectItem value="none" className="font-semibold cursor-pointer">Hide</SelectItem>
                  <SelectItem value="true" className="font-semibold cursor-pointer">Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full relative overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow className="border-none">
                  <TableHead className="w-[50px] pl-4"><Checkbox className="border-slate-700 bg-white/50 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white data-[state=checked]:border-slate-800" /></TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm py-4">Company ID</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm">Company Name</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm">Company Type</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm">Company Email</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm">Contact Number</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm">PAN</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm">Status</TableHead>
                  <TableHead className="text-center text-slate-900 font-bold whitespace-nowrap text-sm pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingList ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Parsing Company Records...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : companies.filter(c => (c.company_name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((company) => (
                  <TableRow key={company.company_id} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <TableCell className="pl-4"><Checkbox className="border-slate-400 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white data-[state=checked]:border-slate-800" /></TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm py-5">#ID-{company.company_id}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">{company.company_name}</TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm">Private Limited</TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm">{company.company_email}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">{company.contact_number}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">{company.gst_no || 'N/A'}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleStatusToggle(company.company_id, company.status)}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${company.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                      >
                        {company.status ? 'Active' : 'Inactive'}
                      </button>
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="text-slate-700 hover:text-blue-600 transition-colors p-1"
                          title="View"
                          onClick={() => handleViewClick(company.company_id)}
                        >
                          <Eye className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                        <button
                          className="text-slate-700 hover:text-orange-600 transition-colors p-1"
                          title="Summary"
                          onClick={() => handleSummaryClick(company.company_id)}
                        >
                          <BarChart3 className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                        <button
                          className="text-slate-700 hover:text-blue-600 transition-colors p-1"
                          title="Admins"
                          onClick={() => handleAdminsClick(company.company_id)}
                        >
                          <Users className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                        <button
                          className="text-slate-700 hover:text-emerald-600 transition-colors p-1"
                          title="Branches"
                          onClick={() => handleBranchesClick(company.company_id)}
                        >
                          <Store className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                        <button
                          className="text-slate-700 hover:text-emerald-600 transition-colors p-1"
                          title="Edit"
                          onClick={() => handleEditClick(company)}
                        >
                          <Edit className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                        <button
                          className="text-slate-700 hover:text-red-600 transition-colors p-1"
                          title="Delete"
                          onClick={() => handleDeleteClick(company.company_id, company.company_name)}
                        >
                          <Trash2 className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                        <button
                          className={`transition-colors p-1 ${company.status ? 'text-slate-700 hover:text-orange-600' : 'text-orange-600 hover:text-slate-900'}`}
                          title={company.status ? "Deactivate" : "Activate"}
                          onClick={() => handleStatusToggle(company.company_id, company.status)}
                        >
                          <XCircle className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end p-4 py-3 bg-slate-50/50 border-t border-slate-200 gap-2 text-sm text-slate-400 font-medium">
            <button className="flex items-center hover:text-slate-600 transition-colors disabled:opacity-50 pr-2 tracking-tight" disabled>&larr; Previous</button>
            <div className="flex items-center gap-1">
              <button className="h-7 w-7 rounded bg-slate-800 text-white font-bold text-xs flex items-center justify-center">1</button>
              <button className="h-7 w-7 rounded hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">2</button>
              <button className="h-7 w-7 rounded hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">3</button>
              <span className="px-1 text-slate-500 font-bold text-xs">...</span>
              <button className="h-7 w-7 rounded hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">67</button>
              <button className="h-7 w-7 rounded hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center transition-colors">68</button>
            </div>
            <button className="flex items-center hover:text-slate-600 transition-colors pl-2 tracking-tight">Next &rarr;</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;
