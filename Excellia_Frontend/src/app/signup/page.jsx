"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from '../auth.module.css';
import Hero from "../../../public/images/hero.png";
import { checkAuth } from '../../utils/session'; // Import session utility

const SignUpInitial = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cne: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    if (checkAuth()) {
      // Redirect to home page if already logged in
      router.push('/');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Verify if student exists in UserRef via backend API
      const response = await axios.post('http://localhost:8888/inscription-service/auth/signup', {
        cne: formData.cne,
        password: formData.password
      }, {
        withCredentials: true,  // Include cookies if needed
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // If initial registration is successful
      if (response.status === 200 || response.status === 201) {
        // Store authentication data to create session
        localStorage.setItem('user_cne', formData.cne);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store user ID from response if available
        if (response.data && response.data.id) {
          localStorage.setItem('user_id', response.data.id);
        }
        
        // Notify other components about authentication change
        window.dispatchEvent(new Event('storage'));
        
        // Store registration data in sessionStorage for the registration form
        sessionStorage.setItem('registrationData', JSON.stringify({
          cne: formData.cne,
          userId: response.data.id || ''
        }));

        // Display success alert with SweetAlert
        await Swal.fire({
          title: 'Success!',
          text: 'Your account has been created successfully. Please complete your registration.',
          icon: 'success',
          confirmButtonText: 'Continue'
        });
        
        // Redirect to registration page to complete profile
        router.push('/Registration');
      } else {
        // Handle unexpected response status
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
      
      // Display error alert with SweetAlert
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="authContainer" className={styles.authContainer}>
      <div>
        <h1 id="title1" className={styles.title1}>Create Your Account</h1>
      </div>
      <div id="authContent" className={styles.authContent}>
        <div id="imgContainer" className={styles.imgContainer}>
          <Image
            src={Hero}
            alt="Sign Up Illustration"
            fill={true}
            className={styles.image}
          />
        </div>

        <div id="authCard" className={styles.authCard}>
          <div id="authHeader" className={styles.authHeader}>
            <h1 id="headerTitle">Sign Up</h1>
            <p id="headerSubtitle">Create your candidate account</p>
          </div>

          {error && <div id="errorMessage" className={styles.errorMessage}>{error}</div>}

          <form id="authForm" onSubmit={handleSubmit} className={styles.authForm}>
            <div id="formGroup-cne" className={styles.formGroup}>
              <label htmlFor="cne">Massar Code (CNE)</label>
              <input
                type="text"
                id="cne"
                name="cne"
                value={formData.cne}
                onChange={handleChange}
                placeholder="Enter your Massar code"
                required
              />
            </div>

            <div id="formGroup-password" className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create your password"
                required
              />
            </div>

            <div id="formGroup-confirmPassword" className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button 
              id="continueButton" 
              type="submit" 
              className={styles.authButton}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Continue'}
            </button>
          </form>

          <div id="authFooter" className={styles.authFooter}>
            <p>
              Already have an account?{' '}
              <Link id="signInLink" href="/signin" className={styles.authLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpInitial;
