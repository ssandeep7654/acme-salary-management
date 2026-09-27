import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
  DollarSign,
  Users,
  TrendingUp,
  Scale,
  Award,
  Globe2,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

export default function DashboardView() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [genderData, setGenderData] = useState(null);
  const [perfData, setPerfData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [ov, countries, depts, gender, perf] = await Promise.all([
        api.getOverview(),
        api.getByCountry(),
        api.getByDepartment(),
        api.getGenderPayEquity(),
        api.getPerformanceVsSalary(),
      ]);

      setOverview(ov);
      setCountryData(countries);
      setDepartmentData(depts);
      setGenderData(gender);
      setPerfData(perf);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="text-sm font-medium text-slate-400">Loading ACME Global Payroll Analytics...</div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#3b82f6', '#f59e0b', '#06b6d4', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-card border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Executive Compensation Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time analytics across 10,000 employees in 8 global regions (USD Normalized).
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="self-start md:self-auto px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/50 transition-all flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" /> Refresh Metrics
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Payroll */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Payroll Spend</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ${overview?.total_payroll_usd ? (overview.total_payroll_usd / 1_000_000).toFixed(2) : 0}M
          </div>
          <div className="text-xs text-indigo-300 mt-2 font-medium">
            Annual Global Spend (USD)
          </div>
        </div>

        {/* Card 2: Employees */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Headcount</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {overview?.total_employees?.toLocaleString()}
          </div>
          <div className="text-xs text-purple-300 mt-2 font-medium">
            Active Global Workforce
          </div>
        </div>

        {/* Card 3: Median Salary */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-pink-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Median Compensation</span>
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ${overview?.median_salary_usd?.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Avg: ${overview?.average_salary_usd?.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 4: Gender Pay Equity */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pay Equity Index</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {overview?.gender_pay_equity_ratio}%
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Female to Male Median Pay Ratio
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Department Spend */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-400" /> Department Compensation Spend
              </h3>
              <p className="text-xs text-slate-400">Total payroll & employee count by department</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()} USD`, 'Total Spend']}
                />
                <Bar dataKey="total_spend_usd" fill="url(#indigoGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Country Distribution */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-purple-400" /> Regional Workforce Spend
              </h3>
              <p className="text-xs text-slate-400">Payroll spend distribution across countries</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countryData}
                  dataKey="total_spend_usd"
                  nameKey="country"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()} USD`, 'Spend']}
                />
                <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Department Gender Pay Equity */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="h-4 w-4 text-pink-400" /> Gender Pay Equity by Department
              </h3>
              <p className="text-xs text-slate-400">Female vs Male Median Salary (USD)</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData?.departments || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()} USD`, 'Median Pay']}
                />
                <Legend />
                <Bar dataKey="female_median_usd" name="Female Median" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="male_median_usd" name="Male Median" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Performance Rating vs Salary */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-400" /> Pay vs Performance Rating
              </h3>
              <p className="text-xs text-slate-400">Average compensation progression by performance score (1-5)</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="performance_rating" stroke="#94a3b8" tickFormatter={(v) => `Rating ${v}`} fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()} USD`, 'Average Salary']}
                />
                <Area type="monotone" dataKey="avg_salary_usd" stroke="#10b981" fill="url(#emeraldArea)" strokeWidth={3} />
                <defs>
                  <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
