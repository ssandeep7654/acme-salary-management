import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
  X,
  User,
  Building2,
  Globe,
  Calendar,
  DollarSign,
  TrendingUp,
  History,
  Award,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EmployeeDetailModal({ employeeId, onClose, onAdjustSalary }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      loadEmployeeDetails();
    }
  }, [employeeId]);

  const loadEmployeeDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getEmployee(employeeId);
      setData(res);
    } catch (err) {
      console.error('Failed to load employee details', err);
    } finally {
      setLoading(false);
    }
  };

  if (!employeeId) return null;

  const employee = data?.employee;
  const histories = data?.salary_histories || [];

  // Sort histories chronologically for progression chart
  const chartData = [...histories]
    .sort((a, b) => new Date(a.effective_from) - new Date(b.effective_from))
    .map((h) => ({
      date: h.effective_from,
      salary: h.salary,
      bonus: h.bonus,
      reason: h.change_reason,
    }));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-3xl rounded-2xl border border-slate-800 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold">
                {employee?.employee_code}
              </span>
              <span className="text-xs text-slate-400 font-medium">Employee Profile</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{employee?.full_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <span>Fetching detailed compensation audit trail...</span>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
            {/* Quick Profile Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                  <Building2 className="h-3.5 w-3.5 text-indigo-400" /> Dept & Role
                </div>
                <div className="font-bold text-white text-xs">{employee?.job_title}</div>
                <div className="text-indigo-400 text-[11px]">{employee?.department}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                  <Globe className="h-3.5 w-3.5 text-purple-400" /> Region
                </div>
                <div className="font-bold text-white text-xs">{employee?.country}</div>
                <div className="text-purple-400 text-[11px]">{employee?.currency} Base</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Current Pay
                </div>
                <div className="font-bold text-emerald-400 text-xs">
                  {employee?.currency} {employee?.current_salary?.toLocaleString()}
                </div>
                <div className="text-slate-400 text-[11px]">${employee?.current_salary_usd?.toLocaleString()} USD</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 mb-1 flex items-center gap-1.5 font-medium">
                  <Award className="h-3.5 w-3.5 text-amber-400" /> Performance
                </div>
                <div className="font-bold text-amber-400 text-xs">Rating {employee?.performance_rating} / 5</div>
                <div className="text-slate-400 text-[11px]">Gender: {employee?.gender}</div>
              </div>
            </div>

            {/* Salary Progression Chart */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-400" /> Salary Growth Timeline
                </h3>
                <span className="text-[11px] text-slate-400">{histories.length} Historical Revisions</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                      formatter={(val, name) => [`${employee?.currency} ${Number(val).toLocaleString()}`, name]}
                    />
                    <Line type="monotone" dataKey="salary" name="Base Salary" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Salary History Table Log */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <History className="h-4 w-4 text-purple-400" /> Historical Compensation Audit Log
                </h3>
                <button
                  onClick={() => {
                    onClose();
                    onAdjustSalary(employee);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/40 font-bold transition-all flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Record Salary Adjustment
                </button>
              </div>

              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 uppercase text-[10px] font-bold text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Effective Date</th>
                      <th className="py-2.5 px-3">Base Salary</th>
                      <th className="py-2.5 px-3">Bonus</th>
                      <th className="py-2.5 px-3">Reason</th>
                      <th className="py-2.5 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {histories.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-mono text-slate-300">{h.effective_from}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-100">
                          {h.currency} {h.salary?.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400">
                          +{h.currency} {h.bonus?.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                            {h.change_reason}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{h.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
