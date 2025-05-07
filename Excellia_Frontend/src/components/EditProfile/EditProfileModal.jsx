"use client";
import React, { useState, useEffect } from 'react';
import styles from './edit-profile-modal.module.css';

const EditProfileModal = ({ userData, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    lastName: "",
    firstName: "",
    idNumber: "",
    massarCode: "",
    birthDate: "",
    gender: "",
    birthPlace: "",
    phone: "",
    
    // Address Information
    country: "",
    region: "",
    province: "",
    city: "",
    postalAddress: "",
    district: "",
    village: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyPhone: "",
    relationship: "",
    emergencyEmail: "",
    
    // Educational Information
    previousSchool: "",
    educationLevel: "",
    major: "",
    bacGraduationYear: "",
    bacHonors: "",
    bacAverage: "",
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields based on active tab
    if (!validateActiveTab()) {
      return;
    }
    
    // Save data
    onSave(formData);
    onClose();
  };

  const validateActiveTab = () => {
    setErrorMessage('');
    
    switch (activeTab) {
      case 'personal':
        if (!formData.lastName || !formData.firstName || !formData.idNumber || 
            !formData.massarCode || !formData.birthDate || !formData.gender || 
            !formData.birthPlace || !formData.phone) {
          setErrorMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        break;
      case 'address':
        if (!formData.country || !formData.region || !formData.province || 
            !formData.city || !formData.postalAddress) {
          setErrorMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        break;
      case 'emergency':
        if (!formData.emergencyContactName || !formData.emergencyPhone || !formData.relationship) {
          setErrorMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        break;
      case 'education':
        if (!formData.previousSchool || !formData.educationLevel || !formData.major ||
            !formData.bacGraduationYear || !formData.bacHonors || !formData.bacAverage) {
          setErrorMessage('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        break;
    }
    
    return true;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>Modifier votre profil</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <div className={styles.modalTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'personal' ? styles.active : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Informations personnelles
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'address' ? styles.active : ''}`}
            onClick={() => setActiveTab('address')}
          >
            Adresse
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'emergency' ? styles.active : ''}`}
            onClick={() => setActiveTab('emergency')}
          >
            Contact d'urgence
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'education' ? styles.active : ''}`}
            onClick={() => setActiveTab('education')}
          >
            Parcours éducatif
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {activeTab === 'personal' && (
            <div className={styles.tabContent}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Nom <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">Prénom <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="idNumber">Numéro d'identité <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="massarCode">Code Massar <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    id="massarCode"
                    name="massarCode"
                    value={formData.massarCode}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="birthDate">Date de naissance <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="gender">Genre <span className={styles.required}>*</span></label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Male">Masculin</option>
                    <option value="Female">Féminin</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="birthPlace">Lieu de naissance <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    id="birthPlace"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Téléphone <span className={styles.required}>*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className={styles.tabContent}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="country">Pays <span className={styles.required}>*</span></label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Morocco">Maroc</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="region">Région <span className={styles.required}>*</span></label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner</option>
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
                    <option value="">Sélectionner</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="El Jadida">El Jadida</option>
                    <option value="Mohammedia">Mohammedia</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="city">Ville <span className={styles.required}>*</span></label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="El Jadida">El Jadida</option>
                    <option value="Azemmour">Azemmour</option>
                    <option value="Bir Jdid">Bir Jdid</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="postalAddress">Adresse postale <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="postalAddress"
                  name="postalAddress"
                  value={formData.postalAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="district">Quartier</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="village">Village</label>
                  <input
                    type="text"
                    id="village"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className={styles.tabContent}>
              <div className={styles.formGroup}>
                <label htmlFor="emergencyContactName">Nom du contact d'urgence <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="emergencyPhone">Téléphone d'urgence <span className={styles.required}>*</span></label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="relationship">Lien de parenté <span className={styles.required}>*</span></label>
                  <select
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Father">Père</option>
                    <option value="Mother">Mère</option>
                    <option value="Brother">Frère</option>
                    <option value="Sister">Sœur</option>
                    <option value="Uncle">Oncle</option>
                    <option value="Aunt">Tante</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="emergencyEmail">Email d'urgence</label>
                  <input
                    type="email"
                    id="emergencyEmail"
                    name="emergencyEmail"
                    value={formData.emergencyEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className={styles.tabContent}>
              <div className={styles.formGroup}>
                <label htmlFor="previousSchool">École précédente <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  id="previousSchool"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="educationLevel">Niveau d'éducation <span className={styles.required}>*</span></label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Baccalaureate">Baccalauréat</option>
                    <option value="License">Licence</option>
                    <option value="Master">Master</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="major">Filière <span className={styles.required}>*</span></label>
                  <select
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="Mathematical Sciences">Sciences Mathématiques</option>
                    <option value="Physical Sciences">Sciences Physiques</option>
                    <option value="Life and Earth Sciences">Sciences de la Vie et de la Terre</option>
                    <option value="Economic Sciences">Sciences Économiques</option>
                    <option value="Letters">Lettres</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="bacGraduationYear">Année d'obtention du Bac <span className={styles.required}>*</span></label>
                  <select
                    id="bacGraduationYear"
                    name="bacGraduationYear"
                    value={formData.bacGraduationYear}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="bacHonors">Mention <span className={styles.required}>*</span></label>
                  <select
                    id="bacHonors"
                    name="bacHonors"
                    value={formData.bacHonors}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="High Distinction">Très Bien</option>
                    <option value="Good">Bien</option>
                    <option value="Fairly Good">Assez Bien</option>
                    <option value="Pass">Passable</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bacAverage">Moyenne du Bac <span className={styles.required}>*</span></label>
                <input
                  type="number"
                  id="bacAverage"
                  name="bacAverage"
                  value={formData.bacAverage}
                  onChange={handleChange}
                  step="0.01"
                  min="10"
                  max="20"
                  required
                />
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className={styles.saveButton}>
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;