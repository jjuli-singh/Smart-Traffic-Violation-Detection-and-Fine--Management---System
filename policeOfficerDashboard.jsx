import React, { useState } from 'react';
import './policeDashboard.css';

const PoliceDashboard = () => {
  const [violation, setViolation] = useState({
    vehicleNumber: '',
    violationType: '',
    location: '',
    image: null,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setViolation({ ...violation, image: e.target.files[0] });
    } else {
      setViolation({ ...violation, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('vehicleNumber', violation.vehicleNumber);
    formData.append('violationType', violation.violationType);
    formData.append('location', violation.location);
    formData.append('image', violation.image);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/violations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setMessage('Violation uploaded successfully!');
      setViolation({ vehicleNumber: '', violationType: '', location: '', image: null });
    } catch (err) {
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Traffic Violation Upload</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Vehicle Number</label>
          <input
            type="text"
            className="form-control"
            name="vehicleNumber"
            value={violation.vehicleNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Violation Type</label>
          <select
            className="form-select"
            name="violationType"
            value={violation.violationType}
            onChange={handleChange}
            required
          >
            <option value="">Select Violation</option>
            <option value="Signal Jump">Signal Jump</option>
            <option value="No Helmet">No Helmet</option>
            <option value="Over Speeding">Over Speeding</option>
            <option value="Wrong Parking">Wrong Parking</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Violation Location</label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={violation.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Violation Image</label>
          <input
            type="file"
            className="form-control"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Submit Violation</button>
      </form>
    </div>
  );
};

export default PoliceDashboard;;
