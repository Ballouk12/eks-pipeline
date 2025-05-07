"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '../auth.module.css';
import Hero from "../../../public/images/hero.png";
import { checkAuth } from '../../utils/session'; // Import session utility

const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cne: '',
    password: '',
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
    setLoading(true);
    
    try {
      // Call login API
      const response = await axios.post(
        'http://localhost:8888/inscription-service/auth/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
  
      // Verify response status
      if (response.status === 200) {
        // Store authentication data
        localStorage.setItem('user_cne', formData.cne);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store any additional user data if available in the response
        if (response.data && response.data.user) {
          const userData = response.data.user;
          if (userData.id) localStorage.setItem('user_id', userData.id);
          if (userData.role) localStorage.setItem('user_role', userData.role);
        }
        
        // Notify other components about authentication change
        window.dispatchEvent(new Event('storage'));
        
        // Redirect after a short delay to avoid state update issues
        setTimeout(() => {
          router.push('/');
        }, 100);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred during login'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div id="authContainer" className={styles.authContainer}>
      <h1 id="title1" className={styles.title1}>Sign In to Your Account</h1>
      <div id="authContent" className={styles.authContent}>
        <div id="imgContainer" className={styles.imgContainer}>
          <Image
            src={Hero}
            alt="Sign In Illustration"
            fill={true}
            className={styles.image}
          />
        </div>
       
        <div id="authCard" className={styles.authCard}>
          <div id="authHeader" className={styles.authHeader}>
            <h1 id="headerTitle">Sign In</h1>
            <p id="headerSubtitle">Access your candidate space</p>
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
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              id="signInButton"
              type="submit"
              className={styles.authButton}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div id="authFooter" className={styles.authFooter}>
            <p>
              Don't have an account?{' '}
              <Link id="signUpLink" href="/signup" className={styles.authLink}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
