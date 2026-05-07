import { useState } from 'react';
import { X, XCircle } from 'lucide-react';

export default function AnnulerModal({ contrat, onConfirm, onClose, loading }) {
  const [motif, setMotif] = useState('');
  const [error, setError] = useState('');

  function handleConfirm() {
    if (!motif.trim()) {
      setError('Le motif est obligatoire (RG-M4-07)');
      return;
    }
    onConfirm(motif.trim());
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Annuler ce contrat</h2>
            <p>Un motif est obligatoire (RG-M4-07)</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div
            className="confirm-icon"
            style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(247,111,111,0.15)',
              color: 'var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <XCircle size={28} />
          </div>

          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 18 }}>
            Le contrat{' '}
            <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              #{contrat.id}
            </strong>{' '}
            (Employé{' '}
            <strong style={{ color: 'var(--text)' }}>#{contrat.employeId}</strong>) passera
            au statut <span style={{ color: 'var(--red)' }}>ANNULÉ</span> de façon définitive.
          </p>

          <div className="form-group">
            <label className="form-label">
              Motif d'annulation <span className="required">*</span>
            </label>
            <textarea
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="Ex : Rupture période d'essai, Faute grave, Accord des parties…"
              value={motif}
              onChange={(e) => { setMotif(e.target.value); setError(''); }}
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }}
            />
            {error && <span className="form-error">{error}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Retour
          </button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Annulation…</>
            ) : (
              <><XCircle size={15} /> Confirmer l'annulation</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}