import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const User = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/all');
      setUsers(res.data);
    } catch (err) {
      setMessage('❌ Failed to fetch users');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/user/${id}`);
      if (res.status === 200) {
        alert('User deleted successfully');
        fetchUsers(); // refresh the list
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('❌ Network error while deleting user');
    }
  };

  const filteredUsers = users.filter(u =>
    (u.user || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phoneNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.uuid || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const cellStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    textAlign: 'center',
    fontSize: '14px',
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Poppins, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search..."
          style={{ padding: '8px 12px', fontSize: '14px', width: '220px', borderRadius: '6px', border: '1px solid #ccc' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h2 style={{ fontSize: '1.8rem', color: '#003366', textAlign: 'center', margin: '0 auto' }}>Customer List</h2>
      </div>

      {message && (
        <div style={{ marginBottom: '1rem', fontWeight: '600', color: message.includes('✅') ? 'green' : 'red', backgroundColor: '#fff', padding: '10px 15px', borderRadius: '6px', boxShadow: '0 0 6px rgba(0,0,0,0.05)' }}>
          {message}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 8px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '700px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={cellStyle}>UUID</th>
              <th style={cellStyle}>Customer</th>
              <th style={cellStyle}>Phone No</th>
              <th style={cellStyle}>Location</th>
              <th style={cellStyle}>Registered On</th>
              <th style={cellStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td style={cellStyle} colSpan="6">No user found</td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user._id}>
                  <td style={cellStyle}>{user.uuid}</td>
                  <td style={cellStyle}>{user.user}</td>
                  <td style={cellStyle}>{user.phoneNo}</td>
                  <td style={cellStyle}>{user.location}</td>
                  <td style={cellStyle}>{new Date(user.registeredAt || user.createdAt).toLocaleString()}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => navigate(`/edituser?id=${user._id}`)}
                      style={{ marginRight: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '1rem', fontSize: '14px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }}
            >
              Previous
            </button>
            <span style={{ fontWeight: 'bold' }}>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
