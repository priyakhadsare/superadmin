import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calculator, 
  Save, 
  Plus, 
  Building2, 
  Search, 
  Trash2, 
  Edit, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  History,
  Info,
  ChevronDown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const CompanySalaryStructure: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [structures, setStructures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editStructureId, setEditStructureId] = useState<number | null>(null);

  const initialFormData = {
    structure_name: '',
    description: '',
    is_active: true,
    is_default: false,
    basic_type: 'PERCENTAGE',
    basic_value: 0,
    hra_percentage_of_basic: 0,
    special_allowance_type: 'BALANCING',
    special_allowance_value: 0,
    conveyance_allowance: 0,
    medical_allowance: 0,
    other_allowance: 0,
    pf_type: 'PERCENTAGE',
    pf_value: 0,
    esic_type: 'PERCENTAGE',
    esic_value: 0,
    professional_tax: 0,
    tds_type: 'PERCENTAGE',
    tds_value: 0,
    other_deduction: 0
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://testing.staffly.space/companies', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch companies');
    }
  };

  // Fetch Structures for Selected Company
  const fetchStructures = async (companyId: string) => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/companies/${companyId}/salary-structures`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStructures(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch salary structures');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      fetchStructures(selectedCompanyId);
    } else {
      setStructures([]);
    }
  }, [selectedCompanyId]);

  const handleSubmit = async () => {
    if (!selectedCompanyId) {
      alert('Please select a company first');
      return;
    }
    if (!formData.structure_name) {
      alert('Structure name is required');
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('access_token');
      const isEditing = !!editStructureId;
      const url = isEditing
        ? `https://testing.staffly.space/companies/${selectedCompanyId}/salary-structures/${editStructureId}`
        : `https://testing.staffly.space/companies/${selectedCompanyId}/salary-structures`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          company_id: parseInt(selectedCompanyId),
          ...(isEditing ? { structure_id: editStructureId } : {})
        })
      });

      if (response.ok) {
        alert(`Salary structure ${isEditing ? 'updated' : 'created'} successfully!`);
        setIsModalOpen(false);
        fetchStructures(selectedCompanyId);
        setFormData(initialFormData);
        setEditStructureId(null);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to process request');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePatchStructure = async (structureId: number, patchData: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/companies/${selectedCompanyId}/salary-structures/${structureId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          company_id: parseInt(selectedCompanyId),
          structure_id: structureId,
          ...patchData
        })
      });

      if (response.ok) {
        fetchStructures(selectedCompanyId);
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to update structure');
      }
    } catch (err) {
      alert('Network error during partial update');
    }
  };

  const fetchStructureById = async (structureId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/companies/${selectedCompanyId}/salary-structures/${structureId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('Failed to fetch structure details');
    }
    return null;
  };

  const handleEdit = async (structure: any) => {
    setIsProcessing(true);
    const detailedData = await fetchStructureById(structure.structure_id);
    setIsProcessing(false);

    if (detailedData) {
      setEditStructureId(detailedData.structure_id);
      setFormData({
        structure_name: detailedData.structure_name,
        description: detailedData.description || '',
        is_active: detailedData.is_active,
        is_default: detailedData.is_default,
        basic_type: detailedData.basic_type,
        basic_value: parseFloat(detailedData.basic_value),
        hra_percentage_of_basic: parseFloat(detailedData.hra_percentage_of_basic),
        special_allowance_type: detailedData.special_allowance_type,
        special_allowance_value: parseFloat(detailedData.special_allowance_value || 0),
        conveyance_allowance: parseFloat(detailedData.conveyance_allowance),
        medical_allowance: parseFloat(detailedData.medical_allowance),
        other_allowance: parseFloat(detailedData.other_allowance),
        pf_type: detailedData.pf_type,
        pf_value: parseFloat(detailedData.pf_value),
        esic_type: detailedData.esic_type,
        esic_value: parseFloat(detailedData.esic_value),
        professional_tax: parseFloat(detailedData.professional_tax),
        tds_type: detailedData.tds_type,
        tds_value: parseFloat(detailedData.tds_value),
        other_deduction: parseFloat(detailedData.other_deduction)
      });
      setIsModalOpen(true);
    } else {
      alert('Failed to load structure details. Please try again.');
    }
  };

  const handleDelete = async (structureId: number) => {
    if (!window.confirm('Are you sure you want to delete this salary structure?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://testing.staffly.space/companies/${selectedCompanyId}/salary-structures/${structureId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Structure deleted successfully');
        fetchStructures(selectedCompanyId);
      } else {
        alert('Failed to delete structure');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div className="space-y-6 p-2 min-h-screen bg-transparent">
      {/* Header & Company Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
            <Calculator className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black tracking-tight text-slate-800">Salary Configuration</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage Company Specific Compensation Models</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <Building2 className="h-4 w-4 text-slate-400 ml-2" />
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="w-[240px] border-none shadow-none bg-transparent font-bold text-slate-700 focus:ring-0">
                <SelectValue placeholder="Select Business Account" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-xl shadow-xl border-slate-100 max-h-[300px]">
                {companies.map(c => (
                  <SelectItem key={c.company_id} value={c.company_id.toString()} className="font-bold cursor-pointer">
                    {c.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
              setEditStructureId(null);
              setFormData(initialFormData);
            }
          }}>
            <DialogTrigger asChild>
              <Button disabled={!selectedCompanyId} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                <Plus className="mr-2 h-5 w-5" /> New Structure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[1000px] max-h-[90vh] p-0 overflow-hidden border-none rounded-3xl bg-white shadow-2xl">
              <DialogHeader className="bg-indigo-600 p-8 flex flex-row items-center gap-6 space-y-0 text-left">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                  <Calculator className="h-10 w-10 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-black text-white tracking-tight">
                    {editStructureId ? 'Modify Structure' : 'Architect Structure'}
                  </DialogTitle>
                  <DialogDescription className="text-indigo-100 font-bold uppercase tracking-widest text-xs mt-1">
                    Compensation Framework Design Interface
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* General Info */}
                  <div className="col-span-1 md:col-span-2 space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <Info className="h-4 w-4 text-indigo-500" /> Identity & Scope
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Structure Name *</Label>
                        <Input 
                          placeholder="E.g. Senior Executive Model"
                          className="h-11 bg-white border-slate-200 rounded-xl font-bold text-slate-800"
                          value={formData.structure_name}
                          onChange={e => setFormData({...formData, structure_name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Description</Label>
                        <Input 
                          placeholder="Brief technical summary..."
                          className="h-11 bg-white border-slate-200 rounded-xl font-bold text-slate-800"
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-10 pt-2">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id="is_active" 
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({...formData, is_active: !!checked})}
                          className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label htmlFor="is_active" className="text-sm font-bold text-slate-700 cursor-pointer">Active Model</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id="is_default" 
                          checked={formData.is_default}
                          onCheckedChange={(checked) => setFormData({...formData, is_default: !!checked})}
                          className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label htmlFor="is_default" className="text-sm font-bold text-slate-700 cursor-pointer">Set as Default for Company</Label>
                      </div>
                    </div>
                  </div>

                  {/* Earnings Column */}
                  <div className="space-y-6">
                    <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl space-y-6">
                      <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                        <Calculator className="h-4 w-4" /> Earnings Hub
                      </h3>
                      
                      {/* Basic */}
                      <div className="space-y-4 p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] font-black text-emerald-600 uppercase">Basic Component</Label>
                          <Select 
                            value={formData.basic_type} 
                            onValueChange={v => setFormData({...formData, basic_type: v})}
                          >
                            <SelectTrigger className="h-7 w-28 bg-emerald-100 border-none rounded-lg text-[10px] font-black text-emerald-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="PERCENTAGE">PERCENTAGE</SelectItem>
                              <SelectItem value="FIXED">FIXED</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input 
                          type="number"
                          className="h-10 bg-slate-50 border-slate-100 rounded-xl font-black text-slate-800"
                          value={formData.basic_value}
                          onChange={e => setFormData({...formData, basic_value: parseFloat(e.target.value) || 0})}
                        />
                      </div>

                      {/* HRA */}
                      <div className="space-y-4 p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                        <Label className="text-[10px] font-black text-emerald-600 uppercase">HRA (% of Basic)</Label>
                        <Input 
                          type="number"
                          className="h-10 bg-slate-50 border-slate-100 rounded-xl font-black text-slate-800"
                          value={formData.hra_percentage_of_basic}
                          onChange={e => setFormData({...formData, hra_percentage_of_basic: parseFloat(e.target.value) || 0})}
                        />
                      </div>

                      {/* Other Earnings */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[9px] font-black text-slate-400 uppercase">Conveyance</Label>
                          <Input 
                            type="number"
                            className="h-10 bg-white border-slate-200 rounded-xl font-bold text-slate-800"
                            value={formData.conveyance_allowance}
                            onChange={e => setFormData({...formData, conveyance_allowance: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[9px] font-black text-slate-400 uppercase">Medical</Label>
                          <Input 
                            type="number"
                            className="h-10 bg-white border-slate-200 rounded-xl font-bold text-slate-800"
                            value={formData.medical_allowance}
                            onChange={e => setFormData({...formData, medical_allowance: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <Label className="text-[9px] font-black text-slate-400 uppercase">Other Allowance</Label>
                         <Input 
                            type="number"
                            className="h-11 bg-white border-slate-200 rounded-xl font-bold text-slate-800"
                            value={formData.other_allowance}
                            onChange={e => setFormData({...formData, other_allowance: parseFloat(e.target.value) || 0})}
                          />
                      </div>

                      {/* Special Allowance */}
                      <div className="space-y-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] font-black text-indigo-600 uppercase">Special Allowance</Label>
                          <Select 
                            value={formData.special_allowance_type} 
                            onValueChange={v => setFormData({...formData, special_allowance_type: v})}
                          >
                            <SelectTrigger className="h-7 w-28 bg-indigo-100 border-none rounded-lg text-[10px] font-black text-indigo-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem value="BALANCING">BALANCING</SelectItem>
                              <SelectItem value="FIXED">FIXED</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {formData.special_allowance_type === 'FIXED' && (
                          <Input 
                            type="number"
                            className="h-10 bg-white border-slate-200 rounded-xl font-black text-slate-800"
                            value={formData.special_allowance_value}
                            onChange={e => setFormData({...formData, special_allowance_value: parseFloat(e.target.value) || 0})}
                          />
                        )}
                        {formData.special_allowance_type === 'BALANCING' && (
                          <p className="text-[9px] font-bold text-indigo-400 italic">Automatically calculated based on Gross target</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Deductions Column */}
                  <div className="space-y-6">
                    <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-3xl space-y-6">
                      <h3 className="text-sm font-black text-rose-700 uppercase tracking-widest flex items-center gap-2">
                        <History className="h-4 w-4" /> Deduction Matrix
                      </h3>

                      {/* PF */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-2xl border border-rose-50 shadow-sm">
                        <div className="col-span-2 flex items-center justify-between border-b border-rose-50 pb-2 mb-2">
                          <Label className="text-[10px] font-black text-rose-600 uppercase">Provident Fund (PF)</Label>
                          <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[9px]">STATUTORY</Badge>
                        </div>
                        <Select value={formData.pf_type} onValueChange={v => setFormData({...formData, pf_type: v})}>
                          <SelectTrigger className="h-10 bg-slate-50 border-none rounded-xl font-bold text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="PERCENTAGE">%</SelectItem>
                            <SelectItem value="FIXED">₹</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          type="number"
                          className="h-10 bg-slate-50 border-none rounded-xl font-black text-slate-800 text-right"
                          value={formData.pf_value}
                          onChange={e => setFormData({...formData, pf_value: parseFloat(e.target.value) || 0})}
                        />
                      </div>

                      {/* ESIC */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-2xl border border-rose-50 shadow-sm">
                        <div className="col-span-2 flex items-center justify-between border-b border-rose-50 pb-2 mb-2">
                          <Label className="text-[10px] font-black text-rose-600 uppercase">ESIC Contribution</Label>
                          <Badge className="bg-rose-100 text-rose-700 border-none font-bold text-[9px]">STATUTORY</Badge>
                        </div>
                        <Select value={formData.esic_type} onValueChange={v => setFormData({...formData, esic_type: v})}>
                          <SelectTrigger className="h-10 bg-slate-50 border-none rounded-xl font-bold text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="PERCENTAGE">%</SelectItem>
                            <SelectItem value="FIXED">₹</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          type="number"
                          className="h-10 bg-slate-50 border-none rounded-xl font-black text-slate-800 text-right"
                          value={formData.esic_value}
                          onChange={e => setFormData({...formData, esic_value: parseFloat(e.target.value) || 0})}
                        />
                      </div>

                      {/* PT & TDS */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 p-4 bg-white rounded-2xl border border-rose-50 shadow-sm">
                          <Label className="text-[9px] font-black text-slate-400 uppercase">Pro. Tax (PT)</Label>
                          <Input 
                            type="number"
                            className="h-10 bg-slate-50 border-none rounded-xl font-bold text-slate-800"
                            value={formData.professional_tax}
                            onChange={e => setFormData({...formData, professional_tax: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        <div className="space-y-2 p-4 bg-white rounded-2xl border border-rose-50 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-[9px] font-black text-slate-400 uppercase">TDS</Label>
                            <Select value={formData.tds_type} onValueChange={v => setFormData({...formData, tds_type: v})}>
                              <SelectTrigger className="h-5 w-10 p-0 border-none bg-transparent text-[8px] font-black focus:ring-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem value="PERCENTAGE">%</SelectItem>
                                <SelectItem value="FIXED">₹</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input 
                            type="number"
                            className="h-10 bg-slate-50 border-none rounded-xl font-bold text-slate-800"
                            value={formData.tds_value}
                            onChange={e => setFormData({...formData, tds_value: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <Label className="text-[9px] font-black text-slate-400 uppercase">Miscellaneous Deductions</Label>
                         <Input 
                            type="number"
                            className="h-11 bg-white border-slate-200 rounded-xl font-bold text-slate-800"
                            value={formData.other_deduction}
                            onChange={e => setFormData({...formData, other_deduction: parseFloat(e.target.value) || 0})}
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  className="h-12 border-slate-200 rounded-2xl px-8 font-bold text-slate-600 hover:bg-slate-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Discard Changes
                </Button>
                <Button 
                  className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl px-12 shadow-xl shadow-indigo-100"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Synchronizing...' : editStructureId ? 'Update Engine' : 'Deploy Structure'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Area */}
      {selectedCompanyId ? (
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="p-6 border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-slate-800">Deployment Registry</CardTitle>
                <CardDescription className="text-xs font-bold text-slate-400 uppercase mt-1">Active Salary Models for this Tenant</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input 
                      placeholder="Search models..."
                      className="pl-9 h-10 w-[240px] rounded-xl bg-slate-50 border-none font-medium placeholder:text-slate-400"
                   />
                 </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Querying central databases...</p>
              </div>
            ) : structures.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 border-dashed">
                  <Calculator className="h-8 w-8 text-slate-200" />
                </div>
                <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">No compensation models found for this tenant.</p>
                <Button 
                  variant="ghost" 
                  className="mt-4 text-indigo-600 font-bold hover:bg-indigo-50"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create initial structure
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="py-5 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry ID</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Name</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic Config</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HRA Focus</TableHead>
                      <TableHead className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</TableHead>
                      <TableHead className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pr-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {structures.map((s) => (
                      <TableRow key={s.structure_id} className="group hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                        <TableCell className="pl-8 py-5">
                          <code className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">#{s.structure_id}</code>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-black text-slate-800">{s.structure_name}</p>
                            <p className="text-[10px] font-bold text-slate-400 italic truncate max-w-[200px]">{s.description || 'No description provided'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[9px]">{s.basic_type}</Badge>
                             <span className="text-xs font-black text-slate-600">{s.basic_value}{s.basic_type === 'PERCENTAGE' ? '%' : ''}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                           <span className="text-xs font-black text-indigo-600">{s.hra_percentage_of_basic}% <span className="text-[10px] text-slate-300 font-bold uppercase">of basic</span></span>
                        </TableCell>
                        <TableCell className="text-center">
                          <button 
                            onClick={() => handlePatchStructure(s.structure_id, { is_active: !s.is_active })}
                            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
                          >
                            <Badge className={`h-1.5 w-6 p-0 rounded-full border-none ${s.is_active ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-slate-300'}`} />
                            <span className="text-[9px] font-black uppercase text-slate-400">{s.is_active ? 'Active' : 'Archived'}</span>
                            {s.is_default && <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black mt-1">DEFAULT</Badge>}
                          </button>
                        </TableCell>
                        <TableCell className="pr-8 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                              onClick={() => handleEdit(s)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              onClick={() => handleDelete(s.structure_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
           <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl opacity-50 scale-150 animate-pulse"></div>
              <Building2 className="h-20 w-20 text-indigo-200 relative z-10" />
           </div>
           <h2 className="text-2xl font-black text-slate-800 tracking-tight">Select a Business Entity</h2>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Initialize compensation module by choosing a tenant</p>
           <div className="mt-8 flex items-center gap-3">
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="w-[300px] h-12 bg-slate-50 border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm">
                  <SelectValue placeholder="Browse All Companies..." />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-2xl shadow-2xl border-slate-100">
                  {companies.map(c => (
                    <SelectItem key={c.company_id} value={c.company_id.toString()} className="font-bold cursor-pointer py-3 border-b border-slate-50 last:border-none">
                      {c.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>
        </div>
      )}

      {/* Footer Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
         <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-2 bg-emerald-50 rounded-xl">
               <Calculator className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase">Static Revenue</p>
               <p className="text-xs font-bold text-slate-700">Gross components are additive by default.</p>
            </div>
         </div>
         <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-2 bg-rose-50 rounded-xl">
               <History className="h-5 w-5 text-rose-600" />
            </div>
            <div className="text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase">Deduction Stack</p>
               <p className="text-xs font-bold text-slate-700">Statutory deductions follow local tax laws.</p>
            </div>
         </div>
         <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-2 bg-amber-50 rounded-xl">
               <Info className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase">Default Logic</p>
               <p className="text-xs font-bold text-slate-700">Default structures auto-apply to new hires.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CompanySalaryStructure;
