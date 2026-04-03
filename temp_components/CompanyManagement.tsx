import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Building2, MoreVertical, Building, Edit, Power, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState([
    { id: 1, name: 'Acme Corp', email: 'hello@acme.com', phone: '+1234567890', plan: 'Pro', status: 'Active', db: 'tenant_acme' },
    { id: 2, name: 'Globex Inc', email: 'admin@globex.io', phone: '+0987654321', plan: 'Enterprise', status: 'Active', db: 'tenant_globex' },
    { id: 3, name: 'Soylent Corp', email: 'contact@soylent.co', phone: '+1122334455', plan: 'Basic', status: 'Inactive', db: 'tenant_soylent' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building className="h-6 w-6 text-blue-600" />
            Company Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Onboard new companies, manage subscriptions, and tenant routing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register New Company</DialogTitle>
                <DialogDescription>Setup a new tenant instance</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Company Name <span className="text-red-500">*</span></Label>
                  <Input placeholder="Acme Corporation" />
                </div>
                <div className="grid gap-2">
                  <Label>Company Email <span className="text-red-500">*</span></Label>
                  <Input type="email" placeholder="contact@acme.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Contact Number <span className="text-red-500">*</span></Label>
                  <Input type="tel" placeholder="+91 99999 99999" />
                </div>
                <div className="grid gap-2">
                  <Label>GST Number (Optional)</Label>
                  <Input placeholder="22AAAAA0000A1Z5" />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label>Address <span className="text-red-500">*</span></Label>
                  <Textarea placeholder="123 Corporate Blvd" />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label>Company Logo</Label>
                  <Input type="file" accept="image/*" />
                </div>
                <div className="grid gap-2">
                  <Label>Subscription Plan <span className="text-red-500">*</span></Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select Plan" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status <span className="text-red-500">*</span></Label>
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
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Company</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex flex-col space-y-1">
            <CardTitle>Organizations</CardTitle>
            <CardDescription>Global view of all registered companies.</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search companies..."
              className="pl-8 bg-slate-50 dark:bg-slate-900"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p>{company.name}</p>
                          <code className="text-xs bg-slate-100 dark:bg-slate-800 rounded px-1 text-slate-500">{company.db}</code>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-slate-600">{company.email}</div>
                      <div className="text-xs text-slate-500">{company.phone}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                        {company.plan}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${company.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {company.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4 " />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2 text-blue-500" /> Edit Company
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Power className={`h-4 w-4 mr-2 ${company.status === 'Active' ? 'text-amber-500' : 'text-emerald-500'}`} /> 
                            {company.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Company
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default CompanyManagement;
