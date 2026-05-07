import React, { useEffect, useState } from 'react';
import { getTousEmployes, supprimerOperant } from '../services/employeService';
import { getAllContrats, creerContrat, getMonContrat, accepterContrat } from '../services/contratService';
import { logout, getNom } from '../services/authService';
import { ContratCard, ModalRefus, EcranFinEmploi } from './OperantDashboard';
import axios from 'axios';

const API_URL = 'http://localhost:3004';
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const Icon = ({ name, size = 16 }) => {
  const icons = {
    users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    file:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash:     <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    check:     <><polyline points="20 6 9 17 4 12"/></>,
    x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    alert:     <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icons[name]}</svg>;
};

const StatutBadge = ({ statut }) => <span className={`status-badge status-${statut}`}>{statut?.replace('_', ' ')}</span>;
const TypeBadge = ({ type }) => {
  const cls = { CDI: 'type-cdi', CDD: 'type-cdd', Stage: 'type-stage' };
  return <span className={`type-badge ${cls[type] || ''}`}>{type}</span>;
};
const Modal = ({ title, subtitle, onClose, children, footer }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-header">
        <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" /></button>
      </div>
      <div className="modal-body">{children}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </div>
  </div>
);

const FORM_INIT = { employeId: '', typeContrat: 'CDD', dateDebut: '', dateFin: '', categorieId: '', echelonId: '' };

