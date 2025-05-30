import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import '../../src/styleCss/UserAlerts.css'

export function UserAlerts() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { alerts } = location.state || {}; // Récupère les alertes depuis le state de navigate

  return (
    <div>
      <h1>Alerts for {user.prenom} {user.nom}</h1>
      <div className="container"></div>
      {alerts.length!=0 ? (

        <>
          {alerts.map(alert => (
            
            <div className="alert">
              <div className="envoyeur">
              
              <img src="/FB_IMG_17028196037704662.jpg"  alt="" />
              <h3>Admin</h3>


              </div>
            <div>
                <h3>{alert.titre}</h3>
            </div>
            
            <div>
                <p>{alert.contenu}</p>
            </div>
                         
            <div>
                <p>{new Date(alert.created_at).toLocaleString()}</p>
            </div>
            </div>
                    
          ))}
        </>
      ) : (
        <p>No alerts available.</p>
      )}
    </div>
  );
}
