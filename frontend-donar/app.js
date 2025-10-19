import React, { useState } from "react";

// =========================================================
// --- 1. STYLES: Common Styles for both pages ---
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
        cursor: 'pointer', // Make the logo clickable to return home
    },
    navLinks: {
        display: "flex",
        gap: "25px",
        fontSize: "14px",
    },
    link: (isActive) => ({
        textDecoration: "none",
        color: isActive ? "#16a34a" : "#333", // Green for active page
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
    },
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
// --- 2. BROWSE PAGE COMPONENT ---
// Receives the setCurrentPage function as a prop
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
            
            {/* Navbar - Uses setCurrentPage to switch views */}
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
                    <a href="#" style={commonStyles.link(false)}> Donate Items </a>
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
// --- 3. HOME PAGE COMPONENT ---
// Receives the setCurrentPage function as a prop
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
            backgroundImage: url(${bgImage}),
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
        btnBlue: {
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            width: '100%',
        },
        btnGreen: {
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
            backgroundColor: ${color}22,
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
                    {/* Nav Link: Browse Items - Click handler changes the state to 'browse' */}
                    <div onClick={() => setCurrentPage('browse')} style={styles.link(false)}>
                        Browse Items
                    </div>
                    <a href="#" style={styles.link(false)}> Donate Items </a>
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
                                <button style={styles.btnBlue}>Start Donating</button>
                            </div>

                            <div style={styles.card}>
                                <div style={styles.icon}>🔍</div>
                                <h3>I Want to Receive</h3>
                                <p>Browse and select items you need for free</p>
                                {/* Button: Browse Items - Click handler changes the state to 'browse' */}
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
// --- 4. MAIN APP COMPONENT (Handles State and Rendering) ---
// =========================================================
export default function App() {
    // State to track which page is currently visible
    const [currentPage, setCurrentPage] = useState('home');

    // Conditional rendering based on the currentPage state
    if (currentPage === 'browse') {
        // Render the Browse Page and pass the function to go back
        return <BrowsePage setCurrentPage={setCurrentPage} />;
    }

    // Default: Render the Home Page and pass the function to navigate to browse
    return <HomePage setCurrentPage={setCurrentPage} />;
}