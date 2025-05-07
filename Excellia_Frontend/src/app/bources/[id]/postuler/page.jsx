"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaPaperPlane, FaUniversity, FaFileUpload, FaUser } from 'react-icons/fa';
import styles from './page.module.css';
import Link from 'next/link';

const ApplicationForm = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [bourse, setBourse] = useState(null);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    cne: '',
    criteriaResponses: {},
    documents: null,
  });

  useEffect(() => {
    const fetchBourse = async () => {
      try {
        const response = await fetch(`/api/bourses/${id}`);
        const data = await response.json();
        setBourse(data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la bourse:', error);
      }
    };
    fetchBourse();
  }, [id]);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    const applicationPayload = {
      bourseId: bourse.id,
      name: applicationData.name,
      email: applicationData.email,
      cne: applicationData.cne,
      criteriaResponses: applicationData.criteriaResponses,
    };

    try {
      const response = await fetch(`http://localhost:8888/gestion-bourse-condidature-service/api/candidatures/submit?userId=1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la soumission de la candidature: ${errorText}`);
      }

      alert('Votre candidature a été soumise avec succès!');
      router.push('/bources');
    } catch (error) {
      console.error('Erreur lors de la soumission de la candidature:', error);
      alert('Une erreur est survenue lors de la soumission. Veuillez réessayer.');
    }
  };

  const handleChange = (key, value) => {
    // Vérifie si la clé correspond à un critère de la bourse
    if (bourse?.eligibilityCriteria?.some(c => c.name === key)) {
      setApplicationData((prev) => ({
        ...prev,
        criteriaResponses: {
          ...prev.criteriaResponses,
          [key]: value,
        },
      }));
    } else {
      setApplicationData({ ...applicationData, [key]: value });
    }
  };

  if (!bourse) {
    return <div className={styles.container}>Chargement...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.applicationPageHeader}>
          <Link href="/bources" className={styles.backLink}>
            <FaArrowLeft /> Retour aux bourses
          </Link>
          <h1>Candidature pour {bourse.title}</h1>
          <div className={styles.universityDetail}>
            <FaUniversity />
            <span>{bourse.university}</span>
          </div>
        </div>

        <div className={styles.applicationFormContainer}>
          <h2>Formulaire de candidature</h2>
          <p className={styles.applicationDescription}>
            Veuillez remplir le formulaire ci-dessous pour postuler à cette bourse. 
            Assurez-vous de fournir tous les documents requis dans un fichier ZIP.
          </p>

          <form onSubmit={handleApplicationSubmit} className={styles.applicationForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name"><FaUser /> Nom complet:</label>
              <input
                type="text"
                id="name"
                value={applicationData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email"><FaUser /> Email:</label>
              <input
                type="email"
                id="email"
                value={applicationData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cne"><FaUser /> CNE:</label>
              <input
                type="text"
                id="cne"
                value={applicationData.cne}
                onChange={(e) => handleChange("cne", e.target.value)}
                required
                className={styles.formInput}
              />
            </div>

            {/* Affichage dynamique des critères */}
            {bourse.eligibilityCriteria?.map((criterion, index) => (
              <div className={styles.formGroup} key={index}>
                <label htmlFor={`criterion-${index}`}>{criterion.name}:</label>
                <input
                  type="text"
                  id={`criterion-${index}`}
                  value={applicationData.criteriaResponses[criterion.name] || ''}
                  onChange={(e) => handleChange(criterion.name, e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
            ))}

            <div className={styles.formGroup}>
              <label htmlFor="documents"><FaFileUpload /> Documents requis:</label>
              <input
                type="file"
                id="documents"
                onChange={(e) => handleChange("documents", e.target.files[0])}
                required
                className={styles.formInput}
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              <FaPaperPlane /> Soumettre ma candidature
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
