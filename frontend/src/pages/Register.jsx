import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import toast from 'react-hot-toast';
import Header from '../components/header';
import RegisterForm from '../components/RegisterForm';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleFormChange = (newData) => {
    setForm((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Redundant client-side safety checks
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
      };
      await register(payload);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
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
          <div className="w-full flex flex-col gap-4 items-center">
            <RegisterForm 
              formData={form} 
              onChange={handleFormChange} 
              onSubmit={handleSubmit}
              loading={loading}
            />
            <p className="text-sm text-slate-500 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
