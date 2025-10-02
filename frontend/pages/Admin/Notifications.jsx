import { useState } from 'react';
import { apiRequest } from '../../utils/fetchapi';
import { FiPlus, FiEye, FiTrash2, FiEdit, FiSend, FiX } from 'react-icons/fi';
import '../../src/styleCss/Notifications.css';

export function Notifications() {
  const [mode, setMode] = useState("ajouter");
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    message: "",
    email: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "ajouter") {
      if (!formData.message || !formData.email) {
        alert("Veuillez remplir tous les champs !");
        return;
      }

      try {
        const data = await apiRequest('/Notifications', 'POST', formData);
        alert(data.message);
        setFormData({ message: "", email: "" });
      } catch (error) {
        alert(error);
        setFormData({ message: "", email: "" });
      }
    } else {
      try {
        const data = await apiRequest(`/Notifications/${formData.email}`, 'GET');
        setNotifications(data);
      } catch (error) {
        alert(error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const data = await apiRequest(`/Notifications/${id}`, 'DELETE');
      alert(data.message);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      alert(error);
    }
  };

  const handleModify = async (id) => {
    try {
      const data = await apiRequest(`/Notifications/${id}`, 'PUT', { message: editMessage });
      alert(data.message);
      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, message: editMessage } : notification
      ));
      setEditingId(null);
      setEditMessage("");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="notif-main-container">
      <h1 className="notif-main-title">Gestion des Notifications</h1>
      
      {/* Mode selector */}
      <div className="notif-mode-selector">
        <button
          onClick={() => setMode("ajouter")}
          className={`notif-mode-btn ${mode === "ajouter" ? 'notif-mode-active' : ''}`}
        >
          <FiPlus className="notif-btn-icon" />
          Ajouter une notification
        </button>
        <button
          onClick={() => setMode("afficher")}
          className={`notif-mode-btn ${mode === "afficher" ? 'notif-mode-active' : ''}`}
        >
          <FiEye className="notif-btn-icon" />
          Voir les notifications
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="notif-form-container">
        {mode === "ajouter" && (
          <div className="notif-form-group">
            <label className="notif-form-label">Message :</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="notif-form-textarea"
              rows={4}
              placeholder="Entrez votre message..."
            />
          </div>
        )}

        <div className="notif-form-group">
          <label className="notif-form-label">Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="notif-form-input"
            placeholder="Entrez l'email"
          />
        </div>

        <button
          type="submit"
          className="notif-submit-btn"
        >
          {mode === "ajouter" ? (
            <>
              <FiPlus className="notif-btn-icon" />
              Ajouter
            </>
          ) : (
            <>
              <FiEye className="notif-btn-icon" />
              Afficher
            </>
          )}
        </button>
      </form>

      {/* Notifications list */}
      {mode === "afficher" && notifications.length > 0 && (
        <div className="notif-list-container">
          <h2 className="notif-list-title">Notifications</h2>
          
          {notifications.map(notification => (
            <div key={notification.id} className="notif-card">
              {editingId === notification.id ? (
                <div className="notif-edit-container">
                  <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="notif-edit-textarea"
                    rows={3}
                  />
                  <div className="notif-edit-actions">
                    <button
                      onClick={() => handleModify(notification.id)}
                      className="notif-edit-submit"
                    >
                      <FiSend className="notif-btn-icon" />
                      Envoyer
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="notif-edit-cancel"
                    >
                      <FiX className="notif-btn-icon" />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="notif-card-message">{notification.message}</p>
                  <p className="notif-card-date">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                  <div className="notif-card-actions">
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="notif-action-btn notif-action-delete"
                      title="Supprimer"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(notification.id);
                        setEditMessage(notification.message);
                      }}
                      className="notif-action-btn notif-action-edit"
                      title="Modifier"
                    >
                      <FiEdit />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {mode === "afficher" && notifications.length === 0 && formData.email && (
        <p className="notif-empty-message">Aucune notification trouvée pour cet email.</p>
      )}
    </div>
  );
}