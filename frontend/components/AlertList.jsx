

import '../src/styleCss/AlertList.css'
import { apiRequest } from '../utils/fetchapi';
import { useState } from 'react';


export default function AlertList({ alertsData, setAlertsData }) {
    const [isModify, setIsModify] = useState(false)
    const [contenu, setContenu] = useState('')
    const [titre, setTitre] = useState('')

    const handleDelete = async (id) => {
        
        try {
            const data = await apiRequest(`/Alerts/${id}`, 'DELETE')
            alert(data.message)
            setAlertsData(prevData => prevData.filter(alert => alert.id !== id));
        
            
        } catch (error) {
            alert(error)
            
            
        }
    };


    const handleModify = async (id) => {
        
        try {
            const data = await apiRequest(`/Alerts/${id}`, 'PUT' , {titre, contenu})
            alert(data.message)
            
        } catch (error) {
            alert(error)
        }

        // la logique de modification.
    };
    





    return (
        <div className="alerts-list">
            {alertsData.map(alert => (
                <div className="alert-item" key={alert.id}>
                    <div className='titre'>
                        <h3>{alert.titre}</h3>
                    </div>
                    <hr />
                    <div className='contenu'>
                        <p>{alert.contenu}</p>
                    </div>
                    <hr />
                    
                    <div className='date'>
                        <p className="alert-date">{new Date(alert.created_at).toLocaleString()}</p>
                    </div>
                    <div className='btnSM'>
                        <button
                            
                            onClick={() => handleDelete(alert.id)}
                            >
                            🗑️
                        </button>
                        
                        <button
                        onClick={()=>setIsModify(!isModify)}
                        >
                        ✏️
                        </button>
                        

                        


                        
                        
                        

                    </div>
                    {isModify &&
                        (
                            <>
                            <input 
                                type="text" 
                                value={titre} 
                                onChange={(e) => setTitre(e.target.value)} 
                                placeholder="Modifier le titre de l'alerte"
                            /><br />

                            <textarea value={contenu} onChange={(e) => setContenu(e.target.value)} /><br></br>
                            <button onClick={() => handleModify(alert.id)} > submit</button>
                            </>
                            

                        ) 
                        }
                   
                </div>
            ))}
        </div>
    );
}
