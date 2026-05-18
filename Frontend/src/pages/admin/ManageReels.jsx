import API_BASE_URL from '../../config';
import React, { useState, useEffect } from 'react';
import FileUpload from '../../components/FileUpload';

const ManageReels = () => {
  const [reels, setReels] = useState([]);
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/portfolio`);
      const data = await res.json();
      if (data && data.Reels) {
        setReels(data.Reels);
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
      const res = await fetch(`${API_BASE_URL}/api/admin/reels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Title: title,
          YoutubeLink: videoUrl, // Maps to the string URL column in Db
          IsFeatured: isFeatured
        })
      });
      if (res.ok) {
        setTitle('');
        setVideoUrl('');
        setIsFeatured(false);
        setMessage('Reel added successfully!');
        fetchReels();
      } else {
        setMessage('Failed to add reel.');
      }
    } catch (e) {
      setMessage('Server error.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reel?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reels/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchReels();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Manage Video Showreels</h2>

      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--border-color)', maxWidth: '800px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Add New Reel</h3>
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
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Reel Title</label>
            <input className="input-field" placeholder="e.g. Cinematic Showreel 2026, Colorist Showcase" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Showreel Video (Upload File or Paste Link)</label>
            <FileUpload onUploadSuccess={url => setVideoUrl(url)} accept="video/*" label="Upload Showreel Video File" />

            <div style={{ margin: '0.75rem 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>- OR -</div>

            <input
              className="input-field"
              placeholder="Paste Video URL (YouTube, Vimeo, or raw MP4 link)"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
            />

            {videoUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                  Selected Video: {videoUrl}
                </span>
                {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                  <div style={{ color: '#10B981', fontSize: '0.85rem' }}>✓ Linked YouTube video successfully.</div>
                ) : (
                  <video src={videoUrl} controls muted style={{ width: '100%', maxHeight: '180px', borderRadius: '4px', background: '#000' }} />
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={e => setIsFeatured(e.target.checked)}
              style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--accent-red)' }}
            />
            <label htmlFor="isFeatured" style={{ cursor: 'pointer', fontSize: '0.95rem' }}>Mark as Featured (Display prominently on Homepage)</label>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Adding...' : 'Add Showreel'}
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '1.25rem', maxWidth: '800px' }}>
        <h3>Current Showreels</h3>
        {reels.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No reels added yet.</p>
        ) : (
          reels.map(r => (
            <div key={r.Id} style={{
              background: 'var(--bg-card)',
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', overflow: 'hidden' }}>
                <div style={{ width: '100px', height: '60px', borderRadius: '4px', background: '#000', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {r.YoutubeLink.includes('youtube.com') || r.YoutubeLink.includes('youtu.be') ? (
                    <span style={{ fontSize: '0.75rem', color: '#FF0000' }}>YouTube</span>
                  ) : (
                    <video src={r.YoutubeLink} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>
                    {r.Title}
                    {r.IsFeatured && (
                      <span style={{
                        fontSize: '0.7rem',
                        background: 'rgba(220, 38, 38, 0.15)',
                        color: 'var(--accent-red)',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        marginLeft: '0.5rem',
                        fontWeight: '600'
                      }}>
                        Featured
                      </span>
                    )}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', wordBreak: 'break-all' }}>{r.YoutubeLink}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(r.Id)}
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

export default ManageReels;
