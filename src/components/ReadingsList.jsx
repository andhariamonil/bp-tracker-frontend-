import { bpCategory } from '../utils/dateLogic';

export default function ReadingsList({ readings, onDelete, onCalculate }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <h2 className="font-semibold text-slate-700">Session Readings</h2>
        </div>
        <span className="text-xs bg-medical-100 text-medical-700 px-2 py-1 rounded-full font-medium">
          {readings.length} entry{readings.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {readings.map((r, i) => {
          const cat = bpCategory(r.upper_bp, r.lower_bp);
          return (
            <div key={r.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-medical-100 text-medical-600 text-xs font-bold rounded-full flex items-center justify-center">
                  {readings.length - i}
                </span>
                <div>
                  <span className="text-slate-700 font-mono font-medium text-sm">
                    {r.upper_bp}/{r.lower_bp}
                    <span className="text-slate-400 font-sans text-xs ml-1">mmHg</span>
                  </span>
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="text-slate-600 text-sm">{r.pulse} <span className="text-slate-400 text-xs">bpm</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${cat.color}`}>{cat.label}</span>
                <button
                  onClick={() => onDelete(r.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn-primary w-full" onClick={onCalculate}>
        Calculate Average →
      </button>
    </div>
  );
}