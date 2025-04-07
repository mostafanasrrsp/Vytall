import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage on initial mount (to persist login across refreshes)
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const role = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    const patientId = localStorage.getItem('patientId');
    const physicianId = localStorage.getItem('physicianId');
    const pharmacistId = localStorage.getItem('pharmacistId');
    const facilityId = localStorage.getItem('facilityId');

    if (token && role && username) {
      setUser({ token, role, username, patientId, physicianId, pharmacistId, facilityId });
    }
  }, []);

  // ✅ Handle login success and save everything in localStorage
  function handleLoginSuccess({ token, role, username, patientId, physicianId, pharmacistId, facilityId }) {
    console.log("Login Success Data:", { token, role, username, patientId, physicianId, pharmacistId, facilityId }); // ✅ Check what's returned
    setUser({ token, role, username, patientId, physicianId, pharmacistId, facilityId });
    

    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', username);
    localStorage.setItem('patientId', patientId || '');
    localStorage.setItem('physicianId', physicianId || '');
    localStorage.setItem('pharmacistId', pharmacistId || '');
    localStorage.setItem('facilityId', facilityId || '');
  }

  function logout() {
    // ✅ Clear authentication data
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('patientId');
    localStorage.removeItem('physicianId');
    localStorage.removeItem('pharmacistId');
    localStorage.removeItem('facilityId');

    // ✅ Reset user state
    setUser(null);

    // ✅ Force refresh to re-evaluate routes
    window.location.href = "/";
}

  return (
    <AuthContext.Provider value={{ user, handleLoginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}