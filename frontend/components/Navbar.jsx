import '../src/styleCss/Navbar.css';
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/fetchapi";
import { FaBars } from "react-icons/fa";

export function Navbar({ toggleSidebar, sidebarOpen }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [unreadnotifications, setUnreadnotificaions] = useState(0);
    const [unreadalerts, setUnreadalerts] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);
    const logoRef = useRef(null);

    const nbrNotificationnonlu = async () => {
        const response = await apiRequest(`/Notifications/unread/${user.userId}`, 'GET');
        setUnreadnotificaions(response.unread);
    };

    const nbrAlertsnolu = async () => {
        const response = await apiRequest(`/Alerts/unread/${user.userId}`, 'GET');
        setUnreadalerts(response.unread);
    };

    useEffect(() => {
        nbrAlertsnolu();
    }, []);

    useEffect(() => {
        nbrNotificationnonlu();
    }, []);

    useEffect(() => {
        if (!animationComplete && logoRef.current) {
            const timer = setTimeout(() => {
                setAnimationComplete(true);
            }, 3000); // Durée suffisante pour toutes les animations

            return () => clearTimeout(timer);
        }
    }, [animationComplete]);

    const ShowAlerts = async () => {
        const data = await apiRequest(`/Alerts/${user.email}`, 'GET');
        navigate('User-Alerts', { state: { alerts: data } });
    };

    const ShowNotifications = async () => {
        const data = await apiRequest(`/Notifications/${user.email}`, 'GET');
        navigate('User-notifications', { state: { notifications: data } });
    };

   
    // Créer les lettres animées
    const renderAnimatedLogo = () => {
        const letters = "SmartMoodle".split('');
        return letters.map((letter, index) => (
            <span
                key={index}
                className={`logo-letter ${!animationComplete ? 'falling' : 'visible'}`}
                style={{
                    color: 'white',
                    animationDelay: `${index * 0.1}s`,
                    
                }}
            >
                {letter}
            </span>
        ));
    };

    return (
        <header className="nav-header">
            <div className="nav-left-section">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    <FaBars />
                    <span className="tooltip">{sidebarOpen ? 'Masquer le menu' : 'Afficher le menu'}</span>
                </button>
                <div className="nav-user-info">
                    <img
                        src="https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
                        alt="User"
                        className="nav-user-avatar"
                    />
                    <span className="nav-user-name">{user.prenom} {user.nom}</span>
                </div>
                <div className="nav-icons-container">
                    <button className="nav-icon-btn nav-alert-btn" onClick={ShowAlerts}>
                        {unreadalerts !== 0 && <span className="nav-badge">{unreadalerts}</span>}
                        <i className="nav-icon">🚨</i>
                    </button>
                    <button className="nav-icon-btn nav-notify-btn" onClick={ShowNotifications}>
                        {unreadnotifications !== 0 && <span className="nav-badge">{unreadnotifications}</span>}
                        <i className="nav-icon">🔔</i>
                    </button>
                </div>
            </div>

            <div className="nav-brand" ref={logoRef}>
                <span className="nav-logo">{renderAnimatedLogo()}</span>
            </div>
        </header>
    );
}