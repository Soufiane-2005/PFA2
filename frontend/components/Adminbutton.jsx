import '../src/styleCss/Adminbutton.css'


import { useNavigate } from 'react-router-dom'

export function Adminbutton() {
    const navigate = useNavigate();

    // Fonction pour gérer la redirection
    const handleRedirect = (path) => {
        navigate(path);
    };

    return (
        <div className="admin-button-container">
            <h1 className="admin-title">Ajouter / Modifier / Supprimer</h1>
            <div className="button-grid">
                <button 
                    onClick={() => handleRedirect('Enseignant')} 
                    className="btn btn-enseignant"
                >
                    Enseignant
                </button>
                <button 
                    onClick={() => handleRedirect('Modules')} 
                    className="btn btn-classe"
                >
                    Modules
                </button>
                <button 
                    onClick={() => handleRedirect('Alerts')} 
                    className="btn btn-alerts"
                >
                    Alerts
                </button>
                <button 
                    onClick={() => handleRedirect('Notifications')} 
                    className="btn btn-notifs"
                >
                    Notifications
                </button>
                     <button 
                    onClick={() => handleRedirect('Enseignement')} 
                    className="btn btn-enseignements"
                >
                    Enseignements
                </button>
            </div>
        </div>
    );
}
