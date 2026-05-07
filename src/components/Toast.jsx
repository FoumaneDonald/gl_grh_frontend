import { useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

// ── Singleton store ──────────────────────────────
let _addToast = null;

export function toast(type, message) {
  if (_addToast) _addToast({ type, message, id: Date.now() });
}
toast.success = (m) => toast('success', m);
toast.error   = (m) => toast('error', m);
toast.info    = (m) => toast('info', m);

// ── Provider component ───────────────────────────
export function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 4000);
  }, []);

  useEffect(() => { _addToast = addToast; }, [addToast]);

  const icons = {
    success: <CheckCircle size={16} />,
    error: <XCircle size={16} />,
    info: <AlertCircle size={16} />,
  };

  const colors = {
    success: { bg: 'rgba(62,207,142,0.1)', border: 'rgba(62,207,142,0.25)', color: '#3ecf8e' },
    error:   { bg: 'rgba(247,111,111,0.1)', border: 'rgba(247,111,111,0.25)', color: '#f76f6f' },
    info:    { bg: 'rgba(79,142,247,0.1)', border: 'rgba(79,142,247,0.25)', color: '#4f8ef7' },
  };

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const c = colors[t.type] || colors.info;
        return (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: 'var(--bg2)',
              border: `1px solid ${c.border}`,
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              color: c.color,
              fontSize: '13.5px',
              fontFamily: 'var(--font-body)',
              minWidth: '280px',
              animation: 'slideUp 0.2s ease',
            }}
          >
            {icons[t.type]}
            <span style={{ flex: 1, color: 'var(--text)' }}>{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
