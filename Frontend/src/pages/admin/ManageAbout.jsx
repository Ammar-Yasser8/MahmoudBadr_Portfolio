import API_BASE_URL from '../../config';
import React, { useState, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';

const ManageAbout = () => {
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/portfolio`);
      const data = await res.json();
      if (data && data.About) {
        setTitle(data.About.Title || '');
        setBrief(data.About.Brief || '');
        setImageUrl(data.About.ImageUrl || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: title, Brief: brief, ImageUrl: imageUrl })
      });
      if (res.ok) {
        setMessage('About section updated successfully!');
      } else {
        setMessage('Failed to update About section.');
      }
    } catch (e) {
      setMessage('Server error.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Manage About Section</h2>

      <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', maxWidth: '800px' }}>
        {message && (
          <div style={{
            padding: '1rem',
            background: message.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            color: message.includes('success') ? '#10B981' : 'var(--accent-red)',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Section Title</label>
            <input
              className="input-field"
              placeholder="e.g. About Me, The Director, etc."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Biography / Brief Details</label>
            <textarea
              className="input-field"
              placeholder="Write a few paragraphs about yourself, your background, and your passion..."
              value={brief}
              onChange={e => setBrief(e.target.value)}
              rows="6"
              required
            ></textarea>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Profile Image</label>
            <FileUpload
              onUploadSuccess={url => setImageUrl(url)}
              accept="image/*"
              label="Upload Profile / About Image"
            />
            {imageUrl && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={imageUrl} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--accent-red)' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{imageUrl}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Updating...' : 'Update About Section'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageAbout;
