"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';
import Image from "next/image";
import Female from "../../../public/images/femaleStd.png";
import Male from "../../../public/images/maleStd.png";
import EditProfileModal from "@/components/EditProfile/EditProfileModal";
import { checkAuth, logout } from '../../utils/session';

const ProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!checkAuth()) {
      router.push('/signin');
      return;
    }
    // Charger les données du profil
    loadProfileData();
  }, [router]);

  const loadProfileData = () => {
    const storedData = sessionStorage.getItem('registrationData') || localStorage.getItem('userProfile');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      fetchUserProfile();
    }
    setLoading(false);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8888/inscription-service/auth/profile', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        localStorage.setItem('userProfile', JSON.stringify(data));
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProfile = (updatedData) => {
    setUserData(updatedData);
    sessionStorage.setItem('registrationData', JSON.stringify(updatedData));
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
  };

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  if (!checkAuth() || loading) {
    return (
      <div id="profileContainer" className={styles.container}>
        <div id="loadingMessage" className={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div id="profileContainer" className={styles.container}>
      <header id="profileHeader" className={styles.profileHeader}>
        <h1 id="headerTitle">Student Profile</h1>
        <div id="profileActions" className={styles.profileActions}>
          <button id="editProfileButton" onClick={handleOpenModal} className={styles.editButton}>
            Edit Profile
          </button>
          <button id="logoutButton" onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div id="profileCard" className={styles.profileCard}>
        <div id="profileSidebar" className={styles.profileSidebar}>
          <div id="profileImage" className={styles.profileImage}>
            {userData?.gender === "Male" ? (
              <Image src={Male} alt="Male avatar" />
            ) : (
              <Image src={Female} alt="Female avatar" />
            )}
          </div>
          <div id="profileInfoSummary" className={styles.profileInfoSummary}>
            <h2 id="userName">{userData?.firstName} {userData?.lastName}</h2>
            <p id="massarCode" className={styles.studentId}>Massar Code: {userData?.massarCode}</p>
            <p id="studentProgram" className={styles.studentProgram}>{userData?.major}</p>
          </div>
        </div>

        <div id="profileTabs" className={styles.profileTabs}>
          <div id="tabHeaders" className={styles.tabHeaders}>
            <button 
              id="tabPersonal" 
              className={`${styles.tabButton} ${activeTab === 'personal' ? styles.active : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </button>
            <button 
              id="tabAddress" 
              className={`${styles.tabButton} ${activeTab === 'address' ? styles.active : ''}`}
              onClick={() => setActiveTab('address')}
            >
              Address
            </button>
            <button 
              id="tabEmergency" 
              className={`${styles.tabButton} ${activeTab === 'emergency' ? styles.active : ''}`}
              onClick={() => setActiveTab('emergency')}
            >
              Emergency Contact
            </button>
            <button 
              id="tabEducation" 
              className={`${styles.tabButton} ${activeTab === 'education' ? styles.active : ''}`}
              onClick={() => setActiveTab('education')}
            >
              Education History
            </button>
          </div>

          <div id="tabContent" className={styles.tabContent}>
            {activeTab === 'personal' && (
              <div id="personalSection" className={styles.infoSection}>
                <h3 id="personalTitle">Personal Information</h3>
                <div id="personalGrid" className={styles.infoGrid}>
                  <div id="infoFullName" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Full Name:</span>
                    <span className={styles.infoValue}>{userData?.firstName} {userData?.lastName}</span>
                  </div>
                  <div id="infoIdNumber" className={styles.infoItem}>
                    <span className={styles.infoLabel}>ID Number:</span>
                    <span className={styles.infoValue}>{userData?.idNumber}</span>
                  </div>
                  <div id="infoMassarCode" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Massar Code:</span>
                    <span className={styles.infoValue}>{userData?.massarCode}</span>
                  </div>
                  <div id="infoBirthDate" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Birth Date:</span>
                    <span className={styles.infoValue}>
                      {userData?.birthDate ? new Date(userData.birthDate).toLocaleDateString('en-US') : 'N/A'}
                    </span>
                  </div>
                  <div id="infoBirthPlace" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Birth Place:</span>
                    <span className={styles.infoValue}>{userData?.birthPlace || 'N/A'}</span>
                  </div>
                  <div id="infoGender" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Gender:</span>
                    <span className={styles.infoValue}>{userData?.gender || 'N/A'}</span>
                  </div>
                  <div id="infoPhone" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{userData?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div id="addressSection" className={styles.infoSection}>
                <h3 id="addressTitle">Address</h3>
                <div id="addressGrid" className={styles.infoGrid}>
                  <div id="infoPostalAddress" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Postal Address:</span>
                    <span className={styles.infoValue}>{userData?.postalAddress || 'N/A'}</span>
                  </div>
                  <div id="infoCity" className={styles.infoItem}>
                    <span className={styles.infoLabel}>City:</span>
                    <span className={styles.infoValue}>{userData?.city || 'N/A'}</span>
                  </div>
                  <div id="infoProvince" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Province:</span>
                    <span className={styles.infoValue}>{userData?.province || 'N/A'}</span>
                  </div>
                  <div id="infoRegion" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Region:</span>
                    <span className={styles.infoValue}>{userData?.region || 'N/A'}</span>
                  </div>
                  <div id="infoCountry" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Country:</span>
                    <span className={styles.infoValue}>{userData?.country || 'N/A'}</span>
                  </div>
                  <div id="infoDistrict" className={styles.infoItem}>
                    <span className={styles.infoLabel}>District:</span>
                    <span className={styles.infoValue}>{userData?.district || "Not specified"}</span>
                  </div>
                  <div id="infoVillage" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Village:</span>
                    <span className={styles.infoValue}>
                      {userData?.village === "NONE" || !userData?.village ? "Not applicable" : userData.village}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'emergency' && (
              <div id="emergencySection" className={styles.infoSection}>
                <h3 id="emergencyTitle">Emergency Contact</h3>
                <div id="emergencyGrid" className={styles.infoGrid}>
                  <div id="infoEmergencyName" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Name:</span>
                    <span className={styles.infoValue}>{userData?.emergencyContactName || 'N/A'}</span>
                  </div>
                  <div id="infoEmergencyPhone" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{userData?.emergencyPhone || 'N/A'}</span>
                  </div>
                  <div id="infoRelationship" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Relationship:</span>
                    <span className={styles.infoValue}>{userData?.relationship || 'N/A'}</span>
                  </div>
                  <div id="infoEmergencyEmail" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{userData?.emergencyEmail || "Not specified"}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div id="educationSection" className={styles.infoSection}>
                <h3 id="educationTitle">Education History</h3>
                <div id="educationGrid" className={styles.infoGrid}>
                  <div id="infoPreviousSchool" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Previous School:</span>
                    <span className={styles.infoValue}>{userData?.previousSchool || 'N/A'}</span>
                  </div>
                  <div id="infoEducationLevel" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Education Level:</span>
                    <span className={styles.infoValue}>{userData?.educationLevel || 'N/A'}</span>
                  </div>
                  <div id="infoMajor" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Major:</span>
                    <span className={styles.infoValue}>{userData?.major || 'N/A'}</span>
                  </div>
                  <div id="infoBacYear" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Baccalaureate Year:</span>
                    <span className={styles.infoValue}>{userData?.bacGraduationYear || 'N/A'}</span>
                  </div>
                  <div id="infoBacHonors" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Baccalaureate Honors:</span>
                    <span className={styles.infoValue}>{userData?.bacHonors || 'N/A'}</span>
                  </div>
                  <div id="infoBacAverage" className={styles.infoItem}>
                    <span className={styles.infoLabel}>Baccalaureate Average:</span>
                    <span className={styles.infoValue}>{userData?.bacAverage || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal 
        userData={userData}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
      />

      <footer id="profileFooter" className={styles.profileFooter}>
        <p>&copy; {new Date().getFullYear()} - Student Portal</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
