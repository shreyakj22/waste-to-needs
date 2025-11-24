import React, { useEffect, useState } from 'react';

import { API_BASE } from './config';

export default function DashboardPage({ setCurrentPage }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const email = localStorage.getItem('userEmail');

  useEffect(() => {
    let mounted = true;
    if (!email) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const body = await res.json();
        if (mounted) setData(body);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false };
  }, [email]);

  if (!email) {
    return (
      <div style={{ padding: 40 }}>
        <h2>You must be logged in to view the dashboard</h2>
        <p>Please login and try again.</p>
        <button onClick={() => setCurrentPage('auth')}>Go to Login</button>
      </div>
    );
  }

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard…</div>;

  if (!data) return <div style={{ padding: 40 }}>Failed to load dashboard.</div>;

  const { profile, stats, donated, received } = data;

  // Build simple chart data
  const total = (stats.availableDonations || 0) + ((stats.totalDonations - stats.availableDonations) || 0);
  const available = stats.availableDonations || 0;
  const requested = total - available;

  const barLeft = stats.donatedCount || 0;
  const barRight = stats.receivedCount || 0;

  return (
    <div style={{ padding: 28, maxWidth: 1200, margin: '0 auto', fontFamily: "Segoe UI, Roboto, Arial" }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>Dashboard</h1>
          <p style={{ margin: '6px 0 0 0', color: '#475569' }}>Overview of your activity and statistics</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setCurrentPage('donate')} style={{ padding: '10px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Donate Item</button>
          <button onClick={() => setCurrentPage('browse')} style={{ padding: '10px 14px', background: '#eef2ff', color: '#3730a3', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Browse Items</button>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginTop: 20 }}>
        <div style={{ background: 'linear-gradient(180deg,#ffffff, #fbfffb)', padding: 20, borderRadius: 12, boxShadow: '0 6px 18px rgba(13, 30, 41, 0.06)' }}>
          <h3 style={{ marginTop: 0, color: '#0f172a' }}>Profile</h3>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: 12, background: '#ecfccb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#047857' }}>{(profile.name || 'U').charAt(0).toUpperCase()}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{profile.name}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{profile.email}</div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 8 }}>Member since {new Date(profile.dateCreated).toLocaleDateString()}</div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 6 }}>Credits: <strong style={{ color: '#065f46' }}>{(profile.credits || 0)}</strong></div>
            </div>
          </div>
        </div>

        <aside style={{ background: '#fff', padding: 18, borderRadius: 12, boxShadow: '0 6px 18px rgba(13, 30, 41, 0.04)' }}>
          <h3 style={{ marginTop: 0 }}>Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <div style={{ background: '#f0fdf4', padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: 14, color: '#065f46' }}>Items Donated</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.donatedCount}</div>
            </div>
            <div style={{ background: '#eef2ff', padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: 14, color: '#3730a3' }}>Items Received</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.receivedCount}</div>
            </div>
            <div style={{ background: '#fff7ed', padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: 14, color: '#7c2d12' }}>Available Now</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.availableDonations}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: 10, borderRadius: 8 }}>
              <div style={{ fontSize: 14, color: '#374151' }}>Total Users</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{stats.totalUsers}</div>
            </div>
          </div>

          {/* Charts area */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 88, height: 88, borderRadius: 44, background: '#ecfeee', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -6px 12px rgba(16,185,129,0.06)' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>{available}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Available vs Requested</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{available} available • {requested} requested</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'flex-end', height: 72 }}>
              {(() => {
                const max = Math.max(barLeft, barRight, 1);
                const leftH = Math.round((barLeft / max) * 72);
                const rightH = Math.round((barRight / max) * 72);
                return (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: leftH, background: 'linear-gradient(180deg,#34d399,#059669)', borderRadius: 8 }}></div>
                      <div style={{ marginTop: 6, fontSize: 12, color: '#374151' }}>Donated</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: rightH, background: 'linear-gradient(180deg,#60a5fa,#2563eb)', borderRadius: 8 }}></div>
                      <div style={{ marginTop: 6, fontSize: 12, color: '#374151' }}>Received</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </aside>
      </section>

      <section style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div>
          <h3 style={{ marginBottom: 10 }}>Items You Donated</h3>
          {donated.length === 0 ? <p>No donated items yet.</p> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {donated.map(d => (
                <div key={d._id || d.id} style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 6px 14px rgba(2,6,23,0.04)' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 96, height: 72, borderRadius: 8, background: '#f3f4f6', flexShrink: 0 }}>
                      {d.photos && d.photos[0] ? <img src={d.photos[0]} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} /> : null}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 16 }}>{d.itemTitle}</strong>
                        <span style={{ color: d.status === 'available' ? '#059669' : '#d97706', fontWeight: 700 }}>{d.status}</span>
                      </div>
                      <div style={{ color: '#6b7280', marginTop: 6 }}>{d.description && d.description.substring(0, 140)}</div>
                      <div style={{ marginTop: 8, fontSize: 12, color: '#9ca3af' }}>Posted: {d.datePosted ? new Date(d.datePosted).toLocaleDateString() : '—'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: 10 }}>Items You Received / Requested</h3>
          {received.length === 0 ? <p>No received items yet.</p> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {received.map(d => (
                <div key={d._id || d.id} style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 6px 14px rgba(2,6,23,0.04)' }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 96, height: 72, borderRadius: 8, background: '#f3f4f6', flexShrink: 0 }}>
                      {d.photos && d.photos[0] ? <img src={d.photos[0]} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} /> : null}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 16 }}>{d.itemTitle}</strong>
                        <span style={{ color: '#374151', fontWeight: 600 }}>{d.status}</span>
                      </div>
                      <div style={{ color: '#6b7280', marginTop: 6 }}>{d.description && d.description.substring(0, 140)}</div>
                      <div style={{ marginTop: 8, fontSize: 12, color: '#9ca3af' }}>Requested: {d.requestDate ? new Date(d.requestDate).toLocaleDateString() : '—'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
