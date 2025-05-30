import { useContext } from 'react'
import '../src/styleCss/sidebar.css'
import { AuthContext } from '../context/AuthContext'
import {apiRequest} from '../utils/fetchapi'
import { useNavigate, Link } from "react-router-dom"



export function Sidebar(){
    const {user} = useContext(AuthContext)
    const navigate = useNavigate()
 

    
    const handleLogout = async ()=>{
        try{

            const data = await apiRequest('/logout', 'POST')
            alert(data.message)
            navigate('/login')

        }catch(err){
            alert(err.message)

        }
        
        
    }

    const handleRedirect = (path) => {
        navigate(path);
    };



    return (
        <div className='sideBarAdmin'>
            <div>
                <div style={{ textAlign: 'center' }}>{user.role=='admin'? <img 
                        src="/FB_IMG_17028196037704662.jpg" 
                  
                        className="profile-img"
                    />: <img 
                    src="https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg" 
              
                    className="profile-img"
                />

                    }
                    
                    <h3>Prenom: {user.prenom} </h3>
                    <h3>Nom: {user.nom}</h3>
                    <h3>Email: {user.email}</h3>
                    <h3>Numéro de téléphone: {user.numero_tele}</h3>
                </div>
                <div className="button-container">
                    <button onClick={()=>handleRedirect("modifier-info")}>Modifier les infos</button>
                    <button onClick={handleLogout}>Se déconnecter</button>
                </div>
                
            </div>
        </div>
    )
}