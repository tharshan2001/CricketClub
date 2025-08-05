import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:6030",
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/players/profile");
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Axios response interceptor for 401 errors to logout and reload
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const config = error.config || {};
        if (error.response?.status === 401 && !config.__skipAuthInterceptor) {
          setUser(null);
          window.location.reload();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  // Periodic session validation every 1 hour
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axiosInstance.get("/api/players/profile");
      } catch (error) {
        if (error.response?.status === 401) {
          setUser(null);
          window.location.reload();
        }
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Login method
  const login = async (email, password) => {
    await axiosInstance.post(
      "/api/players/login",
      { email, password },
      {
        __skipAuthInterceptor: true,
      }
    );
    await fetchProfile();
  };

  // Logout method
  const logout = async () => {
    await axiosInstance.post("/api/players/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        axiosInstance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier consumption
export const useAuth = () => useContext(AuthContext);
