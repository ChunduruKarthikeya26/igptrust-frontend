import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/85 z-50 flex items-center justify-between px-6 md:px-12">
      <Link to="/" className="flex items-center gap-2.5 hover:opacity-95 transition-opacity">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#111111" />
          <circle cx="16" cy="16" r="8" stroke="#44BCF3" strokeWidth="3" strokeLinecap="round" strokeDasharray="20 10" />
          <circle cx="16" cy="16" r="2" fill="#44BCF3" />
        </svg>
        <span className="text-xl font-extrabold text-slate-900 tracking-tight">
          i<span className="text-[#44BCF3]">CMP</span>
        </span>
      </Link>
      
      <nav className="flex items-center gap-6">
        <a 
          href="https://docs.consentmanager.dev" 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-full shadow-md shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
        >
          Documentation
        </a>
      </nav>
    </header>
  );
}
