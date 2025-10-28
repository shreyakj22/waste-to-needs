
import React, { useState, useEffect } from "react";
import AuthPage from './AuthPage';

// API base (can be overridden by frontend-donorss/.env)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
// =========================================================
// --- 1. STYLES: Common Styles for all pages ---
// =========================================================
const commonStyles = {
    page: {
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "#333",
    },
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 10,
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontWeight: "bold",
        color: "#16a34a",
        fontSize: "18px",
        cursor: 'pointer',
    },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: "25px",
        fontSize: "14px",
    },
    link: (isActive) => ({
        textDecoration: "none",
        color: isActive ? "#16a34a" : "#333",
        fontWeight: "400",
        transition: 'color 0.2s',
        cursor: 'pointer',
    }),
    logoutBtn: {
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        padding: '6px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        height: 'fit-content',
        lineHeight: '1.5',
    },
    footer: {
        backgroundColor: "#fff",
        padding: "10px",
        fontSize: "14px",
        borderTop: "1px solid #ddd",
        color: "#555",
        textAlign: 'center',
        marginTop: 'auto', // Push footer to the bottom
    },
    // Common form and button styles for DonatePage
    formInput: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box',
        marginBottom: '20px',
    },
    formTextarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '16px',
        resize: 'vertical',
        minHeight: '100px',
        boxSizing: 'border-box',
        marginBottom: '10px',
    },
    formSelect: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M287%20170a14.7%2014.7%200%200%201-24%2011L146%2046%2031%20181a14.7%2014.7%200%200%201-24-11%2014.7%2014.7%200%200%201%2011-24L146%204l115%20143a14.7%2014.7%200%200%201%2015%2024z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        backgroundSize: '12px',
    },
    formLabel: {
        display: 'block',
        fontWeight: 'bold',
        marginBottom: '5px',
        fontSize: '14px',
        color: '#555',
    },
    required: {
        color: '#ef4444',
        marginLeft: '4px',
    },
    button: (color, isOutlined = false) => ({
        padding: '12px 25px',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
        fontSize: '16px',
        ...(!isOutlined ? {
            backgroundColor: color,
            color: '#fff',
            border: 'none',
        } : {
            backgroundColor: 'transparent',
            color: color,
            border: `2px solid ${color}`,
        })
    }),
    // Styles for the search bar on the BrowsePage
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px 15px',
        maxWidth: '700px',
        width: '100%',
        margin: '20px 0',
        backgroundColor: '#fff',
    },
    searchInput: {
        border: 'none',
        flexGrow: 1,
        padding: '5px 10px',
        fontSize: '16px',
        outline: 'none',
    },
    selectDropdown: {
        padding: '5px 10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        marginLeft: '15px',
        backgroundColor: '#fff',
        outline: 'none',
    }
};

// Inline Logo component (reliable, no external fetch)
function Logo({ width = 30, height = 30 }) {
    // Professional two-tone circular leaf badge SVG
    const id = 'logoGrad';
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 64 64"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <linearGradient id={id} x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#16a34a" />
                    <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="12" fill="#f3fbf6" />
            <g transform="translate(8 8)">
                <circle cx="24" cy="24" r="24" fill={`url(#${id})`} opacity="0.95" />
                <g transform="translate(9 7) scale(0.7)" fill="#fff">
                    <path d="M15.6 2.4c-4 0-9.2 4.8-11.6 8.3-.6 1-1 2.1-1 3.3 0 3.9 3.8 7.2 8.4 7.2 4.6 0 8.4-3.3 8.4-7.2 0-4.1-3.3-9.2-4.2-11.6-.2-.5-.7-1-1.4-1zM18 20.2c-1.3 1.1-3.4 2.3-6.6 2.3-3.9 0-7.6-1.9-9.2-4.8 2.4 1.4 5.6 2.3 8.7 2.3 4.1 0 7.2-1.3 7.9-1.8z" />
                </g>
                <g transform="translate(6 6)" fill="#fff">
                    <path d="M10 2c-1.1 0-2 .9-2 2 0 3 2 5 5 6 0 0-1.5-3.2-1.5-6C11.5 3 11 2 10 2z" opacity="0.9" />
                </g>
            </g>
        </svg>
    );
}


