import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "./ui/button";

const countries = [
  { code: "US", name: "United States", prefix: "+1" },
  { code: "GB", name: "United Kingdom", prefix: "+44" },
  { code: "CA", name: "Canada", prefix: "+1" },
  { code: "IN", name: "India", prefix: "+91" },
  { code: "AU", name: "Australia", prefix: "+61" },
  { code: "DE", name: "Germany", prefix: "+49" },
  { code: "FR", name: "France", prefix: "+33" },
  { code: "JP", name: "Japan", prefix: "+81" },
  { code: "BR", name: "Brazil", prefix: "+55" },
  { code: "MX", name: "Mexico", prefix: "+52" },
  { code: "IT", name: "Italy", prefix: "+39" },
  { code: "ES", name: "Spain", prefix: "+34" },
  { code: "NL", name: "Netherlands", prefix: "+31" },
  { code: "NZ", name: "New Zealand", prefix: "+64" },
  { code: "SG", name: "Singapore", prefix: "+65" },
];

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all text-sm bg-white text-slate-800 placeholder-slate-400";

const labelClass =
  "block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-left";

export default function LoginForm({ formData, onChange, onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (onChange) {
      onChange({ [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    } else {
      alert("Form submitted!\n" + JSON.stringify(formData, null, 2));
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100 w-full max-w-xl h-fit">
      <form
        name="email-form"
        data-name="Email Form"
        id="hb-form-1"
        className="w-full text-left"
        onSubmit={handleSubmit}
      >
        {/* Name field */}
        <div className="div-block-39 mb-6">
          <div className="hs_input_block-2">
            <label className={labelClass} htmlFor="name-3">
              Name <span className="text-blue-500">*</span>
            </label>

            <input
              type="text"
              id="name-3"
              name="name"
              placeholder="Name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              className={`${inputClass} hs_input-2 w-input h-[46px] py-0`}
            />
          </div>
        </div>

        {/* Email */}
        <div className="div-block-39 mb-6">
          <div className="hs_input_block-2">
            <label className={labelClass} htmlFor="email-5">
              Email ID <span className="text-blue-500">*</span>
            </label>

            <input
              type="email"
              id="email-5"
              name="workEmail"
              placeholder="Enter a Valid Email Address"
              value={formData.workEmail}
              onChange={handleChange}
              required
              className={`${inputClass} hs_input-2 w-input h-[46px] py-0`}
            />
          </div>
        </div>

        {/* Password */}
        <div className="div-block-39 mb-6">
          <div className="hs_input_block-2">
            <label className={labelClass} htmlFor="password-5">
              Password <span className="text-blue-500">*</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password-5"
                name="password"
                placeholder="Password"
                value={formData.password || ''}
                onChange={handleChange}
                required
                className={`${inputClass} hs_input-2 w-input h-[46px] py-0 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-450 hover:text-slate-650 focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>


        {/* Project details */}
        <div className="text-area-div mb-6">
          <label className={labelClass} htmlFor="message-6">
            Tell us about your project
          </label>

          <textarea
            id="message-6"
            name="projectDetails"
            placeholder="Tell us about your project..."
            value={formData.projectDetails}
            onChange={handleChange}
            maxLength={5000}
            rows={4}
            className={`${inputClass} hs_form_text_area textarea-2 div-block-textarea resize-none`}
          />
        </div>

        {/* Submit */}
        <div className="submit-div">
          <Button
            type="submit"
            id="demo-form-submit"
            disabled={loading}
            className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all active:scale-[0.98] text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  );
}
