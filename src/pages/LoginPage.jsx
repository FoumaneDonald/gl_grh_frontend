import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ login: '', motDePasse: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form.login, form.motDePasse);
      if (data.role === 'DIRECTEUR') navigate('/directeur');
      else if (data.role === 'CHEF_SERVICE') navigate('/chef-service');
      else navigate('/operant');
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.grid} />
      <div style={styles.glow} />
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d0f14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div>
            <div style={styles.brandName}>GRH Contrats</div>
            <div style={styles.brandSub}>Système de gestion</div>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.formHeader}>
          <h1 style={styles.title}>Connexion</h1>
          <p style={styles.subtitle}>Accédez à votre espace de travail</p>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>LOGIN</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                style={styles.input}
                type="text"
                placeholder="Votre identifiant"
                value={form.login}
                onChange={e => setForm({ ...form, login: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>MOT DE PASSE</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                style={{ ...styles.input, paddingRight: '42px' }}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.motDePasse}
                onChange={e => setForm({ ...form, motDePasse: e.target.value })}
                required
              />
              <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter →'}
          </button>
        </form>

        <div style={styles.roles}>
          {[
            { role: 'DIRECTEUR', color: '#e8a84c', icon: '👔' },
            { role: 'CHEF SERVICE', color: '#4f8ef7', icon: '🗂️' },
            { role: 'OPÉRANT', color: '#3ecf8e', icon: '👷' },
          ].map(r => (
            <div key={r.role} style={{ ...styles.roleChip, borderColor: r.color + '44', color: r.color }}>
              {r.icon} {r.role}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  root: {
    minHeight: '100vh', background: '#0d0f14',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', padding: '20px',
  },
  grid: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  },
  glow: {
    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
    width: '600px', height: '400px',
    background: 'radial-gradient(ellipse, rgba(232,168,76,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative', zIndex: 1,
    background: '#13161e', border: '1px solid #242838', borderRadius: '20px',
    padding: '40px', width: '100%', maxWidth: '420px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' },
  logoIcon: {
    width: '44px', height: '44px',
    background: 'linear-gradient(135deg, #e8a84c, #c4853a)',
    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  brandName: { fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '16px', color: '#e8eaf2' },
  brandSub: { fontSize: '11px', color: '#555d78', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase' },
  divider: { height: '1px', background: '#242838', marginBottom: '28px' },
  formHeader: { marginBottom: '24px' },
  title: { fontFamily: "'Sora', sans-serif", fontSize: '24px', fontWeight: 700, color: '#e8eaf2', letterSpacing: '-0.5px', margin: 0 },
  subtitle: { fontSize: '13px', color: '#555d78', marginTop: '4px' },
  errorBanner: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '11px 14px', background: 'rgba(247,111,111,0.1)',
    border: '1px solid rgba(247,111,111,0.2)', borderRadius: '8px',
    fontSize: '13px', color: '#f76f6f', marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '7px' },
  label: { fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace", color: '#555d78', letterSpacing: '0.8px', textTransform: 'uppercase' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#555d78', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '11px 12px 11px 38px',
    background: '#1a1e2a', border: '1px solid #242838', borderRadius: '9px',
    color: '#e8eaf2', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: '#555d78', cursor: 'pointer', padding: '2px',
  },
  submitBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '13px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #e8a84c, #c4853a)',
    color: '#0d0f14', fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '14px',
    border: 'none', cursor: 'pointer', marginTop: '4px',
  },
  roles: { display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' },
  roleChip: {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '4px 10px', borderRadius: '99px', border: '1px solid',
    fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace",
  },
};

export default LoginPage;