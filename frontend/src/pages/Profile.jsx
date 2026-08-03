import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { getProfile } from "../api/authApi";
import { getToken } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const token = getToken();

            const data = await getProfile(token);

            setProfile(data);
        } catch {
            setError("Unable to load profile.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!profile) {
        return <p>Loading...</p>;
    }
    const initial = profile?.fullName?.charAt(0)?.toUpperCase() || "?";

    return (
         <div className="profile-page">
            <div className="profile-container">
 
                <div className="profile-nav">
                    <button className="profile-nav-btn" onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </button>
                    <button className="profile-nav-btn" onClick={() => navigate("/chat")}>
                        Chat
                    </button>
                </div>
 
                <div className="profile-banner">
                    <div className="profile-avatar">{initial}</div>
                    <div>
                        <h2 className="profile-banner-name">{profile.fullName}</h2>
                        <p className="profile-banner-sub">@{profile.username}</p>
                    </div>
                    <span className="profile-role-badge">{profile.role}</span>
                </div>
 
                <div className="profile-grid">
                    <div className="profile-card">
                        <h3>Account Details</h3>
 
                        <div className="profile-row">
                            <span className="profile-row-label">Username</span>
                            <span className="profile-row-value">{profile.username}</span>
                        </div>
 
                        <div className="profile-row">
                            <span className="profile-row-label">Full Name</span>
                            <span className="profile-row-value">{profile.fullName}</span>
                        </div>
 
                        <div className="profile-row">
                            <span className="profile-row-label">Role</span>
                            <span className="profile-row-value">{profile.role}</span>
                        </div>
                    </div>
 
                    <div className="profile-card profile-actions-card">
                        <h3>Account</h3>
 
                        <button className="profile-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
 
            </div>
        </div>
    );
}

export default Profile;