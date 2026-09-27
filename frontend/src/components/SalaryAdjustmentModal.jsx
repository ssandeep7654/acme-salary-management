import React, { useState } from 'react';
import { api } from '../api/client';
import { X, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function SalaryAdjustmentModal({ employee, onClose, onSuccess }) {
  if (!employee) return null;

  const [salary, setSalary] = useState(employee.current_salary);
  const [bonus, setBonus] = useState(Math.round(employee.current_salary * 0.1));
  const [currency, setCurrency] = useState(employee.currency);
  const [effectiveFrom, setEffectiveFrom] = useState(new Date().toISOString().split('T')[0]);
  const [changeReason, setChangeReason] = useState('Annual Performance Review');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.addSalaryAdjustment(employee.id, {
        salary: parseFloat(salary),
        bonus: parseFloat(bonus),
        currency: currency,
        effective_from: effectiveFrom,
        change_reason: changeReason,
        notes: notes,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to record salary adjustment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pctChange = (((salary - employee.current_salary) / employee.current_salary) * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Record Salary Revision</h3>
            <p className="text-xs text-slate-400">
              Employee: <span className="text-slate-200 font-semibold">{employee.full_name}</span> ({employee.employee_code})
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Current Base Pay:</span>
            <span className="font-mono font-bold text-white">
              {employee.currency} {employee.current_salary?.toLocaleString()}
            </span>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">New Base Salary ({currency})</label>
            <input
              type="number"
              required
              min="0"
              step="100"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
            />
            {pctChange != 0 && (
              <div className={`mt-1 text-[11px] font-semibold flex items-center gap-1 ${pctChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                <TrendingUp className="h-3 w-3" /> Adjustment: {pctChange > 0 ? `+${pctChange}` : pctChange}%
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Annual Bonus ({currency})</label>
              <input
                type="number"
                min="0"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Effective Date</label>
              <input
                type="date"
                required
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Adjustment Reason</label>
            <select
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Annual Performance Review">Annual Performance Review</option>
              <option value="Promotion">Promotion</option>
              <option value="Market Adjustment">Market Adjustment</option>
              <option value="Merit Increase">Merit Increase</option>
              <option value="Role Transition">Role Transition</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Justification Notes</label>
            <textarea
              rows={2}
              placeholder="Provide reason or performance review notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Updating...' : 'Save Salary Revision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
