import { useState, useRef } from 'react';
import '../../src/styleCss/modifierinfo.css';
import { apiRequest } from '../../utils/fetchapi';
import { FiUser, FiMail, FiPhone, FiSave, FiCheckCircle } from 'react-icons/fi';

export function Modifierinfo() {
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        numero_telephone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const formRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await apiRequest('/modifier-info', 'PUT', formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            alert(error.message || "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="profile-edit">
            <div className="edit-container">
                <header className="edit-header">
                    <h1>Modifier votre profil</h1>
                    <p>Mettez à jour vos informations personnelles</p>
                </header>

                <form ref={formRef} onSubmit={handleSubmit} className="edit-form">
                    <div className="input-group">
                        <label className="input-label">
                            <FiUser className="input-icon" />
                            Prénom
                        </label>
                        <input
                            type="text"
                            name="prenom"
                            placeholder="Entrez votre prénom"
                            value={formData.prenom}
                            onChange={handleChange}
                            className="text-input"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <FiUser className="input-icon" />
                            Nom
                        </label>
                        <input
                            type="text"
                            name="nom"
                            placeholder="Entrez votre nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="text-input"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <FiMail className="input-icon" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Entrez votre email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="text-input"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            <FiPhone className="input-icon" />
                            Téléphone
                        </label>
                        <input
                            type="text"
                            name="numero_telephone"
                            placeholder="Format : 0712340815"
                            value={formData.numero_telephone}
                            onChange={handleChange}
                            className="text-input"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="btn-spinner"></span>
                        ) : (
                            <>
                                <FiSave className="btn-icon" />
                                Sauvegarder
                            </>
                        )}
                    </button>
                </form>

                {success && (
                    <div className="success-message">
                        <FiCheckCircle className="success-icon" />
                        <span>Vos modifications ont été enregistrées</span>
                    </div>
                )}
            </div>
        </div>
    );
}