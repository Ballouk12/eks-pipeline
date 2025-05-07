"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './registration.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { checkAuth } from '../../utils/session';

const RegistrationForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [formData, setFormData] = useState({
    cne: '',
    password: '',
    cin: '',
    dateNaissance: '',
    telephone: '',
    nom: '',
    prenom: '',
    genre: '',
    lieuNaissance: '',
    codeMassar: '',
    pays: 'Maroc',
    regionOrigine: '',
    province: '',
    ville: '',
    adressePostale: '',
    quartier: '',
    douar: '',
    nomContactUrgence: '',
    gsmUrgence: '',
    lienParente: '',
    emailUrgence: '',
    etablissementPrecedent: '',
    niveauEtude: '',
    filiere: '',
    anneeObtentionBac: '',
    mentionBac: '',
    moyenneBac: '',
  });

  useEffect(() => {
    // Vérifier si l'utilisateur vient bien du signup
    const savedData = sessionStorage.getItem('registrationData');
    
    if (!savedData) {
      // Redirection silencieuse si pas de données d'inscription
      router.push('/signup');
      return;
    }

    // Charger les données sauvegardées
    const parsedData = JSON.parse(savedData);
    setFormData(prevData => ({
      ...prevData,
      ...parsedData,
      codeMassar: parsedData.cne || ''
    }));

    // Marquer comme initialisé pour afficher le formulaire
    setIsInitialized(true);
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      sessionStorage.setItem('registrationData', JSON.stringify(formData));
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validateCurrentStep = () => {
    setError('');
    
    switch (currentStep) {
      case 1:
        if (!formData.cin || !formData.dateNaissance || !formData.telephone) {
          setError('Veuillez remplir tous les champs obligatoires');
          Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
          return false;
        }
        if (!isValidDate(formData.dateNaissance)) {
          setError('Date de naissance invalide');
          Swal.fire('Erreur', 'Veuillez entrer une date valide au format AAAA-MM-JJ', 'error');
          return false;
        }
        break;
      case 2:
        if (!formData.nom || !formData.prenom || !formData.genre || !formData.lieuNaissance || !formData.codeMassar) {
          setError('Veuillez remplir tous les champs obligatoires');
          Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
          return false;
        }
        break;
      case 3:
        if (!formData.regionOrigine || !formData.province || !formData.ville || !formData.adressePostale) {
          setError('Veuillez remplir tous les champs obligatoires');
          Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
          return false;
        }
        break;
      case 4:
        if (!formData.nomContactUrgence || !formData.gsmUrgence || !formData.lienParente) {
          setError('Veuillez remplir tous les champs obligatoires');
          Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
          return false;
        }
        break;
      case 5:
        if (!formData.etablissementPrecedent || !formData.niveauEtude || !formData.filiere || 
            !formData.anneeObtentionBac || !formData.mentionBac || !formData.moyenneBac) {
          setError('Veuillez remplir tous les champs obligatoires');
          Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
          return false;
        }
        if (isNaN(formData.moyenneBac)) {
          setError('Moyenne du Bac invalide');
          Swal.fire('Erreur', 'Veuillez entrer une moyenne valide', 'error');
          return false;
        }
        break;
    }
    
    return true;
  };

  const saveFormForLater = () => {
    sessionStorage.setItem('registrationData', JSON.stringify(formData));
    Swal.fire('Succès', 'Formulaire sauvegardé avec succès', 'success');
  };

  const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;
    
    setLoading(true);
    
    try {
      const profileData = {
        user: {
          cne: formData.cne,
        },
        profile: {
          firstName: formData.prenom,
          lastName: formData.nom,
          cin: formData.cin,
          dateOfBirth: formatDateForBackend(formData.dateNaissance),
          placeOfBirth: formData.lieuNaissance,
          gender: formData.genre,
          image: null,
          school: formData.etablissementPrecedent,
          stadyLevel: formData.niveauEtude,
          major: formData.filiere,
          bacYear: parseInt(formData.anneeObtentionBac),
          bacHonor: formData.mentionBac,
          bacGrade: parseFloat(formData.moyenneBac),
          emergencyContactName: formData.nomContactUrgence,
          emergencyContactEmail: formData.emailUrgence || null,
          emergencyContactPhone: formData.gsmUrgence,
          relationship: formData.lienParente,
          address: {
            country: formData.pays,
            region: formData.regionOrigine,
            city: formData.ville,
            postalAddress: formData.adressePostale,
            neighborhood: formData.quartier || "AUCUN",
            douar: formData.douar || "AUCUN"
          }
        }
      };
      
      const response = await axios.post('http://localhost:8888/inscription-service/auth/addProfile', profileData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Nettoyer les données de session après inscription réussie
      sessionStorage.removeItem('registrationData');
      
      await Swal.fire({
        icon: 'success',
        title: 'Inscription réussie',
        text: 'Votre profil a été enregistré avec succès!',
      });
      
      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (err) {
      console.error("Erreur lors de l'inscription:", err);
      let errorMessage = 'Une erreur est survenue lors de l\'inscription';
      
      if (err.response) {
        if (err.response.data) {
          errorMessage = err.response.data.message || 
                        err.response.data.error || 
                        JSON.stringify(err.response.data);
        }
      }
      
      setError(errorMessage);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Données Principales</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="cin">CIN <span className={styles.required}>*</span></label>
              <input
                type="text"
                id="cin"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                placeholder="Entrez votre CIN"
                required
                pattern="[A-Za-z0-9]{6,12}"
                title="Le CIN doit contenir entre 6 et 12 caractères alphanumériques"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="dateNaissance">Date de naissance <span className={styles.required}>*</span></label>
              <input
                type="date"
                id="dateNaissance"
                name="dateNaissance"
                value={formData.dateNaissance}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="telephone">Téléphone <span className={styles.required}>*</span></label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Entrez votre téléphone"
                required
                pattern="[0-9]{10}"
                title="Le numéro de téléphone doit contenir 10 chiffres"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Informations personnelles</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="nom">Nom <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Entrez votre nom"
                  required
                  pattern="[A-Za-zÀ-ÿ\s\-']{2,}"
                  title="Le nom doit contenir au moins 2 caractères"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="prenom">Prénom <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Entrez votre prénom"
                  required
                  pattern="[A-Za-zÀ-ÿ\s\-']{2,}"
                  title="Le prénom doit contenir au moins 2 caractères"
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="genre">Genre <span className={styles.required}>*</span></label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="lieuNaissance">Lieu de naissance <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="lieuNaissance"
                  name="lieuNaissance"
                  value={formData.lieuNaissance}
                  onChange={handleChange}
                  placeholder="Entrez votre lieu de naissance"
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="codeMassar">Code Massar <span className={styles.required}>*</span></label>
              <input
                type="text"
                id="codeMassar"
                name="codeMassar"
                value={formData.codeMassar}
                onChange={handleChange}
                placeholder="Entrez votre code massar"
                required
                pattern="[A-Za-z0-9]{8,12}"
                title="Le code Massar doit contenir entre 8 et 12 caractères alphanumériques"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Adresse et localisation</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="pays">Pays <span className={styles.required}>*</span></label>
                <select
                  id="pays"
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                  required
                >
                  <option value="Maroc">Maroc</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="regionOrigine">Région <span className={styles.required}>*</span></label>
                <select
                  id="regionOrigine"
                  name="regionOrigine"
                  value={formData.regionOrigine}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une région</option>
                  <option value="Casablanca-Settat">Casablanca-Settat</option>
                  <option value="Rabat-Salé-Kénitra">Rabat-Salé-Kénitra</option>
                  <option value="Marrakech-Safi">Marrakech-Safi</option>
                  <option value="Fès-Meknès">Fès-Meknès</option>
                  <option value="Tanger-Tétouan-Al Hoceima">Tanger-Tétouan-Al Hoceima</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="province">Province <span className={styles.required}>*</span></label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une province</option>
                  <option value="El Jadida">El Jadida</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Mohammedia">Mohammedia</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="ville">Ville <span className={styles.required}>*</span></label>
                <select
                  id="ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une ville</option>
                  <option value="El Jadida">El Jadida</option>
                  <option value="Azemmour">Azemmour</option>
                  <option value="Bir Jdid">Bir Jdid</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="adressePostale">Adresse postale <span className={styles.required}>*</span></label>
              <input
                type="text"
                id="adressePostale"
                name="adressePostale"
                value={formData.adressePostale}
                onChange={handleChange}
                placeholder="Entrez votre adresse complète"
                required
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="quartier">Quartier</label>
                <input
                  type="text"
                  id="quartier"
                  name="quartier"
                  value={formData.quartier}
                  onChange={handleChange}
                  placeholder="(Optionnel)"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="douar">Douar</label>
                <input
                  type="text"
                  id="douar"
                  name="douar"
                  value={formData.douar}
                  onChange={handleChange}
                  placeholder="(Optionnel)"
                />
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Contact d'urgence</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="nomContactUrgence">Nom complet <span className={styles.required}>*</span></label>
              <input
                type="text"
                id="nomContactUrgence"
                name="nomContactUrgence"
                value={formData.nomContactUrgence}
                onChange={handleChange}
                placeholder="Entrez le nom complet"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="gsmUrgence">Téléphone <span className={styles.required}>*</span></label>
              <input
                type="tel"
                id="gsmUrgence"
                name="gsmUrgence"
                value={formData.gsmUrgence}
                onChange={handleChange}
                placeholder="Entrez le numéro de téléphone"
                required
                pattern="[0-9]{10}"
                title="Le numéro de téléphone doit contenir 10 chiffres"
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="lienParente">Lien de parenté <span className={styles.required}>*</span></label>
                <select
                  id="lienParente"
                  name="lienParente"
                  value={formData.lienParente}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="Père">Père</option>
                  <option value="Mère">Mère</option>
                  <option value="Frère">Frère</option>
                  <option value="Sœur">Sœur</option>
                  <option value="Oncle">Oncle</option>
                  <option value="Tante">Tante</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="emailUrgence">Email</label>
                <input
                  type="email"
                  id="emailUrgence"
                  name="emailUrgence"
                  value={formData.emailUrgence}
                  onChange={handleChange}
                  placeholder="Entrez l'email (optionnel)"
                />
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Informations scolaires</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="etablissementPrecedent">Établissement précédent <span className={styles.required}>*</span></label>
              <input
                type="text"
                id="etablissementPrecedent"
                name="etablissementPrecedent"
                value={formData.etablissementPrecedent}
                onChange={handleChange}
                placeholder="Entrez le nom de l'établissement"
                required
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="niveauEtude">Niveau d'étude <span className={styles.required}>*</span></label>
                <select
                  id="niveauEtude"
                  name="niveauEtude"
                  value={formData.niveauEtude}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="Baccalauréat">Baccalauréat</option>
                  <option value="Licence">Licence</option>
                  <option value="Master">Master</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="filiere">Filière <span className={styles.required}>*</span></label>
                <select
                  id="filiere"
                  name="filiere"
                  value={formData.filiere}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="Sciences Mathématiques">Sciences Mathématiques</option>
                  <option value="Sciences Physiques">Sciences Physiques</option>
                  <option value="Sciences de la Vie et de la Terre">Sciences de la Vie et de la Terre</option>
                  <option value="Sciences Économiques">Sciences Économiques</option>
                  <option value="Lettres">Lettres</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="anneeObtentionBac">Année du Bac <span className={styles.required}>*</span></label>
                <select
                  id="anneeObtentionBac"
                  name="anneeObtentionBac"
                  value={formData.anneeObtentionBac}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="mentionBac">Mention <span className={styles.required}>*</span></label>
                <select
                  id="mentionBac"
                  name="mentionBac"
                  value={formData.mentionBac}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner...</option>
                  <option value="Très Bien">Très Bien</option>
                  <option value="Bien">Bien</option>
                  <option value="Assez Bien">Assez Bien</option>
                  <option value="Passable">Passable</option>
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="moyenneBac">Moyenne du Bac <span className={styles.required}>*</span></label>
              <input
                type="number"
                id="moyenneBac"
                name="moyenneBac"
                value={formData.moyenneBac}
                onChange={handleChange}
                placeholder="Entrez votre moyenne"
                step="0.01"
                min="10"
                max="20"
                required
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isInitialized) {
    // Retourner null ou un loader pendant l'initialisation
    return null;
  }

  return (
    <div className={styles.registrationContainer}>
      <div className={styles.registrationCard}>
        <div className={styles.registrationHeader}>
          <h1>Complétez votre inscription</h1>
          <p>Veuillez remplir tous les champs obligatoires (<span className={styles.required}>*</span>)</p>
        </div>
        
        <div className={styles.progressBar}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i} 
              className={`${styles.progressStep} ${i + 1 <= currentStep ? styles.active : ''}`}
              onClick={() => i + 1 < currentStep && setCurrentStep(i + 1)}
            >
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepLabel}>Étape {i + 1}</span>
            </div>
          ))}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.registrationForm}>
          {renderFormStep()}
          
          <div className={styles.formActions}>
            {currentStep > 1 && (
              <button 
                type="button" 
                className={styles.previousButton}
                onClick={handlePrevious}
                disabled={loading}
              >
                Précédent
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button 
                type="button" 
                className={styles.nextButton}
                onClick={handleNext}
                disabled={loading}
              >
                Suivant
              </button>
            ) : (
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Envoi en cours...
                  </>
                ) : 'Terminer l\'inscription'}
              </button>
            )}
          </div>
        </form>
        
        <div className={styles.saveFormAction}>
          <button 
            type="button" 
            className={styles.saveButton}
            onClick={saveFormForLater}
            disabled={loading}
          >
            Sauvegarder et continuer plus tard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;