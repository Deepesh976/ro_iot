import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditUser = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    user: '',
    phoneNo: '',
    location: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/user/${userId}`)
        .then((res) => {
          const { user, phoneNo, location } = res.data;
          setUserData((prev) => ({
            ...prev,
            user,
            phoneNo,
            location,
          }));
        })
        .catch((err) => {
          console.error('Error fetching user:', err);
          setMessage('❌ Failed to load user');
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (userData.password && userData.password !== userData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    try {
      const payload = {
        user: userData.user,
        phoneNo: userData.phoneNo,
        location: userData.location,
      };

      if (userData.password.trim()) {
        payload.password = userData.password.trim();
      }

await axios.put(`http://localhost:5000/api/user/${userId}`, payload);

      setMessage('✅ User updated successfully');
      setTimeout(() => {
        navigate('/user', { state: { refresh: true } });
      }, 1000);
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      setMessage('❌ Failed to update user');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>Edit User</h2>
        {message && (
          <p style={{ ...styles.message, color: message.includes('✅') ? 'green' : 'red' }}>
            {message}
          </p>
        )}
        <form onSubmit={handleUpdate} style={styles.form}>
          <input
            name="user"
            value={userData.user}
            onChange={handleChange}
            placeholder="User Name"
            required
            style={styles.input}
          />
          <input
            name="phoneNo"
            value={userData.phoneNo}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            style={styles.input}
          />
          <input
            name="location"
            value={userData.location}
            onChange={handleChange}
            placeholder="Location"
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
            style={styles.input}
          />
          <input
            name="confirmPassword"
            type="password"
            value={userData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            style={styles.input}
            required={userData.password.trim() !== ''}
          />
          <button type="submit" style={styles.button}>
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    paddingTop: '20px',
    paddingBottom: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    background: '#f4f6f9',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  formWrapper: {
    background: '#fff',
    padding: '30px 25px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '450px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '22px',
    fontWeight: '600',
    color: '#003366',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    padding: '12px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  message: {
    textAlign: 'center',
    marginBottom: '15px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
};

export default EditUser;
