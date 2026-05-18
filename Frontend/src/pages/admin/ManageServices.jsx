import API_BASE_URL from '../../config';
import React, { useState, useEffect } from 'react';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/portfolio`);
      const data = await res.json();
      if (data && data.Services) {
        setServices(data.Services);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          Title: title, 
          Description: description 
        })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setMessage('Service added successfully!');
        fetchServices();
      } else {
        setMessage('Failed to add service.');
      }
    } catch (e) {
      setMessage('Server error.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/services/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchServices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Manage Services</h2>
      
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)', maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Add New Service Offered</h3>
        {message && (
          <div style={{ 
            padding: '0.75rem', 
            background: 'rgba(16, 185, 129, 0.1)', 
            color: '#10B981', 
            borderRadius: '6px', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Service Title</label>
            <input className="input-field" placeholder="e.g. Color Grading, Sound Design, Full Video Editing" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Service Description</label>
            <textarea 
              className="input-field" 
              placeholder="Describe the details, tools used, turnaround time, etc." 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              style={{ minHeight: '100px', resize: 'vertical' }}
              required 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Service'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px' }}>
        <h3>Current Services</h3>
        {services.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No services listed yet.</p>
        ) : (
          services.map(s => (
            <div key={s.Id} style={{ 
              background: 'var(--bg-card)', 
              padding: '1rem 1.5rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div style={{ marginRight: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.25rem' }}>{s.Title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>{s.Description}</p>
              </div>
              <button 
                onClick={() => handleDelete(s.Id)} 
                className="btn-secondary" 
                style={{ padding: '0.5rem 1rem', color: 'var(--accent-red)', borderColor: 'var(--accent-red)', flexShrink: 0 }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageServices;
