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

      <h3 style={{
  marginTop: "40px",
  fontSize: "1.8rem",
  fontWeight: "700",
  letterSpacing: "0.5px"
}}>
  📘 How to Use the App
</h3>

<ul style={{
  marginTop: "30px",
  lineHeight: "2.1rem",
  fontSize: "1.15rem",
  paddingLeft: "25px",
  maxWidth: "900px"
}}>
  <li style={{ marginBottom: "18px" }}>
    <strong>Register/Login:</strong> Create an account to access the dashboard.
  </li>

  <li style={{ marginBottom: "18px" }}>
    <strong>Add Members:</strong> Maintain a list of people involved in loan transactions.
  </li>

  <li style={{ marginBottom: "18px" }}>
    <strong>Create Loans:</strong> Record who borrowed, who lent, principal amount, interest, due date, and notes.
  </li>

  <li style={{ marginBottom: "18px" }}>
    <strong>Track Repayments:</strong> Add repayments easily and LoanLens automatically updates outstanding balances.
  </li>

  <li style={{ marginBottom: "18px" }}>
    <strong>Dashboard:</strong> View pending vs cleared loans, total outstanding, and group-level financial summary.
  </li>
</ul>


      
    </section>
  );
}

