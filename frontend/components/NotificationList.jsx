import { apiRequest } from '../utils/fetchapi';
import { useState } from 'react';

export default function NotificationList({ notificationsData, setNotificationsData }) {
    const [isModify, setIsModify] = useState(false);
    const [message, setMessage] = useState('');

    const handleDelete = async (id) => {
        try {
            const data = await apiRequest(`/Notifications/${id}`, 'DELETE');
            alert(data.message);
            setNotificationsData(prevData => prevData.filter(notification => notification.id !== id));
        } catch (error) {
            alert(error);
        }
    };

    const handleModify = async (id) => {
        try {
            const data = await apiRequest(`/Notifications/${id}`, 'PUT', { message });
            console.log(message)
            alert(data.message);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            {notificationsData.map(notification => (
                <div key={notification.id}>
                    <hr />
                    <div>
                        <p>{notification.message}</p>
                    </div>
                    <hr />
                    <div>
                        <p>{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                        <button onClick={() => handleDelete(notification.id)}>🗑️</button>
                        <button onClick={() => setIsModify(!isModify)}>✏️</button>
                    </div>

                    {isModify && (
                        <>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            /><br />

                            <button onClick={() => handleModify(notification.id)}>submit</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
