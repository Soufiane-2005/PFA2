import React, { useState } from 'react';
import '../../src/styleCss/Modules.css';
import { apiRequest } from '../../utils/fetchapi';

export function Modules() {
    const [nom, setNom] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{

            console.log(nom)

            const data = await apiRequest('/Modules', 'POST', {nom})
            alert(data.message)



        }catch(err){
            alert(err)
        }

        
        
    };

    return (
        <div className="modules-container">
            <h2>Ajouter un Module</h2>
            <form onSubmit={handleSubmit} className="module-form">
                <label htmlFor="nom">Nom du module :</label>
                <input
                    type="text"
                    id="nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                />
                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
}
