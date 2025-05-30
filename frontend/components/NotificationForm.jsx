import { useState } from 'react';
import { apiRequest } from '../utils/fetchapi';

export default function NotificationForm({ mode, setNotificationsData }) {
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === "ajouter") {
            if (!message || !email) {
                alert("Veuillez remplir tous les champs !");
                return;
            }
            try {
                const data = await apiRequest('/Notifications', 'POST', { message, email });
                alert(data.message);
                setMessage("");
                setEmail("");
            } catch (error) {
                setMessage("");
                setEmail("");
                alert(error);
            }

        } else if (mode === "afficher") {
            try {
                const data = await apiRequest(`/Notifications/${email}`, 'GET');
                setNotificationsData(data);
            } catch (error) {
                alert(error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {mode === "ajouter" && (
                <>
                    <label>Message :</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </>
            )}

            <label>Email :</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <button type="submit">{mode === "ajouter" ? "Ajouter" : "Afficher"}</button>
        </form>
    );
}
