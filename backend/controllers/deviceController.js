const Device = require('../models/Device');
const User = require('../models/User');

// Register Device
const registerDevice = async (req, res) => {
  try {
    const { device_id, model, address, latitude, longitude, customer_id, status, firmware_version } = req.body;

    if (!device_id || !model || !customer_id) {
      return res.status(400).json({ message: 'Device ID, model, and customer are required' });
    }

    // Check if device already exists
    const existingDevice = await Device.findOne({ device_id });
    if (existingDevice) return res.status(409).json({ message: 'Device ID already exists' });

    // Fetch customer and UUID
    const customer = await User.findById(customer_id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const newDevice = new Device({
      device_id: device_id.toUpperCase(),
      model,
      location: { address: address || '', latitude: latitude || '', longitude: longitude || '' },
      status: status || 'active',
      firmware_version: firmware_version || '1.0.0',
      registered_with: {
        customer_id: customer._id,
        uuid: customer.uuid
      },
      registered_at: Date.now(),
      last_seen: Date.now()
    });

    await newDevice.save();

    res.status(201).json({ message: 'Device registered successfully', data: newDevice });
  } catch (error) {
    console.error('Device registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Get all registered devices
const getRegisteredDevices = async (req, res) => {
  try {
    const devices = await Device.find().populate('registered_with.customer_id', 'user uuid');
    res.status(200).json(devices);
  } catch (error) {
    console.error('Fetch devices error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update Device
const updateDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { device_id, model, address, latitude, longitude, customer_id, status, firmware_version } = req.body;

    if (!device_id || !model || !customer_id) {
      return res.status(400).json({ message: 'Device ID, model, and customer are required' });
    }

    const customer = await User.findById(customer_id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const updatedFields = {
      device_id: device_id.toUpperCase(),
      model,
      location: { address: address || '', latitude: latitude || '', longitude: longitude || '' },
      status: status || 'active',
      firmware_version: firmware_version || '1.0.0',
      registered_with: { customer_id: customer._id, uuid: customer.uuid },
      last_seen: Date.now()
    };

    const updatedDevice = await Device.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!updatedDevice) return res.status(404).json({ message: 'Device not found' });

    res.status(200).json({ message: 'Device updated successfully', data: updatedDevice });
  } catch (error) {
    console.error('Update device error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete Device
const deleteDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDevice = await Device.findByIdAndDelete(id);
    if (!deletedDevice) return res.status(404).json({ message: 'Device not found' });
    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Login Device (optional)
const loginDevice = async (req, res) => {
  try {
    const { device_id } = req.body;
    if (!device_id) return res.status(400).json({ message: 'Device ID is required' });

    const device = await Device.findOne({ device_id });
    if (!device) return res.status(404).json({ message: 'Device not found' });

    res.status(200).json({ message: 'Login successful', data: device });
  } catch (error) {
    console.error('Device login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  registerDevice,
  getRegisteredDevices,
  updateDevice,
  deleteDevice,
  loginDevice
};
