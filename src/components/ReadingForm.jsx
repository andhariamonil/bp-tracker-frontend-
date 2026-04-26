import { useState } from 'react';
import { currentTimeString, todayString } from '../utils/dateLogic';

const FIELDS = [
  { key: 'upper', label: 'Systolic (Upper)', placeholder: '120', unit: 'mmHg', min: 50, max: 300 },
  { key: 'lower', label: 'Diastolic (Lower)', placeholder: '80',  unit: 'mmHg', min: 30, max: 200 },
  { key: 'pulse', label: 'Pulse',              placeholder: '72',  unit: 'bpm',  min: 20, max: 250 },
];

export default function ReadingForm({ onAdd, getEntryDate, lastReadingAt }) {
  const [form,   setForm]   = useState({ upper: '', lower: '', pulse: '', time: currentTimeString() });
  const [date,   setDate]   = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const needsDate = !getEntryDate();   // null means > 10h gap

  const validate = () => {
    const errs = {};
    FIELDS.forEach(({ key, min, max, label }) => {
      const v = parseInt(form[key]);
      if (!form[key]) errs[key] = 'Required';
      else if (isNaN(v) || v < min || v > max) errs[key] = `${label}: ${min}–${max}`;
    });
    if (!form.time) errs.time = 'Required';
    if (needsDate && !date) errs.date = 'Please select a date';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setLoading(true);
    const entryDate = needsDate ? date : getEntryDate();
    await onAdd({
      upper: parseInt(form.upper),
      lower: parseInt(form.lower),
      pulse: parseInt(form.pulse),
      time:  form.time,
      date:  entryDate,
    });
    setForm({ upper: '', lower: '', pulse: '', time: currentTimeString() });
    setDate('');
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-medical-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-medical-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <h2 className="font-semibold text-slate-700">Add Reading</h2>
      </div>

      {/* Date selector if needed */}
      {needsDate && (
        <div className="mb-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-amber-700 text-xs font-medium mb-2">
            ⏱ More than 10 hours since last reading — please select a date
          </p>
          <label className="label">Date</label>
          <input
            type="date"
            className={`input ${errors.date ? 'border-red-400' : ''}`}
            value={date}
            max={todayString()}
            onChange={e => { setDate(e.target.value); setErrors(p => ({ ...p, date: '' })); }}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>
      )}

      {/* BP fields */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {FIELDS.map(({ key, label, placeholder, unit }) => (
          <div key={key}>
            <label className="label">{label.split(' ')[0]}</label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                className={`input pr-10 ${errors[key] ? 'border-red-400' : ''}`}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })); }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">{unit}</span>
            </div>
            {errors[key] && <p className="text-red-500 text-xs mt-0.5">{errors[key]}</p>}
          </div>
        ))}
      </div>

      {/* Time */}
      <div className="mb-4">
        <label className="label">Time</label>
        <input
          type="time"
          className={`input ${errors.time ? 'border-red-400' : ''}`}
          value={form.time}
          onChange={e => { setForm(p => ({ ...p, time: e.target.value })); setErrors(p => ({ ...p, time: '' })); }}
        />
        {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
      </div>

      <button className="btn-primary w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Adding…' : '+ Add Reading'}
      </button>
    </div>
  );
}