import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [otpInfo, setOtpInfo] = useState<{
    message?: string;
    environment?: string;
    otp_method?: string;
    expires_in_minutes?: number;
  } | null>(null);

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
      // Server expects query string, not JSON body
      const url = `https://testing.staffly.space/super-admin/send-otp?email=${encodeURIComponent(email)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setOtpInfo(data);
        setOtpSent(true);
        setSuccessMessage(data.message || 'OTP sent successfully!');
      } else {
        let errorMsg = 'Failed to send OTP. Please try again.';
        if (typeof data.message === 'string') errorMsg = data.message;
        else if (typeof data.detail === 'string') errorMsg = data.detail;
        else if (Array.isArray(data.detail)) errorMsg = data.detail[0]?.msg || JSON.stringify(data.detail);
        
        setError(errorMsg);
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again later.');
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
      // Server expects query strings, not JSON body
      const url = `https://testing.staffly.space/super-admin/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        }
      });

      const data = await response.json();

      // Support both possible token field names from the API
      const accessToken = data.access_token || data.token;
 
      if (response.ok && accessToken) {
        let fullProfile: Record<string, any> = {};
        try {
          // Fetch the full user details to populate the profile payload
          const listRes = await fetch('https://testing.staffly.space/super-admin/list', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          if (listRes.ok) {
            const listData = await listRes.json();
            if (Array.isArray(listData)) {
              const matchedAdmin = listData.find((admin: any) => admin.email === (data.email || email));
              if (matchedAdmin) {
                fullProfile = matchedAdmin;
              }
            }
          }
        } catch (e) {
          console.warn("Could not fetch extended profile details", e);
        }

        const userData = {
          ...data,
          ...fullProfile,
          access_token: accessToken,
          email: data.email || email,
          name: fullProfile.name || data.name || data.super_admin_name || email.split('@')[0]
        };
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        login(userData);
        navigate('/');
      } else {
        let errorMsg = 'Invalid OTP. Please try again.';
        if (typeof data.message === 'string') errorMsg = data.message;
        else if (typeof data.detail === 'string') errorMsg = data.detail;
        else if (Array.isArray(data.detail)) errorMsg = data.detail[0]?.msg || JSON.stringify(data.detail);
        
        setError(errorMsg);
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please try again later.');
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
                {otpInfo && (
                  <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      {otpInfo.message || 'OTP generated successfully'}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {otpInfo.environment && (
                        <div className="bg-white rounded-lg p-2 border border-emerald-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Environment</p>
                          <p className="text-xs font-bold text-slate-700 capitalize mt-0.5">{otpInfo.environment}</p>
                        </div>
                      )}
                      {otpInfo.otp_method && (
                        <div className="bg-white rounded-lg p-2 border border-emerald-100">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OTP Method</p>
                          <p className="text-xs font-bold text-slate-700 capitalize mt-0.5">{otpInfo.otp_method}</p>
                        </div>
                      )}
                      {otpInfo.expires_in_minutes && (
                        <div className="bg-white rounded-lg p-2 border border-orange-100 col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expires In</p>
                          <p className="text-xs font-bold text-orange-600 mt-0.5">{otpInfo.expires_in_minutes} minutes</p>
                        </div>
                      )}
                    </div>
                    {otpInfo.otp_method === 'console' && (
                      <p className="text-[11px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 rounded-lg p-2 mt-1">
                        ⚠️ Check the server console / backend logs for the OTP code.
                      </p>
                    )}
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
