import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from "./ui/button";

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all text-sm bg-white text-slate-800 placeholder-slate-400";

const labelClass =
  "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-left";

export default function RegisterForm({ formData, onChange, onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (onChange) {
      onChange({ [name]: value });
    }
  };

  const password = formData.password || '';
  const confirmPassword = formData.confirmPassword || '';

  const isMinLength = password.length >= 8;
  const isMatching = password && password === confirmPassword;

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100 w-full max-w-xl h-fit">
      <div className="mb-6 text-left">
        <h2 className="text-2xl font-bold text-slate-850">Create account</h2>
        <p className="text-sm text-slate-500 mt-1">Start managing cookie consent today</p>
      </div>

      <form onSubmit={onSubmit} className="w-full text-left">
        {/* Name Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={labelClass} htmlFor="reg-firstname">
              First Name <span className="text-blue-500">*</span>
            </label>
            <input
              type="text"
              id="reg-firstname"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName || ''}
              onChange={handleChange}
              required
              className={`${inputClass} h-[46px] py-0`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="reg-lastname">
              Last Name <span className="text-blue-500">*</span>
            </label>
            <input
              type="text"
              id="reg-lastname"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName || ''}
              onChange={handleChange}
              required
              className={`${inputClass} h-[46px] py-0`}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="reg-email">
            Email <span className="text-blue-500">*</span>
          </label>
          <input
            type="email"
            id="reg-email"
            name="email"
            placeholder="you@company.com"
            value={formData.email || ''}
            onChange={handleChange}
            required
            className={`${inputClass} h-[46px] py-0`}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="reg-password">
            Password <span className="text-blue-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="reg-password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={handleChange}
              required
              className={`${inputClass} h-[46px] py-0 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-650 focus:outline-none cursor-pointer"
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="reg-confirmpassword">
            Confirm Password <span className="text-blue-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="reg-confirmpassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleChange}
              required
              className={`${inputClass} h-[46px] py-0 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-655 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="submit-div">
          <Button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all active:scale-[0.98] text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </div>
  );
}
