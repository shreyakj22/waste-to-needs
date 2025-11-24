import React, { useEffect, useRef, useState } from 'react';
import { API_BASE } from './config';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Provide Leaflet's default icon paths (CRA bundling-friendly)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Nearby({ setCurrentPage }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [userPos, setUserPos] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(10000);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [permState, setPermState] = useState(null);

  // initialize map container once
  useEffect(() => {
    if (!mapEl.current) return;
    mapRef.current = L.map(mapEl.current, { center: [0, 0], zoom: 2, preferCanvas: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current);

    markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      try { mapRef.current.remove(); } catch (e) {}
    };
  }, []);

  // Try geolocation on mount
  useEffect(() => {
    setLoading(true);
    // Query permission state if available
    if (navigator.permissions && navigator.permissions.query) {
      try {
        navigator.permissions.query({ name: 'geolocation' }).then(p => {
          setPermState(p.state);
          p.onchange = () => setPermState(p.state);
        }).catch(() => {});
      } catch (e) {}
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserPos({ lat, lng });
        setLoading(false);
      }, (err) => {
        console.warn('geolocation denied', err && err.message);
        setError('Geolocation denied or unavailable. Enter coordinates manually.');
        setLoading(false);
      }, { enableHighAccuracy: true, timeout: 10000 });
    } else {
      setError('Geolocation not supported by your browser. Enter coordinates manually.');
      setLoading(false);
    }
  }, []);

  // When userPos or radius changes, fetch nearby donations and update map
  useEffect(() => {
    if (!userPos) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/donations/nearby?lat=${userPos.lat}&lng=${userPos.lng}&radius=${radius}`);
        if (res.status === 429) {
          const b = await res.json().catch(() => ({}));
          alert(b.error || 'You have reached your monthly request limit (3). Please try next month.');
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error(`Server ${res.status}`);
        const body = await res.json();
        const list = body.donations || [];
        setDonations(list);

        // update map view and markers
        if (mapRef.current) {
          mapRef.current.setView([userPos.lat, userPos.lng], 13);
          markersLayerRef.current.clearLayers();

          // add circle for radius
          L.circle([userPos.lat, userPos.lng], { radius, color: '#16a34a', fillOpacity: 0.05 }).addTo(markersLayerRef.current);

          // user marker
          L.marker([userPos.lat, userPos.lng]).bindPopup('You are here').addTo(markersLayerRef.current);

          list.forEach(d => {
            if (!d.location || !Array.isArray(d.location.coordinates)) return;
            const [lng, lat] = d.location.coordinates;
            const marker = L.marker([lat, lng]);
            const popupHtml = `<div style="max-width:220px"><strong>${escapeHtml(d.itemTitle || '')}</strong><div style="font-size:12px">${escapeHtml(d.pickupLocation || '')}</div><div style="margin-top:8px"><button data-id="${d._id || d.id}" class="w2n-request-btn">Request</button></div></div>`;
            marker.bindPopup(popupHtml).addTo(markersLayerRef.current);
          });

          // attach click handler for popup buttons (delegation)
          mapRef.current.off('popupopen');
          mapRef.current.on('popupopen', (ev) => {
            const px = ev.popup.getElement();
            if (!px) return;
            const btn = px.querySelector('.w2n-request-btn');
            if (btn) {
              btn.addEventListener('click', async (e) => {
                const id = btn.getAttribute('data-id');
                await handleRequest(id);
                ev.popup.close();
              });
            }
          });
        }
      } catch (err) {
        console.error('Nearby fetch failed', err);
        setError('Failed to fetch nearby items');
      } finally {
        setLoading(false);
      }
    })();
  }, [userPos, radius]);

  const handleManualSearch = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isFinite(lat) || !isFinite(lng)) return setError('Enter valid numeric coordinates');
    setUserPos({ lat, lng });
    setError(null);
  };

  const handleRequest = async (donationId) => {
    const userEmail = localStorage.getItem('userEmail');
    try {
      const res = await fetch(`${API_BASE}/api/donations/${donationId}/request`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverEmail: userEmail })
      });
      if (res.status === 429) {
        const b = await res.json().catch(() => ({}));
        alert(b.error || 'You have reached your monthly request limit (3). Please try next month.');
        return;
      }
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || `Server ${res.status}`);
      }
      alert('Request sent — donor will be notified');
      setDonations(prev => prev.filter(d => (d._id || d.id) !== donationId));
      // remove marker for requested item
      markersLayerRef.current.clearLayers();
    } catch (err) {
      console.error('Request error', err);
      alert('Failed to send request: ' + (err.message || 'unknown'));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontWeight: '700', color: '#16a34a' }}>Nearby Items</div>
        <div>
          <button onClick={() => setCurrentPage('browse')} style={{ marginRight: 8 }}>Back</button>
        </div>
      </nav>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Radius (meters):</label>
        <input value={radius} onChange={e => setRadius(parseInt(e.target.value || '0', 10))} style={{ width: 120, marginRight: 12 }} />
        <button onClick={() => userPos && setUserPos({ ...userPos })}>Refresh</button>
      </div>

      {loading && <div>Loading location/items…</div>}
      {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

      {permState === 'denied' && (
        <div style={{ marginBottom: 12, padding: 12, background: '#fff3f2', border: '1px solid #ffd1cc', borderRadius: 8 }}>
          <strong style={{ color: '#b91c1c' }}>Location access blocked</strong>
          <div style={{ marginTop: 8, color: '#333' }}>To find items near you, enable location permissions for this site in your browser settings:</div>
          <ul style={{ marginTop: 8 }}>
            <li><strong>Chrome / Edge:</strong> Click the lock icon in the address bar → Site settings → Location → Allow.</li>
            <li><strong>Firefox:</strong> Click the shield / lock icon → Permissions → Location → Allow.</li>
            <li><strong>Or</strong> enter coordinates manually in the fields and press Enter.</li>
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <h3>Search</h3>
          <div style={{ marginBottom: 8 }}>
            <input placeholder="Latitude" value={manualLat} onChange={e => setManualLat(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleManualSearch()} style={{ marginRight: 8 }} />
            <input placeholder="Longitude" value={manualLng} onChange={e => setManualLng(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleManualSearch()} style={{ marginRight: 8 }} />
            <button onClick={handleManualSearch}>Use coords</button>
          </div>

          <h3>Nearby Items ({donations.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {donations.map(d => (
              <div key={d._id || d.id} style={{ padding: 10, border: '1px solid #eee', borderRadius: 8 }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 90, height: 70, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden' }}>
                    {d.photos && d.photos[0] ? <img src={d.photos[0]} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ padding: 10, color: '#999' }}>No image</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{d.itemTitle}</div>
                    <div style={{ color: '#555', fontSize: 13 }}>{d.pickupLocation}</div>
                    <div style={{ marginTop: 6 }}>
                      <button onClick={() => handleRequest(d._id || d.id)} style={{ marginRight: 8 }}>Request</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: 640, height: 520 }}>
          <div ref={mapEl} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[s];
  });
}
