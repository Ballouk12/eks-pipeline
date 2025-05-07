"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '../utils/session';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    if (!checkAuth()) {
      // If not authenticated, redirect to the sign-in page
      router.push('/signin');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Show loading state or the protected content
  return isLoading ? <div>Loading...</div> : children;
};

export default ProtectedRoute;