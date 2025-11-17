import React, { useState } from "react";
import { authAPI } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await authAPI.register({ username, password });

      // Do NOT auto-login → Do NOT store token
      // Instead, show success and redirect to login

      setSuccess("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <h2>Create an Account</h2>

      <form onSubmit={handleSubmit} className="form">

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error" style={{ color: "red" }}>{error}</p>}
        {success && <p className="success" style={{ color: "green" }}>{success}</p>}

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </section>
  );
}
