import React, { useEffect, useState } from 'react';
import './userDashboard.css';

const UserDashboard = () => {
  const [fines, setFines] = useState([]);
  const [appealModal, setAppealModal] = useState({ show: false, fineId: null });
  const [appealData, setAppealData] = useState({ reason: '', evidence: null });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/fines/user/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setFines(data))
      .catch(err => console.error(err));
  }, []);

  const handlePay = async (fineId) => {
    try {
      const response = await fetch(`/api/fines/${fineId}/pay`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Payment failed');
      setMessage('Fine marked as paid.');
      setFines(prev =>
        prev.map(f => f.id === fineId ? { ...f, status: 'Paid' } : f)
      );
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fineId', appealModal.fineId);
    formData.append('reason', appealData.reason);
    formData.append('evidence', appealData.evidence);

    try {
      const response = await fetch('/api/appeals', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Appeal failed');
      setMessage('Appeal submitted.');
      setAppealModal({ show: false, fineId: null });
    } catch (err) {
      setMessage(err.message);
    }
  };

  const openAppeal = (fineId) => {
    setAppealModal({ show: true, fineId });
  };

  const handleAppealChange = (e) => {
    if (e.target.name === 'evidence') {
      setAppealData({ ...appealData, evidence: e.target.files[0] });
    } else {
      setAppealData({ ...appealData, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">My Traffic Fines</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <table className="table table-bordered table-striped shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fines.map((fine, index) => (
            <tr key={fine.id}>
              <td>{index + 1}</td>
              <td>{fine.vehicleNumber}</td>
              <td>{fine.violationType}</td>
              <td>₹{fine.fineAmount}</td>
              <td>
                <span className={`badge bg-${fine.status === 'Paid' ? 'success' : fine.status === 'Appealed' ? 'warning' : 'danger'}`}>
                  {fine.status}
                </span>
              </td>
              <td>
                {fine.status === 'Pending' && (
                  <>
                    <button className="btn btn-sm btn-success me-2" onClick={() => handlePay(fine.id)}>Pay</button>
                    <button className="btn btn-sm btn-warning" onClick={() => openAppeal(fine.id)}>Appeal</button>
                  </>
                )}
                {fine.status === 'Appealed' && <span>Under Review</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Appeal Modal */}
      {appealModal.show && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAppealSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Appeal Fine</h5>
                  <button type="button" className="btn-close" onClick={() => setAppealModal({ show: false, fineId: null })}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Reason</label>
                    <textarea className="form-control" name="reason" required onChange={handleAppealChange}></textarea>
                  </div>
                  <div className="mb-3">
                    <label>Evidence (Image/Video)</label>
                    <input type="file" className="form-control" name="evidence" onChange={handleAppealChange} accept="image/*,video/*" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" type="submit">Submit Appeal</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setAppealModal({ show: false, fineId: null })}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
