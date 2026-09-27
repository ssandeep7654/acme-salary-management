import React from 'react';
import { Building2, UserCheck, Search, Bell, Globe } from 'lucide-react';

export default function Navbar({ searchTerm, setSearchTerm, activeTab }) {
  return (
    <header className="sticky top-0 z-30 glass-card border-b border-slate-800/80 px-6 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              ACME <span className="gradient-text">Compensation Hub</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Enterprise HR Salary Management</p>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex items-center relative w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search 10,000 employees by name, code, title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900/80 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
            <Globe className="h-3.5 w-3.5 text-indigo-400" />
            <span>USD Normalized Baseline</span>
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
              HR
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-slate-200">Sarah Jenkins</div>
              <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <UserCheck className="h-3 w-3" /> HR Manager
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
