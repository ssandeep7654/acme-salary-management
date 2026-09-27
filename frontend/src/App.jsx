import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import EmployeeListView from './components/EmployeeListView';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import SalaryAdjustmentModal from './components/SalaryAdjustmentModal';
import HrInsightsView from './components/HrInsightsView';
import BulkImportView from './components/BulkImportView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [adjustingEmployee, setAdjustingEmployee] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectEmployee = (id) => {
    setSelectedEmployeeId(id);
  };

  const handleAdjustSalary = (emp) => {
    setAdjustingEmployee(emp);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={(term) => {
          setSearchTerm(term);
          if (term && activeTab !== 'directory') {
            setActiveTab('directory');
          }
        }}
        activeTab={activeTab}
      />

      {/* Main Content Body */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content View Container */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}

          {activeTab === 'directory' && (
            <EmployeeListView
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSelectEmployee={handleSelectEmployee}
              onAdjustSalary={handleAdjustSalary}
              refreshTrigger={refreshTrigger}
            />
          )}

          {activeTab === 'insights' && <HrInsightsView />}

          {activeTab === 'import_export' && (
            <BulkImportView onImportSuccess={handleRefresh} />
          )}
        </main>
      </div>

      {/* Employee Detail & Salary History Drawer Modal */}
      {selectedEmployeeId && (
        <EmployeeDetailModal
          employeeId={selectedEmployeeId}
          onClose={() => setSelectedEmployeeId(null)}
          onAdjustSalary={handleAdjustSalary}
        />
      )}

      {/* Salary Adjustment / Promotion Modal */}
      {adjustingEmployee && (
        <SalaryAdjustmentModal
          employee={adjustingEmployee}
          onClose={() => setAdjustingEmployee(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
