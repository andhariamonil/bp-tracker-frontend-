import { useState } from 'react';
import { todayString, bpCategory } from '../utils/dateLogic';

export default function AverageResult({ average, onSave, getEntryDate }) {
  const [date,    setDate]    = useState(getEntryDate() || todayString());
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const needsDate = !getEntryDate();
  const cat = bpCategory(average.upper, average.lower);

  const handleSave = async () => {
    setSaving(true);
    await onSave(date);
    setSaved(true);
    setSaving(false);
  };

  return (
    <div className="card border-2 border-medical-200 bg-gradient-to-br from-medical-50 to-white">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-medical-500 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-slate-700">Average Result</h2>
          <span className={`text-xs font-semibold ${cat.color}`}>{cat.label}</span>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="stat-chip">
          <span className="text-xs text-slate-500 mb-1">Systolic</span>
          <span className="text-2xl font-bold text-medical-600 font-mono">{average.upper}</span>
          <span className="text-xs text-slate-400">mmHg</span>
        </div>
        <div className="stat-chip">
          <span className="text-xs text-slate-500 mb-1">Diastolic</span>
          <span className="text-2xl font-bold text-medical-600 font-mono">{average.lower}</span>
          <span className="text-xs text-slate-400">mmHg</span>
        </div>
        <div className="stat-chip">
          <span className="text-xs text-slate-500 mb-1">Pulse</span>
          <span className="text-2xl font-bold text-slate-700 font-mono">{average.pulse}</span>
          <span className="text-xs text-slate-400">bpm</span>
        </div>
      </div>

      {needsDate && !saved && (
        <div className="mb-3">
          <label className="label">Record Date</label>
          <input type="date" className="input" value={date} max={todayString()} onChange={e => setDate(e.target.value)} />
        </div>
      )}

      {!saved ? (
        <button className="btn-primary w-full" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save Daily Record'}
        </button>
      ) : (
        <div className="text-center py-2 text-green-600 font-medium text-sm">✓ Saved to history!</div>
      )}
    </div>
  );
}