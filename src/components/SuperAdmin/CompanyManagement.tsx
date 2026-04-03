import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Eye, Edit, Trash2, XCircle, Search, Plus, Paperclip } from 'lucide-react';
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

const CompanyManagement: React.FC = () => {
  const [companies] = useState([
    { 
      id: 1, 
      companyId: 'COMP001',
      name: 'Tech Mahendra', 
      type: 'Private Limited',
      email: 'techmahendra@gmail.com', 
      phone: '9897465545', 
      pan: 'GDPAP9856E',
      status: 'Active', 
    },
  ]);

  return (
    <div className="space-y-4 p-4 min-h-screen">
      
      {/* Header Card */}
      <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-slate-200 rounded-lg bg-slate-50">
              <Briefcase className="h-6 w-6 text-slate-800" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Company Management</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 flex items-center gap-2">
                <Plus className="mr-1 h-4 w-4" /> Company
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[480px] p-0 overflow-hidden border-none rounded-2xl bg-white shadow-2xl">
              <DialogHeader className="bg-orange-50 p-6 flex flex-row items-center gap-4 space-y-0 text-left">
                <div className="bg-orange-500 p-3 rounded-xl shadow-lg shadow-orange-100">
                  <Plus className="h-6 w-6 text-white" strokeWidth={3} />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 leading-tight">Create New Company</DialogTitle>
                  <DialogDescription className="text-xs text-slate-700 font-medium mt-0.5">Fill in the required fields marked with *</DialogDescription>
                </div>
              </DialogHeader>

              {/* Scrollable Form Body */}
              <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
                
                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900">Company ID * <span className="font-normal text-slate-500">(Uppercase and Numbers Only)</span></Label>
                  <Input placeholder="E.g., COMP001" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900">Company Name *</Label>
                  <Input placeholder="E.g., Tech Mahendra" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900">Company Email *</Label>
                  <Input placeholder="E.g., xyz@example.com" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900">Contact Number *</Label>
                  <Input placeholder="E.g., 1234567890" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400" />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-900">Address *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-800">Office No. / Floor No.</Label>
                      <Input placeholder="E.g., Office No. 7" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium text-sm focus-visible:ring-1 focus-visible:ring-orange-400" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-800">Company Name/Building Name</Label>
                      <Input placeholder="E.g., Galaxy Tower" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium text-sm focus-visible:ring-1 focus-visible:ring-orange-400" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-800">Area</Label>
                      <Input placeholder="E.g., Downtown" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium text-sm focus-visible:ring-1 focus-visible:ring-orange-400" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-800">City</Label>
                      <Input placeholder="E.g., Mumbai" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium text-sm focus-visible:ring-1 focus-visible:ring-orange-400" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-800">State</Label>
                      <Input placeholder="E.g., Maharashtra" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium text-sm focus-visible:ring-1 focus-visible:ring-orange-400" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-800">Pincode</Label>
                      <Input placeholder="E.g., 400001" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium text-sm focus-visible:ring-1 focus-visible:ring-orange-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900">GST Number</Label>
                  <Input placeholder="E.g., 27ABCDE1234F1Z5" className="bg-orange-50/50 border-slate-200 rounded-lg h-10 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-1 focus-visible:ring-orange-400" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900">Upload Company Logo *</Label>
                  <div className="flex rounded-lg overflow-hidden h-10">
                    <label className="flex items-center justify-center px-3 border border-[#bfdbfe] border-r-0 rounded-l-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors shrink-0">
                      <Paperclip className="h-4 w-4 mr-2 text-slate-700" />
                      <span className="text-xs font-extrabold text-slate-900 whitespace-nowrap">Choose file</span>
                      <input type="file" className="hidden" />
                    </label>
                    <div className="flex-1 px-3 flex items-center text-xs font-medium text-slate-600 bg-white border border-[#bfdbfe] rounded-r-lg">
                      No File Chosen
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-900">Subscription *</Label>
                  <Select>
                    <SelectTrigger className="bg-orange-50/50 border-slate-200 rounded-lg h-10 font-bold text-slate-700 focus:ring-1 focus:ring-orange-400">
                      <SelectValue placeholder="Select Subscription Plan" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl shadow-lg border-slate-100 font-bold text-slate-800">
                      <SelectItem value="basic">Basic Plan</SelectItem>
                      <SelectItem value="pro">Pro Plan</SelectItem>
                      <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-900">Status *</Label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="status" defaultChecked className="h-4 w-4 text-slate-900 border-slate-400 focus:ring-slate-900 accent-slate-800" />
                      <span className="text-sm font-bold text-slate-900">Active</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="status" className="h-4 w-4 text-slate-900 border-slate-400 focus:ring-slate-900 accent-slate-800" />
                      <span className="text-sm font-bold text-slate-900">Inactive</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 pt-4 pb-2">
                  <Button variant="outline" className="bg-orange-50 hover:bg-orange-100 text-slate-900 border-none font-bold rounded-lg px-8 h-10 w-[140px]">
                    Cancel
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg px-6 h-10 w-[180px]">
                    + Create Company
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

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
                className="pl-9 h-9 w-[280px] rounded-lg border-slate-200 bg-white placeholder:text-slate-400 text-sm focus-visible:ring-orange-400"
              />
            </div>
            <Select defaultValue="status">
              <SelectTrigger className="h-9 w-[110px] rounded-lg border-slate-200 font-bold text-slate-900 bg-white focus:ring-orange-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl shadow-lg border-slate-100">
                <SelectItem value="status" className="font-semibold cursor-pointer">Status</SelectItem>
                <SelectItem value="active" className="font-semibold cursor-pointer">Active</SelectItem>
                <SelectItem value="inactive" className="font-semibold cursor-pointer">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
                {companies.map((company) => (
                  <TableRow key={company.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <TableCell className="pl-4"><Checkbox className="border-slate-400 data-[state=checked]:bg-slate-800 data-[state=checked]:text-white data-[state=checked]:border-slate-800" /></TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm py-5">{company.companyId}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">{company.name}</TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm">{company.type}</TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm">{company.email}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">{company.phone}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">{company.pan}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">{company.status}</TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-slate-700 hover:text-blue-600 transition-colors p-1"><Eye className="h-5 w-5" strokeWidth={2.5} /></button>
                        <button className="text-slate-700 hover:text-emerald-600 transition-colors p-1"><Edit className="h-5 w-5" strokeWidth={2.5} /></button>
                        <button className="text-slate-700 hover:text-red-600 transition-colors p-1"><Trash2 className="h-5 w-5" strokeWidth={2.5} /></button>
                        <button className="text-slate-700 hover:text-slate-900 transition-colors p-1"><XCircle className="h-5 w-5" strokeWidth={2.5} /></button>
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
