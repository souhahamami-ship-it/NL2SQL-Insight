import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { register } from "../api/authApi";
import "../styles/auth.css";
function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullName: "",
        role: "User",
        registrationKey: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            await register(formData);

            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            if (err.response?.status === 403) {
                setError("Invalid registration key.");
            }
            else if (err.response?.status === 409) {
                setError("Username already exists.");
            }
            else {
                setError("Registration failed.");
            }
        }
    };

    return (
         <div className="auth-page">
            <div className="auth-card">
                <p className="auth-eyebrow">Create account</p>
                <h2>Register</h2>
 
                <form onSubmit={handleRegister}>
 
                    <div className="auth-field">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className="auth-field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className="auth-field">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    <div className="auth-field">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
 
                    <div className="auth-field">
                        <label>Registration Key</label>
                        <input
                            type="password"
                            name="registrationKey"
                            value={formData.registrationKey}
                            onChange={handleChange}
                            required
                        />
                    </div>
 
                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}
 
                    {success && (
                        <p className="auth-success">
                            {success}
                        </p>
                    )}
 
                    <button type="submit" className="auth-submit">
                        Register
                    </button>
 
                </form>
 
                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
 
            </div>
        </div>
    
    );
}

export default Register;