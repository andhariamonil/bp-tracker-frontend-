// Returns true if the last reading was within the past 10 hours
export function isWithinTenHours(lastReadingCreatedAt) {
  if (!lastReadingCreatedAt) return false;
  const last = new Date(lastReadingCreatedAt);
  const now  = new Date();
  const diffHours = (now - last) / (1000 * 60 * 60);
  return diffHours <= 10;
}

export function todayString() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

export function currentTimeString() {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // HH:MM
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function bpCategory(upper, lower) {
  if (upper < 120 && lower < 80)  return { label: 'Normal',       color: 'text-green-600' };
  if (upper < 130 && lower < 80)  return { label: 'Elevated',     color: 'text-yellow-600' };
  if (upper < 140 || lower < 90)  return { label: 'High Stage 1', color: 'text-orange-600' };
  if (upper >= 180 || lower >= 120) return { label: 'Crisis',     color: 'text-red-700 font-bold' };
  return                                   { label: 'High Stage 2', color: 'text-red-600' };
}