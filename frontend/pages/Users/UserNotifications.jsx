import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export function UserNotifications() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { notifications } = location.state || {}; // Récupère les alertes depuis le state de navigate

  return (
    <div>
      <h1>Notifications for {user.prenom} {user.nom}</h1>
      {notifications.length!=0 ? (

        <>
          {notifications.map(notification => (
            <>
            <hr />
            <div>
                <h3>{notification.message}</h3>
            </div>
                         
            <div>
                <p>{new Date(notification.created_at).toLocaleString()}</p>
            </div>
            <hr />
            </>         
          ))}
        </>
      ) : (
        <p>No notificatinos available.</p>
      )}
    </div>
  );
}
