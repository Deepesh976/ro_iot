import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Devices = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [model, setModel] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [devicesList, setDevicesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editDeviceId, setEditDeviceId] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchDevices();
  }, []);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/all');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching customers');
    }
  };

  // Fetch devices
  const fetchDevices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/devices/all');
      setDevicesList(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching devices');
    }
  };

  // Register device
  const handleRegister = async () => {
    if (!selectedCustomer || !deviceId || !model) {
      return alert('Device ID, Model, and Customer are required');
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/devices/registered', {
        device_id: deviceId.toUpperCase(),
        model,
        address,
        latitude,
        longitude,
        customer_id: selectedCustomer,
      });

      alert('Device registered successfully');
      resetForm();
      await fetchDevices();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  // Update device
  const handleUpdate = async () => {
    if (!editDeviceId) return;

    if (!selectedCustomer || !deviceId || !model) {
      return alert('Device ID, Model, and Customer are required');
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/devices/registered/${editDeviceId}`, {
        device_id: deviceId.toUpperCase(),
        model,
        address,
        latitude,
        longitude,
        customer_id: selectedCustomer,
      });

      alert('Device updated successfully');
      resetForm();
      await fetchDevices();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  // Delete device
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this device?')) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/devices/registered/${id}`);
      await fetchDevices();
      alert('Device deleted successfully');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Error deleting device');
    }
    setLoading(false);
  };

  // Edit device → prefill form
  const handleEdit = (device) => {
    setIsEditing(true);
    setEditDeviceId(device._id);
    setSelectedCustomer(device.registered_with?.customer_id?._id || '');
    setDeviceId(device.device_id);
    setModel(device.model);
    setAddress(device.location?.address || '');
    setLatitude(device.location?.latitude || '');
    setLongitude(device.location?.longitude || '');
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setEditDeviceId(null);
    setSelectedCustomer('');
    setDeviceId('');
    setModel('');
    setAddress('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>{isEditing ? 'Edit Device' : 'Register Device'}</h2>

        <div style={styles.inlineForm}>
          {/* Customer Dropdown */}
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            style={styles.input}
          >
            <option value="">-- Select Customer --</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.user || c.name}
              </option>
            ))}
          </select>

          {/* Device ID */}
          <input
            type="text"
            placeholder="Device ID"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value.toUpperCase())}
            style={styles.input}
          />

          {/* Device Model */}
          <input
            type="text"
            placeholder="Device Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={styles.input}
          />

          {/* Address */}
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
          />

          {/* Latitude */}
          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            style={styles.input}
          />

          {/* Longitude */}
          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            style={styles.input}
          />

          {/* Register / Update Button */}
          <button
            style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
            onClick={isEditing ? handleUpdate : handleRegister}
            disabled={loading}
          >
            {loading ? 'Processing...' : isEditing ? 'Update' : 'Register'}
          </button>

          {/* Cancel button for editing */}
          {isEditing && (
            <button
              style={{ ...styles.button, backgroundColor: '#6c757d' }}
              onClick={resetForm}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Devices Table */}
        <div style={styles.tableWrapper}>
          <h3 style={styles.subHeading}>Registered Devices</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Device ID</th>
                  <th style={styles.th}>Model</th>
                  <th style={styles.th}>Customer Name</th>
                  <th style={styles.th}>Customer UUID</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>Latitude</th>
                  <th style={styles.th}>Longitude</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Registered At</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {devicesList.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={styles.emptyRow}>
                      No devices found
                    </td>
                  </tr>
                ) : (
                  devicesList.map((d) => (
                    <tr key={d._id}>
                      <td style={styles.td}>{d.device_id}</td>
                      <td style={styles.td}>{d.model}</td>
                      <td style={styles.td}>
                        {d.registered_with?.customer_id?.user || 'N/A'}
                      </td>
                      <td style={styles.td}>{d.registered_with?.uuid}</td>
                      <td style={styles.td}>{d.location?.address}</td>
                      <td style={styles.td}>{d.location?.latitude}</td>
                      <td style={styles.td}>{d.location?.longitude}</td>
                      <td style={styles.td}>{d.status}</td>
                      <td style={styles.td}>
                        {new Date(d.registered_at).toLocaleString()}
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleEdit(d)}
                          style={{
                            ...styles.actionBtn,
                            backgroundColor: '#28a745',
                            marginRight: '8px',
                          }}
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(d._id)}
                          style={{ ...styles.actionBtn, backgroundColor: '#dc3545' }}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  page: {
    padding: '20px',
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  container: { maxWidth: '1300px', margin: '0 auto' },
  title: {
    fontSize: '2rem',
    color: '#003366',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  inlineForm: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    flex: '1',
    minWidth: '150px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  subHeading: { fontSize: '1.2rem', marginBottom: '0.5rem' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f0f0f0' },
  th: {
    padding: '10px',
    borderBottom: '2px solid #ccc',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ccc', // line between rows
    textAlign: 'center', // center align
  },
  emptyRow: { textAlign: 'center', padding: '1rem', color: '#999' },
  actionBtn: {
    padding: '6px 12px',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Devices;
