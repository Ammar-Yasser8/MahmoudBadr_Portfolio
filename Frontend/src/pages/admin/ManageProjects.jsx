import API_BASE_URL from '../../config';
import React, { useState, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/portfolio`);
      const data = await res.json();
      if (data && data.Projects) setProjects(data.Projects);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE_URL}/api/admin/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: title, Brief: brief, Category: category, ThumbnailUrl: thumbnailUrl })
      });
      setTitle(''); setBrief(''); setCategory(''); setThumbnailUrl('');
      fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete project?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Manage Projects</h2>
      
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Add New Project</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
          <input className="input-field" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="input-field" placeholder="Category (e.g. Cinematic)" value={category} onChange={e => setCategory(e.target.value)} required />
          <input className="input-field" placeholder="Brief" value={brief} onChange={e => setBrief(e.target.value)} style={{ gridColumn: '1 / -1' }} required />
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Project Thumbnail</label>
            <FileUpload onUploadSuccess={url => setThumbnailUrl(url)} accept="image/*" label="Upload Project Thumbnail Image" />
            {thumbnailUrl && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={thumbnailUrl} alt="Preview" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{thumbnailUrl}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>Add Project</button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {projects.map(p => (
          <div key={p.Id} style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ marginBottom: '0.25rem' }}>{p.Title} <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)', marginLeft: '0.5rem' }}>{p.Category}</span></h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{p.Brief}</p>
            </div>
            <button onClick={() => handleDelete(p.Id)} className="btn-secondary" style={{ padding: '0.5rem 1rem', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
