import { useState } from 'react';
import { apiRequest } from '../../utils/fetchapi';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiSave, FiX } from 'react-icons/fi';
import '../../src/styleCss/Alerts.css';

export function Alerts() {
    const [mode, setMode] = useState("ajouter");
    const [alertsData, setAlertsData] = useState([]);
    const [formData, setFormData] = useState({
        titre: "",
        contenu: "",
        email: ""
    });
    const [editingAlert, setEditingAlert] = useState(null);
    const [editFormData, setEditFormData] = useState({
        titre: "",
        contenu: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === "ajouter") {
            if (!formData.titre || !formData.contenu || !formData.email) {
                alert("Veuillez remplir tous les champs !");
                return;
            }
            
            try {
                const data = await apiRequest('/Alerts', 'POST', formData);
                alert(data.message);
                setFormData({ titre: "", contenu: "", email: "" });
            } catch (error) {
                alert(error);
                setFormData({ titre: "", contenu: "", email: "" });
            }
        } else if (mode === "afficher") {
            try {
                const data = await apiRequest(`/Alerts/${formData.email}`, 'GET');
                setAlertsData(data);
            } catch (error) {
                alert(error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette alerte ?")) {
            try {
                const data = await apiRequest(`/Alerts/${id}`, 'DELETE');
                alert(data.message);
                setAlertsData(prevData => prevData.filter(alert => alert.id !== id));
            } catch (error) {
                alert(error);
            }
        }
    };

    const startEditing = (alert) => {
        setEditingAlert(alert.id);
        setEditFormData({
            titre: alert.titre,
            contenu: alert.contenu
        });
    };

    const cancelEditing = () => {
        setEditingAlert(null);
    };

    const handleEditSubmit = async (id) => {
        try {
            const data = await apiRequest(`/Alerts/${id}`, 'PUT', editFormData);
            alert(data.message);
            setAlertsData(prevData => 
                prevData.map(alert => 
                    alert.id === id ? { ...alert, ...editFormData } : alert
                )
            );
            setEditingAlert(null);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="alerts-system-container">
            <header className="alerts-system-header">
                <h1 className="alerts-system-title">Gestion des Alertes</h1>
                <div className="alerts-mode-switcher">
                    <button 
                        className={`alerts-mode-btn ${mode === "ajouter" ? "alerts-mode-active" : ""}`}
                        onClick={() => setMode("ajouter")}
                    >
                        <FiPlus className="alerts-btn-icon" /> Ajouter
                    </button>
                    <button 
                        className={`alerts-mode-btn ${mode === "afficher" ? "alerts-mode-active" : ""}`}
                        onClick={() => setMode("afficher")}
                    >
                        <FiSearch className="alerts-btn-icon" /> Voir alertes
                    </button>
                </div>
            </header>

            <main className="alerts-system-main">
                <form className="alerts-form" onSubmit={handleSubmit}>
                    {mode === "ajouter" && (
                        <>
                            <div className="alerts-form-group">
                                <label htmlFor="titre">Titre :</label>
                                <input 
                                    type="text" 
                                    id="titre"
                                    name="titre"
                                    value={formData.titre}
                                    onChange={handleInputChange}
                                    placeholder="Titre de l'alerte"
                                />
                            </div>
                            <div className="alerts-form-group">
                                <label htmlFor="contenu">Contenu :</label>
                                <textarea 
                                    id="contenu"
                                    name="contenu"
                                    value={formData.contenu}
                                    onChange={handleInputChange}
                                    placeholder="Détails de l'alerte"
                                    rows="4"
                                />
                            </div>
                        </>
                    )}

                    <div className="alerts-form-group">
                        <label htmlFor="email">Email :</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Votre email"
                            required 
                        />
                    </div>

                    <button type="submit" className="alerts-submit-btn">
                        {mode === "ajouter" ? (
                            <>
                                <FiPlus className="alerts-btn-icon" /> Créer l'alerte
                            </>
                        ) : (
                            <>
                                <FiSearch className="alerts-btn-icon" /> Rechercher
                            </>
                        )}
                    </button>
                </form>

                {mode === "afficher" && (
                    <div className="alerts-list-wrapper">
                        {alertsData.length > 0 ? (
                            <div className="alerts-cards-grid">
                                {alertsData.map(alert => (
                                    <div className="alert-item-card" key={alert.id}>
                                        {editingAlert === alert.id ? (
                                            <div className="alert-edit-form">
                                                <input 
                                                    type="text" 
                                                    name="titre"
                                                    value={editFormData.titre}
                                                    onChange={handleEditInputChange}
                                                    className="alert-edit-input"
                                                />
                                                <textarea 
                                                    name="contenu"
                                                    value={editFormData.contenu}
                                                    onChange={handleEditInputChange}
                                                    className="alert-edit-textarea"
                                                    rows="3"
                                                />
                                                <div className="alert-edit-actions">
                                                    <button 
                                                        onClick={() => handleEditSubmit(alert.id)}
                                                        className="alert-save-btn"
                                                    >
                                                        <FiSave className="alerts-btn-icon" /> Enregistrer
                                                    </button>
                                                    <button 
                                                        onClick={cancelEditing}
                                                        className="alert-cancel-btn"
                                                    >
                                                        <FiX className="alerts-btn-icon" /> Annuler
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="alert-card-header">
                                                    <h3 className="alert-item-title">{alert.titre}</h3>
                                                    <div className="alert-item-actions">
                                                        <button 
                                                            onClick={() => startEditing(alert)}
                                                            className="alert-edit-btn"
                                                            aria-label="Modifier"
                                                        >
                                                            <FiEdit2 size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(alert.id)}
                                                            className="alert-delete-btn"
                                                            aria-label="Supprimer"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="alert-content-container">
                                                    <p className="alert-item-content">{alert.contenu}</p>
                                                </div>
                                                <div className="alert-item-footer">
                                                    <span className="alert-creation-date">
                                                        {new Date(alert.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-alerts-message">
                                <p>Aucune alerte trouvée pour cet email</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}