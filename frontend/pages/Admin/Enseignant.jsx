import { useState } from 'react';
import { apiRequest } from '../../utils/fetchapi';
import '../../src/styleCss/Enseignant.css'

export function Enseignant() {
    const [action, setAction] = useState('ajouter');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [ancienEmail, setAncienEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (action === 'ajouter') {
                const data = await apiRequest('/AjouterEnseignant', 'POST', {
                    nom,
                    prenom,
                    email,
                    password
                });
                alert(data.message);
                // Réinitialiser le formulaire après soumission
                if (data.success) {
                    setNom('');
                    setPrenom('');
                    setEmail('');
                    setPassword('');
                }

            } else if (action === 'modifier') {
                const data = await apiRequest('/ModifierEnseignant', 'PUT', {
                    nom,
                    prenom,
                    ancienEmail,
                    email
                });
                alert(data.message);
                if (data.success) {
                    setNom('');
                    setPrenom('');
                    setAncienEmail('');
                    setEmail('');
                }

            } else if (action === 'supprimer') {
                console.log("hello mr soufiane")
                const data = await apiRequest(`/SupprimerEnseignant/${email}`, 'DELETE');
                console.log(data)
                alert(data.message);
                if (data.success) {
                    setEmail('');
                }
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="modifier-container">
            <h1>Gestion des Enseignants</h1>
            <form className="modifier-form" onSubmit={handleSubmit}>
                <div>
                    <label>Action :</label>
                    <select 
                        value={action} 
                        onChange={(e) => setAction(e.target.value)}
                        className="action-select"
                    >
                        <option value="ajouter">Ajouter un enseignant</option>
                        <option value="modifier">Modifier un enseignant</option>
                        <option value="supprimer">Supprimer un enseignant</option>
                    </select>
                </div>

                <div className={`action-section action-transition`}>
                    {action === 'ajouter' && (
                        <>
                            <div>
                                <label>Nom: </label>
                                <input
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    placeholder="Entrez le nom de famille"
                                />
                            </div>

                            <div>
                                <label>Prénom :</label>
                                <input
                                    type="text"
                                    value={prenom}
                                    onChange={(e) => setPrenom(e.target.value)}
                                    required
                                    placeholder="Entrez le prénom"
                                />
                            </div>

                            <div>
                                <label>Email :</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="exemple@institution.edu"
                                />
                            </div>

                            <div>
                                <label>Mot de passe :</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Créez un mot de passe"
                                />
                            </div>
                        </>
                    )}

                    {action === 'modifier' && (
                        <>
                            <div>
                                <label>Nom :</label>
                                <input
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    required
                                    placeholder="Nouveau nom"
                                />
                            </div>

                            <div>
                                <label>Prénom :</label>
                                <input
                                    type="text"
                                    value={prenom}
                                    onChange={(e) => setPrenom(e.target.value)}
                                    required
                                    placeholder="Nouveau prénom"
                                />
                            </div>

                            <div>
                                <label>Email précédent :</label>
                                <input
                                    type="email"
                                    value={ancienEmail}
                                    onChange={(e) => setAncienEmail(e.target.value)}
                                    required
                                    placeholder="Email actuel de l'enseignant"
                                />
                            </div>

                            <div>
                                <label>Nouvel email :</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Nouvel email"
                                />
                            </div>
                        </>
                    )}

                    {action === 'supprimer' && (
                        <div>
                            <label>Email de l'enseignant à supprimer :</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email de l'enseignant"
                            />
                        </div>
                    )}
                </div>

                <button type="submit">
                    {action === 'ajouter' && 'Ajouter'}
                    {action === 'modifier' && 'Modifier'}
                    {action === 'supprimer' && 'Supprimer'}
                </button>
            </form>
        </div>
    );
}