import { formatDate, bpCategory } from '../utils/dateLogic';

export default function HistoryTable({ records, onDelete }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <h2 className="font-semibold text-slate-700">Daily History</h2>
        <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{records.length} records</span>
      </div>

      <div className="space-y-2">
        {records.map(r => {
          const cat = bpCategory(Number(r.avg_upper), Number(r.avg_lower));
          return (
            <div key={r.id} className="bg-slate-50 rounded-xl p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-slate-700 text-sm font-medium">{formatDate(r.record_date)}</p>
                  <p className="text-slate-400 text-xs">{r.record_time?.slice(0,5)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white ${cat.color}`}>
                    {cat.label}
                  </span>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 text-center bg-white rounded-lg py-1.5">
                  <p className="text-xs text-slate-400">Systolic</p>
                  <p className="font-bold text-medical-600 font-mono">{Number(r.avg_upper).toFixed(1)}</p>
                </div>
                <div className="flex-1 text-center bg-white rounded-lg py-1.5">
                  <p className="text-xs text-slate-400">Diastolic</p>
                  <p className="font-bold text-medical-600 font-mono">{Number(r.avg_lower).toFixed(1)}</p>
                </div>
                <div className="flex-1 text-center bg-white rounded-lg py-1.5">
                  <p className="text-xs text-slate-400">Pulse</p>
                  <p className="font-bold text-slate-700 font-mono">{Number(r.avg_pulse).toFixed(1)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}