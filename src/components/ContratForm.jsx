import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:3004';
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const TYPE_OPTIONS = ['CDI', 'CDD', 'Stage'];

const INIT = {
  employeId: '',
  typeContrat: 'CDI',
  dateDebut: '',
  dateFin: '',
  echelonId: '',
};

export default function ContratForm({ onClose, onCreated }) {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [echelons, setEchelons] = useState([]);

  const dateFinRequired = form.typeContrat === 'CDD' || form.typeContrat === 'Stage';

  useEffect(() => {
    const loadEchelons = async () => {
      try {
        const response = await axios.get(`${API_URL}/echelons`, getHeaders());
        setEchelons(response.data);
      } catch (err) {
        console.error('Erreur chargement échelons:', err);
      }
    };
    loadEchelons();
  }, []);

  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'typeContrat' && value === 'CDI') next.dateFin = '';
      return next;
    });
    setErrors((e) => ({ ...e, [field]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.employeId.toString().trim()) e.employeId = 'Champ obligatoire';
    if (!form.typeContrat)                 e.typeContrat = 'Champ obligatoire';
    if (!form.dateDebut)                   e.dateDebut = 'Champ obligatoire';
    if (dateFinRequired && !form.dateFin)
      e.dateFin = 'Date de fin obligatoire pour CDD / Stage (RG-M4-02)';
    if (form.dateFin && form.dateDebut && form.dateFin <= form.dateDebut)
      e.dateFin = 'La date de fin doit être postérieure à la date de début';
    if (!form.echelonId)                   e.echelonId = 'Échelon obligatoire';
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    try {
      const selectedEchelon = echelons.find(e => e.id === Number(form.echelonId));
      const payload = {
        employeId:   Number(form.employeId),
        typeContrat: form.typeContrat,
        dateDebut:   form.dateDebut,
        dateFin:     form.dateFin || null,
        echelon:     selectedEchelon ? { id: selectedEchelon.id } : null,
      };
      await onCreated(payload);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Nouveau contrat</h2>
            <p>Remplissez les informations du contrat de travail</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            {/* ID Employé */}
            <div className="form-group full-width">
              <label className="form-label">
                ID Employé <span className="required">*</span>
              </label>
              <input
                className={`form-input ${errors.employeId ? 'error' : ''}`}
                type="number"
                min="1"
                placeholder="ex: 42"
                value={form.employeId}
                onChange={(e) => set('employeId', e.target.value)}
              />
              {errors.employeId && <span className="form-error">{errors.employeId}</span>}
              <span className="form-hint">Identifiant de l'employé depuis le module M1</span>
            </div>

            {/* Type de contrat */}
            <div className="form-group full-width">
              <label className="form-label">
                Type de contrat <span className="required">*</span>
              </label>
              <select
                className={`form-select ${errors.typeContrat ? 'error' : ''}`}
                value={form.typeContrat}
                onChange={(e) => set('typeContrat', e.target.value)}
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.typeContrat && <span className="form-error">{errors.typeContrat}</span>}
            </div>

            {/* Date début */}
            <div className="form-group">
              <label className="form-label">
                Date de début <span className="required">*</span>
              </label>
              <input
                className={`form-input ${errors.dateDebut ? 'error' : ''}`}
                type="date"
                value={form.dateDebut}
                onChange={(e) => set('dateDebut', e.target.value)}
              />
              {errors.dateDebut && <span className="form-error">{errors.dateDebut}</span>}
            </div>

            {/* Date fin */}
            <div className="form-group">
              <label className="form-label">
                Date de fin {dateFinRequired && <span className="required">*</span>}
              </label>
              <input
                className={`form-input ${errors.dateFin ? 'error' : ''}`}
                type="date"
                value={form.dateFin}
                onChange={(e) => set('dateFin', e.target.value)}
                disabled={form.typeContrat === 'CDI'}
                min={form.dateDebut || undefined}
              />
              {form.typeContrat === 'CDI' && (
                <span className="form-hint">Non applicable pour un CDI</span>
              )}
              {dateFinRequired && !errors.dateFin && (
                <span className="form-hint">Obligatoire pour CDD / Stage (RG-M4-02)</span>
              )}
              {errors.dateFin && <span className="form-error">{errors.dateFin}</span>}
            </div>

            {/* Échelon */}
            <div className="form-group full-width">
              <label className="form-label">
                Échelon <span className="required">*</span>
              </label>
              <select
                className={`form-select ${errors.echelonId ? 'error' : ''}`}
                value={form.echelonId}
                onChange={(e) => set('echelonId', e.target.value)}
              >
                <option value="">-- Sélectionner un échelon --</option>
                {echelons.map(echelon => (
                  <option key={echelon.id} value={echelon.id}>
                    {echelon.code} - Indice: {echelon.indiceSalarial} 
                    {echelon.categorie && ` (${echelon.categorie.libelle})`}
                  </option>
                ))}
              </select>
              {errors.echelonId && <span className="form-error">{errors.echelonId}</span>}
              <span className="form-hint">L'échelon détermine automatiquement la catégorie</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={submitting}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Création…</>
            ) : (
              <><FileText size={15} /> Créer le contrat</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}