"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from "./navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { checkAuth, logout } from '../../utils/session';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Common links for all users
  const commonLinks = [
    {
      id: 1,
      title: "Home",
      url: "/",
    },
    {
      id: 3,
      title: "About",
      url: "/about",
    },
    {
      id: 4,
      title: "Contact",
      url: "/contact",
    },
  ];
  
  // Links for authenticated users
  const authLinks = [
    {
      id: 5,
      title: "Profile",
      url: "/profile",
    },
    {
      id: 6,
      title: "Bourses",
      url: "/bources",
    },
  ];

  useEffect(() => {
    // Check authentication status whenever component renders
    setIsAuthenticated(checkAuth());
    
    // Add event listener for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      setIsAuthenticated(checkAuth());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        🧑🏻‍🎓ExcelliaBourse
      </Link>
      <div className={styles.links}>
        <DarkModeToggle />
        
        {/* Common links for all users */}
        {commonLinks.map((link) => (
          <Link key={link.id} href={link.url} className={styles.link}>
            {link.title}
          </Link>
        ))}
        
        {/* Conditional rendering based on authentication status */}
        {isAuthenticated ? (
          <>
            {/* Links for authenticated users */}
            {authLinks.map((link) => (
              <Link key={link.id} href={link.url} className={styles.link}>
                {link.title}
              </Link>
            ))}
            <button onClick={handleLogout} className={styles.signIn}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/signin" className={styles.signIn}>Sign In</Link>
            <Link href="/signup" className={styles.signUp}>Sign Up</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;