const ChefServiceDashboard = () => {
  const [employes,       setEmployes]       = useState([]);
  const [contrats,       setContrats]       = useState([]);
  const [mesContrats,    setMesContrats]    = useState([]);   // ← contrats du chef connecté
  const [categories,     setCategories]     = useState([]);
  const [echelons,       setEchelons]       = useState([]);
  const [echelonsFiltres,setEchelonsFiltres]= useState([]);
  const [onglet,         setOnglet]         = useState('employes');
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [search,         setSearch]         = useState('');
  const [modalContrat,   setModalContrat]   = useState(false);
  const [form,           setForm]           = useState(FORM_INIT);
  const [submitting,     setSubmitting]     = useState(false);

  // Signature de son propre contrat
  const [modalRefus,     setModalRefus]     = useState(null);
  const [finEmploi,      setFinEmploi]      = useState(false);
  const [actionLoading,  setActionLoading]  = useState(false);

  const charger = async () => {
    try {
      const [emp, c, cat, ech, mc] = await Promise.all([
        getTousEmployes(),
        getAllContrats(),
        axios.get(`${API_URL}/categories`, getHeaders()),
        axios.get(`${API_URL}/echelons`,   getHeaders()),
        getMonContrat(),
      ]);
      setEmployes(emp.data);
      setContrats(c.data);
      setCategories(cat.data);
      setEchelons(ech.data);
      setMesContrats(mc.data);
    } catch {
      setError('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  useEffect(() => {
    if (form.categorieId) {
      const filtres = echelons.filter(e => e.categorie?.id === parseInt(form.categorieId));
      setEchelonsFiltres(filtres);
      setForm(prev => ({ ...prev, echelonId: '' }));
    } else {
      setEchelonsFiltres(echelons);
    }
  }, [form.categorieId, echelons]);

  const ouvrirModalContrat = () => { setForm(FORM_INIT); setError(''); setModalContrat(true); };

  const handleCreerContrat = async () => {
    if (!form.employeId || !form.dateDebut || !form.categorieId || !form.echelonId) {
      setError('Employé, date de début, catégorie et échelon sont obligatoires'); return;
    }
    setSubmitting(true); setError('');
    try {
      await creerContrat({
        operant:     { id: parseInt(form.employeId) },
        typeContrat: form.typeContrat,
        dateDebut:   form.dateDebut,
        dateFin:     form.dateFin || null,
        echelon:     { id: parseInt(form.echelonId) },
      });
      setModalContrat(false); setForm(FORM_INIT); charger();
    } catch (err) {
      setError(err.response?.data || err.message || 'Erreur lors de la création');
    } finally { setSubmitting(false); }
  };

  const handleSupprimerOperant = async (id) => {
    if (!window.confirm('Supprimer cet opérant ?')) return;
    try { await supprimerOperant(id); charger(); }
    catch (err) { setError(err.response?.data?.message || 'Erreur suppression'); }
  };

  // Signer son propre contrat
  const handleAccepter = async (contratId) => {
    setActionLoading(true); setError('');
    try { await accepterContrat(contratId); charger(); }
    catch (err) { setError(err.response?.data || 'Erreur signature'); }
    finally { setActionLoading(false); }
  };

  // Refuser son contrat → suppression du compte
  const handleRefuser = async () => {
    setActionLoading(true); setError('');
    try {
      await axios.delete(`${API_URL}/employes/moi`, getHeaders());
      setModalRefus(null); setFinEmploi(true);
    } catch (err) {
      setError(err.response?.data || 'Erreur'); setModalRefus(null);
    } finally { setActionLoading(false); }
  };

  const filteredEmployes = employes.filter(e =>
    e.nom?.toLowerCase().includes(search.toLowerCase())
  );

  const aContratASigner = mesContrats.some(c => c.statut === 'EN_COURS');

  const stats = [
    { label: 'EMPLOYÉS',   value: employes.length,                                      color: '#3ecf8e' },
    { label: 'CONTRATS',   value: contrats.length,                                      color: '#4f8ef7' },
    { label: 'EN COURS',   value: contrats.filter(c => c.statut === 'EN_COURS').length, color: '#e8a84c' },
    { label: 'MON CONTRAT',value: mesContrats.length,                                   color: '#8b5cf6' },
  ];

  if (finEmploi) return <EcranFinEmploi />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-badge">
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #4f8ef7, #3b6fd4)' }}>
              <Icon name="briefcase" size={18} />
            </div>
            <div className="logo-text"><span className="brand">GRH Contrats</span><span className="module">M4 · Contrats</span></div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">Navigation</div>
          {[
            { key: 'employes',   label: 'Opérants',     icon: 'users'     },
            { key: 'contrats',   label: 'Contrats',     icon: 'file'      },
            { key: 'moncontrat', label: 'Mon Contrat',  icon: 'user'      },
          ].map(item => (
            <button key={item.key} className={`nav-item ${onglet === item.key ? 'active' : ''}`}
              onClick={() => { setOnglet(item.key); setSearch(''); }}>
              <Icon name={item.icon} size={16} /><span>{item.label}</span>
              {item.key === 'moncontrat' && aContratASigner && (
                <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#4f8ef7', display: 'inline-block' }} />
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: '12px', padding: '10px 12px', background: 'rgba(79,142,247,0.08)', borderRadius: '8px', border: '1px solid rgba(79,142,247,0.15)' }}>
            <div style={{ fontSize: '11px', color: '#555d78', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Connecté</div>
            <div style={{ fontSize: '13px', color: '#4f8ef7', fontWeight: 600 }}>{getNom()}</div>
            <div style={{ fontSize: '11px', color: '#555d78' }}>Chef de service</div>
          </div>
          <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>
            <Icon name="logout" size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <h1>{{ employes: 'Gestion des Opérants', contrats: 'Gestion des Contrats', moncontrat: 'Mon Contrat' }[onglet]}</h1>
            <p>{{ employes: 'Visualisez et gérez les opérants', contrats: 'Créez et suivez les contrats', moncontrat: 'Consultez et signez votre contrat de travail' }[onglet]}</p>
          </div>
          <div className="topbar-right">
            {onglet === 'contrats' && (
              <button className="btn btn-primary btn-sm" onClick={ouvrirModalContrat}>
                <Icon name="plus" size={14} /> Nouveau contrat
              </button>
            )}
          </div>
        </div>

        <div className="page-body">
          {error && (
            <div className="error-banner">
              <Icon name="alert" size={15} /> {error}
              <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f76f6f', cursor: 'pointer' }} onClick={() => setError('')}><Icon name="x" size={13} /></button>
            </div>
          )}

          <div className="stats-bar">
            {stats.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-accent" style={{ background: s.color }} />
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {loading ? <div className="loading-overlay"><div className="spinner" /> Chargement...</div> : (
            <>
              {/* ── OPÉRANTS ── */}
              {onglet === 'employes' && (
                <>
                  <div className="toolbar">
                    <div className="search-input-wrap">
                      <Icon name="search" size={15} />
                      <input className="search-input" placeholder="Rechercher un employé..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <span className="record-count">{filteredEmployes.length} employé(s)</span>
                  </div>
                  <div className="table-wrap">
                    <table className="contrat-table">
                      <thead><tr><th>#ID</th><th>Nom</th><th>Rôle</th><th>Âge</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filteredEmployes.length === 0
                          ? <tr><td colSpan={5}><div className="empty-state"><Icon name="users" size={32} /><h3>Aucun employé</h3></div></td></tr>
                          : filteredEmployes.map(o => (
                            <tr key={o.id}>
                              <td className="cell-id">#{o.id}</td>
                              <td className="cell-employe">{o.nom}</td>
                              <td><span style={{ fontSize: '11.5px', fontFamily: 'IBM Plex Mono', color: o.role === 'CHEF_SERVICE' ? '#4f8ef7' : '#3ecf8e' }}>{o.role}</span></td>
                              <td>{o.age}</td>
                              <td>
                                {o.role === 'OPERANT' && (
                                  <button className="btn btn-danger btn-sm" onClick={() => handleSupprimerOperant(o.id)}>
                                    <Icon name="trash" size={13} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* ── CONTRATS GÉRÉS ── */}
              {onglet === 'contrats' && (
                <div className="table-wrap">
                  <table className="contrat-table">
                    <thead><tr><th>#ID</th><th>Employé</th><th>Type</th><th>Catégorie</th><th>Échelon</th><th>Début</th><th>Fin</th><th>Statut</th></tr></thead>
                    <tbody>
                      {contrats.length === 0
                        ? <tr><td colSpan={8}><div className="empty-state"><Icon name="file" size={32} /><h3>Aucun contrat</h3></div></td></tr>
                        : contrats.map(c => (
                          <tr key={c.id}>
                            <td className="cell-id">#{c.id}</td>
                            <td className="cell-employe">{c.operant?.nom || '—'}</td>
                            <td><TypeBadge type={c.typeContrat} /></td>
                            <td style={{ color: '#8b5cf6', fontSize: '12.5px' }}>{c.categorie?.libelle || '—'}</td>
                            <td style={{ fontFamily: 'IBM Plex Mono', color: '#4f8ef7', fontSize: '12px' }}>{c.echelon?.code || '—'}</td>
                            <td className="cell-date">{c.dateDebut}</td>
                            <td className="cell-date">{c.dateFin || '—'}</td>
                            <td><StatutBadge statut={c.statut} /></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── MON CONTRAT (chef de service) ── */}
              {onglet === 'moncontrat' && (
                mesContrats.length === 0 ? (
                  <div style={{ maxWidth: '600px' }}>
                    <div className="empty-state">
                      <Icon name="file" size={32} /><h3>Aucun contrat</h3>
                      <p>Vous n'avez pas encore de contrat assigné.</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
                    {mesContrats.map(c => (
                      <ContratCard
                        key={c.id}
                        contrat={c}
                        onAccepter={handleAccepter}
                        onRefuser={(id) => setModalRefus(id)}
                        actionLoading={actionLoading}
                      />
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Modal création contrat ── */}
      {modalContrat && (
        <Modal title="Nouveau contrat" subtitle="Créer un contrat pour un employé" onClose={() => setModalContrat(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setModalContrat(false)} disabled={submitting}>Annuler</button>
              <button className="btn btn-primary" onClick={handleCreerContrat} disabled={submitting}>
                {submitting ? <><div className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Création…</> : <><Icon name="check" size={14} /> Créer</>}
              </button>
            </>
          }
        >
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Employé <span className="required">*</span></label>
              <select className="form-select" value={form.employeId} onChange={e => setForm({ ...form, employeId: e.target.value })}>
                <option value="">-- Sélectionner un employé --</option>
                {employes.filter(e => e.role !== 'DIRECTEUR').map(e => (
                  <option key={e.id} value={e.id}>{e.nom} — {e.role} (#{e.id})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.typeContrat} onChange={e => setForm({ ...form, typeContrat: e.target.value })}>
                <option value="CDD">CDD</option>
                <option value="CDI">CDI</option>
                <option value="Stage">Stage</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date de début <span className="required">*</span></label>
              <input type="date" className="form-input" value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Date de fin</label>
              <input type="date" className="form-input" value={form.dateFin} disabled={form.typeContrat === 'CDI'} min={form.dateDebut} onChange={e => setForm({ ...form, dateFin: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie <span className="required">*</span></label>
              <select className="form-select" value={form.categorieId} onChange={e => setForm({ ...form, categorieId: e.target.value })}>
                <option value="">-- Sélectionner --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.libelle} ({c.code})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Échelon <span className="required">*</span></label>
              <select className="form-select" value={form.echelonId} disabled={!form.categorieId} onChange={e => setForm({ ...form, echelonId: e.target.value })}>
                <option value="">{form.categorieId ? '-- Sélectionner --' : "-- Choisir d'abord une catégorie --"}</option>
                {echelonsFiltres.map(e => <option key={e.id} value={e.id}>{e.code} — indice {e.indiceSalarial}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {modalRefus && (
        <ModalRefus
          onConfirmer={handleRefuser}
          onAnnuler={() => setModalRefus(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default ChefServiceDashboard;