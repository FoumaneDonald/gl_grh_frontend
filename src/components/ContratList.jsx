import React, { useEffect, useState } from 'react';
import { getAllContrats, annulerContrat, terminerContrat } from '../services/contratService';

const ContratList = () => {
  const [contrats, setContrats] = useState([]);
  const [motifAnnulation, setMotifAnnulation] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState('');

  const chargerContrats = async () => {
    try {
      const response = await getAllContrats();
      setContrats(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des contrats');
    }
  };

  useEffect(() => {
    chargerContrats();
  }, []);

  const handleAnnuler = async (id) => {
    if (!motifAnnulation.trim()) {
      alert('Le motif est obligatoire pour annuler un contrat.');
      return;
    }
    try {
      await annulerContrat(id, motifAnnulation);
      setMotifAnnulation('');
      setSelectedId(null);
      chargerContrats();
    } catch (err) {
      setError("Erreur lors de l'annulation");
    }
  };

  // ✅ NOUVEAU
  const handleTerminer = async (id) => {
    if (!window.confirm('Voulez-vous vraiment terminer ce contrat ?')) return;
    try {
      await terminerContrat(id);
      chargerContrats();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Erreur lors de la clôture du contrat'
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Liste des Contrats</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Employé</th>
            <th>Type</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contrats.map((contrat) => (
            <tr key={contrat.id}>
              <td>{contrat.id}</td>
              <td>{contrat.employeId}</td>
              <td>{contrat.typeContrat}</td>
              <td>{contrat.dateDebut}</td>
              <td>{contrat.dateFin || '—'}</td>
              <td>
                <span
                  className={`badge ${
                    contrat.statut === 'EN_COURS'
                      ? 'bg-success'
                      : contrat.statut === 'ANNULE'
                      ? 'bg-danger'
                      : contrat.statut === 'TERMINE'
                      ? 'bg-secondary'
                      : 'bg-warning text-dark'
                  }`}
                >
                  {contrat.statut}
                </span>
              </td>
              <td>
                {/* Bouton Annuler — visible si EN_COURS ou BROUILLON */}
                {(contrat.statut === 'EN_COURS' || contrat.statut === 'BROUILLON') && (
                  <>
                    {selectedId === contrat.id ? (
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Motif d'annulation"
                          value={motifAnnulation}
                          onChange={(e) => setMotifAnnulation(e.target.value)}
                        />
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAnnuler(contrat.id)}
                        >
                          Confirmer
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setSelectedId(null)}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => setSelectedId(contrat.id)}
                      >
                        Annuler
                      </button>
                    )}
                  </>
                )}

                {/* ✅ NOUVEAU — Bouton Terminer, visible uniquement si EN_COURS */}
                {contrat.statut === 'EN_COURS' && (
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => handleTerminer(contrat.id)}
                  >
                    Terminer
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContratList;