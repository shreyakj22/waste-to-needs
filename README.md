import React from "react";

export default function App() {
  const bgImage =
    "https://images.unsplash.com/photo-1556767576-5ec41e3239d6?auto=format&fit=crop&w=1600&q=80";

  const styles = {
    page: {
      fontFamily: "Arial, sans-serif",
      margin: 0,
      padding: 0,
      textAlign: "center",
      color: "#333",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
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
    },
    navLinks: {
      display: "flex",
      gap: "25px",
      fontSize: "14px",
    },
    link: {
      textDecoration: "none",
      color: "#333",
      fontWeight: "500",
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
      color: "#000", // <-- text inside cards now black
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
    },
    btnGreen: {
      backgroundColor: "#16a34a",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "6px",
      fontWeight: "bold",
      cursor: "pointer",
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
    footer: {
      backgroundColor: "#fff",
      padding: "10px",
      fontSize: "14px",
      borderTop: "1px solid #ddd",
      color: "#555",
    },
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Recycle001.svg"
            alt="logo"
            width="30"
            height="30"
          />
          WasteDonate
        </div>
        <div style={styles.navLinks}>
          <a href="#" style={styles.link}>
            Browse Items
          </a>
          <a href="#" style={styles.link}>
            Donate Items
          </a>
          <a href="#" style={styles.link}>
            About
          </a>
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
                <button style={styles.btnGreen}>Browse Items</button>
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
Title
