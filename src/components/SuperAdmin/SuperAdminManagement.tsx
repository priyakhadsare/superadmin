import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SuperAdmin {
  super_admin_id: number;
  name: string;
  email: string;
  contact_no: string;
  gender: string;
  is_active: boolean;
  created_on: string;
}

const SuperAdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<SuperAdmin[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editAdminId, setEditAdminId] = useState<string | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState<SuperAdmin | null>(null);
  const [viewError, setViewError] = useState('');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAdminId, setDeleteAdminId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_no: '',
    gender: 'Male',
    password: ''
  });

  const fetchAdmins = async () => {
    setIsLoadingList(true);
    setListError('');
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://testing.staffly.space/super-admin/list', {
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
        setListError(data.message || data.detail || 'Failed to fetch super admins');
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

  const confirmDelete = (adminId: number) => {
    setDeleteAdminId(adminId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteAdminId) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/super-admin/delete/${deleteAdminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (response.ok) {
        setIsDeleteDialogOpen(false);
        setDeleteAdminId(null);
        fetchAdmins();
      } else {
        const data = await response.json();
        alert(data.message || data.detail || 'Failed to delete super admin');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewClick = async (adminId: number) => {
    setViewData(null);
    setViewError('');
    setIsViewModalOpen(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/super-admin/view/${adminId}`, {
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
        setViewError(data.message || data.detail || 'Failed to fetch super admin details');
      }
    } catch (err) {
      setViewError('Network error. Please try again.');
    }
  };

  const handleEditClick = (admin: SuperAdmin) => {
    setEditAdminId(admin.super_admin_id.toString());
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      contact_no: admin.contact_no || '',
      gender: admin.gender || 'Male',
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const isEditing = !!editAdminId;
      const url = isEditing
        ? `https://testing.staffly.space/super-admin/update/${editAdminId}`
        : 'https://testing.staffly.space/super-admin/create';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          contact_no: formData.contact_no,
          gender: formData.gender,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        setEditAdminId(null);
        setFormData({ name: '', email: '', contact_no: '', gender: 'Male', password: '' });
        fetchAdmins();
        alert(isEditing ? 'Super Admin updated successfully!' : 'Super Admin created successfully!');
      } else {
        setError(data.message || data.detail || `Failed to ${isEditing ? 'update' : 'create'} super admin`);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 text-left">
          <div className="bg-orange-100 dark:bg-orange-500/10 p-3 rounded-xl">
            <Briefcase className="h-6 w-6 text-orange-600 dark:text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Super Admin Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">Configure and oversee administrative access.</p>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditAdminId(null);
            setFormData({ name: '', email: '', contact_no: '', gender: 'Male', password: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-6 h-12 shadow-lg shadow-orange-200 dark:shadow-none transition-all duration-200 hover:scale-[1.02]">
              <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} /> Create Super Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
            <DialogHeader className="bg-orange-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
              <div className="bg-orange-500 p-3 rounded-xl shadow-lg shadow-orange-100">
                <Plus className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-800">
                  {editAdminId ? 'Edit Super Admin' : 'Create Super Admin'}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 font-medium">
                  Fill in the required fields marked with *
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4 bg-white text-left">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="E.g., Vipul Patil"
                  className="bg-orange-50/50 border-slate-200 h-11 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400 transition-all border-none shadow-inner"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vipulpatil@gmail.com"
                  className="bg-orange-50/50 border-slate-200 h-11 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400 transition-all border-none shadow-inner"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91-1234567890"
                  className="bg-orange-50/50 border-slate-200 h-11 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400 transition-all border-none shadow-inner"
                  value={formData.contact_no}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, contact_no: e.target.value })}
                />
              </div>

              {!editAdminId && (
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Set a secure password"
                    className="bg-orange-50/50 border-slate-200 h-11 rounded-xl text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400 transition-all border-none shadow-inner"
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1">Gender *</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                  <SelectTrigger className="h-11 bg-orange-50/50 border-none rounded-xl font-bold shadow-inner text-slate-800">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100">
                    <SelectItem value="Male" className="font-semibold cursor-pointer">Male</SelectItem>
                    <SelectItem value="Female" className="font-semibold cursor-pointer">Female</SelectItem>
                    <SelectItem value="Other" className="font-semibold cursor-pointer">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-xs font-bold text-rose-500 text-center animate-pulse">{error}</p>}

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  className="flex-1 bg-slate-50 hover:bg-slate-100 border-none font-bold text-slate-600 h-12 rounded-xl transition-all"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-orange-100 transition-all"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (editAdminId ? 'Save Changes' : 'Create Admin')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
            <DialogHeader className="bg-sky-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
              <div className="bg-sky-500 p-3 rounded-xl shadow-lg shadow-sky-100">
                <Eye className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-800">Super Admin Profile</DialogTitle>
                <DialogDescription className="text-sm text-slate-500 font-medium">Detailed administrative records.</DialogDescription>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4 bg-white text-left">
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin ID</p>
                    <code className="text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">ID-{viewData.super_admin_id}</code>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-bold text-slate-900">{viewData.email || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</p>
                    <p className="text-sm font-bold text-slate-900">{viewData.contact_no || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${viewData.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {viewData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">{viewData.gender || 'N/A'}</p>
                  </div>
                  <div className="col-span-2 space-y-1 pt-2 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Created At</p>
                    <p className="text-xs font-bold text-slate-600">{viewData.created_on ? new Date(viewData.created_on).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
                  <p className="text-sm font-bold text-slate-500 italic">Retrieving profile...</p>
                </div>
              )}

              <div className="pt-2 text-center">
                <Button
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-12 h-11 w-full transition-all"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close Record
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
            <DialogHeader className="bg-red-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
              <div className="bg-red-500 p-3 rounded-xl shadow-lg shadow-red-100">
                <Trash2 className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
              <div className="text-left">
                <DialogTitle className="text-2xl font-bold text-slate-800">Delete Super Admin</DialogTitle>
                <DialogDescription className="text-sm text-slate-500 font-medium">This action cannot be undone.</DialogDescription>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4 bg-white text-left">
              <p className="text-slate-700 font-bold text-center leading-relaxed">Are you absolutely sure you want to permanently revoke this super administrator's access?</p>
              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 bg-slate-50 hover:bg-slate-100 border-none font-bold text-slate-600 h-12 rounded-xl transition-all"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-red-100 transition-all"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Revoke'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-white rounded-2xl border-none">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between py-5 px-8 border-b border-slate-100 dark:border-slate-800 text-left space-y-0">
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">System Administrators</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search administrators..."
                className="pl-10 w-64 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-10 rounded-xl font-semibold shadow-inner"
              />
            </div>
            <Select defaultValue="status">
              <SelectTrigger className="w-[120px] h-10 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-bold rounded-xl shadow-inner text-slate-800">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100">
                <SelectItem value="status" className="font-semibold font-bold">Status</SelectItem>
                <SelectItem value="active" className="font-semibold font-bold">Active</SelectItem>
                <SelectItem value="inactive" className="font-semibold font-bold">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full relative overflow-x-auto text-left">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                <TableRow className="border-none">
                  <TableHead className="w-[50px] pl-8 py-5"><Checkbox className="border-slate-300" /></TableHead>
                  <TableHead className="text-slate-900 font-black text-[11px] uppercase tracking-widest pl-4">Super Admin ID</TableHead>
                  <TableHead className="text-slate-900 font-black text-[11px] uppercase tracking-widest">Administrator Name</TableHead>
                  <TableHead className="text-slate-900 font-black text-[11px] uppercase tracking-widest">Email Address</TableHead>
                  <TableHead className="text-slate-900 font-black text-[11px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-center text-slate-900 font-black text-[11px] uppercase tracking-widest pr-8">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingList ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Parsing Administrator Records...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : listError ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center text-rose-500 font-bold uppercase tracking-widest text-xs">{listError}</TableCell>
                  </TableRow>
                ) : admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No administrative records found.</TableCell>
                  </TableRow>
                ) : admins.map((admin) => (
                  <TableRow key={admin.super_admin_id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="pl-8 py-4"><Checkbox className="border-slate-300" /></TableCell>
                    <TableCell className="pl-4">
                      <code className="text-[11px] font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 border border-slate-200">ID-{admin.super_admin_id}</code>
                    </TableCell>
                    <TableCell className="font-bold text-slate-800 text-sm">{admin.name}</TableCell>
                    <TableCell className="font-semibold text-slate-600 text-sm lowercase">{admin.email}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-all ${admin.is_active
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="pr-8">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleViewClick(admin.super_admin_id)} className="text-slate-600 hover:text-sky-600 transition-all p-1.5 hover:bg-sky-50 rounded-xl" title="Detailed View"><Eye className="h-5 w-5" strokeWidth={2.5} /></button>
                        <button onClick={() => handleEditClick(admin)} className="text-slate-600 hover:text-emerald-600 transition-all p-1.5 hover:bg-emerald-50 rounded-xl" title="Edit Admin"><Edit className="h-5 w-5" strokeWidth={2.5} /></button>
                        <button onClick={() => confirmDelete(admin.super_admin_id)} className="text-slate-600 hover:text-rose-600 transition-all p-1.5 hover:bg-rose-50 rounded-xl" title="Delete Record"><Trash2 className="h-5 w-5" strokeWidth={2.5} /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-6 px-8 bg-slate-50/50 border-t border-slate-100">
            <Button variant="ghost" size="sm" className="h-10 px-4 text-slate-600 hover:text-slate-900 font-bold hover:bg-white rounded-xl transition-all" disabled>
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <div className="flex items-center gap-2">
              {[1, 2, 3, '...', 12].map((page, i) => (
                <Button
                  key={i}
                  variant={page === 1 ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-9 w-9 p-0 font-bold rounded-xl transition-all ${page === 1
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                    }`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="h-10 px-4 text-slate-600 hover:text-slate-900 font-bold hover:bg-white rounded-xl transition-all">
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminManagement;
