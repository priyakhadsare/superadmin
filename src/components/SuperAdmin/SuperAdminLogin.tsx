import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SuperAdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://staffly.space/super-admin/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setSuccessMessage(data.message || 'OTP sent successfully!');
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://staffly.space/super-admin/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otp }), // Send OTP as a string
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data));
        login(data);
      } else {
        setError(data.message || data.detail || 'Failed to verify OTP. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Super Admin Access
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to manage Staffly enterprise suite
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {otpSent ? 'Enter OTP' : 'Welcome back'}
            </CardTitle>
            <CardDescription className="text-center">
              {otpSent 
                ? `We've sent a code to ${email}`
                : 'Enter your email to receive a one-time password'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-900">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@staffly.space"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {successMessage && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50 p-3 rounded-lg mb-4">
                    <CheckCircle2 className="h-5 w-5" />
                    {successMessage}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-bold text-slate-900">One-Time Password</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-12 text-center text-2xl tracking-widest bg-slate-50 border-slate-200 focus-visible:ring-orange-500 rounded-xl"
                    maxLength={6}
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify Access'}
                </Button>
                
                <div className="text-center mt-4">
                  <button 
                    type="button" 
                    onClick={() => { setOtpSent(false); setError(''); }}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-500"
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
