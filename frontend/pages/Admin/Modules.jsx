import React, { useState } from 'react';
import { apiRequest } from '../../utils/fetchapi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../../src/styleCss/Modules.css';

export function Modules() {
    const [nom, setNom] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validation
        if (nom.includes('/')) {
            setError("Le nom du module ne peut pas contenir le caractère '/'");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const data = await apiRequest('/Modules', 'POST', { nom });
            alert(data.message);
            setSuccess(true);
            setNom('');
            
            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert(err);
            setError(err.message || "Une erreur s'est produite");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setNom(e.target.value);
        setError('');
    };

    return (
        <div className="module-page">
            <div className="module-glass-container">
                <div className="module-form-header">
                    <FontAwesomeIcon icon={faBookOpen} className="form-icon" />
                    <h1>Ajouter un Nouveau Module</h1>
                    <p>Remplissez les détails pour créer un nouveau module d'enseignement</p>
                </div>

                <form onSubmit={handleSubmit} className="module-elegant-form">
                    <div className="module-form-group">
                        <label htmlFor="nom">
                            <span>Nom du Module</span>
                            <span className="required-asterisk">*</span>
                        </label>
                        <input
                            type="text"
                            id="nom"
                            value={nom}
                            onChange={handleChange}
                            className="module-glass-input"
                            placeholder="Ex: Mathématiques Avancées"
                            required
                            pattern="[^/]*"
                            title="Le caractère '/' n'est pas autorisé"
                        />
                        {error && <div className="module-error-message">{error}</div>}
                    </div>

                    <div className="module-form-actions">
                        <button 
                            type="submit" 
                            className="module-submit-btn"
                            disabled={isSubmitting || !nom.trim()}
                        >
                            {isSubmitting ? (
                                <span className="module-spinner"></span>
                            ) : (
                                <>
                                    <span>Créer le Module</span>
                                    <FontAwesomeIcon icon={faCheckCircle} className="btn-icon" />
                                </>
                            )}
                        </button>
                    </div>

                    {success && (
                        <div className="module-success-message">
                            <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                            <span>Module créé avec succès!</span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}