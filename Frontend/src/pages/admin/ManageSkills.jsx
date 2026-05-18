import API_BASE_URL from '../../config';
import React, { useState, useEffect } from 'react';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [order, setOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/portfolio`);
      const data = await res.json();
      if (data && data.Skills) {
        setSkills(data.Skills);
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
      const res = await fetch(`${API_BASE_URL}/api/admin/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          Title: title, 
          Tags: tags, 
          Order: parseInt(order) 
        })
      });
      if (res.ok) {
        setTitle('');
        setTags('');
        setOrder(skills.length + 2);
        setMessage('Skill added successfully!');
        fetchSkills();
      } else {
        setMessage('Failed to add skill.');
      }
    } catch (e) {
      setMessage('Server error.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/skills/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchSkills();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Manage Skills</h2>
      
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)', maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Add New Skill Category</h3>
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
        <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '2fr 1fr' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Skill Category Title</label>
            <input className="input-field" placeholder="e.g. Video Editing, Motion Graphics" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Display Order</label>
            <input type="number" className="input-field" value={order} onChange={e => setOrder(e.target.value)} required />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Skills / Tags (comma-separated)</label>
            <input className="input-field" placeholder="e.g. Adobe Premiere, DaVinci Resolve, Avid Media Composer" value={tags} onChange={e => setTags(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }} disabled={loading}>
            {loading ? 'Adding...' : 'Add Skill Category'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px' }}>
        <h3>Current Skills</h3>
        {skills.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No skills added yet.</p>
        ) : (
          skills.map(s => (
            <div key={s.Id} style={{ 
              background: 'var(--bg-card)', 
              padding: '1rem 1.5rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>{s.Title} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>Order: {s.Order}</span></h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {s.Tags.split(',').map((tag, idx) => (
                    <span key={idx} style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      color: 'var(--text-secondary)' 
                    }}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => handleDelete(s.Id)} 
                className="btn-secondary" 
                style={{ padding: '0.5rem 1rem', color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
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

export default ManageSkills;
