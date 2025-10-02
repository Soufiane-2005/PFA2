import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserShield, faClock } from '@fortawesome/free-solid-svg-icons';
import '../../src/styleCss/UserAlerts.css'; // Assuming you'll use the same CSS file
import { apiRequest } from "../../utils/fetchapi";


export function UserNotifications() {
  const {user} = useContext(AuthContext)
  const location = useLocation();
  const { notifications = [] } = location.state || {};


  const luNotification = async ()=>{
    const response = await apiRequest(`/Notifications/mark-as-read/${user.userId}`, "PUT")
    console.log(response)
  }

  useEffect(()=>{
    luNotification()
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
            <FontAwesomeIcon icon={faBell} className="header-icon" />
            Mes Notifications
            <span className="alerts-count">{notifications.length}</span>
          </h1>
        </div>

        <div className="alerts-list-container">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div className="alert-card" key={index} data-priority={notification.priority || 'medium'}>
                <div className="alert-card-content">
                  <div className="alert-sender">
                    <div className="sender-avatar">
                      <img src="/FB_IMG_17028196037704662.jpg" alt="Sender" />
                    </div>
                    <div className="sender-info">
                      <h3>
                        <FontAwesomeIcon icon={faUserShield} /> Admin
                      </h3>
                      <p className="alert-date">
                        <FontAwesomeIcon icon={faClock} /> {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="alert-content">
                    
                    <p className="alert-message">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-alerts">
              <div className="no-alerts-illustration">
                <div className="empty-state-icon">🔔</div>
                <h3>Aucune notification pour le moment</h3>
                <p>Vous serez notifié quand de nouvelles notifications arriveront</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}