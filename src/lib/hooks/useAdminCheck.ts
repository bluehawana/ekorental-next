import { useEffect, useState } from 'react';

// Replace this with your own user retrieval logic (e.g., session, context, etc.)
const getUser = () => {
  // Example: Get user data from local storage or your own auth context
  return JSON.parse(localStorage.getItem('user') || '{}');
};

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (user?.email === 'bluehawana@gmail.com') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  return { isAdmin, loading };
}

