const LOCALE = 'fr-FR';
const DATE = { day: '2-digit', month: 'short', year: 'numeric' };

export function formatDate(ts) {
  return ts ? new Date(ts).toLocaleDateString(LOCALE, DATE) : '';
}

export function formatDateTime(ts) {
  return ts
    ? new Date(ts).toLocaleString(LOCALE, { ...DATE, hour: '2-digit', minute: '2-digit' })
    : 'N/A';
}

export function formatTime(ts) {
  return ts ? new Date(ts).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' }) : '';
}
