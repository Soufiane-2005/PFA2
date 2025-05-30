import { useState } from 'react';
import '../src/styleCss/AlertForm.css'
import { apiRequest } from '../utils/fetchapi';

export default function AlertForm({ mode , setAlertsData}) {
    const [titre, setTitre] = useState("");
    const [contenu, setContenu] = useState("");
    const [email, setEmail] = useState("");
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === "ajouter") {
            if (!titre || !contenu || !email) {
                alert("Veuillez remplir tous les champs !");
                return;
            }
            try {
                const data = await apiRequest('/Alerts', 'POST', {titre, contenu, email})
                alert(data.message);
                setTitre("");
                setContenu("");
                setEmail("")
                
                
                
                
            } catch (error) {
                setTitre("");
                setContenu("");
                setEmail("")
                alert(error)
            }
            
            
            // la logique d'ajouter un 
            
            

           
        } else if (mode === "afficher") {

            //la logique d'afficher un alert
            try {
                const data = await apiRequest(`/Alerts/${email}`, 'GET')
                setAlertsData(data)
                
            } catch (error) {
                alert(error)
            }
            
            
            
            
            
        }
    };

    return (
        <form className="alert-form" onSubmit={handleSubmit}>
            {mode === "ajouter" && (
                <>
                    <label>Titre :</label>
                    <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} />
                    <label>Contenu :</label>
                    <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} />
                </>
            )}

            <label>Email :</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <button type="submit">{mode === "ajouter" ? "Ajouter" : "Afficher"}</button>
        </form>
    );
}
