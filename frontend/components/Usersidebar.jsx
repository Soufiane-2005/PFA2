import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiRequest } from '../utils/fetchapi';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faSignOutAlt, faCog, faCamera } from '@fortawesome/free-solid-svg-icons';
import { SettingsPanel } from './SettingsPanel';
import { FaRobot } from 'react-icons/fa';

export function Usersidebar({ isOpen, toggleSidebar }) {
    const {user} = useContext(AuthContext); 
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);
    const fileInputRef = useRef(null);

    const handleLogout = async () => {
        try {
            const data = await apiRequest('/logout', 'POST');
            alert(data.message);
            localStorage.removeItem('theme')
            navigate('/login');
        } catch (err) {
            alert(err.message || 'Erreur lors de la déconnexion');
        }
    };

    const handleChatbot = () => {
        navigate('chatbot')
    };

    const handleRedirect = (path) => {
        navigate(path);
        if (path !== 'parametres') setShowSettings(false);
        if (!isOpen) toggleSidebar?.();
    };

    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        
        
        try {
            const formData = new FormData();
            formData.append('profile_picture', file);
            formData.append('user_id', user.userId)
            
            // Envoi de la photo au serveur
            const data = await apiRequest('/profile_picture', 'POST', formData);
            
            
            
            
            alert(data.message);
        } catch (error) {
            alert('Erreur lors du téléchargement de la photo: ' + error.message);
        }
    };

    return (
        <div className={`user-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
                <div className="user-profile">
                    <div className="avatar-container">
                        <img 
                            src="https://drive.google.com/uc?id=1iQCwzhE2CfCcz2razMJUj6Ex27sbzv-a"

                            alt="Profile"
                            className="profile-avatar"
                            onError={(e)=>{
                                e.target.src = 'inconnue.jpg'
                            }}
                            
                        />
                        <div className="camera-icon" onClick={handleCameraClick}>
                            <FontAwesomeIcon icon={faCamera} />
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                    
                    <div className="user-info">
                        <h2>{user.prenom} {user.nom}</h2>
                        <p className="user-email">{user.email}</p>
                        {user.numero_tele && <p className="user-phone">{user.numero_tele}</p>}
                        <span className={`user-role ${user.role}`}>{user.role}(e)</span>
                    </div>
                </div>

                <div className="sidebar-menu">
                    <button 
                        className="menu-item"
                        onClick={() => handleRedirect("modifier-info")}
                        aria-label="Modifier le profil"
                    >
                        <FontAwesomeIcon icon={faUserEdit} className="menu-icon" />
                        <span>Modifier le profil</span>
                    </button>
                    
                    <button 
                        className="menu-item"
                        onClick={() => {
                            setShowSettings(!showSettings);
                            if (!isOpen) toggleSidebar?.();
                        }}
                        aria-label="Paramètres"
                    >
                        <FontAwesomeIcon icon={faCog} className="menu-icon" />
                        <span>Paramètres</span>
                    </button>
                    
                    <button 
                        className="menu-item" 
                        onClick={handleChatbot}
                        aria-label="Assistant Virtuel"
                    >
                        <FaRobot className="menu-icon" />
                        <span>Assistant Virtuel</span>
                    </button>
                    
                    <button 
                        className="logout-btn" 
                        onClick={handleLogout}
                        aria-label="Déconnexion"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>

            {showSettings && (
                <SettingsPanel 
                    onClose={() => setShowSettings(false)} 
                />
            )}
        </div>
    );
}