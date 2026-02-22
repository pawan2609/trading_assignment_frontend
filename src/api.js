const API_BASE = 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
}

export const api = {
  getState:      () => request('/api/state'),
  getTrades:     () => request('/api/trades'),
  getPositions:  () => request('/api/positions'),
  getPnl:        () => request('/api/pnl'),
  getConfig:     () => request('/api/config'),
  getRejections: () => request('/api/rejections'),

  kill:   () => request('/api/kill',   { method: 'POST' }),
  pause:  () => request('/api/pause',  { method: 'POST' }),
  resume: () => request('/api/resume', { method: 'POST' }),
  stop:   () => request('/api/stop',   { method: 'POST' }),

  start: (symbol) =>
    request('/api/start', {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    }),

  backtest: (symbol, startDate, endDate) =>
    request('/api/backtest', {
      method: 'POST',
      body: JSON.stringify({
        symbol,
        start_date: startDate,
        end_date: endDate,
      }),
    }),
};
