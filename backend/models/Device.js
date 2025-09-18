const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  device_id: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  location: {
    address: { type: String, required: false },
    latitude: { type: String, required: false },
    longitude: { type: String, required: false },
  },
  status: { type: String, default: 'active' },
  firmware_version: { type: String, default: '1.0.0' },
  registered_with: {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uuid: { type: String, required: true }, // <-- replace phone number with UUID
  },
  registered_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Device', deviceSchema);
