function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 25px",
                background: "#1e293b",
                color: "white"
            }}
        >
            <h2>AI Text-to-SQL</h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center"
                }}
            >
                <NavLink
                    to="/dashboard"
                    style={{ color: "white", textDecoration: "none" }}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/chat"
                    style={{ color: "white", textDecoration: "none" }}
                >
                    Chat
                </NavLink>

                <NavLink
                    to="/profile"
                    style={{ color: "white", textDecoration: "none" }}
                >
                    Profile
                </NavLink>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;