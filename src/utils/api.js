const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Persons
export const getPersons      = ()       => req('/persons');
export const createPerson    = (name)   => req('/persons', { method: 'POST', body: JSON.stringify({ name }) });

// Readings
export const getReadings     = (pid)    => req(`/readings/${pid}`);
export const createReading   = (data)   => req('/readings', { method: 'POST', body: JSON.stringify(data) });
export const deleteReading   = (id)     => req(`/readings/${id}`, { method: 'DELETE' });

// Records
export const getRecords      = (pid)    => req(`/records/${pid}`);
export const saveRecord      = (data)   => req('/records', { method: 'POST', body: JSON.stringify(data) });
export const deleteRecord    = (id)     => req(`/records/${id}`, { method: 'DELETE' });