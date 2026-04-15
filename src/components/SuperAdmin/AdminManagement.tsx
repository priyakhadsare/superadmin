import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Eye, Edit, Trash2, XCircle, Search, Plus, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
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

interface Admin {
  user_id: number;
  employee_id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  address: string;
  role: string;
  gender: string;
  is_active: boolean;
  shift_type: string;
  employee_type: string;
  created_at: string;
}

const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editAdminId, setEditAdminId] = useState<number | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAdminId, setDeleteAdminId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    email: '',
    department: '',
    designation: '',
    phone: '',
    address: {
      flat: '',
      building: '',
      area: '',
      city: '',
      state: '',
      pincode: ''
    },
    pan_card: '',
    aadhar_card: '',
    gender: 'Male',
    employee_type: '',
    shift_type: ''
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [viewError, setViewError] = useState('');

  const fetchAdmins = async () => {
    setIsLoadingList(true);
    setListError('');
    try {
      const token = localStorage.getItem('access_token');
 
      if (token === 'dev_bypass_token') {
        setAdmins([]);
        setIsLoadingList(false);
        return;
      }
 
      const response = await fetch('https://testing.staffly.space/super-admin/admins', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      const data = await response.json();
      if (response.ok) {
        setAdmins(Array.isArray(data) ? data : []);
      } else {
        setListError(data.message || data.detail || 'Failed to fetch admins');
      }
    } catch (err) {
      setListError('Network error. Please try again.');
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleViewClick = async (adminId: number) => {
    setViewData(null);
    setViewError('');
    setIsViewModalOpen(true);

    try {
      const token = localStorage.getItem('access_token');
 
      if (token === 'dev_bypass_token') {
        const admin = admins.find(a => a.user_id === adminId) || admins[0];
        setViewData(admin);
        return;
      }
 
      const response = await fetch(`https://testing.staffly.space/super-admin/admins/${adminId}`, {
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
        setViewError(data.message || data.detail || 'Failed to fetch admin details');
      }
    } catch (err) {
      setViewError('Network error. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleEditClick = (admin: any) => {
    setEditAdminId(admin.user_id);
    setFormData({
      employee_id: admin.employee_id || '',
      name: admin.name || '',
      email: admin.email || '',
      department: admin.department || '',
      designation: admin.designation || '',
      phone: admin.phone || '',
      address: {
        flat: '', building: '', area: '', city: '', state: '', pincode: ''
      },
      pan_card: admin.pan_card || '',
      aadhar_card: admin.aadhar_card || '',
      gender: admin.gender || 'Male',
      employee_type: admin.employee_type || '',
      shift_type: admin.shift_type || ''
    });
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    const fullAddress = [
      formData.address.flat,
      formData.address.building,
      formData.address.area,
      formData.address.city,
      formData.address.state,
      formData.address.pincode
    ].filter(Boolean).join(', ');

    const isEditing = !!editAdminId;
    const url = isEditing
      ? `https://testing.staffly.space/super-admin/admins/${editAdminId}`
      : 'https://testing.staffly.space/super-admin/admins';
    const method = isEditing ? 'PUT' : 'POST';

    const payload = isEditing ? {
      name: formData.name,
      email: formData.email
    } : {
      name: formData.name,
      email: formData.email,
      employee_id: formData.employee_id,
      department: formData.department,
      designation: formData.designation,
      phone: formData.phone,
      address: fullAddress,
      gender: formData.gender.toLowerCase(),
      shift_type: formData.shift_type.toLowerCase(),
      employee_type: formData.employee_type.toLowerCase(),
      pan_card: formData.pan_card,
      aadhar_card: formData.aadhar_card
    };

    try {
      const token = localStorage.getItem('access_token');
 
      // Developer Simulation Mode
      if (token === 'dev_bypass_token') {
        setTimeout(() => {
          setIsOpen(false);
          setEditAdminId(null);
          const simulatedAdmin = {
            ...payload,
            user_id: isEditing ? editAdminId : Math.floor(Math.random() * 1000) + 100,
            is_active: true,
            created_at: new Date().toISOString()
          } as any;
          if (!isEditing) {
            setAdmins(prev => [simulatedAdmin, ...prev]);
          } else {
            setAdmins(prev => prev.map(a => a.user_id === editAdminId ? { ...a, ...simulatedAdmin } : a));
          }
          setFormData({
            employee_id: '', name: '', email: '', department: '', designation: '', phone: '', address: { flat: '', building: '', area: '', city: '', state: '', pincode: '' }, pan_card: '', aadhar_card: '', gender: 'Male', employee_type: '', shift_type: ''
          });
          alert(`Dev Mode: Admin ${isEditing ? 'updated' : 'created'} successfully (Simulated)`);
          setIsLoading(false);
        }, 800);
        return;
      }
 
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        setIsOpen(false);
        setEditAdminId(null);
        fetchAdmins();
        setFormData({
          employee_id: '', name: '', email: '', department: '', designation: '', phone: '', address: { flat: '', building: '', area: '', city: '', state: '', pincode: '' }, pan_card: '', aadhar_card: '', gender: 'Male', employee_type: '', shift_type: ''
        });
        alert(isEditing ? 'Admin updated successfully!' : 'Admin created successfully!');
      } else {
        setError(data.message || data.detail || `Failed to ${isEditing ? 'update' : 'create'} admin`);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (adminId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
 
      // Developer Simulation Mode
      if (token === 'dev_bypass_token') {
        setAdmins(prev => prev.map(a => a.user_id === adminId ? { ...a, is_active: !currentStatus } : a));
        alert(`Dev Mode: Admin status updated (Simulated)`);
        return;
      }
 
      const response = await fetch(`https://testing.staffly.space/super-admin/admins/${adminId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (response.ok) {
        alert(`Admin status ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
        fetchAdmins();
      } else {
        const data = await response.json();
        alert(data.message || data.detail || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  const confirmDelete = (adminId: number) => {
    setDeleteAdminId(adminId);
    setDeleteError('');
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteAdminId) return;
    setIsDeleting(true);
    setDeleteError('');

    try {
      const token = localStorage.getItem('access_token');
 
      // Developer Simulation Mode
      if (token === 'dev_bypass_token') {
        setTimeout(() => {
          setIsDeleteDialogOpen(false);
          setDeleteAdminId(null);
          setAdmins(prev => prev.filter(a => a.user_id !== deleteAdminId));
          alert('Dev Mode: Admin deleted successfully (Simulated)');
          setIsDeleting(false);
        }, 500);
        return;
      }
 
      const response = await fetch(`https://testing.staffly.space/super-admin/admins/${deleteAdminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await response.json();

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setDeleteAdminId(null);
        alert(data.detail || 'Admin deleted successfully');
        fetchAdmins();
      } else {
        setDeleteError(data.detail || data.message || 'Failed to delete admin');
      }
    } catch (err) {
      setDeleteError('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 min-h-screen">

      <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-slate-200 rounded-lg bg-slate-50">
              <Briefcase className="h-6 w-6 text-slate-800" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Admin Management</h1>
          </div>

          <div className="flex items-center gap-3 text-left">
            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
                <DialogHeader className="bg-rose-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                  <div className="bg-rose-500 p-3 rounded-xl shadow-lg shadow-rose-100">
                    <Trash2 className="h-8 w-8 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-slate-900">Delete Admin</DialogTitle>
                    <DialogDescription className="text-xs text-rose-600 font-bold mt-0.5">This action cannot be undone</DialogDescription>
                  </div>
                </DialogHeader>

                <div className="p-6 space-y-4">
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed text-center px-4">
                    Are you sure you want to permanently delete this administrator from your system?
                  </p>

                  {deleteError && (
                    <div className="p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg text-center border border-rose-100">
                      {deleteError}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-slate-50 hover:bg-slate-100 border-none font-bold text-slate-600 h-11"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold h-11 shadow-lg shadow-rose-100"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
              <DialogContent className="max-w-[480px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
                <DialogHeader className="bg-sky-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                  <div className="bg-sky-500 p-3 rounded-xl shadow-lg shadow-sky-100">
                    <Eye className="h-8 w-8 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-slate-800">Administrator Profile</DialogTitle>
                    <DialogDescription className="text-sm text-slate-500 font-medium">Detailed user information</DialogDescription>
                  </div>
                </DialogHeader>

                <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-left">
                  {viewError ? (
                    <div className="p-4 bg-rose-50 text-rose-600 text-center rounded-xl font-bold text-sm border border-rose-100 italic">
                      {viewError}
                    </div>
                  ) : viewData ? (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                        <p className="text-sm font-bold text-slate-900">{viewData.name || 'N/A'}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee ID</p>
                        <p className="text-sm font-bold text-slate-900">{viewData.employee_id || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                        <p className="text-sm font-bold text-slate-900">{viewData.email || 'N/A'}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                        <p className="text-sm font-bold text-slate-900">{viewData.phone || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</p>
                        <p className="text-sm font-bold text-slate-900">{viewData.department || 'N/A'}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designation</p>
                        <p className="text-sm font-bold text-slate-900">{viewData.designation || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</p>
                        <p className="text-sm font-bold text-slate-900">{viewData.role || 'N/A'}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</p>
                        <p className="text-sm font-bold text-slate-900 capitalize">{viewData.gender || 'N/A'}</p>
                      </div>
                      <div className="col-span-2 space-y-1 pt-2 border-t border-slate-50">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanent Address</p>
                        <p className="text-sm font-bold text-slate-900">{viewData.address || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-slate-500">Retrieving profile...</p>
                    </div>
                  )}

                  <div className="flex items-center justify-center pt-2">
                    <Button
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg px-8 h-10 w-full"
                      onClick={() => setIsViewModalOpen(false)}
                    >
                      Close Profile
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Create/Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) {
                setEditAdminId(null);
                setFormData({
                  employee_id: '', name: '', email: '', department: '', designation: '', phone: '', address: { flat: '', building: '', area: '', city: '', state: '', pincode: '' }, pan_card: '', aadhar_card: '', gender: 'Male', employee_type: '', shift_type: ''
                });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 flex items-center gap-2 font-bold">
                  <Plus className="h-4 w-4" /> Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[480px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
                <DialogHeader className="bg-orange-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                  <div className="bg-orange-500 p-3 rounded-xl shadow-lg shadow-orange-100">
                    <Plus className="h-8 w-8 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                      {editAdminId ? 'Edit Administrator' : 'Create Administrator'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500 font-medium">
                      Complete the profile information below.
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4 text-left">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-slate-900">Employee ID *</Label>
                    <Input
                      placeholder="E.g. EMP001"
                      className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                      value={formData.employee_id}
                      onChange={(e) => handleInputChange('employee_id', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-slate-900">Name *</Label>
                    <Input
                      placeholder="E.g., John Doe"
                      className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-bold text-slate-900">Email Address *</Label>
                    <Input
                      placeholder="E.g., contact@company.com"
                      className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  {!editAdminId && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-bold text-slate-900">Department *</Label>
                          <Input
                            placeholder="Engineering"
                            className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                            value={formData.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-bold text-slate-900">Designation *</Label>
                          <Input
                            placeholder="Software Engineer"
                            className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                            value={formData.designation}
                            onChange={(e) => handleInputChange('designation', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-bold text-slate-900">Phone Number *</Label>
                        <Input
                          placeholder="+91-1234567890"
                          className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>

                      <div className="space-y-4 pt-2 border-t border-slate-100">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Office Address</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-800">Flat / Office No.</Label>
                            <Input
                              placeholder="E.g., 401"
                              className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-sm focus-visible:ring-orange-400"
                              value={formData.address.flat}
                              onChange={(e) => handleInputChange('address.flat', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-800">Building Name</Label>
                            <Input
                              placeholder="E.g., Tech Tower"
                              className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-sm focus-visible:ring-orange-400"
                              value={formData.address.building}
                              onChange={(e) => handleInputChange('address.building', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-800">City</Label>
                            <Input
                              placeholder="E.g., Mumbai"
                              className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-sm focus-visible:ring-orange-400"
                              value={formData.address.city}
                              onChange={(e) => handleInputChange('address.city', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-800">Pincode</Label>
                            <Input
                              placeholder="E.g., 400001"
                              className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-sm focus-visible:ring-orange-400"
                              value={formData.address.pincode}
                              onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-bold text-slate-900">Gender *</Label>
                          <Select value={formData.gender} onValueChange={(v) => handleInputChange('gender', v)}>
                            <SelectTrigger className="bg-orange-50/50 border-slate-200 rounded-lg h-10 font-bold">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="Male" className="font-semibold">Male</SelectItem>
                              <SelectItem value="Female" className="font-semibold">Female</SelectItem>
                              <SelectItem value="Other" className="font-semibold">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-bold text-slate-900">Shift *</Label>
                          <Select value={formData.shift_type} onValueChange={(v) => handleInputChange('shift_type', v)}>
                            <SelectTrigger className="bg-orange-50/50 border-slate-200 rounded-lg h-10 font-bold">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="morning" className="font-semibold">Morning</SelectItem>
                              <SelectItem value="evening" className="font-semibold">Evening</SelectItem>
                              <SelectItem value="night" className="font-semibold">Night</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {error && <p className="text-xs font-bold text-rose-500 text-center animate-pulse">{error}</p>}

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      className="flex-1 bg-slate-50 hover:bg-slate-100 border-none font-bold text-slate-600 h-11"
                      onClick={() => setIsOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 shadow-lg shadow-orange-100"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : (editAdminId ? 'Update Admin' : 'Create Admin')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-4 border-b-0 space-y-0">
          <CardTitle className="text-xl font-bold text-slate-800">Administrator List</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search administrators..."
                className="pl-9 h-9 w-[280px] rounded-lg border-slate-200 bg-white placeholder:text-slate-400 text-sm focus:ring-orange-400"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full relative overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-none">
                  <TableHead className="w-[50px] pl-4"><Checkbox /></TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm py-4 uppercase tracking-wider">Emp ID</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm uppercase tracking-wider">Full Name</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm uppercase tracking-wider">Department</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm uppercase tracking-wider">Email</TableHead>
                  <TableHead className="text-slate-900 font-bold whitespace-nowrap text-sm uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-center text-slate-900 font-bold whitespace-nowrap text-sm pr-4 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingList ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading data...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : listError ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center text-rose-500 font-bold uppercase text-xs">{listError}</TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center text-slate-500 font-bold uppercase text-xs">No administrators found</TableCell>
                  </TableRow>
                ) : admins.map((admin) => (
                  <TableRow key={admin.user_id} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <TableCell className="pl-4"><Checkbox /></TableCell>
                    <TableCell className="font-bold text-slate-800 text-sm py-5 uppercase">{admin.employee_id}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">{admin.name}</TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm">{admin.department}</TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm lowercase">{admin.email}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider ${admin.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleViewClick(admin.user_id)} className="text-slate-700 hover:text-blue-600 transition-colors p-1"><Eye className="h-5 w-5" /></button>
                        <button onClick={() => handleEditClick(admin)} className="text-slate-700 hover:text-emerald-600 transition-colors p-1"><Edit className="h-5 w-5" /></button>
                        <button onClick={() => confirmDelete(admin.user_id)} className="text-slate-700 hover:text-red-600 transition-colors p-1"><Trash2 className="h-5 w-5" /></button>
                        <button
                          onClick={() => handleStatusToggle(admin.user_id, admin.is_active)}
                          className={`transition-colors p-1 ${admin.is_active ? 'text-slate-700 hover:text-orange-600' : 'text-emerald-500 hover:text-emerald-600'}`}
                        >
                          {admin.is_active ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
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
    </div>
  );
};

export default AdminManagement;
