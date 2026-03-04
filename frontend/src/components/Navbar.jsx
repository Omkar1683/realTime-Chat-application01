import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="logo-icon">💬</span>
                <span className="brand-name">ChatApp</span>
            </div>
            <div className="navbar-right">
                <span className="navbar-user">👤 {user?.username}</span>
                <button id="logout-btn" className="btn-logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}
