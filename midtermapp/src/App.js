import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './components/theme';
import Navbar from './components/Navbar';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import MembersPage from './components/MembersPage';
import ProtectedRoute from './components/ProtectedRoute'; 

const HomePage = lazy(() => import('./components/HomePage'));
const AdminPage = lazy(() => import('./components/AdminPage'));
const AddProductPage = lazy(() => import('./components/AddProductPage'));

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/members" element={<MembersPage />} />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-product"
              element={
                <ProtectedRoute>
                  <AddProductPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </Router>
  );
};

export default App;
