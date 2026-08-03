import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { login as loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await loginApi(username, password);

            // Save the JWT and update authentication state
            login(response.token);

            // Redirect after successful login
            navigate("/profile");
        } catch (err) {
            setError("Invalid username or password.");
        }
    };

    return (
        
        <div className="auth-page">
  <div className="auth-card">
    <p className="auth-eyebrow">Welcome back</p>
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
      <div className="auth-field">
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div className="auth-field">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="auth-error">{error}</p>}
      <button type="submit" className="auth-submit">Login</button>
      <p className="auth-footer">Don't have an account? <Link to="/register">Register</Link></p>
    </form>
  </div>
</div>
    );
}

export default Login;