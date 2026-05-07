const BASE_URL = 'http://localhost:3004';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let msg = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      msg = body.message || body.error || msg;
    } catch {}
    throw new Error(msg);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const contratApi = {
  getAll:  ()                => request('/contrats'),
  create:  (payload)         => request('/contrats', { method: 'POST', body: JSON.stringify(payload) }),
  activer: (id)              => request(`/contrats/${id}/activer`, { method: 'PUT' }),
  annuler: (id, motif)       => request(`/contrats/${id}/annuler`, {
    method: 'PUT',
    body: JSON.stringify({ motif }),
  }),
};