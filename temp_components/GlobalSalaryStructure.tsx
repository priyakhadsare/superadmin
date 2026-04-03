import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Save } from 'lucide-react';

const GlobalSalaryStructure: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Global Salary Structure
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Configure fully customizable salary structures (Earnings & Deductions) used globally across tenants.
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" />
          Save Master Structure
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-600 flex items-center gap-2">
              <Calculator className="h-5 w-5" /> Earnings
            </CardTitle>
            <CardDescription>Configure master earning fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Basic Salary (%)</Label>
              <Input type="number" defaultValue="50" />
            </div>
            <div className="grid gap-2">
              <Label>HRA (%)</Label>
              <Input type="number" defaultValue="20" />
            </div>
            <div className="grid gap-2">
              <Label>Special Allowance (%)</Label>
              <Input type="number" defaultValue="30" />
            </div>
            <div className="grid gap-2">
              <Label>Bonus (Fixed)</Label>
              <Input type="number" defaultValue="0" />
            </div>
            <div className="grid gap-2">
              <Label>Incentive (Variable)</Label>
              <Input type="number" defaultValue="0" />
            </div>
            <div className="grid gap-2">
              <Label>Other Allowance (Fixed)</Label>
              <Input type="number" defaultValue="0" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Calculator className="h-5 w-5" /> Deductions
            </CardTitle>
            <CardDescription>Configure master deduction fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>PF (Provident Fund) (%)</Label>
              <Input type="number" defaultValue="12" />
            </div>
            <div className="grid gap-2">
              <Label>ESIC (%)</Label>
              <Input type="number" defaultValue="0.75" />
            </div>
            <div className="grid gap-2">
              <Label>Professional Tax (Fixed)</Label>
              <Input type="number" defaultValue="200" />
            </div>
            <div className="grid gap-2">
              <Label>TDS (%)</Label>
              <Input type="number" defaultValue="10" />
            </div>
            <div className="grid gap-2">
              <Label>Other Deduction (Fixed)</Label>
              <Input type="number" defaultValue="0" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-slate-50 dark:bg-slate-900 border-none">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-around items-center gap-4 text-center">
            <div>
              <p className="text-sm font-medium text-slate-500">Auto Calculation Target</p>
              <h3 className="text-2xl font-bold text-emerald-600">Gross Salary</h3>
            </div>
            <div className="hidden md:block text-2xl font-light text-slate-300">-</div>
            <div>
              <p className="text-sm font-medium text-slate-500">Auto Calculation Target</p>
              <h3 className="text-2xl font-bold text-red-600">Total Deduction</h3>
            </div>
            <div className="hidden md:block text-2xl font-light text-slate-300">=</div>
            <div>
              <p className="text-sm font-medium text-slate-500">Auto Calculation Target</p>
              <h3 className="text-2xl font-bold text-blue-600">Net Salary</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSalaryStructure;
