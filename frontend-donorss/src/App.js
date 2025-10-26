import React, { useState } from "react";

// =========================================================
// --- AUTH PAGE (LOGIN PAGE) ---
// =========================================================
function AuthPage({ setCurrentPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0f4f7",
    },
    card: {
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      width: "350px",
      textAlign: "center",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#16a34a",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "16px",
      marginBottom: "15px",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#16a34a",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      alert("Login successful!");
      setCurrentPage("home"); // ✅ Navigate to inside pages
    } else {
      alert("Please enter email and password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to WasteDonate</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// =========================================================
// --- COMMON STYLES (Same as yours) ---
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
    cursor: "pointer",
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
    transition: "color 0.2s",
    cursor: "pointer",
  }),
  footer: {
    backgroundColor: "#fff",
    padding: "10px",
    fontSize: "14px",
    borderTop: "1px solid #ddd",
    color: "#555",
    textAlign: "center",
    marginTop: "auto",
  },
};

// =========================================================
// --- DONATE PAGE COMPONENT ---
// =========================================================
function DonatePage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    itemTitle: "",
    category: "",
    condition: "",
    description: "",
    pickupLocation: "",
    contactInformation: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Donation Submitted:", formData);
    alert("Item submitted for donation! Thank you.");
    setCurrentPage("home");
  };

  return (
    <div style={{ ...commonStyles.page, backgroundColor: "#f0f4f7" }}>
      {/* Navbar */}
      <nav style={commonStyles.navbar}>
        <div onClick={() => setCurrentPage("home")} style={commonStyles.logo}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Recycle_logo_green.svg/1200px-Recycle_logo_green.svg.png"
            alt="logo"
            width="30"
            height="30"
          />
          WasteDonate
        </div>
        <div style={commonStyles.navLinks}>
          <div onClick={() => setCurrentPage("browse")} style={commonStyles.link(false)}>
            Browse Items
          </div>
          <div onClick={() => setCurrentPage("donate")} style={commonStyles.link(true)}>
            Donate Items
          </div>
          <a href="#" style={commonStyles.link(false)}>About</a>
        </div>
      </nav>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "40px auto",
          padding: "30px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ color: "#16a34a", marginBottom: "20px" }}>Donate an Item</h2>
        <input
          type="text"
          name="itemTitle"
          placeholder="Item Title"
          value={formData.itemTitle}
          onChange={(e) => setFormData({ ...formData, itemTitle: e.target.value })}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          name="pickupLocation"
          placeholder="Pickup Location"
          value={formData.pickupLocation}
          onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="text"
          name="contactInformation"
          placeholder="Contact Info"
          value={formData.contactInformation}
          onChange={(e) => setFormData({ ...formData, contactInformation: e.target.value })}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Submit Donation
        </button>
      </form>

      {/* Footer */}
      <footer style={commonStyles.footer}>
        © {new Date().getFullYear()} WasteDonate — All Rights Reserved.
      </footer>
    </div>
  );
}

// =========================================================
// --- BROWSE PAGE COMPONENT ---
// =========================================================
function BrowsePage({ setCurrentPage }) {
  return (
    <div style={{ ...commonStyles.page, backgroundColor: "#f9f9f9" }}>
      <nav style={commonStyles.navbar}>
        <div onClick={() => setCurrentPage("home")} style={commonStyles.logo}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Recycle_logo_green.svg/1200px-Recycle_logo_green.svg.png"
            alt="logo"
            width="30"
            height="30"
          />
          WasteDonate
        </div>
        <div style={commonStyles.navLinks}>
          <div onClick={() => setCurrentPage("browse")} style={commonStyles.link(true)}>
            Browse Items
          </div>
          <div onClick={() => setCurrentPage("donate")} style={commonStyles.link(false)}>
            Donate Items
          </div>
          <a href="#" style={commonStyles.link(false)}>About</a>
        </div>
      </nav>

      <div style={{ padding: "40px", textAlign: "center", flexGrow: 1 }}>
        <h1>Browse Available Items</h1>
        <p style={{ color: "#777" }}>No items available yet. Check back soon!</p>
      </div>

      <footer style={commonStyles.footer}>
        © {new Date().getFullYear()} WasteDonate — All Rights Reserved.
      </footer>
    </div>
  );
}

// =========================================================
// --- HOME PAGE COMPONENT ---
// =========================================================
function HomePage({ setCurrentPage }) {
  const bgImage =
    "https://images.unsplash.com/photo-1556767576-5ec41e3239d6?auto=format&fit=crop&w=1600&q=80";

  const styles = {
    ...commonStyles,
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
      textAlign: "center",
    },
    title: { fontSize: "42px", fontWeight: "bold", marginBottom: "15px" },
    subtitle: { fontSize: "18px", lineHeight: "1.6" },
    buttons: { marginTop: "30px", display: "flex", gap: "20px", justifyContent: "center" },
    button: (color) => ({
      backgroundColor: color,
      color: "#fff",
      padding: "12px 25px",
      border: "none",
      borderRadius: "6px",
      fontWeight: "bold",
      cursor: "pointer",
    }),
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div onClick={() => setCurrentPage("home")} style={styles.logo}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Recycle_logo_green.svg/1200px-Recycle_logo_green.svg.png"
            alt="logo"
            width="30"
            height="30"
          />
          WasteDonate
        </div>
        <div style={styles.navLinks}>
          <div onClick={() => setCurrentPage("browse")} style={styles.link(false)}>Browse Items</div>
          <div onClick={() => setCurrentPage("donate")} style={styles.link(false)}>Donate Items</div>
          <a href="#" style={styles.link(false)}>About</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.overlay}></div>
        <div style={styles.heroText}>
          <h1 style={styles.title}>Turn Your Waste Into Someone’s Treasure</h1>
          <p style={styles.subtitle}>
            Connect donors and receivers in your community. Donate items you no longer need and help reduce waste while helping others.
          </p>
          <div style={styles.buttons}>
            <button onClick={() => setCurrentPage("donate")} style={styles.button("#2563eb")}>Start Donating</button>
            <button onClick={() => setCurrentPage("browse")} style={styles.button("#16a34a")}>Browse Items</button>
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
// --- MAIN APP COMPONENT (ROUTING HANDLER) ---
// =========================================================
export default function App() {
  const [currentPage, setCurrentPage] = useState("auth"); // Start with login page

  if (currentPage === "auth") return <AuthPage setCurrentPage={setCurrentPage} />;
  if (currentPage === "browse") return <BrowsePage setCurrentPage={setCurrentPage} />;
  if (currentPage === "donate") return <DonatePage setCurrentPage={setCurrentPage} />;

  return <HomePage setCurrentPage={setCurrentPage} />;
}
