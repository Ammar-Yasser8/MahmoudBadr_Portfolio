import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicPortfolio from './pages/PublicPortfolio';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardHome from './pages/admin/DashboardHome';
import ManageProjects from './pages/admin/ManageProjects';
import AdminLogin from './pages/admin/AdminLogin';
import ManageHero from './pages/admin/ManageHero';
import ManageSkills from './pages/admin/ManageSkills';
import ManageServices from './pages/admin/ManageServices';
import ManageReels from './pages/admin/ManageReels';
import ManageMessages from './pages/admin/ManageMessages';
import ManageAbout from './pages/admin/ManageAbout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicPortfolio />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="hero" element={<ManageHero />} />
          <Route path="about" element={<ManageAbout />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="services" element={<ManageServices />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="reels" element={<ManageReels />} />
          <Route path="messages" element={<ManageMessages />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
