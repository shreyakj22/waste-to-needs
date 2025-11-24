import React, { useEffect, useState } from 'react';

import { API_BASE } from './config';

export default function DashboardPage({ setCurrentPage }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const email = localStorage.getItem('userEmail');

  // helper to count requests this month from localStorage
  const getRequestsThisMonth = (email) => {
    if (!email) return 0;
    try {
      const raw = localStorage.getItem('w2n_request_history') || '{}';
      const obj = JSON.parse(raw);
      const list = Array.isArray(obj[email]) ? obj[email] : [];
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      return list.filter(ts => {
        try {
          const d = new Date(ts);
          return d.getMonth() === month && d.getFullYear() === year;
        } catch (e) { return false; }
      }).length;
    } catch (e) { return 0; }
  };

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
        // fallback: try to read donations/requests from localStorage
        try {
          const donations = JSON.parse(localStorage.getItem('donations') || '[]');
          const donated = (donations || []).filter(d => (d.donorEmail || d.email) === email);
          const received = (donations || []).filter(d => (d.requestedBy || '').toString() === email);
          if (mounted) setData({ profile: { name: email.split('@')[0], email, dateCreated: new Date().toISOString(), credits: 0 }, stats: { donatedCount: donated.length, receivedCount: received.length, availableDonations: (donations || []).filter(d => d.status === 'available').length, totalUsers: 0 }, donated, received });
        } catch (e) {}
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

  const { profile, stats, donated = [], received = [] } = data;
  const requestsUsed = getRequestsThisMonth(email);
  const REQUEST_LIMIT = 3;
  const requestsLeft = Math.max(0, REQUEST_LIMIT - requestsUsed);

  return (
    <div style={{ padding: 28, maxWidth: 1200, margin: '0 auto', fontFamily: "Segoe UI, Roboto, Arial" }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>Dashboard</h1>
          <p style={{ margin: '6px 0 0 0', color: '#475569' }}>Overview of your activity and account</p>
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
              <div style={{ fontSize: 18, fontWeight: 700 }}>{profile.name || profile.email}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{profile.email}</div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 8 }}>Member since {profile.dateCreated ? new Date(profile.dateCreated).toLocaleDateString() : '—'}</div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 6 }}>Credits: <strong style={{ color: '#065f46' }}>{(profile.credits || 0)}</strong></div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ padding: 12, background: '#fff', borderRadius: 8, boxShadow: '0 4px 10px rgba(2,6,23,0.04)', minWidth: 140 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Requests Left This Month</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: requestsLeft > 0 ? '#059669' : '#b91c1c' }}>{requestsLeft}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{requestsUsed} of {REQUEST_LIMIT} used</div>
            </div>

            <div style={{ padding: 12, background: '#fff', borderRadius: 8, boxShadow: '0 4px 10px rgba(2,6,23,0.04)', flex: 1 }}>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Account Actions</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={() => setCurrentPage('donate')} style={{ ...{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#10b981', color: '#fff' } }}>Post Donation</button>
                <button onClick={() => setCurrentPage('browse')} style={{ ...{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: '#2563eb', color: '#fff' } }}>Browse Items</button>
                <button onClick={() => { localStorage.removeItem('isLoggedIn'); localStorage.removeItem('userEmail'); setCurrentPage('auth'); }} style={{ ...{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', cursor: 'pointer', background: '#fff' } }}>Sign Out</button>
              </div>
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

          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: 12, background: '#ecfeee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>{stats.availableDonations}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Available items in platform</div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{stats.availableDonations} available • {stats.totalDonations || 0} total</div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div>
          <h3 style={{ marginBottom: 10 }}>Recent Donations (yours)</h3>
          {donated.length === 0 ? <p>No donated items yet.</p> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {donated.slice(0,6).map(d => (
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
          <h3 style={{ marginBottom: 10 }}>Recent Requests</h3>
          {received.length === 0 ? <p>No recent requests.</p> : (
            <div style={{ display: 'grid', gap: 12 }}>
              {received.slice(0,6).map(d => (
                <div key={d._id || d.id} style={{ background: '#fff', padding: 12, borderRadius: 10, boxShadow: '0 6px 14px rgba(2,6,23,0.04)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: 16 }}>{d.itemTitle}</strong>
                        <span style={{ color: '#374151', fontWeight: 600 }}>{d.status}</span>
                      </div>
                      <div style={{ color: '#6b7280', marginTop: 6 }}>{d.description && d.description.substring(0, 140)}</div>
                      <div style={{ marginTop: 8, fontSize: 12, color: '#9ca3af' }}>Requested: {d.requestDate ? new Date(d.requestDate).toLocaleDateString() : '—'}</div>
                      <div style={{ marginTop: 8, fontSize: 12 }}>
                        📧 Donor contact: <strong style={{ color: '#065f46' }}>{d.contactInformation || (d.donorEmail || 'not provided')}</strong>
                      </div>
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
