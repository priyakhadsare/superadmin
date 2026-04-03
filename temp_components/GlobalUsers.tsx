import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  UserCheck,
  UserX,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

const GlobalUsers: React.FC = () => {
  const [users] = useState([
    { id: 'U001', name: 'Alok Mishra', email: 'alok.mishra@acme.com', company: 'Acme Corp', role: 'Manager', status: 'Active' },
    { id: 'U002', name: 'Sneha Reddy', email: 'sneha@globex.org', company: 'Globex Inc', role: 'HR', status: 'Active' },
    { id: 'U003', name: 'Rohan Sharma', email: 'rohan.s@soylent.in', company: 'Soylent', role: 'Employee', status: 'Inactive' },
    { id: 'U004', name: 'Pooja Verma', email: 'pooja.v@acme.com', company: 'Acme Corp', role: 'Team Lead', status: 'Active' },
    { id: 'U005', name: 'Karthik S', email: 'karthik@initech.co', company: 'Initech', role: 'Employee', status: 'Active' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#3FA2F6]" />
            Global User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor and manage all users across all registered organizations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export All
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search users by name, email or ID..." 
            className="pl-9 h-11 border-slate-200 focus-visible:ring-[#3FA2F6]"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] h-11 border-slate-200">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              <SelectItem value="acme">Acme Corp</SelectItem>
              <SelectItem value="globex">Globex Inc</SelectItem>
              <SelectItem value="soylent">Soylent</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-11 border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200">
              <TableRow>
                <TableHead className="px-6 py-4 font-bold text-slate-700">User ID</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700">User Details</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700">Organization</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700">Role</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700">Status</TableHead>
                <TableHead className="px-6 py-4 font-bold text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-b last:border-0 border-slate-100">
                  <TableCell className="px-6 py-4">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {user.id}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{user.name}</span>
                      <span className="text-xs text-slate-500">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="font-medium text-slate-700">{user.company}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-slate-600">{user.role}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className={`font-bold text-[10px] uppercase ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="gap-2 focus:bg-blue-50 transition-colors cursor-pointer">
                            <Edit className="h-4 w-4" /> Edit User
                          </DropdownMenuItem>
                          {user.status === 'Active' ? (
                            <DropdownMenuItem className="gap-2 text-rose-600 focus:bg-rose-50 transition-colors cursor-pointer">
                              <UserX className="h-4 w-4" /> Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="gap-2 text-emerald-600 focus:bg-emerald-50 transition-colors cursor-pointer">
                              <UserCheck className="h-4 w-4" /> Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="gap-2 text-rose-600 focus:bg-rose-50 transition-colors cursor-pointer font-bold">
                            <Trash2 className="h-4 w-4" /> Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center">
          <Button variant="ghost" size="sm" className="font-bold text-blue-600 hover:bg-blue-50 h-8">
            Load More Users
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GlobalUsers;
