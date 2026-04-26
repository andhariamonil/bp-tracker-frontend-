import { useState, useEffect } from 'react';
import { getPersons, createPerson } from '../utils/api';

export default function PersonSelector({ onSelect }) {
  const [name,    setName]    = useState('');
  const [persons, setPersons] = useState([]);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPersons().then(setPersons).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return setError('Please enter a name');
    setError('');
    setLoading(true);
    try {
      const person = await createPerson(trimmed);
      onSelect(person);
    } catch (e) { setError(e.message); }
    finally     { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-500 to-medical-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Hero */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold">BP Tracker</h1>
          <p className="text-medical-100 text-sm mt-1">Blood Pressure Monitoring System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl">
          <h2 className="text-slate-700 font-semibold text-lg mb-1">Who's tracking today?</h2>
          <p className="text-slate-400 text-sm mb-5">Enter your name to access your records</p>

          <label className="label">Your Name</label>
          <input
            className="input mb-3"
            placeholder="e.g. Ramesh Patel"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          <button
            className="btn-primary w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Continue →'}
          </button>

          {/* Existing persons */}
          {persons.length > 0 && (
            <div className="mt-5">
              <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-2">Recent persons</p>
              <div className="space-y-2">
                {persons.slice(0, 5).map(p => (
                  <button
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-medical-50 text-slate-600 hover:text-medical-700 text-sm font-medium transition-all capitalize"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}