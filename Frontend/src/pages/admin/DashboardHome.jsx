import API_BASE_URL from '../../config';
import React, { useEffect, useState } from 'react';
import { BarChart, MessageSquare, Video, Settings } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState({ TotalProjects: 0, Messages: 0, FeaturedVideos: 0, Services: 0 });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/dashboard-stats`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const cards = [
    { title: 'Total Projects', value: stats.TotalProjects, icon: <BarChart size={24} color="var(--accent-red)" /> },
    { title: 'Messages', value: stats.Messages, icon: <MessageSquare size={24} color="var(--accent-red)" /> },
    { title: 'Featured Videos', value: stats.FeaturedVideos, icon: <Video size={24} color="var(--accent-red)" /> },
    { title: 'Services', value: stats.Services, icon: <Settings size={24} color="var(--accent-red)" /> }
  ];

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {cards.map((card, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{card.title}</p>
              <h3 style={{ fontSize: '2rem' }}>{card.value}</h3>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(220, 38, 38, 0.1)', borderRadius: '50%' }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
