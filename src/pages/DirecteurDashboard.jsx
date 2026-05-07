import React, { useEffect, useState } from 'react';
import { getAllEmployes, creerEmploye, modifierEmploye, supprimerEmploye } from '../services/employeService';
import { getAllContrats, activerContrat, annulerContrat, terminerContrat } from '../services/contratService';
import { logout, getNom } from '../services/authService';
import axios from 'axios';

const API_URL = 'http://localhost:3004';
const getHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const Icon = ({ name, size = 16 }) => {
  const icons = {
    users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    folder:   <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
    layers:   <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    file:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    logout:   <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:     <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    check:    <><polyline points="20 6 9 17 4 12"/></>,
    x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    alert:    <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    shield:   <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

const StatutBadge = ({ statut }) => (
  <span className={`status-badge status-${statut}`}>{statut?.replace('_', ' ')}</span>
);
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

const DirecteurDashboard = () => {
  const [employes,   setEmployes]   = useState([]);
  const [contrats,   setContrats]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [echelons,   setEchelons]   = useState([]);
  const [onglet,     setOnglet]     = useState('employes');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');

  const [modalEmp,   setModalEmp]   = useState(false);
  const [modalCat,   setModalCat]   = useState(false);
  const [modalEch,   setModalEch]   = useState(false);
  const [modalMotif, setModalMotif] = useState(null);

  const [formEmp, setFormEmp] = useState({ nom: '', age: '', famille: '', login: '', motDePasse: '', role: 'OPERANT' });
  const [editEmpId, setEditEmpId] = useState(null);

  const [formCat, setFormCat] = useState({ code: '', libelle: '' });
  const [editCatId, setEditCatId] = useState(null);

  // ← categorieId ajouté pour lier l'échelon à une catégorie
  const [formEch, setFormEch] = useState({ code: '', indiceSalarial: '', categorieId: '' });
  const [editEchId, setEditEchId] = useState(null);

  const [motif, setMotif] = useState('');

  const charger = async () => {
    try {
      const [e, c, cat, ech] = await Promise.all([
        getAllEmployes(),
        getAllContrats(),
        axios.get(`${API_URL}/categories`, getHeaders()),
        axios.get(`${API_URL}/echelons`,   getHeaders()),
      ]);
      setEmployes(  Array.isArray(e.data)   ? e.data   : []);
      setContrats(  Array.isArray(c.data)   ? c.data   : []);
      setCategories(Array.isArray(cat.data) ? cat.data : []);
      setEchelons(  Array.isArray(ech.data) ? ech.data : []);
    } catch (err) {
      setError('Erreur de chargement : ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  // ── Employés ────────────────────────────────────────────────────────────
  const openCreateEmp = () => {
    setEditEmpId(null);
    setFormEmp({ nom: '', age: '', famille: '', login: '', motDePasse: '', role: 'OPERANT' });
    setModalEmp(true);
  };
  const openEditEmp = (e) => {
    setEditEmpId(e.id);
    setFormEmp({ nom: e.nom, age: e.age, famille: e.famille || '', login: e.login, motDePasse: '', role: e.role });
    setModalEmp(true);
  };
  const handleSaveEmp = async () => {
    if (!formEmp.nom || !formEmp.age || !formEmp.login) { setError('Nom, âge et login obligatoires'); return; }
    try {
      if (editEmpId) await modifierEmploye(editEmpId, formEmp);
      else           await creerEmploye(formEmp);
      setModalEmp(false); setError(''); charger();
    } catch (err) { setError(err.response?.data?.message || 'Erreur employé'); }
  };
  const handleDeleteEmp = async (id) => {
    if (!window.confirm('Supprimer cet employé ?')) return;
    try { await supprimerEmploye(id); charger(); }
    catch (err) { setError(err.response?.data?.message || 'Erreur suppression'); }
  };

  // ── Catégories ───────────────────────────────────────────────────────────
  const openCreateCat = () => { setEditCatId(null); setFormCat({ code: '', libelle: '' }); setModalCat(true); };
  const openEditCat   = (c) => { setEditCatId(c.id); setFormCat({ code: c.code, libelle: c.libelle }); setModalCat(true); };
  const handleSaveCat = async () => {
    if (!formCat.code || !formCat.libelle) { setError('Code et libellé obligatoires'); return; }
    try {
      if (editCatId) await axios.put( `${API_URL}/categories/${editCatId}`, formCat, getHeaders());
      else           await axios.post(`${API_URL}/categories`,              formCat, getHeaders());
      setModalCat(false); setError(''); charger();
    } catch (err) { setError(err.response?.data?.message || 'Erreur catégorie'); }
  };
  const handleDeleteCat = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ? Les échelons liés seront aussi supprimés.')) return;
    try { await axios.delete(`${API_URL}/categories/${id}`, getHeaders()); charger(); }
    catch { setError('Erreur suppression catégorie'); }
  };

  // ── Échelons ─────────────────────────────────────────────────────────────
  const openCreateEch = () => {
    setEditEchId(null);
    setFormEch({ code: '', indiceSalarial: '', categorieId: '' });
    setModalEch(true);
  };
  const openEditEch = (e) => {
    setEditEchId(e.id);
    setFormEch({ code: e.code, indiceSalarial: e.indiceSalarial, categorieId: e.categorie?.id || '' });
    setModalEch(true);
  };
  const handleSaveEch = async () => {
    if (!formEch.code)          { setError('Le code est obligatoire');             return; }
    if (!formEch.indiceSalarial){ setError("L'indice salarial est obligatoire");   return; }
    if (!formEch.categorieId)   { setError('Veuillez sélectionner une catégorie'); return; }

    // Payload avec catégorie imbriquée (comme attendu par le backend)
    const payload = {
      code:           formEch.code,
      indiceSalarial: parseFloat(formEch.indiceSalarial),
      categorie:      { id: parseInt(formEch.categorieId) },
    };
    try {
      if (editEchId) await axios.put( `${API_URL}/echelons/${editEchId}`, payload, getHeaders());
      else           await axios.post(`${API_URL}/echelons`,              payload, getHeaders());
      setModalEch(false); setError(''); charger();
    } catch (err) { setError(err.response?.data?.message || 'Erreur échelon'); }
  };
  const handleDeleteEch = async (id) => {
    if (!window.confirm('Supprimer cet échelon ?')) return;
    try { await axios.delete(`${API_URL}/echelons/${id}`, getHeaders()); charger(); }
    catch { setError('Erreur suppression échelon'); }
  };

  // ── Contrats ─────────────────────────────────────────────────────────────
  const handleActiver  = async (id) => { try { await activerContrat(id);  charger(); } catch (err) { setError(err.response?.data?.message || 'Erreur'); } };
  const handleTerminer = async (id) => { try { await terminerContrat(id); charger(); } catch (err) { setError(err.response?.data?.message || 'Erreur'); } };
  const handleAnnuler  = async () => {
    if (!motif.trim()) { setError('Motif obligatoire'); return; }
    try { await annulerContrat(modalMotif, motif); setModalMotif(null); setMotif(''); charger(); }
    catch (err) { setError(err.response?.data?.message || 'Erreur'); }
  };

  const stats = [
    { label: 'EMPLOYÉS',   value: employes.length,                                      color: '#4f8ef7' },
    { label: 'CONTRATS',   value: contrats.length,                                      color: '#e8a84c' },
    { label: 'EN COURS',   value: contrats.filter(c => c.statut === 'EN_COURS').length, color: '#3ecf8e' },
    { label: 'CATÉGORIES', value: categories.length,                                    color: '#8b5cf6' },
  ];

  const navItems = [
    { key: 'employes',   label: 'Employés',   icon: 'users'  },
    { key: 'categories', label: 'Catégories', icon: 'folder' },
    { key: 'echelons',   label: 'Échelons',   icon: 'layers' },
    { key: 'contrats',   label: 'Contrats',   icon: 'file'   },
  ];

  const topbarTitles = {
    employes:   { title: 'Gestion des Employés',  sub: 'Créer, modifier et gérer les comptes employés' },
    categories: { title: 'Catégories',            sub: 'Définir les catégories professionnelles' },
    echelons:   { title: 'Échelons',              sub: 'Définir les niveaux salariaux par catégorie' },
    contrats:   { title: 'Gestion des Contrats',  sub: 'Valider, terminer ou annuler les contrats' },
  };

  const filteredEmployes = employes.filter(e =>
    e.nom?.toLowerCase().includes(search.toLowerCase()) ||
    e.login?.toLowerCase().includes(search.toLowerCase())
  );

  const roleStyle = (role) => ({
    padding: '3px 10px', borderRadius: '5px', fontSize: '11.5px',
    fontFamily: 'IBM Plex Mono', fontWeight: 500,
    background: role === 'DIRECTEUR' ? 'rgba(232,168,76,0.15)' : role === 'CHEF_SERVICE' ? 'rgba(79,142,247,0.15)' : 'rgba(62,207,142,0.15)',
    color:      role === 'DIRECTEUR' ? '#e8a84c'                : role === 'CHEF_SERVICE' ? '#4f8ef7'               : '#3ecf8e',
  });

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-badge">
            <div className="logo-icon"><Icon name="shield" size={18} /></div>
            <div className="logo-text">
              <span className="brand">GRH Contrats</span>
              <span className="module">M4 · Contrats</span>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">Navigation</div>
          {navItems.map(item => (
            <button key={item.key} className={`nav-item ${onglet === item.key ? 'active' : ''}`}
              onClick={() => { setOnglet(item.key); setSearch(''); }}>
              <Icon name={item.icon} size={16} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ marginBottom: '12px', padding: '10px 12px', background: 'rgba(232,168,76,0.08)', borderRadius: '8px', border: '1px solid rgba(232,168,76,0.15)' }}>
            <div style={{ fontSize: '11px', color: '#555d78', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Connecté</div>
            <div style={{ fontSize: '13px', color: '#e8a84c', fontWeight: 600 }}>{getNom()}</div>
            <div style={{ fontSize: '11px', color: '#555d78' }}>Directeur</div>
          </div>
          <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>
            <Icon name="logout" size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU */}
      <main className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <h1>{topbarTitles[onglet].title}</h1>
            <p>{topbarTitles[onglet].sub}</p>
          </div>
          <div className="topbar-right">
            {onglet === 'employes'   && <button className="btn btn-primary btn-sm" onClick={openCreateEmp}><Icon name="plus" size={14} /> Nouvel employé</button>}
            {onglet === 'categories' && <button className="btn btn-primary btn-sm" onClick={openCreateCat}><Icon name="plus" size={14} /> Nouvelle catégorie</button>}
            {onglet === 'echelons'   && <button className="btn btn-primary btn-sm" onClick={openCreateEch}><Icon name="plus" size={14} /> Nouvel échelon</button>}
          </div>
        </div>

        <div className="page-body">
          {error && (
            <div className="error-banner">
              <Icon name="alert" size={15} /> {error}
              <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f76f6f', cursor: 'pointer' }} onClick={() => setError('')}>
                <Icon name="x" size={13} />
              </button>
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
              {/* EMPLOYÉS */}
              {onglet === 'employes' && (
                <>
                  <div className="toolbar">
                    <div className="search-input-wrap">
                      <Icon name="search" size={15} />
                      <input className="search-input" placeholder="Rechercher par nom ou login..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <span className="record-count">{filteredEmployes.length} résultat(s)</span>
                  </div>
                  <div className="table-wrap">
                    <table className="contrat-table">
                      <thead><tr><th>#ID</th><th>Nom</th><th>Âge</th><th>Famille</th><th>Rôle</th><th>Login</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filteredEmployes.length === 0
                          ? <tr><td colSpan={7}><div className="empty-state"><Icon name="users" size={32} /><h3>Aucun employé</h3></div></td></tr>
                          : filteredEmployes.map(e => (
                            <tr key={e.id}>
                              <td className="cell-id">#{e.id}</td>
                              <td className="cell-employe">{e.nom}</td>
                              <td>{e.age}</td>
                              <td>{e.famille || '—'}</td>
                              <td><span style={roleStyle(e.role)}>{e.role}</span></td>
                              <td style={{ fontFamily: 'IBM Plex Mono', fontSize: '12.5px' }}>{e.login}</td>
                              <td>
                                <div className="cell-actions">
                                  <button className="btn btn-secondary btn-sm" onClick={() => openEditEmp(e)}><Icon name="edit" size={13} /> Modifier</button>
                                  <button className="btn btn-danger btn-sm"    onClick={() => handleDeleteEmp(e.id)}><Icon name="trash" size={13} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* CATÉGORIES */}
              {onglet === 'categories' && (
                <div className="table-wrap">
                  <table className="contrat-table">
                    <thead><tr><th>#ID</th><th>Code</th><th>Libellé</th><th>Échelons</th><th>Actions</th></tr></thead>
                    <tbody>
                      {categories.length === 0
                        ? <tr><td colSpan={5}><div className="empty-state"><Icon name="folder" size={32} /><h3>Aucune catégorie</h3><p>Créez la première catégorie.</p></div></td></tr>
                        : categories.map(c => (
                          <tr key={c.id}>
                            <td className="cell-id">#{c.id}</td>
                            <td><span style={{ fontFamily: 'IBM Plex Mono', fontSize: '12.5px', color: '#e8a84c' }}>{c.code}</span></td>
                            <td className="cell-employe">{c.libelle}</td>
                            <td style={{ color: '#8b5cf6', fontFamily: 'IBM Plex Mono' }}>
                              {echelons.filter(e => e.categorie?.id === c.id).length} échelon(s)
                            </td>
                            <td>
                              <div className="cell-actions">
                                <button className="btn btn-secondary btn-sm" onClick={() => openEditCat(c)}><Icon name="edit" size={13} /> Modifier</button>
                                <button className="btn btn-danger btn-sm"    onClick={() => handleDeleteCat(c.id)}><Icon name="trash" size={13} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ÉCHELONS */}
              {onglet === 'echelons' && (
                <div className="table-wrap">
                  <table className="contrat-table">
                    <thead><tr><th>#ID</th><th>Code</th><th>Indice Salarial</th><th>Catégorie</th><th>Actions</th></tr></thead>
                    <tbody>
                      {echelons.length === 0
                        ? <tr><td colSpan={5}><div className="empty-state"><Icon name="layers" size={32} /><h3>Aucun échelon</h3><p>Créez d'abord une catégorie, puis un échelon.</p></div></td></tr>
                        : echelons.map(e => (
                          <tr key={e.id}>
                            <td className="cell-id">#{e.id}</td>
                            <td><span style={{ fontFamily: 'IBM Plex Mono', fontSize: '12.5px', color: '#4f8ef7' }}>{e.code}</span></td>
                            <td style={{ fontFamily: 'IBM Plex Mono', color: '#3ecf8e' }}>{e.indiceSalarial?.toLocaleString()}</td>
                            <td>
                              <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '12px', background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
                                {e.categorie?.libelle || '—'}
                              </span>
                            </td>
                            <td>
                              <div className="cell-actions">
                                <button className="btn btn-secondary btn-sm" onClick={() => openEditEch(e)}><Icon name="edit" size={13} /> Modifier</button>
                                <button className="btn btn-danger btn-sm"    onClick={() => handleDeleteEch(e.id)}><Icon name="trash" size={13} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CONTRATS */}
              {onglet === 'contrats' && (
                <div className="table-wrap">
                  <table className="contrat-table">
                    <thead><tr><th>#ID</th><th>Employé</th><th>Type</th><th>Catégorie</th><th>Échelon</th><th>Date Début</th><th>Date Fin</th><th>Statut</th><th>Actions</th></tr></thead>
                    <tbody>
                      {contrats.length === 0
                        ? <tr><td colSpan={9}><div className="empty-state"><Icon name="file" size={32} /><h3>Aucun contrat</h3></div></td></tr>
                        : contrats.map(c => (
                          <tr key={c.id}>
                            <td className="cell-id">#{c.id}</td>
                            <td className="cell-employe">{c.operant?.nom || '—'}</td>
                            <td><TypeBadge type={c.typeContrat} /></td>
                            <td style={{ fontSize: '12.5px', color: '#8b5cf6' }}>{c.categorie?.libelle || '—'}</td>
                            <td style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: '#4f8ef7' }}>{c.echelon?.code || '—'}</td>
                            <td className="cell-date">{c.dateDebut}</td>
                            <td className="cell-date">{c.dateFin || '—'}</td>
                            <td><StatutBadge statut={c.statut} /></td>
                            <td>
                              <div className="cell-actions">
                                {c.statut === 'BROUILLON' && (
                                  <button className="btn btn-success btn-sm" onClick={() => handleActiver(c.id)}>
                                    <Icon name="check" size={13} /> Valider
                                  </button>
                                )}
                                {c.statut === 'EN_COURS' && (
                                  <button className="btn btn-secondary btn-sm" onClick={() => handleTerminer(c.id)}>
                                    Terminer
                                  </button>
                                )}
                                {(c.statut === 'BROUILLON' || c.statut === 'EN_COURS') && (
                                  <button className="btn btn-danger btn-sm" onClick={() => setModalMotif(c.id)}>
                                    <Icon name="x" size={13} /> Annuler
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── MODAL EMPLOYÉ ─────────────────────────────────────────────────── */}
      {modalEmp && (
        <Modal title={editEmpId ? "Modifier l'employé" : 'Nouvel employé'} subtitle="Remplissez les informations"
          onClose={() => setModalEmp(false)}
          footer={<><button className="btn btn-secondary" onClick={() => setModalEmp(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSaveEmp}><Icon name="check" size={14} /> {editEmpId ? 'Sauvegarder' : 'Créer'}</button></>}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Nom <span className="required">*</span></label><input className="form-input" placeholder="Nom complet" value={formEmp.nom} onChange={e => setFormEmp({ ...formEmp, nom: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Âge <span className="required">*</span></label><input type="number" className="form-input" placeholder="Âge" value={formEmp.age} onChange={e => setFormEmp({ ...formEmp, age: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Famille</label><input className="form-input" placeholder="Nom de famille" value={formEmp.famille} onChange={e => setFormEmp({ ...formEmp, famille: e.target.value })} /></div>
            <div className="form-group">
              <label className="form-label">Rôle</label>
              <select className="form-select" value={formEmp.role} onChange={e => setFormEmp({ ...formEmp, role: e.target.value })}>
                <option value="DIRECTEUR">Directeur</option>
                <option value="CHEF_SERVICE">Chef de service</option>
                <option value="OPERANT">Opérant</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Login <span className="required">*</span></label><input className="form-input" placeholder="Identifiant" value={formEmp.login} onChange={e => setFormEmp({ ...formEmp, login: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Mot de passe {!editEmpId && <span className="required">*</span>}</label><input type="password" className="form-input" placeholder={editEmpId ? 'Laisser vide pour conserver' : 'Mot de passe'} value={formEmp.motDePasse} onChange={e => setFormEmp({ ...formEmp, motDePasse: e.target.value })} /></div>
          </div>
        </Modal>
      )}

      {/* ── MODAL CATÉGORIE ───────────────────────────────────────────────── */}
      {modalCat && (
        <Modal title={editCatId ? 'Modifier la catégorie' : 'Nouvelle catégorie'} subtitle="Catégorie professionnelle"
          onClose={() => setModalCat(false)}
          footer={<><button className="btn btn-secondary" onClick={() => setModalCat(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSaveCat}><Icon name="check" size={14} /> {editCatId ? 'Sauvegarder' : 'Créer'}</button></>}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Code <span className="required">*</span></label>
              <input className="form-input" placeholder="Ex: CADRE" value={formCat.code} onChange={e => setFormCat({ ...formCat, code: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Libellé <span className="required">*</span></label>
              <input className="form-input" placeholder="Ex: Cadre supérieur" value={formCat.libelle} onChange={e => setFormCat({ ...formCat, libelle: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL ÉCHELON ────────────────────────────────────────────────── */}
      {modalEch && (
        <Modal title={editEchId ? "Modifier l'échelon" : 'Nouvel échelon'} subtitle="Niveau salarial lié à une catégorie"
          onClose={() => setModalEch(false)}
          footer={<><button className="btn btn-secondary" onClick={() => setModalEch(false)}>Annuler</button><button className="btn btn-primary" onClick={handleSaveEch}><Icon name="check" size={14} /> {editEchId ? 'Sauvegarder' : 'Créer'}</button></>}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Code <span className="required">*</span></label>
              <input className="form-input" placeholder="Ex: E1" value={formEch.code} onChange={e => setFormEch({ ...formEch, code: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Indice Salarial <span className="required">*</span></label>
              <input type="number" className="form-input" placeholder="Ex: 350" value={formEch.indiceSalarial} onChange={e => setFormEch({ ...formEch, indiceSalarial: e.target.value })} />
            </div>
            {/* ← NOUVEAU : sélection de la catégorie */}
            <div className="form-group full-width">
              <label className="form-label">Catégorie <span className="required">*</span></label>
              <select
                className="form-select"
                value={formEch.categorieId}
                onChange={e => setFormEch({ ...formEch, categorieId: e.target.value })}
              >
                <option value="">-- Sélectionner une catégorie --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.libelle} ({c.code})</option>
                ))}
              </select>
              {categories.length === 0 && (
                <span className="form-hint" style={{ color: '#f76f6f' }}>
                  Aucune catégorie disponible. Créez d'abord une catégorie.
                </span>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── MODAL ANNULATION ─────────────────────────────────────────────── */}
      {modalMotif && (
        <Modal title="Annuler le contrat" subtitle="Cette action est irréversible"
          onClose={() => { setModalMotif(null); setMotif(''); }}
          footer={<><button className="btn btn-secondary" onClick={() => { setModalMotif(null); setMotif(''); }}>Retour</button><button className="btn btn-danger" onClick={handleAnnuler}><Icon name="x" size={14} /> Confirmer</button></>}>
          <div className="form-group">
            <label className="form-label">Motif <span className="required">*</span></label>
            <input className="form-input" placeholder="Précisez le motif d'annulation..." value={motif} onChange={e => setMotif(e.target.value)} />
            <span className="form-hint">Le motif sera enregistré dans l'historique.</span>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DirecteurDashboard;