import React, { useState } from "react";
import AuthPage from './AuthPage';
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
        gap: "25px",
        fontSize: "14px",
    },
    link: (isActive) => ({
        textDecoration: "none",
        color: isActive ? "#16a34a" : "#333",
        fontWeight: isActive ? "bold" : "500",
        transition: 'color 0.2s',
        cursor: 'pointer',
    }),
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

// =========================================================
// --- 2. DONATE PAGE COMPONENT ---
// Renders the form based on the screenshot
// =========================================================
function DonatePage({ setCurrentPage }) {
    const [formData, setFormData] = useState({
        itemTitle: '',
        category: '',
        condition: '',
        description: '',
        pickupLocation: '',
        contactInformation: '',
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for API submission logic
        console.log("Donation Submitted:", formData);
        alert('Item submitted for donation! Thank you.');
        setCurrentPage('home');
    };

    return (
        <div style={{ ...commonStyles.page, backgroundColor: '#f0f4f7' }}>
            
            {/* Navbar */}
            <nav style={commonStyles.navbar}>
                <div onClick={() => setCurrentPage('home')} style={commonStyles.logo}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Recycle_logo_green.svg/1200px-Recycle_logo_green.svg.png"
                        alt="logo"
                        width="30"
                        height="30"
                    />
                    WasteDonate
                </div>
                <div style={commonStyles.navLinks}>
                    <div onClick={() => setCurrentPage('browse')} style={commonStyles.link(false)}> Browse Items </div>
                    <div onClick={() => setCurrentPage('donate')} style={commonStyles.link(true)}> Donate Items </div>
                    <a href="#" style={commonStyles.link(false)}> About </a>
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

                    {/* Photos Upload (Simplified Placeholder) */}
                    <div style={styles.formGroup}>
                        <label style={commonStyles.formLabel}>
                            Photos (Optional but recommended)
                        </label>
                        <div style={styles.photoUploadBox}>
                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Click to upload photos</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                                PNG, JPG up to 10MB each
                            </p>
                        </div>
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
    const pageContentStyle = {
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        flexGrow: 1,
    };

    return (
        <div style={{ ...commonStyles.page, backgroundColor: '#f9f9f9' }}>
            
            {/* Navbar */}
            <nav style={commonStyles.navbar}>
                <div onClick={() => setCurrentPage('home')} style={commonStyles.logo}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Recycle_logo_green.svg/1200px-Recycle_logo_green.svg.png"
                        alt="logo"
                        width="30"
                        height="30"
                    />
                    WasteDonate
                </div>
                <div style={commonStyles.navLinks}>
                    <div onClick={() => setCurrentPage('browse')} style={commonStyles.link(true)}> Browse Items </div>
                    <div onClick={() => setCurrentPage('donate')} style={commonStyles.link(false)}> Donate Items </div>
                    <a href="#" style={commonStyles.link(false)}> About </a>
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
                        />
                        <select style={commonStyles.selectDropdown}>
                            <option>All</option>
                            <option>Furniture</option>
                            <option>Electronics</option>
                            <option>Books</option>
                        </select>
                    </div>
                </div>

                {/* Item Count */}
                <p style={{ textAlign: 'left', margin: '20px 0', fontSize: '14px', color: '#555' }}>
                    Showing 0 items
                </p>

                {/* Placeholder for Item Cards */}
                <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                    No items currently available.
                </div>
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
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Recycle_logo_green.svg/1200px-Recycle_logo_green.svg.png"
                        alt="logo"
                        width="30"
                        height="30"
                    />
                    WasteDonate
                </div>
                <div style={styles.navLinks}>
                    <div onClick={() => setCurrentPage('browse')} style={styles.link(false)}>
                        Browse Items
                    </div>
                    <div onClick={() => setCurrentPage('donate')} style={styles.link(false)}> Donate Items </div>
                    <a href="#" style={styles.link(false)}> About </a>
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
  // 👇 Put it right here, at the top of the function
  const [currentPage, setCurrentPage] = useState('auth');  // start from login page

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
