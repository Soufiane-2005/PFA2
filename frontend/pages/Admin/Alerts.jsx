import { useState } from 'react';
import AlertForm from '../../components/AlertForm';
import AlertList from '../../components/AlertList';
import '../../src/styleCss/alerts.css';

export function Alerts() {
    const [mode, setMode] = useState("ajouter"); // "ajouter" ou "afficher"
   
    const [alertsData, setAlertsData] = useState([]);
    

    return (
        <div className="alerts-page">
            <h1 className="alerts-title">Alerts</h1>
            <div className="mode-buttons">
                    <button onClick={() => setMode("ajouter")}>Ajout</button>
                    <button onClick={() => setMode("afficher")}>Affichage</button>
            </div>


            <div className="alerts-form-container" >
                
                {mode && (
                    <AlertForm
                        mode={mode}
                        setAlertsData={setAlertsData}
                        
                    />
                )}
                {mode === "afficher" && alertsData.length > 0 && (
                <AlertList alertsData={alertsData} setAlertsData={setAlertsData}/>
            )}
            </div>

            
        </div>
    );
}
