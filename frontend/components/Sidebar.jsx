import { useContext, useState, useRef, useEffect } from 'react';
import '../src/styleCss/sidebar.css';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../utils/fetchapi';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUserEdit, faSignOutAlt, faChevronDown, faChalkboardTeacher, faBook, faBell, faEnvelope, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

export function Sidebar({ onWidthChange, onViewChange }) {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const sidebarRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [sidebarWidth, setSidebarWidth] = useState(350);
    const [startX, setStartX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);

    const handleLogout = async () => {
        try {
            const data = await apiRequest('/logout', 'POST');
            alert(data.message);
            navigate('/login');
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRedirect = (path) => {
        if (typeof onViewChange === 'function') {
            onViewChange(path.toLowerCase());
        }
        setShowOptions(false);
    };

    const startResizing = (e) => {
        setIsResizing(true);
        setStartX(e.clientX);
        setStartWidth(sidebarWidth);
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    };

    const stopResizing = () => {
        setIsResizing(false);
        document.body.style.cursor = 'default';
    };

    const resize = (e) => {
        if (isResizing) {
            const newWidth = startWidth + e.clientX - startX;
            if (newWidth >= 250 && newWidth <= 500) {
                setSidebarWidth(newWidth);
                document.documentElement.style.setProperty('--sb-sidebar-width', `${newWidth}px`);
                if (typeof onWidthChange === 'function') {
                    onWidthChange(newWidth);
                }
            }
        }
    };

    useEffect(() => {
        document.documentElement.style.setProperty('--sb-sidebar-width', `${sidebarWidth}px`);
        
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
            document.body.style.cursor = 'default';
        };
    }, [isResizing, startX, startWidth]);

    return (
        <div 
            className='sb-sidebar' 
            ref={sidebarRef}
            style={{ width: `${sidebarWidth}px` }}
        >
            <div className="sb-resize-handle" onMouseDown={startResizing}></div>
            <div className="sb-sidebar-content">
                <div className="sb-profile-section">
                    <img 
                        src="FB_IMG_17028196037704662.jpg" 
                        className="sb-profile-img"
                        alt="Profile"
                    />
                    <div className="sb-user-info">
                        <h3><span className="sb-info-label">Prénom:</span> {user.prenom}</h3>
                        <h3><span className="sb-info-label">Nom:</span> {user.nom}</h3>
                        <h3><span className="sb-info-label">Email:</span> {user.email}</h3>
                        <h3><span className="sb-info-label">Numéro:</span> {user.numero_tele}</h3>
                    </div>
                </div>
                <div className="sb-button-container">
                    <button 
                        className="sb-options-btn" 
                        onClick={() => setShowOptions(!showOptions)}
                    >
                        <FontAwesomeIcon icon={faCog} />
                        <span className="sb-btn-text">Options Administratives</span>
                        <FontAwesomeIcon icon={faChevronDown} className={`sb-arrow ${showOptions ? 'sb-up' : ''}`}/>
                    </button>

                    {showOptions && (
                        <div className="sb-options-modal">
                            <button onClick={() => handleRedirect("Enseignants")}>
                                <FontAwesomeIcon icon={faChalkboardTeacher} />
                                <span className="sb-btn-text">Enseignants</span>
                            </button>
                            <button onClick={() => handleRedirect("Modules")}>
                                <FontAwesomeIcon icon={faBook} />
                                <span className="sb-btn-text">Modules</span>
                            </button>
                            <button onClick={() => handleRedirect("Alerts")}>
                                <FontAwesomeIcon icon={faBell} />
                                <span className="sb-btn-text">Alertes</span>
                            </button>
                            <button onClick={() => handleRedirect("Notifications")}>
                                <FontAwesomeIcon icon={faEnvelope} />
                                <span className="sb-btn-text">Notifications</span>
                            </button>
                            <button onClick={() => handleRedirect("Enseignement")}>
                                <FontAwesomeIcon icon={faGraduationCap} />
                                <span className="sb-btn-text">Enseignements</span>
                            </button>
                        </div>
                    )}

                    <button onClick={() => navigate("modifier-info")} className="sb-edit-btn">
                        <FontAwesomeIcon icon={faUserEdit} />
                        <span className="sb-btn-text">Modifier les infos</span>
                    </button>
                    <button onClick={handleLogout} className="sb-logout-btn">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span className="sb-btn-text">Se déconnecter</span>
                    </button>
                </div>
            </div>
        </div>
    );
}