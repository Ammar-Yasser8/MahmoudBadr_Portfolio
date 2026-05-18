import React, { useState, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';
import API_BASE_URL from '../../config';

const ManageHero = () => {
  const [name, setName] = useState('');
  const [brief, setBrief] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [backgroundVideoUrl, setBackgroundVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/portfolio`);
      const data = await res.json();
      if (data && data.Hero) {
        setName(data.Hero.Name || '');
        setBrief(data.Hero.Brief || '');
        setCtaText(data.Hero.CtaText || '');
        setCtaLink(data.Hero.CtaLink || '');
        setBackgroundVideoUrl(data.Hero.BackgroundVideoUrl || '');
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
      const res = await fetch(`${API_BASE_URL}/api/admin/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          Id: 1, // Hero is a single record, typically ID 1
          Name: name, 
          Brief: brief, 
          CtaText: ctaText, 
          CtaLink: ctaLink, 
          BackgroundVideoUrl: backgroundVideoUrl 
        })
      });
      if (res.ok) {
        setMessage('Hero section updated successfully!');
      } else {
        setMessage('Failed to update Hero section.');
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
      <h2 style={{ marginBottom: '2rem' }}>Manage Hero Section</h2>
      
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', maxWidth: '800px' }}>
        {message && (
          <div style={{ 
            padding: '1rem', 
            background: message.includes('successfully') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(220, 38, 38, 0.1)', 
            color: message.includes('successfully') ? '#10B981' : 'var(--accent-red)', 
            borderRadius: '6px', 
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Editor / Director Name</label>
            <input className="input-field" placeholder="e.g. Mahmoud Badr" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Brief Bio / Hook</label>
            <textarea 
              className="input-field" 
              placeholder="e.g. Professional Video Editor & Motion Graphic Designer" 
              value={brief} 
              onChange={e => setBrief(e.target.value)} 
              style={{ minHeight: '100px', resize: 'vertical' }}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CTA Button Text</label>
              <input className="input-field" placeholder="e.g. View My Work" value={ctaText} onChange={e => setCtaText(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CTA Button Link</label>
              <input className="input-field" placeholder="e.g. #projects" value={ctaLink} onChange={e => setCtaLink(e.target.value)} required />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Background Cinematic Image</label>
            <FileUpload onUploadSuccess={url => setBackgroundVideoUrl(url)} accept="image/*" label="Upload Hero Background Image" />
            {backgroundVideoUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                  Current image URL: {backgroundVideoUrl}
                </span>
                <img 
                  src={backgroundVideoUrl} 
                  alt="Background Preview"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} 
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Saving...' : 'Update Hero Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageHero;
