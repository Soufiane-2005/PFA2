import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faUserShield, faClock} from '@fortawesome/free-solid-svg-icons';
import '../../src/styleCss/UserAlerts.css';
import { apiRequest } from "../../utils/fetchapi";



export function UserAlerts() {
  const {user} = useContext(AuthContext)
  const location = useLocation();
  const { alerts = [] } = location.state || {};

   const luAlerts = async ()=>{
      const response = await apiRequest(`/Alerts/mark-as-read/${user.userId}`, "PUT")
      console.log(response)
    }
  
    useEffect(()=>{
      luAlerts()
    }, [])

  useEffect(() => {
    document.body.classList.add('alerts-page');
    return () => {
      document.body.classList.remove('alerts-page');
    };
  }, []);

  return (
    <div className="alerts-page-container">
      <div className="interactive-background">
        <div className="particles"></div>
        <div className="gradient-overlay"></div>
      </div>
      
      <div className="alerts-glass-container">
        <div className="alerts-header">
          <h1>
            <FontAwesomeIcon icon={faExclamationCircle} className="header-icon" />
            Mes Alertes
            <span className="alerts-count">{alerts.length}</span>
          </h1>
        </div>

        <div className="alerts-list-container">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <div className="alert-card" key={index} data-priority={alert.priority || 'medium'}>
                <div className="alert-card-content">
                  <div className="alert-sender">
                    <div className="sender-avatar">
                      <img src="/FB_IMG_17028196037704662.jpg" alt="Admin" />
                    </div>
                    <div className="sender-info">
                      <h3>
                        <FontAwesomeIcon icon={faUserShield} /> Admin
                      </h3>
                      <p className="alert-date">
                        <FontAwesomeIcon icon={faClock} /> {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                   
                      
                  </div>
                  
                  <div className="alert-content">
                    <h3 className="alert-title">{alert.titre}</h3>
                    <p className="alert-message">{alert.contenu}</p>
                  </div>
                  
                  <div className="alert-actions">
                    
                   
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-alerts">
              <div className="no-alerts-illustration">
                <div className="empty-state-icon">📭</div>
                <h3>Aucune alerte pour le moment</h3>
                <p>Vous serez notifié quand de nouvelles alertes arriveront</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}