import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  Briefcase
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SuperAdminManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admins] = useState([
    {
      id: "AD001",
      name: "Vipul Patil",
      email: "vipulpatil@gmail.com",
      phone: "9897465545",
      role: "MD",
      status: "Active"
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'male'
  });

  const handleCreateAdmin = () => {
    // Logic to add the super admin
    console.log('Creating super admin:', formData);
    setIsModalOpen(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: 'male'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Briefcase className="h-6 w-6 text-slate-700 dark:text-slate-300" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Super Admin Management</h1>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3FA2F6] hover:bg-blue-600 text-white rounded-lg px-4 flex items-center gap-2">
              + Super Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none rounded-3xl">
            {/* Modal content remains the same */}
            <div className="bg-[#DDEBFF] p-6 flex items-center gap-4">
              <div className="bg-[#3B82F6] p-3 rounded-xl shadow-lg shadow-blue-200">
                <Plus className="h-8 w-8 text-white" strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[#1E293B]">Create Super Admin</h2>
                <p className="text-sm text-[#475569]">Fill in the required fields marked with *</p>
              </div>
            </div>

            <div className="p-8 space-y-6 bg-white">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold text-[#1E293B]">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="E.g., John Doe"
                  className="bg-[#DDEBFF] border-none h-12 rounded-xl text-slate-700 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold text-[#1E293B]">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="E.g., xyz@company.com"
                  className="bg-[#DDEBFF] border-none h-12 rounded-xl text-slate-700 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-semibold text-[#1E293B]">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="E.g., 0123456789"
                  className="bg-[#DDEBFF] border-none h-12 rounded-xl text-slate-700 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-400"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold text-[#1E293B]">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <RadioGroup 
                  defaultValue="male" 
                  className="flex items-center gap-6"
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  value={formData.gender}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" className="border-slate-400" />
                    <Label htmlFor="male" className="text-slate-700 font-medium">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" className="border-slate-400" />
                    <Label htmlFor="female" className="text-slate-700 font-medium">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" className="border-slate-400" />
                    <Label htmlFor="other" className="text-slate-700 font-medium">Other</Label>
                  </div>
                </RadioGroup>
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
                  className="flex-1 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold h-12 rounded-xl text-sm"
                  onClick={handleCreateAdmin}
                >
                  + Create Super Admin
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between py-4 px-6 border-b border-slate-200 dark:border-slate-800">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">Admins</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search" 
                className="pl-9 w-64 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9"
              />
            </div>
            <Select defaultValue="status">
              <SelectTrigger className="w-[120px] h-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 font-semibold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#B6EADA] dark:bg-[#1e293b]">
                <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-800">
                  <TableHead className="w-12 py-4">
                    <div className="flex justify-center">
                      <Checkbox className="border-slate-400" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300">Name</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">Email</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">Contact Number</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-center">Status</TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300 text-right pr-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <Checkbox className="border-slate-300" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800 dark:text-slate-200">{admin.name}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 text-center">{admin.email}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 text-center">{admin.phone}</TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-slate-700">
                        {admin.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-3 text-slate-600 dark:text-slate-400">
                        <Eye className="h-5 w-5 cursor-pointer hover:text-blue-500 transition-colors" />
                        <Edit className="h-5 w-5 cursor-pointer hover:text-green-500 transition-colors" />
                        <Trash2 className="h-5 w-5 cursor-pointer hover:text-red-500 transition-colors" />
                        <XCircle className="h-5 w-5 cursor-pointer hover:text-orange-500 transition-colors" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-end px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 disabled:opacity-30" disabled>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, '...', 67, 68].map((page, i) => (
                <Button 
                  key={i} 
                  variant={page === 1 ? 'default' : 'ghost'} 
                  size="sm" 
                  className={`h-8 w-8 min-w-0 p-0 text-xs ${page === 1 ? 'bg-slate-800' : 'text-slate-600'}`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-slate-900">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminManagement;
