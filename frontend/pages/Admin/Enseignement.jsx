import '../../src/styleCss/Enseignement.css';
import { useState, useEffect } from 'react';
import { apiRequest } from '../../utils/fetchapi';

export function Enseignement() {
    const [enseignants, setEnseignants] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedModule, setSelectedModule] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const enseignantsData = await apiRequest('/Enseignement', 'GET');
                setEnseignants(enseignantsData);

                const modulesData = await apiRequest('/Modules', 'GET');
                setModules(modulesData);
            } catch (error) {
                alert('Erreur lors du chargement des données : ' + error.message);
            }
        }

        fetchData();
    }, []);

   const handleSubmit = async (e) => {
    e.preventDefault();

    const enseignant = enseignants.find((ens) => ens.email === selectedEmail);
    const module = modules.find((mod) => mod.nom === selectedModule);

    if (!enseignant || !module) {
        alert("Erreur : enseignant ou module introuvable.");
        return;
    }

    const payload = {
        user_id: enseignant.id,
        module_id: module.id
    };

    try {
        await apiRequest('/Enseignement', 'POST', payload);
        alert("Enseignant assigné au module avec succès !");
    } catch (error) {
        alert("Erreur lors de l'assignation : " + error.message);
    }
};


    return (
        <div className="enseignement-container">
            <h2>Assigner un enseignant à un module</h2>
            <form onSubmit={handleSubmit} className="enseignement-form">
                <div className="form-group">
                    <label htmlFor="enseignant">Email de l'enseignant :</label>
                    <select
                        id="enseignant"
                        value={selectedEmail}
                        onChange={(e) => setSelectedEmail(e.target.value)}
                        required
                    >
                        <option value="">-- Sélectionner un enseignant --</option>
                        {enseignants.map((ens) => (
                            <option key={ens.id} value={ens.email}>
                                {ens.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="module">Nom du module :</label>
                    <select
                        id="module"
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                        required
                    >
                        <option value="">-- Sélectionner un module --</option>
                        {modules.map((mod) => (
                            <option key={mod.id} value={mod.nom}>
                                {mod.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit"
                onClick={handleSubmit}>Assigner</button>
            </form>
        </div>
    );
}
