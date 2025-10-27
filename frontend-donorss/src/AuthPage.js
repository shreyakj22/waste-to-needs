import React, { useState, useEffect } from "react";

export default function AuthPage({ setCurrentPage }) {
  const [view, setView] = useState("login");
  const [captcha, setCaptcha] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginCaptchaInput, setLoginCaptchaInput] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerCaptchaInput, setRegisterCaptchaInput] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const generateCaptcha = () => {
    const newCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(newCaptcha);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const validateLogin = (e) => {
    e.preventDefault();
    if (captcha !== loginCaptchaInput.toUpperCase()) {
      alert("CAPTCHA does not match!");
      generateCaptcha();
      return;
    }
    
    // Store login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', loginEmail);
    
    setCurrentPage("home"); // ✅ Go to home page after login
  };

  const validateRegister = (e) => {
    e.preventDefault();
    if (captcha !== registerCaptchaInput.toUpperCase()) {
      alert("CAPTCHA does not match!");
      generateCaptcha();
      return;
    }
    alert("Registration successful (dummy)");
    setView("login");
  };

  const validateResetPassword = (e) => {
    e.preventDefault();
    alert("Password reset link sent (dummy)");
    setView("login");
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#f2f2f2",
        minHeight: "100vh",
        padding: 0,
        margin: 0,
      }}
    >
      <div
        style={{
          width: 400,
          margin: "50px auto",
          background: "#fff",
          padding: 30,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        {view === "login" && (
          <>
            <h2 style={{ 
              textAlign: "center", 
              marginBottom: 20,
              fontSize: "2.2em",
              fontWeight: "700",
              color: "#2c3e50",
              textTransform: "uppercase",
              letterSpacing: "2px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
            }}>
              waste-2-need
            </h2>
            <p style={{
              textAlign: "center",
              color: "#2c3e50",
              marginBottom: "20px",
              fontSize: "1.1em",
              fontFamily: "Calibri, sans-serif",
              fontWeight: "bold"
            }}>
              Please sign in to continue
            </p>
            <form onSubmit={validateLogin}>
              <label style={{ fontWeight: "bold", fontSize: "1.05em", paddingBottom: 6, display: "block" }}>Email:</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />

              <label style={{ fontWeight: "bold", fontSize: "1.05em", marginTop: 16, paddingBottom: 6, display: "block" }}>Password:</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />

              <label style={{ fontWeight: "bold", fontSize: "1.05em", marginTop: 16, paddingBottom: 6, display: "block" }}>Enter CAPTCHA:</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  value={loginCaptchaInput}
                  onChange={(e) => setLoginCaptchaInput(e.target.value)}
                  required
                  style={{ flex: 1, marginRight: 10, padding: 8 }}
                />
                <div
                  style={{
                    background: "#ddd",
                    padding: 10,
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    userSelect: "none",
                  }}
                >
                  {captcha}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 15,
                  width: "100%",
                  padding: 10,
                  backgroundColor: "#28a745",
                  border: "none",
                  color: "#fff",
                  fontSize: 16,
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#1e7e34")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#28a745")
                }
              >
                Login
              </button>
            </form>

            <div
              style={{
                textAlign: "right",
                marginTop: 10,
                fontSize: "0.9em",
                color: "#28a745",
                cursor: "pointer",
              }}
              onClick={() => setView("forgot")}
            >
              Forgot Password?
            </div>

            <div
              style={{
                textAlign: "center",
                marginTop: 10,
                cursor: "pointer",
                color: "#28a745",
              }}
              onClick={() => setView("register")}
            >
              Don't have an account? Register
            </div>
          </>
        )}

        {view === "register" && (
          <>
            <h2 style={{ 
              textAlign: "center", 
              marginBottom: 20,
              fontSize: "2.2em",
              fontWeight: "700",
              color: "#2c3e50",
              textTransform: "uppercase",
              letterSpacing: "2px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
            }}>
              Register
            </h2>
            <form onSubmit={validateRegister}>
              <label style={{ fontWeight: "bold", fontSize: "1.05em", paddingBottom: 6, display: "block" }}>Name:</label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />

              <label style={{ fontWeight: "bold", fontSize: "1.05em", marginTop: 16, paddingBottom: 6, display: "block" }}>Email:</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />

              <label style={{ fontWeight: "bold", fontSize: "1.05em", marginTop: 16, paddingBottom: 6, display: "block" }}>Password:</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />

              <label style={{ fontWeight: "bold", fontSize: "1.05em", marginTop: 16, paddingBottom: 6, display: "block" }}>Enter CAPTCHA:</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  value={registerCaptchaInput}
                  onChange={(e) => setRegisterCaptchaInput(e.target.value)}
                  required
                  style={{ flex: 1, marginRight: 10, padding: 8 }}
                />
                <div
                  style={{
                    background: "#ddd",
                    padding: 10,
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    userSelect: "none",
                  }}
                >
                  {captcha}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 15,
                  width: "100%",
                  padding: 10,
                  backgroundColor: "#28a745",
                  border: "none",
                  color: "#fff",
                  fontSize: 16,
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#1e7e34")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#28a745")
                }
              >
                Register
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: 10,
                cursor: "pointer",
                color: "#28a745",
              }}
              onClick={() => setView("login")}
            >
              Already have an account? Login
            </div>
          </>
        )}

        {view === "forgot" && (
          <>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>
              Reset Password
            </h2>
            <form onSubmit={validateResetPassword}>
              <label>Enter your email:</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />

              <button
                type="submit"
                style={{
                  marginTop: 15,
                  width: "100%",
                  padding: 10,
                  backgroundColor: "#28a745",
                  border: "none",
                  color: "#fff",
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#1e7e34")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#28a745")
                }
              >
                Reset Password
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: 10,
                cursor: "pointer",
                color: "#28a745",
              }}
              onClick={() => setView("login")}
            >
              Back to Login
            </div>
          </>
        )}
      </div>
    </div>
  );
}
