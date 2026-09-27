import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Sparkles, HelpCircle, CheckCircle2, ArrowRight, Award, Scale, Globe, Building2 } from 'lucide-react';

export default function HrInsightsView() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await api.getInsights();
      setInsights(data || []);
      if (data && data.length > 0) {
        setSelectedInsight(data[0]);
      }
    } catch (err) {
      console.error('Failed to load HR insights', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    Department: Building2,
    Geography: Globe,
    Equity: Scale,
    Performance: Award,
    'Career Growth': Sparkles,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 glass-card rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" /> HR Smart Insights & Pay Intelligence
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Automated intelligence answering key executive questions regarding how ACME compensates its 10,000 employees.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <span>Computing organization pay intelligence...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Selector List */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Executive HR Questions
            </h3>

            {insights.map((item) => {
              const Icon = categoryIcons[item.category] || HelpCircle;
              const isSelected = selectedInsight?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedInsight(item)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white border-purple-400/50 shadow-lg shadow-purple-500/20 font-semibold'
                      : 'glass-card text-slate-300 border-slate-800 hover:border-purple-500/30 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-purple-400'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold opacity-80 uppercase tracking-wider">{item.category}</div>
                      <div className="text-xs leading-snug">{item.question}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Insight Visual Detail */}
          <div className="lg:col-span-2 glass-card p-8 rounded-2xl border border-purple-500/30 flex flex-col justify-between space-y-6">
            {selectedInsight && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold uppercase tracking-wider">
                      {selectedInsight.category} Analysis
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white">
                    {selectedInsight.question}
                  </h3>

                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Key Finding</div>
                    <p className="text-base text-slate-100 leading-relaxed font-medium">
                      {selectedInsight.answer}
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-tr from-purple-900/30 via-slate-900 to-indigo-900/30 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase">Headline Metric</div>
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-1">
                      {selectedInsight.metric}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4" /> Verified Data Snapshot
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
