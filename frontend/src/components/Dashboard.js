import React, { useEffect, useState } from 'react';
import { loansAPI, membersAPI } from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    try {
      const [L, M] = await Promise.all([loansAPI.list(), membersAPI.list()]);
      setLoans(L);
      setMembers(M);
    } catch (err) {
      alert('Error loading data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  const pending = loans.filter(l => l.status === 'pending');
  const cleared = loans.filter(l => l.status === 'cleared');
  const totalOutstanding = loans.reduce((s, l) => s + (l.outstanding || 0), 0);

  return (
    <section>
      <h2>Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* ------------------- SUMMARY CARDS ------------------- */}
          <div className="summary-grid">
            <div className="card">
              <h3>Total Loans</h3>
              <p>{loans.length}</p>
            </div>

            <div className="card">
              <h3>Pending</h3>
              <p>{pending.length}</p>
            </div>

            <div className="card">
              <h3>Cleared</h3>
              <p>{cleared.length}</p>
            </div>

            <div className="card">
              <h3>Total Outstanding</h3>
              <p>₹ {totalOutstanding.toFixed(2)}</p>
            </div>
          </div>

          {/* ------------------- RECENT PENDING LOANS ------------------- */}
          <section>
            <h3>Recent Pending Loans</h3>

            {pending.length === 0 ? (
              <p>No pending loans</p>
            ) : (
              <ul className="list">
                {pending.slice(0, 5).map(l => (
                  <li key={l._id}>
                    <Link to={`/loans/${l._id}`}>
                      {l.borrower?.name} owes {l.lender?.name} ₹{(l.outstanding || 0).toFixed(2)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ------------------- CLEARED LOANS (NEW SECTION) ------------------- */}
          <section style={{ marginTop: "20px" }}>
            <h3>Cleared Loans</h3>

            {cleared.length === 0 ? (
              <p>No cleared loans</p>
            ) : (
              <ul className="list">
                {cleared.map(l => (
                  <li key={l._id}>
                    <Link to={`/loans/${l._id}`}>
                      {l.borrower?.name} repaid {l.lender?.name}
                      {" — "}
                      Total: ₹{(l.total || 0).toFixed(2)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ------------------- MEMBERS SUMMARY ------------------- */}
          <section style={{ marginTop: "20px" }}>
            <h3>Members</h3>
            <ul className="list">
              {members.map(m => (
                <li key={m._id}>
                  {m.name} — net ₹{(m.netBalance || 0).toFixed(2)}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </section>
  );
}
