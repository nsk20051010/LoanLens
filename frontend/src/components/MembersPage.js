import React, { useEffect, useState } from 'react';
import MemberClass from '../models/MemberClass';
import { membersAPI } from '../api';

function MemberItem({ m, onDeleted, onUpdated }) {
  return (
    <div className="member-item">
      <div><strong>{m.name}</strong> <span className="muted">({m.email || 'no email'})</span></div>
      <div>
        <button onClick={() => {
          const newName = prompt('Edit name', m.name);
          if (!newName) return;
          onUpdated(m._id, { ...m, name: newName });
        }}>Edit</button>
        <button onClick={async ()=> {
          if (!window.confirm('Delete member?')) return;
          await onDeleted(m._id);
        }}>Delete</button>
      </div>
    </div>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(new MemberClass());
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await membersAPI.list();
      setMembers(data);
    } catch (err) {
      alert('Error fetching members: ' + err.message);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.isValid()) { alert('Enter name'); return; }
    try {
      const created = await membersAPI.create(form.toPayload());
      setMembers([created, ...members]);
      setForm(new MemberClass());
    } catch (err) { alert(err.message); }
  }

  async function handleDelete(id) {
    try {
      await membersAPI.remove(id);
      setMembers(members.filter(m => m._id !== id));
    } catch (err) { alert(err.message); }
  }

  async function handleUpdate(id, payload) {
    try {
      const updated = await membersAPI.update(id, { name: payload.name });
      setMembers(members.map(m => m._id === id ? updated : m));
    } catch (err) { alert(err.message); }
  }

  return (
    <section>
      <h2>Members</h2>
      <form onSubmit={handleAdd} className="form-inline" onInput={() => { /* input event captured here */ }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm(new MemberClass({ ...form, name: e.target.value }))} />
        <input placeholder="Email (optional)" value={form.email} onChange={e => setForm(new MemberClass({ ...form, email: e.target.value }))} />
        <button type="submit">Add Member</button>
      </form>

      {loading ? <p>Loading members...</p> : (
        <div className="list">
          {members.length === 0 ? <p>No members yet</p> : members.map(m => (
            <MemberItem key={m._id} m={m} onDeleted={handleDelete} onUpdated={handleUpdate} />
          ))}
        </div>
      )}
    </section>
  );
}
