import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import '../src/styleCss/Navbar.css'
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/fetchapi";

export function Navbar() {
    const { user } = useContext(AuthContext);
    console.log(user)
    const email = user.email;
   
    const navigate = useNavigate()

    const ShowAlerts = async ()=>{
      const data = await apiRequest(`/Alerts/${email}`, 'GET')
      navigate('User-Alerts', { state: { alerts: data } });
    }

    const ShowNotifications = async ()=>{
      const data = await apiRequest(`/Notifications/${email}`, 'GET')
      navigate('User-notifications', {state: {notifications : data}})
    }


  
    return (
      <div className="Navbar-container">
        <div className="something">
          <div  style={{ cursor: "pointer" }}>
            <img
              src="https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
              alt="something"
            />
            <h3 style={{color: 'black'}}>{user.prenom} {user.nom}</h3>
          </div>
          <span onClick={ShowAlerts}>🚨</span>
          <br /><br />
          <span onClick={ShowNotifications}>🔔</span>
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', gap: '2px' , marginRight: '50px'}}>
                <span style={{ color: '#1abc9c' }}>S</span>
                <span style={{ color: '#16a085' }}>m</span>
                <span style={{ color: '#3498db' }}>a</span>
                <span style={{ color: '#2980b9' }}>r</span>
                <span style={{ color: '#9b59b6' }}>t</span>
                <span style={{ color: '#f39c12' }}>M</span>
                <span style={{ color: '#e67e22' }}>o</span>
                <span style={{ color: '#e74c3c' }}>o</span>
                <span style={{ color: '#c0392b' }}>d</span>
                <span style={{ color: '#2ecc71' }}>l</span>
                <span style={{ color: '#27ae60' }}>e</span>
        </div>

      </div>
    );
  }
  