import React, { useEffect, useState } from 'react';
import { loansAPI } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function LoanDetails() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [repayAmt, setRepayAmt] = useState('');
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loansAPI.get(id).then(setLoan).catch(e => alert(e.message));
  }, [id]);

  async function handleRepay(e) {
    e.preventDefault();
    const amt = Number(repayAmt);
    if (isNaN(amt) || amt <= 0) return alert('Enter valid amount');
    try {
      const updated = await loansAPI.repay(id, { amount: amt, note });
      setLoan(updated);
      setRepayAmt('');
      setNote('');
      alert('Repayment recorded');
    } catch (err) { alert(err.message); }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this loan?')) return;
    try {
      await loansAPI.remove(id);
      alert('Deleted');
      navigate('/dashboard');
    } catch (err) { alert(err.message); }
  }

  if (!loan) return <p>Loading loan...</p>;

  return (
    <section>
      <h2>Loan Details</h2>
      <div className="card">
        <p><strong>Borrower:</strong> {loan.borrower?.name}</p>
        <p><strong>Lender:</strong> {loan.lender?.name}</p>
        <p><strong>Principal:</strong> ₹{loan.principal.toFixed(2)}</p>
        <p><strong>Interest %:</strong> {loan.interestPercent}%</p>
        <p><strong>Total:</strong> ₹{loan.total?.toFixed(2)}</p>
        <p><strong>Paid:</strong> ₹{loan.paid?.toFixed(2)}</p>
        <p><strong>Outstanding:</strong> ₹{loan.outstanding?.toFixed(2)}</p>
        <p><strong>Due Date:</strong> {loan.dueDate ? format(new Date(loan.dueDate), 'yyyy-MM-dd') : '—'}</p>
        <p><strong>Status:</strong> {loan.status}</p>
      </div>

      <section>
        <h3>Repayments</h3>
        {loan.repayments && loan.repayments.length > 0 ? (
          <ul className="list">
            {loan.repayments.map((r, idx) => (
              <li key={idx}>₹{r.amount.toFixed(2)} — {format(new Date(r.date), 'yyyy-MM-dd')} {r.note && ` — ${r.note}`}</li>
            ))}
          </ul>
        ) : <p>No repayments yet</p>}
      </section>

      {loan.status === 'pending' && (
        <form onSubmit={handleRepay} className="form-inline">
          <input placeholder="Amount" value={repayAmt} onChange={e => setRepayAmt(e.target.value)} />
          <input placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} />
          <button type="submit">Record Repayment</button>
        </form>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={handleDelete}>Delete Loan</button>
      </div>
    </section>
  );
}
