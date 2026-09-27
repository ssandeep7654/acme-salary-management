import React, { useState } from 'react';
import { api } from '../api/client';
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function BulkImportView({ onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.bulkImport(formData);
      setResult(res);
      if (onImportSuccess) onImportSuccess();
    } catch (err) {
      setResult({ errors: ['Failed to upload and parse CSV file. Ensure valid format.'] });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadExport = () => {
    window.open(api.getExportUrl(), '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 glass-card rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-indigo-400" /> Bulk Ingestion & CSV Data Management
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Seamlessly transition Excel salary spreadsheets into ACME Compensation Hub or export active employee datasets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import Box */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Import Employee Salary CSV</h3>
              <p className="text-xs text-slate-400">Upload bulk employee records</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 text-center transition-all bg-slate-900/40">
              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="csv-file-input" className="cursor-pointer space-y-2 block">
                <FileSpreadsheet className="h-10 w-10 text-slate-500 mx-auto" />
                <div className="text-xs text-slate-300 font-semibold">
                  {file ? file.name : 'Click to select or drag CSV file'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Headers required: employee_code, first_name, last_name, email, department, current_salary, currency
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {uploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Processing Bulk CSV...' : 'Upload & Process CSV'}
            </button>
          </form>

          {result && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
              {result.success_count !== undefined && (
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Processed {result.success_count} of {result.total_rows} records.
                </div>
              )}
              {result.errors && result.errors.length > 0 && (
                <div className="space-y-1 text-rose-400">
                  <div className="flex items-center gap-1 font-bold">
                    <AlertCircle className="h-4 w-4" /> Errors encountered:
                  </div>
                  <ul className="list-disc pl-5 text-[11px] space-y-0.5 max-h-32 overflow-y-auto">
                    {result.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Export Box */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Export Global Salary Report</h3>
                <p className="text-xs text-slate-400">Download current employee dataset</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Generates a full CSV report of active employees including localized salary, USD normalized compensation, department, country, and performance ratings.
            </p>
          </div>

          <button
            onClick={handleDownloadExport}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" /> Download Complete Salary CSV Report
          </button>
        </div>
      </div>
    </div>
  );
}
