import React, { useEffect, useState } from 'react';
import LoanClass from '../models/LoanClass';
import { membersAPI, loansAPI } from '../api';
import { useNavigate } from 'react-router-dom';

export default function NewLoanPage() {
  const [members, setMembers] = useState([]);
  const [loan, setLoan] = useState(new LoanClass());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=> {
    membersAPI.list().then(setMembers).catch(e => alert(e.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const lc = new LoanClass(loan);
    const err = lc.validate();
    if (err) return alert(err);
    setLoading(true);
    try {
      const created = await loansAPI.create(lc.toPayload());
      // callback-like action: navigate to loan details so user sees it immediately
      navigate(`/loans/${created._id}`);
    } catch (err) {
      alert('Failed to create loan: ' + err.message);
    } finally { setLoading(false); }
  }

  return (
    <section>
      <h2>Record New Loan</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Borrower
          <select value={loan.borrower || ''} onChange={e => setLoan({ ...loan, borrower: e.target.value })}>
            <option value="">-- select borrower --</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
        </label>

        <label>Lender
          <select value={loan.lender || ''} onChange={e => setLoan({ ...loan, lender: e.target.value })}>
            <option value="">-- select lender --</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
        </label>

        <label>Principal (₹)
          <input type="number" step="0.01" value={loan.principal || ''} onChange={e => setLoan({ ...loan, principal: e.target.value })} />
        </label>

        <label>Interest % (optional)
          <input type="number" step="0.01" value={loan.interestPercent || ''} onChange={e => setLoan({ ...loan, interestPercent: e.target.value })} />
        </label>

        <label>Due Date
          <input type="date" value={loan.dueDate || ''} onChange={e => setLoan({ ...loan, dueDate: e.target.value })} />
        </label>

        <label>Note
          <input type="text" value={loan.note || ''} onChange={e => setLoan({ ...loan, note: e.target.value })} />
        </label>

        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Loan'}</button>
      </form>
    </section>
  );
}
