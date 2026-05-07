import { X, PlayCircle } from 'lucide-react';

export default function ConfirmModal({ contrat, onConfirm, onClose, loading }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Activer ce contrat ?</h2>
            <p>Cette action est irréversible</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="confirm-icon warning">
            <PlayCircle size={28} />
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>
            Le contrat{' '}
            <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
              #{contrat.id}
            </strong>{' '}
            de l'employé{' '}
            <strong style={{ color: 'var(--text)' }}>#{contrat.employeId}</strong> passera
            au statut <span style={{ color: 'var(--green)' }}>EN COURS</span>.
          </p>

          <div
            style={{
              marginTop: 16,
              padding: '12px 14px',
              background: 'var(--bg3)',
              borderRadius: 8,
              border: '1px solid var(--border)',
              fontSize: 13,
              color: 'var(--text3)',
              lineHeight: 1.6,
            }}
          >
            ⚠ Tout contrat <strong>EN COURS</strong> existant pour cet employé sera
            automatiquement clôturé (RG-M4-01).
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Annuler
          </button>
          <button className="btn btn-success" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Activation…</>
            ) : (
              <><PlayCircle size={15} /> Activer</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
