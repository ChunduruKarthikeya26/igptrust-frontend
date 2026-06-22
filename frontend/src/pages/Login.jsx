import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi, getMe } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import api from '../api/axios';
import Header from '../components/header';
import LoginForm from '../components/FormSection';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [preAuthToken, setPreAuthToken] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    password: '',
    country: 'Australia',
    phonePrefix: '+61',
    phoneCountryCode: 'AU',
    phoneNumber: '',
    projectDetails: '',
  });

  const handleFormChange = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi({ email: formData.workEmail, password: formData.password });

      // BUG FIX: if mfa_required, show MFA screen — no access_token yet
      if (res.data.mfa_required) {
        setPendingEmail(formData.workEmail);
        setPreAuthToken(res.data.pre_auth_token);
        setMfaRequired(true);
        toast('Enter your 6-digit authenticator code', { icon: '🔐' });
        return;
      }

      const token = res.data.access_token;
      localStorage.setItem('token', token);
      const me = await getMe();

      if (me.data.mfa_required) {
        login(token, me.data);
        toast.error('Your admin requires MFA. Please set it up now.', { duration: 5000 });
        navigate('/settings?mfa=required', { replace: true });
      } else {
        login(token, me.data);
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async () => {
    if (otpCode.length !== 6) return toast.error('Enter a 6-digit code');
    setMfaLoading(true);
    try {
      const res = await api.post('/auth/login-mfa', null, {
        params: {
          email: pendingEmail,
          code: otpCode,
          pre_auth_token: preAuthToken,
        },
      });
      const token = res.data.access_token;
      localStorage.setItem('token', token);
      const me = await getMe();
      login(token, me.data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid OTP code');
      setOtpCode('');
    } finally {
      setMfaLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f4f6fb]">
      <Header />
      
      <main className="flex-1 w-full flex items-center justify-center pt-32 pb-16 px-6 md:p-12 lg:p-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-xl mx-auto flex flex-col items-center justify-center"
        >
          {!mfaRequired ? (
            <div className="w-full flex flex-col gap-4 items-center">
              <LoginForm 
                formData={formData} 
                onChange={handleFormChange} 
                onSubmit={handleSubmit}
                loading={loading}
              />
              <p className="text-sm text-slate-500 mt-2">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 font-medium hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 w-full max-w-xl h-fit">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <KeyRound size={22} className="text-orange-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the 6-digit code from your authenticator app
                </p>
                <p className="text-xs text-gray-400 mt-1 font-mono">{pendingEmail}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1 text-center">
                    Authenticator Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    autoFocus
                    className="w-full text-center text-2xl font-mono tracking-widest border border-gray-200
                               rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && handleMfaSubmit()}
                  />
                </div>
                <button
                  onClick={handleMfaSubmit}
                  disabled={mfaLoading || otpCode.length !== 6}
                  className="w-full bg-orange-500 text-white py-2.5 rounded-lg text-sm font-medium
                             hover:bg-orange-600 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {mfaLoading ? 'Verifying...' : 'Verify Code'}
                </button>
                <button
                  onClick={() => { setMfaRequired(false); setOtpCode(''); setPendingEmail('') }}
                  className="w-full text-sm text-gray-400 hover:text-gray-600 py-1 cursor-pointer text-center"
                >
                  ← Back to login
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}