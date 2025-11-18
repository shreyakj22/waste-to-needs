import React, { useState, useEffect, useRef } from "react";

// Configurable API base so frontend can point to different backends in dev/prod
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AuthPage({ setCurrentPage }) {
  const [view, setView] = useState("login");
  const [captcha, setCaptcha] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginCaptchaInput, setLoginCaptchaInput] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerCaptchaInput, setRegisterCaptchaInput] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const resendTimerRef = useRef(null);
  const [resetEmail, setResetEmail] = useState("");

  // Generate a simple math captcha like "7 + 5 = ?" and store the numeric answer
  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 12) + 1; // 1..12
    const b = Math.floor(Math.random() * 12) + 1; // 1..12
    const ops = ['+','-','×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let question = '';
    let ans = 0;
    if (op === '+') { ans = a + b; question = `${a} + ${b} = ?`; }
    else if (op === '-') { ans = a - b; question = `${a} - ${b} = ?`; }
    else { ans = a * b; question = `${a} × ${b} = ?`; }

    setCaptcha(question);
    setCaptchaAnswer(ans);
  };

  useEffect(() => {
    generateCaptcha();
    return () => {
      // cleanup any timers
      if (resendTimerRef.current) { clearInterval(resendTimerRef.current); resendTimerRef.current = null; }
    };
  }, []);

  const validateLogin = async (e) => {
    e.preventDefault();
    // accept numeric answers for math captcha
    const userAns = Number((loginCaptchaInput || '').toString().trim());
    if (Number.isNaN(userAns) || userAns !== captchaAnswer) {
      alert("CAPTCHA answer is incorrect — please try again.");
      generateCaptcha();
      setLoginCaptchaInput('');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Login failed');
        return;
      }

      // Store login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', loginEmail);
      localStorage.setItem('userName', data.user.name);
      
      setCurrentPage("home"); // ✅ Go to home page after login
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to connect to the server. Please try again.');
    }
  };

  const validateRegister = async (e) => {
    e.preventDefault();
    const userAns = Number((registerCaptchaInput || '').toString().trim());
    if (Number.isNaN(userAns) || userAns !== captchaAnswer) {
      alert("CAPTCHA answer is incorrect — please try again.");
      generateCaptcha();
      setRegisterCaptchaInput('');
      return;
    }
    if (!isVerified) {
      alert('Please verify your email using the code sent to your email before registering.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/auth/complete-register`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Registration failed');
        return;
      }

      alert("Registration successful! Please login.");
      setView("login");
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to connect to the server. Please try again.');
    }
  };

  const sendVerification = async () => {
  if (!registerName || !registerEmail || !registerPassword) {
    alert('Please fill name, email, and password first.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: registerName, 
        email: registerEmail, 
        password: registerPassword 
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setVerificationSent(true);
      setIsVerified(false);
      setVerificationCodeInput('');

      setResendCooldown(30);
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
      resendTimerRef.current = setInterval(() => {
        setResendCooldown((s) => {
          if (s <= 1) {
            clearInterval(resendTimerRef.current);
            resendTimerRef.current = null;
            return 0;
          }
          return s - 1;
        });
      }, 1000);

      alert('✅ Verification code sent to your email!');
    } else {
      console.error('❌ Server responded with error:', data);
      alert(data.message || 'Failed to send verification code.');
    }

  } catch (err) {
    console.error('🚨 sendVerification error:', err);
    alert('⚠ Could not reach backend — make sure backend (port 5000) is running.');
  }
};
  const verifyCode = async () => {
    if (!registerEmail || !verificationCodeInput) { alert('Provide email and code'); return; }
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: registerEmail, code: verificationCodeInput })
      });
      if (res.ok) {
        setIsVerified(true);
        alert('Email verified — you can now complete registration');
      } else {
        const body = await res.json();
        alert(body.error || 'Verification failed');
      }
    } catch (err) {
      console.error('verifyCode error', err);
      alert('Failed to reach server to verify code');
    }
  };

  const validateResetPassword = (e) => {
    e.preventDefault();
    alert("Password reset link sent (dummy)");
    setView("login");
  };

  const base = {
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f4fff9 0%, #eafaf0 100%)',
    padding: 20,
  };

  const card = {
    width: '100%',
    maxWidth: 920,
    borderRadius: 14,
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    boxShadow: '0 12px 40px rgba(16, 24, 40, 0.12)'
  };

  const left = {
    background: 'linear-gradient(180deg,#ffffff 0%, #f7fff9 100%)',
    padding: 36,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    alignItems: 'flex-start',
    justifyContent: 'center'
  };

  const right = {
    background: '#fff',
    padding: 36,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center'
  };

  const input = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #e6e6e6',
    outline: 'none',
    fontSize: 15,
    boxSizing: 'border-box'
  };

  const button = {
    width: '100%',
    padding: '12px 16px',
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    cursor: 'pointer',
    fontWeight: 700
  };

  const smallLink = { color: '#16a34a', cursor: 'pointer', fontSize: 14 };

  return (
    <div style={base}>
      <div style={card}>
        <div style={left}>
          <div style={{ fontSize: 32, color: '#0f172a', fontWeight: 700, letterSpacing: '-0.5px' }}>Waste2Need</div>
          <div style={{ color: '#0f172a', fontSize: 18, fontWeight: 600 }}>Give. Share. Reuse.</div>
          <p style={{ color: '#334155', marginTop: 8, lineHeight: '1.6' }}>Join a community that reduces waste and shares useful items locally. Create an account to donate or request items near you.</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <div style={{ padding: '8px 12px', borderRadius: 8, background: '#e6fff1', color: '#065f46', fontWeight: 600 }}>Free to use</div>
            <div style={{ padding: '8px 12px', borderRadius: 8, background: '#f0fdf4', color: '#065f46' }}>Community driven</div>
          </div>
        </div>

        <div style={right}>
          {view === 'login' && (
            <>
              <div style={{ marginBottom: 6, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Welcome back</div>
              <div style={{ color: '#475569', marginBottom: 12 }}>Sign in to your account</div>

              <form onSubmit={validateLogin} style={{ display: 'grid', gap: 12 }}>
                <input placeholder='Email' type='email' value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required style={input} />
                <input placeholder='Password' type='password' value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required style={input} />

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input placeholder='Solve the equation' type='text' value={loginCaptchaInput} onChange={e => setLoginCaptchaInput(e.target.value)} required style={{ ...input, flex: 1 }} />
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: '#f1f5f9', fontWeight: 700 }}>{captcha}</div>
                </div>

                <button type='submit' style={button}>Login</button>
              </form>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div style={smallLink} onClick={() => setView('register')}>Create account</div>
                <div style={smallLink} onClick={() => setView('forgot')}>Forgot?</div>
              </div>
            </>
          )}

          {view === 'register' && (
            <>
              <div style={{ marginBottom: 6, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Create account</div>
              <div style={{ color: '#475569', marginBottom: 12 }}>Join Waste2Need</div>

              <form onSubmit={validateRegister} style={{ display: 'grid', gap: 12 }}>
                <input placeholder='Full name' type='text' value={registerName} onChange={e => setRegisterName(e.target.value)} required style={input} />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input placeholder='Email' type='email' value={registerEmail} onChange={e => { setRegisterEmail(e.target.value); setVerificationSent(false); setIsVerified(false); }} required style={{ ...input, flex: 1 }} />
                  <button type='button' onClick={sendVerification} disabled={resendCooldown > 0} style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: resendCooldown > 0 ? '#94a3b8' : '#2563eb', color: '#fff', cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer' }}>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Send code'}</button>
                </div>

                <div style={{ marginTop: 6 }}>
                  {/* always-visible code box (disabled until code sent) */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input placeholder='Verification code' value={verificationCodeInput} onChange={e => setVerificationCodeInput(e.target.value)} disabled={!verificationSent || isVerified} style={{ ...input, flex: 1 }} />
                    <button type='button' onClick={verifyCode} disabled={!verificationSent || isVerified} style={{ padding: '10px 12px', borderRadius: 10, border: 'none', background: '#10b981', color: '#fff', cursor: (!verificationSent || isVerified) ? 'not-allowed' : 'pointer' }}>Verify</button>
                    {isVerified && <div style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 8, background: '#d1fae5', color: '#065f46', fontWeight: 700 }}>Verified ✓</div>}
                  </div>
                </div>
                <input placeholder='Password' type='password' value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required style={input} />

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input placeholder='Solve the equation' type='text' value={registerCaptchaInput} onChange={e => setRegisterCaptchaInput(e.target.value)} required style={{ ...input, flex: 1 }} />
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: '#f1f5f9', fontWeight: 700 }}>{captcha}</div>
                </div>

                <button type='submit' style={button} disabled={!isVerified}>Register</button>
              </form>

              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <span style={{ color: '#64748b' }}>Already a member? </span>
                <span style={smallLink} onClick={() => setView('login')}>Login</span>
              </div>
            </>
          )}

          {view === 'forgot' && (
            <>
              <div style={{ marginBottom: 6, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>Reset password</div>
              <div style={{ color: '#475569', marginBottom: 12 }}>We will send a reset link to your email</div>

              <form onSubmit={validateResetPassword} style={{ display: 'grid', gap: 12 }}>
                <input placeholder='Email address' type='email' value={resetEmail} onChange={e => setResetEmail(e.target.value)} required style={input} />
                <button type='submit' style={button}>Send reset link</button>
              </form>

              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <span style={smallLink} onClick={() => setView('login')}>Back to login</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}