function DonatePage({ setCurrentPage }) {
    const [formData, setFormData] = useState({
        itemTitle: '',
        category: '',
        condition: '',
        description: '',
        pickupLocation: '',
        contactInformation: '',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const categories = ['Furniture', 'Electronics', 'Books', 'Clothing', 'Other'];
    const conditions = ['New', 'Good', 'Fair', 'Needs Repair'];

    const styles = {
        ...commonStyles,
        container: {
            maxWidth: '700px',
            margin: '40px auto',
            padding: '40px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            flexGrow: 1,
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px',
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0',
            color: '#16a34a',
        },
        subtitle: {
            fontSize: '16px',
            color: '#555',
            marginTop: '10px',
        },
        formGroup: {
            marginBottom: '20px',
        },
        row: {
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
        },
        col: {
            flex: 1,
        },
        photoUploadBox: {
            border: '2px dashed #ccc',
            borderRadius: '6px',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '20px',
            backgroundColor: '#f9f9f9',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px',
            marginTop: '30px',
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        
        // Filter for image files only
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        // Create preview URLs
        const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
        
        setSelectedFiles(prev => [...prev, ...imageFiles]);
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removePhoto = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            // Revoke the URL to prevent memory leaks
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert selected files to Base64
        const promises = selectedFiles.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        });

        Promise.all(promises).then(async base64files => {
            const donation = {
                ...formData,
                // client-side id; server will assign _id
                id: Date.now(),
                photos: base64files,
                status: 'available',
                datePosted: new Date().toISOString(),
                donorEmail: localStorage.getItem('userEmail')
            };

            // Try to POST to backend; fallback to localStorage on failure
            try {
                const res = await fetch(`${API_BASE}/api/donations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(donation),
                });
                if (!res.ok) throw new Error(`server returned ${res.status}`);

                // success: cleanup and navigate to browse
                previews.forEach(url => URL.revokeObjectURL(url));
                alert('Item submitted and saved to server — thank you!');
                setCurrentPage('browse');
                return;
            } catch (err) {
                console.warn('POST failed, saving locally:', err);
                const existingDonations = JSON.parse(localStorage.getItem('donations') || '[]');
                localStorage.setItem('donations', JSON.stringify([...existingDonations, donation]));

                previews.forEach(url => URL.revokeObjectURL(url));
                alert('Unable to reach server — item saved locally and will be uploaded when online.');
                setCurrentPage('browse');
            }
        });
    };

    return (
        <div style={{ ...commonStyles.page, backgroundColor: '#f0f4f7' }}>
            
            {/* Navbar */}
            <nav style={commonStyles.navbar}>
                <div onClick={() => setCurrentPage('home')} style={commonStyles.logo}>
                        <Logo width={30} height={30} />
                    WasteDonate
                </div>
                <div style={commonStyles.navLinks}>
                    <div onClick={() => setCurrentPage('browse')} style={commonStyles.link(false)}> Browse Items </div>
                    <div onClick={() => setCurrentPage('donate')} style={commonStyles.link(true)}> Donate Items </div>
                    {/* About link removed */}
                    <button 
                        onClick={() => {
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('userEmail');
                            setCurrentPage('auth');
                        }} 
                        style={commonStyles.logoutBtn}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content: Donation Form */}
            <div style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Donate an Item</h1>
                    <p style={styles.subtitle}>Help someone in your community by donating items you no longer need</p>
                </header>

                <form onSubmit={handleSubmit}>
                    {/* Item Title */}
                    <div style={styles.formGroup}>
                        <label style={commonStyles.formLabel}>
                            Item Title <span style={commonStyles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="itemTitle"
                            value={formData.itemTitle}
                            onChange={handleChange}
                            placeholder="e.g. Vintage Wooden Chair"
                            required
                            style={commonStyles.formInput}
                        />
                    </div>

                    {/* Category and Condition Row */}
                    <div style={styles.row}>
                        <div style={styles.col}>
                            <label style={commonStyles.formLabel}>
                                Category <span style={commonStyles.required}>*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                style={commonStyles.formSelect}
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div style={styles.col}>
                            <label style={commonStyles.formLabel}>
                                Condition <span style={commonStyles.required}>*</span>
                            </label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                required
                                style={commonStyles.formSelect}
                            >
                                <option value="" disabled>Select condition</option>
                                {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div style={styles.formGroup}>
                        <label style={commonStyles.formLabel}>
                            Description <span style={commonStyles.required}>*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the item, its features, and any important details..."
                            maxLength="500"
                            required
                            style={commonStyles.formTextarea}
                        />
                        <small style={{ display: 'block', textAlign: 'right', color: '#888' }}>
                            {formData.description.length}/500 characters
                        </small>
                    </div>

                    {/* Photos Upload Section */}
                    <div style={styles.formGroup}>
                        <label style={commonStyles.formLabel}>
                            Photos (Optional but recommended)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            id="photo-upload"
                        />
                        <label htmlFor="photo-upload" style={{
                            ...styles.photoUploadBox,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📸</div>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Click to upload photos</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                                PNG, JPG up to 10MB each (Max 5 photos)
                            </p>
                        </label>

                        {/* Photo Previews */}
                        {previews.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                gap: '10px',
                                marginTop: '15px'
                            }}>
                                {previews.map((preview, index) => (
                                    <div key={index} style={{
                                        position: 'relative',
                                        aspectRatio: '1',
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <button
                                            onClick={() => removePhoto(index)}
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px',
                                                backgroundColor: 'rgba(0,0,0,0.5)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                            type="button"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pickup Location */}
                    <div style={styles.formGroup}>
                        <label style={commonStyles.formLabel}>
                            Pickup Location <span style={commonStyles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={handleChange}
                            placeholder="e.g. Downtown Seattle, WA"
                            required
                            style={commonStyles.formInput}
                        />
                    </div>

                    {/* Contact Information */}
                    <div style={styles.formGroup}>
                        <label style={commonStyles.formLabel}>
                            Contact Information <span style={commonStyles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="contactInformation"
                            value={formData.contactInformation}
                            onChange={handleChange}
                            placeholder="Email or phone number for receivers to contact you"
                            required
                            style={commonStyles.formInput}
                        />
                    </div>

                    {/* Buttons */}
                    <div style={styles.buttonContainer}>
                        <button
                            type="button"
                            onClick={() => setCurrentPage('home')}
                            style={commonStyles.button('#555', true)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={commonStyles.button('#16a34a')}
                        >
                            Post Item for Donation
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <footer style={commonStyles.footer}>
                © {new Date().getFullYear()} WasteDonate — All Rights Reserved.
            </footer>
        </div>
    );
}

// =========================================================
// --- 3. BROWSE PAGE COMPONENT ---
// =========================================================
function BrowsePage({ setCurrentPage }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [donations, setDonations] = useState([]);

    // Load donations from backend when component mounts, fallback to localStorage
    useEffect(() => {
        let mounted = true;

        const normalize = (d) => ({
            id: d._id || d.id || String(d.id || Date.now()),
            itemTitle: d.itemTitle || d.title || '',
            description: d.description || '',
            category: d.category || 'Other',
            condition: d.condition || '',
            pickupLocation: d.pickupLocation || '',
            contactInformation: d.contactInformation || '',
            photos: d.photos || [],
            status: d.status || 'available',
            donorEmail: d.donorEmail || '',
            datePosted: d.datePosted || new Date().toISOString(),
            ...d,
        });

        (async () => {
            try {
                const res = await fetch(`${API_BASE}/api/donations`);
                if (!res.ok) throw new Error('bad response');
                const body = await res.json();
                const serverDonations = body.donations || body || [];
                const normalized = serverDonations.map(normalize);

                // If we have locally saved donations (offline fallback), try to sync them now
                try {
                    const local = JSON.parse(localStorage.getItem('donations') || '[]');
                    if (Array.isArray(local) && local.length > 0) {
                        console.log('Browse: found', local.length, 'local donations — attempting bulk sync');
                        const syncRes = await fetch(`${API_BASE}/api/donations/bulk`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ donations: local }),
                        });
                        if (syncRes.ok) {
                            console.log('Browse: bulk sync succeeded — clearing localStorage');
                            localStorage.removeItem('donations');
                            // re-fetch server list to include synced items
                            const refreshed = await (await fetch(`${API_BASE}/api/donations`)).json();
                            const refreshedList = (refreshed.donations || refreshed || []).map(normalize);
                            if (mounted) setDonations(refreshedList);
                            return;
                        } else {
                            console.warn('Browse: bulk sync responded with', syncRes.status);
                        }
                    }
                } catch (syncErr) {
                    console.warn('Browse: bulk sync failed', syncErr);
                }

                if (mounted) setDonations(normalized);
            } catch (err) {
                // fallback to localStorage
                const loadedDonations = JSON.parse(localStorage.getItem('donations') || '[]');
                const normalized = (loadedDonations || []).map(normalize);
                if (mounted) setDonations(normalized);
            }
        })();

        return () => { mounted = false };
    }, []);

    // Filter donations based on search query and category
    const filteredDonations = donations.filter(donation => {
        const matchesSearch = donation.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            donation.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || donation.category === selectedCategory;
        return matchesSearch && matchesCategory && donation.status === 'available';
    });

    const handleRequest = (donationId) => {
        const userEmail = localStorage.getItem('userEmail');
        const updatedDonations = donations.map(donation => {
            if (donation.id === donationId) {
                return {
                    ...donation,
                    status: 'requested',
                    requestedBy: userEmail,
                    requestDate: new Date().toISOString()
                };
            }
            return donation;
        });

        localStorage.setItem('donations', JSON.stringify(updatedDonations));
        setDonations(updatedDonations);
        
        // Get donor's contact information
        const donation = donations.find(d => d.id === donationId);
        alert(`Request sent! You can contact the donor at: ${donation.contactInformation}`);
    };

    const pageContentStyle = {
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        flexGrow: 1,
    };

    const itemCardStyle = {
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    };

    const itemGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        padding: '20px 0',
    };

    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
    };

    const contentStyle = {
        padding: '15px',
    };

    return (
        <div style={{ ...commonStyles.page, backgroundColor: '#f9f9f9' }}>
            
            {/* Navbar */}
            <nav style={commonStyles.navbar}>
                <div onClick={() => setCurrentPage('home')} style={commonStyles.logo}>
                        <Logo width={30} height={30} />
                    WasteDonate
                </div>
                <div style={commonStyles.navLinks}>
                    <div onClick={() => setCurrentPage('browse')} style={commonStyles.link(true)}> Browse Items </div>
                    <div onClick={() => setCurrentPage('donate')} style={commonStyles.link(false)}> Donate Items </div>
                    {/* About link removed */}
                    <button 
                        onClick={() => {
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('userEmail');
                            setCurrentPage('auth');
                        }} 
                        style={commonStyles.logoutBtn}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div style={pageContentStyle}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0', textAlign: 'center' }}>
                    Browse Available Items
                </h1>
                <p style={{ fontSize: '16px', color: '#555', margin: '0 0 30px 0', textAlign: 'center' }}>
                    Find items donated by your community members
                </p>

                {/* Search Bar & Filter */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={commonStyles.inputContainer}>
                        <span style={{ color: '#888', fontSize: '18px', marginRight: '5px' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search items..."
                            style={commonStyles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select 
                            style={commonStyles.selectDropdown}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option>All</option>
                            <option>Furniture</option>
                            <option>Electronics</option>
                            <option>Books</option>
                            <option>Clothing</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>

                {/* Item Count */}
                <p style={{ textAlign: 'left', margin: '20px 0', fontSize: '14px', color: '#555' }}>
                    Showing {filteredDonations.length} items
                </p>

                {/* Item Grid */}
                {filteredDonations.length > 0 ? (
                    <div style={itemGridStyle}>
                        {filteredDonations.map(donation => (
                            <div key={donation.id} style={itemCardStyle}>
                                {donation.photos && donation.photos.length > 0 && (
                                    <img
                                        src={donation.photos[0]}
                                        alt={donation.itemTitle}
                                        style={imageStyle}
                                    />
                                )}
                                <div style={contentStyle}>
                                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{donation.itemTitle}</h3>
                                    <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                                        {donation.description.length > 100 
                                            ? donation.description.substring(0, 100) + '...'
                                            : donation.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            backgroundColor: '#e5e7eb', 
                                            borderRadius: '4px', 
                                            fontSize: '12px' 
                                        }}>
                                            {donation.category}
                                        </span>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            backgroundColor: '#e5e7eb', 
                                            borderRadius: '4px', 
                                            fontSize: '12px' 
                                        }}>
                                            {donation.condition}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                                        📍 {donation.pickupLocation}
                                    </p>
                                    <button
                                        onClick={() => handleRequest(donation.id)}
                                        style={{
                                            ...commonStyles.button('#16a34a'),
                                            width: '100%',
                                            marginTop: '10px'
                                        }}
                                    >
                                        Request Item
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                        No items currently available.
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer style={commonStyles.footer}>
                © {new Date().getFullYear()} WasteDonate — All Rights Reserved.
            </footer>
        </div>
    );
}

// =========================================================
// --- 4. HOME PAGE COMPONENT ---
// Includes the fix for the Start Donating button
// =========================================================
function HomePage({ setCurrentPage }) {
    const bgImage =
        "https://images.unsplash.com/photo-1556767576-5ec41e3239d6?auto=format&fit=crop&w=1600&q=80";

    const styles = {
        ...commonStyles,
        page: {
            ...commonStyles.page,
            textAlign: "center", 
        },
        hero: {
            flex: 1,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "50px 20px",
        },
        overlay: {
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
        heroText: {
            position: "relative",
            color: "#fff",
            maxWidth: "700px",
        },
        title: {
            fontSize: "clamp(24px, 5vw, 42px)",
            fontWeight: "bold",
            marginBottom: "15px",
        },
        subtitle: {
            fontSize: "16px",
            lineHeight: "1.6",
            fontWeight: "300",
        },
        cardContainer: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            marginTop: "40px",
        },
        cards: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
        },
        card: {
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            width: "280px",
            padding: "25px",
            textAlign: "center",
            color: "#000",
        },
        icon: { fontSize: "36px", marginBottom: "10px" },
        btnBlue: { // Style for Start Donating Button
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            width: '100%',
        },
        btnGreen: { // Style for Browse Items Button
            backgroundColor: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            display: 'block',
            width: '100%',
        },
        howItWorks: {
            backgroundColor: "#fff",
            padding: "60px 20px",
        },
        howTitle: {
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "10px",
        },
        howSubtitle: {
            fontSize: "16px",
            color: "#555",
            marginBottom: "50px",
        },
        steps: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "50px",
        },
        step: {
            width: "280px",
            textAlign: "center",
        },
        stepCircle: (color) => ({
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: `${color}22`,
            margin: "0 auto 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            color,
        }),
        stepTitle: {
            fontWeight: "bold",
            marginBottom: "10px",
        },
        stepDesc: {
            fontSize: "14px",
            color: "#555",
            lineHeight: "1.5",
        },
    };

    return (
        <div style={styles.page}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <div onClick={() => setCurrentPage('home')} style={styles.logo}>
                        <Logo width={30} height={30} />
                    WasteDonate
                </div>
                <div style={styles.navLinks}>
                    <div onClick={() => setCurrentPage('browse')} style={styles.link(false)}>
                        Browse Items
                    </div>
                    <div onClick={() => setCurrentPage('donate')} style={styles.link(false)}> Donate Items </div>
                    {/* About link removed */}
                    <button 
                        onClick={() => {
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('userEmail');
                            setCurrentPage('auth');
                        }} 
                        style={commonStyles.logoutBtn}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.overlay}></div>
                <div style={styles.heroText}>
                    <h1 style={styles.title}>Turn Your Waste Into Someone’s Treasure</h1>
                    <p style={styles.subtitle}>
                        Connect donors and receivers in your community. Donate items you no
                        longer need and help reduce waste while helping others.
                    </p>

                    {/* Cards */}
                    <div style={styles.cardContainer}>
                        <div style={styles.cards}>
                            <div style={styles.card}>
                                <div style={styles.icon}>📤</div>
                                <h3>I Want to Donate</h3>
                                <p>Upload photos of items you want to give away</p>
                                
                                {/* 🌟 FIX: Added onClick to navigate to 'donate' page 🌟 */}
                                <button onClick={() => setCurrentPage('donate')} style={styles.btnBlue}>
                                    Start Donating
                                </button>
                            </div>

                            <div style={styles.card}>
                                <div style={styles.icon}>🔍</div>
                                <h3>I Want to Receive</h3>
                                <p>Browse and select items you need for free</p>
                                <button onClick={() => setCurrentPage('browse')} style={styles.btnGreen}>
                                    Browse Items
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS Section */}
            <section style={styles.howItWorks}>
                <h2 style={styles.howTitle}>How It Works</h2>
                <p style={styles.howSubtitle}>
                    Simple steps to start sharing and receiving
                </p>

                <div style={styles.steps}>
                    <div style={styles.step}>
                        <div style={styles.stepCircle("#2563eb")}>📷</div>
                        <h3 style={styles.stepTitle}>1. Upload Photos</h3>
                        <p style={styles.stepDesc}>
                            Take photos of items you want to donate and upload them with
                            descriptions
                        </p>
                    </div>

                    <div style={styles.step}>
                        <div style={styles.stepCircle("#16a34a")}>👀</div>
                        <h3 style={styles.stepTitle}>2. Browse & Select</h3>
                        <p style={styles.stepDesc}>
                            Receivers can browse available items and select what they need
                        </p>
                    </div>

                    <div style={styles.step}>
                        <div style={styles.stepCircle("#8b5cf6")}>🤝</div>
                        <h3 style={styles.stepTitle}>3. Connect & Share</h3>
                        <p style={styles.stepDesc}>
                            Connect with each other to arrange pickup and complete the
                            donation
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                © {new Date().getFullYear()} WasteDonate — All Rights Reserved.
            </footer>
        </div>
    );
}


// =========================================================
// --- 5. MAIN APP COMPONENT (Handles Routing) ---
// =========================================================
export default function App() {
  // Check localStorage for auth state on initial load
  const [currentPage, setCurrentPage] = useState(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return isLoggedIn ? 'home' : 'auth';
  });

  if (currentPage === 'auth') {
    return <AuthPage setCurrentPage={setCurrentPage} />;
  }
  if (currentPage === 'browse') {
    return <BrowsePage setCurrentPage={setCurrentPage} />;
  }
  if (currentPage === 'donate') {
    return <DonatePage setCurrentPage={setCurrentPage} />;
  }

  return <HomePage setCurrentPage={setCurrentPage} />;
}