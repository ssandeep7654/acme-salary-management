import React from 'react';
import { LayoutDashboard, Users, Sparkles, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Pay Analytics',
      sublabel: 'Macro Payroll Metrics',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      id: 'directory',
      label: 'Employee Directory',
      sublabel: '10,000 Staff Records',
      icon: Users,
      badge: '10k'
    },
    {
      id: 'insights',
      label: 'HR Smart Insights',
      sublabel: 'Pay Equity & Q&A',
      icon: Sparkles,
      badge: 'AI'
    },
    {
      id: 'import_export',
      label: 'Bulk Ingestion',
      sublabel: 'CSV Upload & Export',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <aside className="w-64 glass-card border-r border-slate-800/80 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Management Portal
          </div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-500/25 font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-sm leading-tight">{item.label}</div>
                      <div className={`text-[11px] ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {item.sublabel}
                      </div>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Security & Audit Active</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          All salary modifications are logged with full historical revision history for compliance.
        </p>
      </div>
    </aside>
  );
}
