import { useState } from 'react';
import '../../src/styleCss/modifierinfo.css';
import { apiRequest } from '../../utils/fetchapi';

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

            } else if (action === 'modifier') {
                const data = await apiRequest('/ModifierEnseignant', 'PUT', {
                    nom,
                    prenom,
                    ancienEmail,
                    email
                });
                alert(data.message);

            } else if (action === 'supprimer') {
                const data = await apiRequest(`/SupprimerEnseignant/${email}`, 'DELETE');
                alert(data.message);
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="modifier-container">
            <h1>Ajouter, Modifier, Supprimer enseignant</h1>
            <form className="modifier-form" onSubmit={handleSubmit}>

                <label>Action :</label>
                <select value={action} onChange={(e) => setAction(e.target.value)}>
                    <option value="ajouter">Ajouter</option>
                    <option value="modifier">Modifier</option>
                    <option value="supprimer">Supprimer</option>
                </select>

                {action === 'ajouter' && (
                    <>
                        <label>Nom: </label>
                        <input
                            type="text"
                            value={nom}
                            onChange={(e)=>setNom(e.target.value)}
                        />

                        <label>Prénom :</label>
                        <input
                            type="text"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required
                        />

                        <label>Email :</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Mot de passe :</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </>
                )}

                {action === 'modifier' && (
                    <>
                        <label>Nom :</label>
                        <input
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                        />

                        <label>Prénom :</label>
                        <input
                            type="text"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required
                        />

                        <label>Email précédent :</label>
                        <input
                            type="email"
                            value={ancienEmail}
                            onChange={(e) => setAncienEmail(e.target.value)}
                            required
                        />

                        <label>Nouvel email :</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </>
                )}

                {action === 'supprimer' && (
                    <>
                        <label>Email :</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </>
                )}

                <button type="submit">Soumettre</button>
            </form>
        </div>
    );
}
