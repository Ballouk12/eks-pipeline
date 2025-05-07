"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { FaEye, FaUsers, FaSearch, FaDownload, FaUniversity, FaUserFriends, FaPaperPlane, FaEdit, FaTrash, FaClock, FaMoneyBillWave, FaFile, FaSpinner } from 'react-icons/fa';
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Bource = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('list');
  const [selectedBourse, setSelectedBourse] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [placesFilter, setPlacesFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('');
  const [userApplications, setUserApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [bourses, setBourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ID utilisateur (à remplacer par l'ID réel de l'utilisateur connecté)
  const userId = 1;

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Chargement des bourses
        const boursesResponse = await fetch('/api/bourses');
        if (!boursesResponse.ok) throw new Error('Erreur lors du chargement des bourses');
        const boursesData = await boursesResponse.json();
        setBourses(boursesData);

        // Chargement des candidatures de l'utilisateur
        const appsResponse = await fetch(`http://localhost:8888/gestion-bourse-condidature-service/api/candidatures/user/${userId}`);
        if (!appsResponse.ok) throw new Error('Erreur lors du chargement des candidatures');
        const appsData = await appsResponse.json();

        // Enrichissement des candidatures avec les détails des bourses
        const enrichedApps = appsData.map(app => {
          const bourse = boursesData.find(b => b.id === app.bourseId);
          return {
            ...app,
            bourseTitle: bourse?.title || 'Bourse inconnue',
            university: bourse?.university || 'Université inconnue',
            status: app.status || 'En attente',
            applicationDate: app.submissionDate || new Date().toISOString()
          };
        });

        setUserApplications(enrichedApps);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Vérifie si l'utilisateur a déjà postulé à une bourse
  const hasAppliedToBourse = (bourseId) => {
    return userApplications.some(app => app.bourseId === bourseId);
  };

  // Filtrage des bourses avec useMemo pour optimiser les performances
  const filteredBourses = useMemo(() => {
    return bourses.filter(bourse => {
      const matchesSearchTerm = searchTerm === '' ||
        bourse.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bourse.university.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPlacesFilter = placesFilter === '' || 
        String(bourse.places) === String(placesFilter);
      
      const matchesDurationFilter = durationFilter === '' || 
        String(bourse.duration) === String(durationFilter);
      
      const matchesAmountFilter = amountFilter === '' || 
        String(bourse.amount) === String(amountFilter);

      return matchesSearchTerm && matchesPlacesFilter && matchesDurationFilter && matchesAmountFilter;
    });
  }, [bourses, searchTerm, placesFilter, durationFilter, amountFilter]);

  // Gestion de la sélection d'une bourse
  const handleBourseSelect = (bourse) => {
    setSelectedBourse(bourse);
    setActiveView('detail');
    setShowPdf(false);
  };

  // Gestion de la sélection d'une candidature
  const handleApplicationSelect = (application) => {
    setSelectedApplication(application);
    setActiveView('applicationDetail');
  };

  // Suppression d'une candidature
  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette candidature?')) {
      try {
        const response = await fetch(`http://localhost:8888/gestion-bourse-condidature-service/api/candidatures/${applicationId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        setUserApplications(prev => prev.filter(app => app.id !== applicationId));
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(null);
          setActiveView('myApplications');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Échec de la suppression. Veuillez réessayer.');
      }
    }
  };

  // Retour à la liste
  const handleBackToList = () => {
    setActiveView('list');
    setShowPdf(false);
    setSelectedApplication(null);
  };

  // Modification d'une candidature
  const handleEditApplication = (applicationId) => {
    router.push(`/bources/edit/${applicationId}`);
  };

  // Rendu conditionnel
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingOverlay}>
          <FaSpinner className={styles.spinner} />
          <p>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorOverlay}>
          <p>Erreur: {error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
    <div className={styles.content}>
      {/* NAVBAR ORIGINAL - NE PAS MODIFIER */}
      <div className={styles.navLinks}>
        <a href="#" className={activeView === 'list' ? styles.active : ''} onClick={handleBackToList}>
          Liste des bourses
        </a>
        <a href="#" className={activeView === 'myApplications' || activeView === 'applicationDetail' ? styles.active : ''} onClick={() => {
          setActiveView('myApplications');
          setShowPdf(false);
          setSelectedApplication(null);
        }}>
          Mes Bourses
        </a>
        {selectedBourse && (
          <a href="#" className={activeView === 'detail' ? styles.active : ''} onClick={() => setActiveView('detail')}>
            Détails de la bourse
          </a>
        )}
        {selectedApplication && (
          <a href="#" className={activeView === 'applicationDetail' ? styles.active : ''} onClick={() => setActiveView('applicationDetail')}>
            Détails de ma candidature
          </a>
        )}
      </div>

        {/* En-tête et recherche */}
        <div className={styles.header}>
          {activeView === 'list' && (
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Rechercher par nom ou université"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <FaSearch className={styles.searchIcon} />
            </div>
          )}
        </div>

        {/* Filtres */}
        {activeView === 'list' && (
          <div className={styles.filters}>
            <div className={styles.filter}>
              <FaUsers className={styles.filterIcon} />
              <select 
                onChange={(e) => setPlacesFilter(e.target.value)} 
                value={placesFilter}
              >
                <option value="">Nombre de places</option>
                {Array.from(new Set(bourses.map(b => b.places))).sort().map(places => (
                  <option key={places} value={places}>{places}</option>
                ))}
              </select>
            </div>

            <div className={styles.filter}>
              <FaClock className={styles.filterIcon} />
              <select 
                onChange={(e) => setDurationFilter(e.target.value)} 
                value={durationFilter}
              >
                <option value="">Durée (mois)</option>
                {Array.from(new Set(bourses.map(b => b.duration))).sort().map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            <div className={styles.filter}>
              <FaMoneyBillWave className={styles.filterIcon} />
              <select 
                onChange={(e) => setAmountFilter(e.target.value)} 
                value={amountFilter}
              >
                <option value="">Montant</option>
                {Array.from(new Set(bourses.map(b => b.amount))).sort().map(amount => (
                  <option key={amount} value={amount}>{amount}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        {activeView === 'list' ? (
          <div className={styles.bourseListContainer}>
            <div className={styles.bourseListHeader}>
              <h2>Bourses disponibles</h2>
              <span className={styles.bourseCount}>
                {filteredBourses.length} bourse{filteredBourses.length !== 1 ? 's' : ''} trouvée{filteredBourses.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className={styles.bourseGrid}>
              {filteredBourses.map((bourse) => {
                const alreadyApplied = hasAppliedToBourse(bourse.id);
                
                return (
                  <div key={bourse.id} className={`${styles.bourseCard} ${alreadyApplied ? styles.appliedCard : ''}`}>
                    <div className={styles.universityLabel}>
                      <FaUniversity className={styles.universityIcon} />
                      <span>{bourse.university}</span>
                      {alreadyApplied && (
                        <div className={styles.alreadyApplied}>
                          <span>Déjà postulé</span>
                        </div>
                      )}
                    </div>
                    <h3>{bourse.title}</h3>
                    <p className={styles.bourseDescription}>{bourse.description}</p>
                    <div className={styles.placesInfo}>
                      <FaUserFriends />
                      <span>{bourse.places} place{bourse.places > 1 ? 's' : ''}</span>
                    </div>
                    <div className={styles.deadline}>
                      <span>Date limite: {new Date(bourse.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.bourseActions}>
                      <button 
                        className={styles.detailsButton} 
                        onClick={() => handleBourseSelect(bourse)}
                      >
                        En savoir plus
                      </button>
                      <a 
                        href={bourse.pdfLink} 
                        className={styles.downloadLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <FaDownload /> Télécharger
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredBourses.length === 0 && (
              <div className={styles.noResults}>
                <p>Aucune bourse trouvée. Veuillez modifier vos critères de recherche.</p>
              </div>
            )}
          </div>
        ) : activeView === 'myApplications' ? (
          <div className={styles.bourseListContainer}>
            <div className={styles.bourseListHeader}>
              <h2>Mes candidatures</h2>
              <span className={styles.bourseCount}>
                {userApplications.length} candidature{userApplications.length !== 1 ? 's' : ''}
              </span>
            </div>

            {userApplications.length === 0 ? (
              <div className={styles.noResults}>
                <p>Vous n'avez pas encore postulé à des bourses.</p>
                <button 
                  className={styles.backButton}
                  onClick={handleBackToList}
                >
                  Voir les bourses disponibles
                </button>
              </div>
            ) : (
              <div className={styles.bourseGrid}>
                {userApplications.map((application) => (
                  <div key={application.id} className={styles.bourseCard}>
                    <div className={styles.universityLabel}>
                      <FaUniversity className={styles.universityIcon} />
                      <span>{application.university}</span>
                    </div>
                    <h3>{application.bourseTitle}</h3>
                    <div className={`${styles.applicationStatus} ${styles[application.status.toLowerCase().replace(' ', '')]}`}>
                      <span>Statut: {application.status}</span>
                    </div>
                    <div className={styles.applicationDate}>
                      <span>Date: {new Date(application.applicationDate).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.bourseActions}>
                      <button 
                        className={styles.detailsButton} 
                        onClick={() => handleApplicationSelect(application)}
                      >
                        Voir ma candidature
                      </button>
                      <button 
                        className={styles.editButton} 
                        onClick={() => handleEditApplication(application.id)}
                      >
                        <FaEdit /> Modifier
                      </button>
                      <button 
                        className={styles.deleteButton} 
                        onClick={() => handleDeleteApplication(application.id)}
                      >
                        <FaTrash /> Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeView === 'applicationDetail' && selectedApplication ? (
          <div className={styles.applicationDetail}>
            <div className={styles.applicationDetailHeader}>
              <h2>Ma candidature: {selectedApplication.bourseTitle}</h2>
              <div className={styles.universityDetail}>
                <FaUniversity />
                <span>{selectedApplication.university}</span>
              </div>
            </div>
            
            <div className={styles.detailSections}>
              <div className={`${styles.detailSection} ${styles.statusSection}`}>
                <h3>Statut de la candidature</h3>
                <p className={styles[selectedApplication.status.toLowerCase().replace(' ', '')]}>
                  {selectedApplication.status}
                </p>
              </div>
              
              <div className={`${styles.detailSection} ${styles.infoSection}`}>
                <h3>Informations personnelles</h3>
                <div className={styles.infoGroup}>
                  <label>Nom:</label>
                  <p>{selectedApplication.name}</p>
                </div>
                <div className={styles.infoGroup}>
                  <label>Email:</label>
                  <p>{selectedApplication.email}</p>
                </div>
                <div className={styles.infoGroup}>
                  <label>CNE:</label>
                  <p>{selectedApplication.cne}</p>
                </div>
              </div>
              
              {selectedApplication.criteriaResponses && Object.keys(selectedApplication.criteriaResponses).length > 0 && (
                <div className={`${styles.detailSection} ${styles.criteriaSection}`}>
                  <h3>Critères d'éligibilité</h3>
                  {Object.entries(selectedApplication.criteriaResponses).map(([key, value], index) => (
                    <div key={index} className={styles.infoGroup}>
                      <label>{key}:</label>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className={`${styles.detailSection} ${styles.documentsSection}`}>
                <h3>Documents soumis</h3>
                {selectedApplication.documentPath ? (
                  <div className={styles.documentFile}>
                    <FaFile className={styles.fileIcon} />
                    <span>{selectedApplication.documentPath.split('/').pop()}</span>
                    <a 
                      href={`http://localhost:8888/gestion-bourse-condidature-service${selectedApplication.documentPath}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.downloadDocument}
                    >
                      <FaDownload /> Télécharger
                    </a>
                  </div>
                ) : (
                  <p>Aucun document soumis</p>
                )}
              </div>
            </div>
            
            <div className={styles.applicationActions}>
              <button 
                className={styles.editButton} 
                onClick={() => handleEditApplication(selectedApplication.id)}
              >
                <FaEdit /> Modifier ma candidature
              </button>
              <button 
                className={styles.deleteButton} 
                onClick={() => handleDeleteApplication(selectedApplication.id)}
              >
                <FaTrash /> Supprimer ma candidature
              </button>
              <button 
                className={styles.backButton}
                onClick={() => setActiveView('myApplications')}
              >
                Retour à mes candidatures
              </button>
            </div>
          </div>
        ) : selectedBourse && (
          <div className={styles.bourseDetail}>
            <div className={styles.bourseDetailHeader}>
              <h2>{selectedBourse.title}</h2>
              <div className={styles.universityDetail}>
                <FaUniversity />
                <span>{selectedBourse.university}</span>
              </div>
            </div>
            
            <div className={styles.detailSections}>
              <div className={`${styles.detailSection} ${styles.descriptionSection}`}>
                <h3>Description</h3>
                <p>{selectedBourse.description}</p>
              </div>
              
              <div className={`${styles.detailSection} ${styles.placesSection}`}>
                <h3>Nombre de places</h3>
                <p><FaUserFriends className={styles.placesIcon} /> {selectedBourse.places}</p>
              </div>
              
              <div className={`${styles.detailSection} ${styles.deadlineSection}`}>
                <h3>Date limite</h3>
                <p>{new Date(selectedBourse.deadline).toLocaleDateString()}</p>
              </div>

              <div className={`${styles.detailSection} ${styles.amountSection}`}>
                <h3>Montant</h3>
                <p>{selectedBourse.amount}</p>
              </div>

              <div className={`${styles.detailSection} ${styles.durationSection}`}>
                <h3>Durée</h3>
                <p>{selectedBourse.duration} mois</p>
              </div>
            </div>
            
            <div className={styles.pdfViewerContainer}>
              <h3>Documents et critères d'éligibilité</h3>
              <p>Veuillez consulter le PDF pour les critères d'éligibilité, les documents requis et le processus de sélection complet.</p>
              <div className={styles.pdfActions}>
                <button
                  className={styles.viewPdfButton}
                  onClick={() => setShowPdf(!showPdf)}
                >
                  <FaEye /> {showPdf ? 'Masquer PDF' : 'Voir PDF'}
                </button>
                <a
                  href={selectedBourse.pdfLink}
                  className={styles.downloadLink}
                  download
                >
                  <FaDownload /> Télécharger le PDF
                </a>
              </div>
              {showPdf && (
                <iframe
                  className={styles.pdfFrame}
                  src={selectedBourse.pdfLink}
                  width="100%"
                  height="600px"
                  title="PDF Viewer"
                />
              )}
            </div>
            
            {hasAppliedToBourse(selectedBourse.id) ? (
              <div className={styles.alreadyAppliedMessage}>
                <p>Vous avez déjà postulé à cette bourse.</p>
                <button 
                  className={styles.viewApplicationButton}
                  onClick={() => {
                    const application = userApplications.find(app => app.bourseId === selectedBourse.id);
                    if (application) {
                      setSelectedApplication(application);
                      setActiveView('applicationDetail');
                    }
                  }}
                >
                  <FaEye /> Voir ma candidature
                </button>
              </div>
            ) : (
              <Link href={`/bources/${selectedBourse.id}/postuler`} passHref>
                <button className={styles.applyButton}>
                  <FaPaperPlane /> Postuler maintenant
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bource;