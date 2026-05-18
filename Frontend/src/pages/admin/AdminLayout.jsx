import React, { useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut, User, Zap, Briefcase, Video, Mail, Info } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--bg-card)', borderRight: '1px solid var(--border-color)', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ marginBottom: '2rem', paddingLeft: '1rem', color: 'var(--accent-red)' }}>Admin Panel</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <LayoutDashboard size={18} color="var(--accent-red)" /> Overview
            </Link>
            <Link to="/admin/hero" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <User size={18} color="var(--accent-red)" /> Hero Section
            </Link>
            <Link to="/admin/about" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <Info size={18} color="var(--accent-red)" /> About Section
            </Link>
            <Link to="/admin/skills" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <Zap size={18} color="var(--accent-red)" /> Skills
            </Link>
            <Link to="/admin/services" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <Briefcase size={18} color="var(--accent-red)" /> Services
            </Link>
            <Link to="/admin/projects" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <FolderKanban size={18} color="var(--accent-red)" /> Projects
            </Link>
            <Link to="/admin/reels" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <Video size={18} color="var(--accent-red)" /> Showreels
            </Link>
            <Link to="/admin/messages" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: 'var(--text-primary)', textDecoration: 'none' }}>
              <Mail size={18} color="var(--accent-red)" /> Messages
            </Link>
          </nav>
        </div>
        
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <LogOut size={18} /> Logout
        </button>
      </aside>
      
      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', background: 'var(--bg-primary)' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
