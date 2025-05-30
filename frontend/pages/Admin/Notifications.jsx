import { useState } from 'react';
import NotificationForm from '../../components/NotificationForm';
import NotificationList from '../../components/NotificationList';

export function Notifications() {
    const [mode, setMode] = useState("ajouter"); // "ajouter" ou "afficher"
    const [notificationsData, setNotificationsData] = useState([]);

    return (
        <div>
            <h1>Notification</h1>
            
            <div>
                <button onClick={() => setMode("ajouter")}>Ajout</button>
                <button onClick={() => setMode("afficher")}>Affichage</button>
            </div>

            <div>
                {mode && (
                    <NotificationForm
                        mode={mode}
                        setNotificationsData={setNotificationsData}
                    />
                )}
                {mode === "afficher" && notificationsData.length > 0 && (
                    <NotificationList
                        notificationsData={notificationsData}
                        setNotificationsData={setNotificationsData}
                    />
                )}
            </div>
        </div>
    );
}
