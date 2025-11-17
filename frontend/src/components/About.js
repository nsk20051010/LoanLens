import React from "react";

export default function About() {
  return (
    <section className="card">
      <h2>About LoanLens</h2>

      <p>
        <strong>LoanLens</strong> is a micro-loan management system designed for
        small groups, college clubs, and communities to track borrowing,
        lending, repayments, and outstanding balances among members.
      </p>

      <h3>📘 How to Use the App</h3>
      <ul>
        <li><strong>Register/Login:</strong> Create an account to access the dashboard.</li>
        <li><strong>Add Members:</strong> Maintain a list of people involved in loan transactions.</li>
        <li><strong>Create Loans:</strong> Record who borrowed, who lent, principal amount, interest, due date, etc.</li>
        <li><strong>Track Repayments:</strong> Add repayments and the system auto-calculates outstanding balances.</li>
        <li><strong>Dashboard:</strong> View pending/cleared loans and group financial summary.</li>
      </ul>

      <h3>🎯 Purpose of the App</h3>
      <p>
        LoanLens demonstrates a functional full-stack web application with real
        data persistence, secure authentication, meaningful UI features, and
        clean coding practices following the university’s MERN project
        requirements.
      </p>
    </section>
  );
}
