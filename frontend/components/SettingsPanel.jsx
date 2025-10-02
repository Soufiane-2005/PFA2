import { useContext, useState } from 'react';
import { FaLanguage, FaLock, FaMoon, FaSun, FaTrash } from 'react-icons/fa';
import '../src/styleCss/SettingsPanel.css';
import { AuthContext } from "../context/AuthContext";
import {apiRequest} from '../utils/fetchapi'
import { useNavigate } from 'react-router-dom';


export function SettingsPanel({ onClose }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()
  const [language, setLanguage] = useState('fr');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordCorrect, setPasswordCorrect] = useState(null);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleDeleteAccountClick = () => {
    setShowDeleteModal(true);
    setPassword('');
    setPasswordCorrect(null);
    setShowFinalConfirmation(false);
  };

  const verifyPassword = async () => {
  
   
      const data = await apiRequest('/supprimer', 'POST', {
        email : user.email,
        password: password

      })
      console.log(data.valid)
      const isCorrect = data.valid; 
      setPasswordCorrect(isCorrect);
      
      if (isCorrect) {
        setShowFinalConfirmation(true);
      }
    
  };

  const confirmAccountDeletion = async () => {
    const data = await apiRequest('/supprimer', 'GET')
    
    alert(data.message);
    setShowDeleteModal(false);
    navigate('/login')
    
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Paramètres</h2>
        <button onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>

      <div className="settings-group">
        <h3><FaLanguage /> Langue</h3>
        <select 
          value={language} 
          onChange={handleLanguageChange}
          className="settings-select"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>

      <div className="settings-group">
        <div className="theme-switch-container">
          <h3>
            {isDarkMode ? <FaMoon /> : <FaSun />} Thème
          </h3>
          <label className="theme-switch">
            <input 
              type="checkbox" 
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="settings-group danger-zone">
        <h3><FaLock /> Zone dangereuse</h3>
        <button 
          onClick={handleDeleteAccountClick}
          className="delete-account-btn"
        >
          <FaTrash /> Supprimer le compte
        </button>
      </div>

      {/* Modal de suppression de compte */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            {!showFinalConfirmation ? (
              <>
                <h3>Supprimer votre compte</h3>
                <p>Pour supprimer votre compte, veuillez entrer votre mot de passe.</p>
                
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  className="password-input"
                />
                
                {passwordCorrect === false && (
                  <p className="error-message">Mot de passe incorrect. Veuillez réessayer.</p>
                )}
                
                <div className="modal-buttons">
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="cancel-btn"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={verifyPassword}
                    className="confirm-btn"
                    disabled={!password}
                  >
                    Vérifier
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>Êtes-vous absolument sûr ?</h3>
                <p>Cette action est irréversible. Toutes vos données seront définitivement supprimées.</p>
                
                <div className="modal-buttons">
                  <button 
                    onClick={() => setShowFinalConfirmation(false)}
                    className="cancel-btn"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={confirmAccountDeletion}
                    className="delete-confirm-btn"
                  >
                    Oui, supprimer mon compte
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}