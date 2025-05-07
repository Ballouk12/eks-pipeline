export const checkAuth = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return false;
    
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userCNE = localStorage.getItem('user_cne');
    
    return isAuthenticated && userCNE;
  };
  
  export const getUserInfo = () => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return null;
    
    // Get user info from localStorage
    const userCNE = localStorage.getItem('user_cne');
    
    return userCNE ? { cne: userCNE } : null;
  };
  
  export const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user_cne');
    
    // You can add any other cleanup needed here
  };