import React from 'react';

export const RegisterCodeForm = ({ formData = {} }) => {
  const maskPassword = (password) => {
    if (!password) return '••••••••';
    return '•'.repeat(Math.min(password.length, 12));
  };

  const lines = [
    <><span className="text-blue-500">curl</span> <span className="text-slate-400">-X POST</span> <span className="text-slate-800">'https://api.consentmanager.dev/v1/auth/register' \</span></>,
    <><span className="text-slate-400 pl-4">-H</span> <span className="text-slate-800">'Content-Type: application/json' \</span></>,
    <><span className="text-slate-400 pl-4">-d</span> <span className="text-slate-850">'&#123;</span></>,
    <><span className="text-slate-850 pl-8">"first_name":</span> <span className="text-blue-500">"{formData.firstName || 'First Name'}"</span>,</>,
    <><span className="text-slate-850 pl-8">"last_name":</span> <span className="text-blue-500">"{formData.lastName || 'Last Name'}"</span>,</>,
    <><span className="text-slate-850 pl-8">"email":</span> <span className="text-blue-500">"{formData.email || 'you@company.com'}"</span>,</>,
    <><span className="text-slate-850 pl-8">"password":</span> <span className="text-blue-500">"{maskPassword(formData.password)}"</span></>,
    <><span className="text-slate-850 pl-4">&#125;'</span></>,
  ];

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 w-full font-mono text-sm overflow-hidden h-fit">
      <div className="flex flex-col w-full">
        {lines.map((line, i) => (
          <div key={i} className="flex items-start leading-7 w-full text-left">
            <div className="text-slate-300 pr-6 select-none w-10 text-right shrink-0">{i + 1}</div>
            <div className="flex-1 min-w-0 text-slate-600 whitespace-pre-wrap break-words text-left">{line}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
