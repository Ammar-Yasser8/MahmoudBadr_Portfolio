import API_BASE_URL from '../../config';
import React, { useState, useEffect } from 'react';
import { Mail, Calendar, User, Phone } from 'lucide-react';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '2rem' }}>Client Messages Inbox</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '900px' }}>
        {loading ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <div style={{ 
            background: 'var(--bg-card)', 
            padding: '3rem 1.5rem', 
            borderRadius: '8px', 
            border: '1px solid var(--border-color)', 
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <Mail size={40} style={{ marginBottom: '1rem', color: 'var(--text-secondary)', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>Your inbox is currently empty!</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.25rem' }}>When clients fill out the contact form on your portfolio, their messages will appear here.</p>
          </div>
        ) : (
          messages.map(m => (
            <div key={m.Id} style={{ 
              background: 'var(--bg-card)', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <User size={16} color="var(--accent-red)" />
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{m.Name}</span>
                </div>
                {m.Email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <Mail size={16} color="var(--accent-red)" />
                    <a href={`mailto:${m.Email}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{m.Email}</a>
                  </div>
                )}
                {m.Phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <Phone size={16} color="var(--accent-red)" />
                    <span>{m.Phone}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                  <Calendar size={16} />
                  <span>{new Date(m.CreatedAt).toLocaleString()}</span>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{m.Message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageMessages;
