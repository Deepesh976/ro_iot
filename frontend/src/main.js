import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/login';
import Navbar from './components/Navbar/navbar';
import Devices from './pages/devices';
import User from './pages/user';
import DeviceAnalysis from './pages/deviceAnalysis';
import EditUser from './pages/edituser';
import ProtectedRoute from './components/auth/ProtectedRoute'; // ✅ Import protected route

const WithNavbar = ({ Component }) => (
  <>
    <Navbar />
    <div style={{ paddingTop: '70px' }}>
      <Component />
    </div>
  </>
);

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Protected Routes - wrap them */}
      <Route
        path="/devices"
        element={
          <ProtectedRoute>
            <WithNavbar Component={Devices} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/deviceAnalysis"
        element={
          <ProtectedRoute>
            <WithNavbar Component={DeviceAnalysis} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <WithNavbar Component={User} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edituser"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <WithNavbar Component={EditUser} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
