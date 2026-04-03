import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, UserCheck, Shield, KeyRound, UserX, Power } from 'lucide-react';

const AdminManagement: React.FC = () => {
  const admins = [
    { id: 1, name: 'Alice Smith', email: 'alice@acme.com', phone: '+1234567890', company: 'Acme Corp', role: 'admin', status: 'Active' },
    { id: 2, name: 'Bob Jones', email: 'bob@globex.io', phone: '+0987654321', company: 'Globex Inc', role: 'hr', status: 'Active' },
    { id: 3, name: 'Charlie Ray', email: 'charlie@soylent.co', phone: '+1122334455', company: 'Soylent Corp', role: 'manager', status: 'Inactive' },
  ];

  const companies = ['Acme Corp', 'Globex Inc', 'Soylent Corp'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600" />
            Admin Creation
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Create global or company-specific admins/managers.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" /> Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Company Admin</DialogTitle>
              <DialogDescription>Assign an administrator to a specific company</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label>Admin Name</Label>
                <Input placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label>Email ID</Label>
                <Input type="email" placeholder="admin@domain.com" />
              </div>
              <div className="grid gap-2">
                <Label>Phone Number</Label>
                <Input type="tel" placeholder="+123456789" />
              </div>
              <div className="grid gap-2">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label>Company</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Company" /></SelectTrigger>
                  <SelectContent>
                    {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Admin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Company Administrators</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input type="search" placeholder="Search admins..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                          {admin.name.charAt(0)}
                        </div>
                        {admin.name}
                      </div>
                    </TableCell>
                    <TableCell>{admin.company}</TableCell>
                    <TableCell>
                      <span className="uppercase text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">{admin.role}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-500">{admin.email}</div>
                      <div className="text-xs text-slate-500">{admin.phone}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${admin.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {admin.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-amber-500" title="Reset Password">
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className={admin.status === 'Active' ? 'text-red-500' : 'text-emerald-500'} title={admin.status === 'Active' ? 'Disable' : 'Enable'}>
                          <Power className="h-4 w-4" />
                        </Button>
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
