import { useState, useEffect, useCallback } from 'react';
import PersonSelector from './components/PersonSelector';
import ReadingForm    from './components/ReadingForm';
import ReadingsList   from './components/ReadingsList';
import AverageResult  from './components/AverageResult';
import HistoryTable   from './components/HistoryTable';
import PDFDownload    from './components/PDFDownload';
import { getReadings, createReading, deleteReading, getRecords, saveRecord, deleteRecord } from './utils/api';
import { isWithinTenHours, todayString, currentTimeString } from './utils/dateLogic';
import { supabase } from './utils/supabase';

export default function App() {
  const [person,    setPerson]    = useState(null);   // { id, name }
  const [readings,  setReadings]  = useState([]);
  const [records,   setRecords]   = useState([]);
  const [average,   setAverage]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [toast,     setToast]     = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load readings & records when person changes
  const loadData = useCallback(async () => {
    if (!person) return;
    setLoading(true);
    try {
      const [r, rec] = await Promise.all([
        getReadings(person.id),
        getRecords(person.id),
      ]);
      setReadings(r);
      setRecords(rec);
    } catch (e) { showToast(e.message, 'error'); }
    finally     { setLoading(false); }
  }, [person]);

  useEffect(() => { loadData(); }, [loadData]);

  // Real-time sync via Supabase
  useEffect(() => {
    if (!person) return;
    const channel = supabase
      .channel(`person_${person.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'records',
        filter: `person_id=eq.${person.id}`,
      }, () => loadData())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'readings',
        filter: `person_id=eq.${person.id}`,
      }, () => loadData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [person, loadData]);

  // Determine date for new reading
  const getEntryDate = () => {
    const lastReading = readings[0];
    if (isWithinTenHours(lastReading?.created_at)) return todayString();
    return null; // caller must prompt for date
  };

  const handleAddReading = async (formData) => {
    try {
      const newR = await createReading({ person_id: person.id, ...formData });
      setReadings(prev => [newR, ...prev]);
      setAverage(null);
      showToast('Reading added!');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleDeleteReading = async (id) => {
    try {
      await deleteReading(id);
      setReadings(prev => prev.filter(r => r.id !== id));
      setAverage(null);
      showToast('Reading removed');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleCalculateAverage = () => {
    if (readings.length === 0) return;
    const avg = (key) =>
      Math.round((readings.reduce((s, r) => s + Number(r[key]), 0) / readings.length) * 10) / 10;
    setAverage({
      upper: avg('upper_bp'),
      lower: avg('lower_bp'),
      pulse: avg('pulse'),
    });
  };

  const handleSaveAverage = async (avg, date) => {
    try {
      const newRec = await saveRecord({
        person_id:   person.id,
        avg_upper:   avg.upper,
        avg_lower:   avg.lower,
        avg_pulse:   avg.pulse,
        record_date: date,
        record_time: currentTimeString(),
      });
      setRecords(prev => [newRec, ...prev]);
      setReadings([]);      // clear session readings
      setAverage(null);
      showToast('Daily average saved!');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteRecord(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      showToast('Record deleted');
    } catch (e) { showToast(e.message, 'error'); }
  };

  if (!person) {
    return <PersonSelector onSelect={setPerson} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all
          ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-medical-500 text-white px-4 pt-12 pb-6 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-medical-100 text-xs uppercase tracking-widest font-medium">BP Tracker</p>
            <h1 className="text-xl font-bold capitalize">{person.name}</h1>
          </div>
          <button
            onClick={() => { setPerson(null); setReadings([]); setRecords([]); setAverage(null); }}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-all"
          >
            Switch Person
          </button>
        </div>
        <p className="text-medical-100 text-xs mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </header>

      <main className="px-4 py-5 space-y-4 max-w-lg mx-auto pb-10">
        {/* Add reading form */}
        <ReadingForm
          onAdd={handleAddReading}
          getEntryDate={getEntryDate}
          lastReadingAt={readings[0]?.created_at}
        />

        {/* Session readings */}
        {readings.length > 0 && (
          <ReadingsList
            readings={readings}
            onDelete={handleDeleteReading}
            onCalculate={handleCalculateAverage}
          />
        )}

        {/* Average result */}
        {average && (
          <AverageResult
            average={average}
            onSave={(date) => handleSaveAverage(average, date)}
            getEntryDate={getEntryDate}
          />
        )}

        {/* History + PDF */}
        {records.length > 0 && (
          <>
            <HistoryTable records={records} onDelete={handleDeleteRecord} />
            <PDFDownload personName={person.name} records={records} />
          </>
        )}

        {loading && (
          <div className="text-center py-8 text-slate-400 text-sm">Loading…</div>
        )}
      </main>
    </div>
  );
}