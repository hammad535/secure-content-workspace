import { create } from 'zustand';

const useAuthStore = create((set, get) => {
  const restoreAuth = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, initialized: true });
        return true;
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false, initialized: true });
        return false;
      }
    }
    
    set({ user: null, token: null, isAuthenticated: false, initialized: true });
    return false;
  };

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    initialized: false,

    setAuth: (user, token) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    },

    initialize: () => {
      if (get().initialized) {
        return;
      }
      restoreAuth();
    },

    getToken: () => {
      return localStorage.getItem('token') || get().token;
    },
  };
});

export default useAuthStore;
