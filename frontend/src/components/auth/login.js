import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const styles = {
  headerBar: {
    width: '100%',
    padding: '0.8rem 2rem',
    background: 'linear-gradient(to right, #3f51b5, #5a55ae)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: '1.4rem',
    fontWeight: 600,
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(to right, #e9efff, #f6f8ff)',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
    paddingTop: '70px',
  },
  formsContainer: {
    position: 'absolute',
    width: '100%',
    height: 'calc(100% - 150px)',
    top: '70px',
    left: 0,
  },
  signinSignup: {
    position: 'absolute',
    top: '50%',
    left: '72%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    display: 'grid',
    gridTemplateColumns: '1fr',
    zIndex: 5,
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '2rem 3rem',
    borderRadius: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 10px 35px rgba(0,0,0,0.08)',
  },
  logo: {
    width: '250px',
    marginBottom: '1rem',
    objectFit: 'contain',
  },
  title: {
    fontSize: '1.6rem',
    color: '#333',
    marginBottom: '1rem',
  },
  inputField: {
    maxWidth: '380px',
    width: '100%',
    backgroundColor: '#f1f3f6',
    margin: '10px 0',
    height: '50px',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',
    position: 'relative',
  },
  inputIcon: {
    marginRight: '0.8rem',
    color: '#777',
    fontSize: '1.1rem',
    width: '20px',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    background: 'none',
    outline: 'none',
    border: 'none',
    fontWeight: 500,
    fontSize: '0.95rem',
    color: '#333',
  },
  toggleBtn: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: '#3f51b5',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  btn: {
    width: '140px',
    backgroundColor: '#3f51b5',
    border: 'none',
    outline: 'none',
    height: '45px',
    borderRadius: '45px',
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 600,
    margin: '20px 0 10px 0',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background 0.3s',
  },
  btnHover: {
    backgroundColor: '#2c3ea8',
  },
  panelsContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    textAlign: 'center',
    zIndex: 6,
  },
  leftPanel: {
    pointerEvents: 'all',
    padding: '2rem 10% 1rem 8%',
  },
  image: {
    width: '100%',
    maxWidth: '4180px',
    marginTop: '1rem',
  },
};

const Login = () => {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');

    if (token && expiry && Date.now() < Number(expiry)) {
      navigate('/user', { replace: true });
    } else {
      // Clear outdated session
      localStorage.clear();
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNo || !password) {
      toast.error('Please enter both phone number and password');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/user/login', {
        phoneNo,
        password,
      });

      const { token = 'dummyToken', userId, role } = res.data;
      const expiry = Date.now() + 60 * 60 * 1000; // 1 hour

      // Store token and user details
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('phoneNo', phoneNo);
      localStorage.setItem('role', role);
      localStorage.setItem('expiry', expiry.toString());

      toast.success('Login successful!');
      navigate('/user', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error('Invalid phone number or password');
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-papmLrJcLYK5kk8e2EAcEQBJb+eIYJq6z5L4Rmv7xFnmM9fCnm56E2O4zGahFvJrOSICMEV+X2r8kX8A9YfRgA=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />

      <div style={styles.headerBar}>
        <h1 style={styles.headerTitle}>RO PLANT</h1>
      </div>

      <div style={styles.container}>
        <div style={styles.formsContainer}>
          <div style={styles.signinSignup}>
            <form style={styles.form} onSubmit={handleSubmit}>
              <img src="/logo.png" alt="Logo" style={styles.logo} />
              <h2 style={styles.title}>User Login</h2>

              <div style={styles.inputField}>
                <i className="fas fa-phone" style={styles.inputIcon}></i>
                <input
                  type="text"
                  placeholder="Phone Number"
                  style={styles.input}
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  maxLength={10}
                  required
                />
              </div>

              <div style={styles.inputField}>
                <i className="fas fa-lock" style={styles.inputIcon}></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggleBtn}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <button
                type="submit"
                style={{ ...styles.btn, ...(btnHover ? styles.btnHover : {}) }}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
              >
                Login
              </button>
            </form>
          </div>
        </div>

        <div style={styles.panelsContainer}>
          <div style={{ ...styles.panel, ...styles.leftPanel }}>
            <img src="/log.svg" style={styles.image} alt="Login Visual" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;