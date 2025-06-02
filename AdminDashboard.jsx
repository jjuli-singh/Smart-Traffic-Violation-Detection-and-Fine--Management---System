import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [fines, setFines] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [filter, setFilter] = useState('All');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/fines', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setFines)
      .catch(console.error);

    fetch('/api/appeals', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAppeals)
      .catch(console.error);
  }, []);

  const filteredFines = fines.filter(fine =>
    filter === 'All' ? true : fine.status === filter
  );

  const handleAppealDecision = async (appealId, status) => {
    try {
      const response = await fetch(`/api/appeals/${appealId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status }) // 'Accepted' or 'Rejected'
      });
      if (!response.ok) throw new Error('Failed to update appeal');
      setAppeals(prev =>
        prev.map(a => (a.id === appealId ? { ...a, status } : a))
      );
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <select className="form-select" onChange={e => setFilter(e.target.value)} value={filter}>
            <option>All</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Appealed</option>
          </select>
        </div>
      </div>

      <h5>📄 Fine Records</h5>
      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-secondary">
          <tr>
            <th>#</th>
            <th>Vehicle</th>
            <th>Violation</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Officer</th>
          </tr>
        </thead>
        <tbody>
          {filteredFines.map((fine, i) => (
            <tr key={fine.id}>
              <td>{i + 1}</td>
              <td>{fine.vehicleNumber}</td>
              <td>{fine.violationType}</td>
              <td>₹{fine.fineAmount}</td>
              <td>
                <span className={`badge bg-${fine.status === 'Paid' ? 'success' : fine.status === 'Appealed' ? 'warning' : 'danger'}`}>
                  {fine.status}
                </span>
              </td>
              <td>{fine.policeOfficer?.name || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h5 className="mt-5">📝 Appeals</h5>
      <table className="table table-striped table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Fine ID</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Evidence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {appeals.map((appeal, i) => (
            <tr key={appeal.id}>
              <td>{i + 1}</td>
              <td>{appeal.fineId}</td>
              <td>{appeal.reason}</td>
              <td>
                <span className={`badge bg-${appeal.status === 'Accepted' ? 'success' : appeal.status === 'Rejected' ? 'danger' : 'warning'}`}>
                  {appeal.status}
                </span>
              </td>
              <td>
                {appeal.evidenceUrl ? (
                  <a href={appeal.evidenceUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                ) : (
                  'None'
                )}
              </td>
              <td>
                {appeal.status === 'Pending' && (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleAppealDecision(appeal.id, 'Accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleAppealDecision(appeal.id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </>
                )}
                {appeal.status !== 'Pending' && <span>-</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
