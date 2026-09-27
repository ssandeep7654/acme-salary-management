import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  UserPlus,
  RefreshCw,
  Building2,
  Globe
} from 'lucide-react';

export default function EmployeeListView({
  searchTerm,
  setSearchTerm,
  onSelectEmployee,
  onAdjustSalary,
  refreshTrigger
}) {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, per_page: 25, total_count: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [countryFilter, setCountryFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  // Add Employee Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState({
    employee_code: `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
    first_name: '',
    last_name: '',
    email: '',
    country: 'United States',
    department: 'Engineering',
    job_title: 'Software Engineer',
    employment_status: 'active',
    current_salary: 85000,
    currency: 'USD',
    gender: 'Female',
    hire_date: new Date().toISOString().split('T')[0],
    performance_rating: 4
  });

  useEffect(() => {
    fetchEmployees(1);
  }, [searchTerm, countryFilter, deptFilter, statusFilter, genderFilter, refreshTrigger]);

  const fetchEmployees = async (page = 1) => {
    setLoading(true);
    try {
      const data = await api.getEmployees({
        page,
        per_page: pagination.per_page,
        query: searchTerm,
        country: countryFilter,
        department: deptFilter,
        employment_status: statusFilter,
        gender: genderFilter,
        sort_by: 'id',
        order: 'desc'
      });
      setEmployees(data.employees || []);
      setPagination(data.pagination || { current_page: 1, per_page: 25, total_count: 0, total_pages: 1 });
    } catch (err) {
      console.error('Error fetching employees', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchEmployees(newPage);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove employee record for ${name}?`)) {
      try {
        await api.deleteEmployee(id);
        fetchEmployees(pagination.current_page);
      } catch (err) {
        alert('Failed to delete employee.');
      }
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.createEmployee(newEmp);
      setShowAddModal(false);
      fetchEmployees(1);
      alert('Employee record created successfully!');
    } catch (err) {
      alert('Failed to create employee. Ensure code & email are unique.');
    }
  };

  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    on_leave: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    terminated: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 glass-card rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Global Employee Directory
          </h2>
          <p className="text-xs text-slate-400">
            Managing <span className="text-indigo-400 font-semibold">{pagination.total_count.toLocaleString()}</span> employees across all global regions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" /> Add Employee
          </button>
        </div>
      </div>

      {/* Multi-Facet Filter Bar */}
      <div className="p-4 glass-card rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Filter className="h-3.5 w-3.5 text-indigo-400" /> Filters:
          </div>

          {/* Country Filter */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Countries (8)</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Germany">Germany</option>
            <option value="India">India</option>
            <option value="Singapore">Singapore</option>
            <option value="Japan">Japan</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-Binary">Non-Binary</option>
          </select>

          {(countryFilter || deptFilter || statusFilter || genderFilter || searchTerm) && (
            <button
              onClick={() => {
                setCountryFilter('');
                setDeptFilter('');
                setStatusFilter('');
                setGenderFilter('');
                setSearchTerm('');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="text-slate-400">
          Showing page <span className="text-slate-200 font-semibold">{pagination.current_page}</span> of {pagination.total_pages}
        </div>
      </div>

      {/* Directory Data Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 uppercase text-[11px] font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Employee Name</th>
                <th className="py-3.5 px-4">Department & Title</th>
                <th className="py-3.5 px-4">Country</th>
                <th className="py-3.5 px-4">Current Salary</th>
                <th className="py-3.5 px-4">USD Eqv.</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Fetching directory records...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No employee records match the specified filters.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-300">
                      {emp.employee_code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{emp.full_name}</div>
                      <div className="text-[11px] text-slate-400">{emp.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200 font-medium">{emp.job_title}</div>
                      <div className="text-[11px] text-indigo-400/80">{emp.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-300">
                        {emp.country}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-100">
                      {emp.currency} {emp.current_salary?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-300 font-medium">
                      ${emp.current_salary_usd?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold capitalize ${statusColors[emp.employment_status] || 'bg-slate-800 text-slate-400'}`}>
                        {emp.employment_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectEmployee(emp.id)}
                          title="View Full Profile & Salary History"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onAdjustSalary(emp)}
                          title="Record Salary Adjustment / Promotion"
                          className="p-1.5 rounded-lg bg-slate-800 text-emerald-400 hover:text-white hover:bg-emerald-600 transition-all"
                        >
                          <DollarSign className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id, emp.full_name)}
                          title="Delete Employee Record"
                          className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:text-white hover:bg-rose-600 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Bar */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Page {pagination.current_page} of {pagination.total_pages} ({pagination.total_count} Total Records)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.total_pages}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1 transition-all"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 rounded-2xl border border-slate-800 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Add New Employee</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newEmp.first_name}
                    onChange={(e) => setNewEmp({ ...newEmp, first_name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newEmp.last_name}
                    onChange={(e) => setNewEmp({ ...newEmp, last_name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newEmp.job_title}
                    onChange={(e) => setNewEmp({ ...newEmp, job_title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Country</label>
                  <select
                    value={newEmp.country}
                    onChange={(e) => setNewEmp({ ...newEmp, country: e.target.value, currency: e.target.value === 'United States' ? 'USD' : e.target.value === 'India' ? 'INR' : e.target.value === 'United Kingdom' ? 'GBP' : 'EUR' })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="United States">United States (USD)</option>
                    <option value="United Kingdom">United Kingdom (GBP)</option>
                    <option value="Germany">Germany (EUR)</option>
                    <option value="India">India (INR)</option>
                    <option value="Singapore">Singapore (SGD)</option>
                    <option value="Japan">Japan (JPY)</option>
                    <option value="Canada">Canada (CAD)</option>
                    <option value="Australia">Australia (AUD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Annual Salary ({newEmp.currency})</label>
                  <input
                    type="number"
                    required
                    value={newEmp.current_salary}
                    onChange={(e) => setNewEmp({ ...newEmp, current_salary: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
