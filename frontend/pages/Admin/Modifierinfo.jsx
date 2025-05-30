import { useState } from 'react';
import '../../src/styleCss/modifierinfo.css';
import { apiRequest } from '../../utils/fetchapi';


export function Modifierinfo() {
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [numero_telephone, setNumeroTelephone] = useState('');

    const handlSubmit = async (e) => {
        e.preventDefault(); // empêcher le rechargement de la page

        const body = {
            prenom,
            nom,
            email,
            numero_telephone,
        };

        try {
            const data = await apiRequest('/modifier-info', 'PUT', body);
            alert(data.message)            
        } catch (error) {
            alert(error); 
        }
    };

    return (
        <div className="modifier-container">
            <h1>Modifier vos informations</h1>
            <form className="modifier-form" onSubmit={handlSubmit}>
                <label>Prénom:</label>
                <input
                    type="text"
                    name="prenom"
                    placeholder="Entrez votre prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                />

                <label>Nom:</label>
                <input
                    type="text"
                    name="nom"
                    placeholder="Entrez votre nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Numéro de téléphone:</label>
                <input
                    type="text"
                    name="telephone"
                    placeholder="Entrez votre numéro de téléphone"
                    value={numero_telephone}
                    onChange={(e) => setNumeroTelephone(e.target.value)}
                />

                <button type="submit">Modifier</button>
            </form>
        </div>
    );
}
