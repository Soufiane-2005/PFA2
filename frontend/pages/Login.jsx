

import {useContext, useState } from "react"
import { apiRequest } from "../utils/fetchapi"
import { useNavigate , Link} from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Cookies               from "js-cookie";
import '../src/styleCss/Login.css'





export function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const {loadUser} = useContext(AuthContext)


    const handleSubmit = async (e)=>{
        e.preventDefault()

        

        try {
            const data = await apiRequest("/Login", "POST", {email, password})
            alert(data.message)


              await loadUser()



            if (data.role == 'admin'){
                
               
                console.log("eiowry")
                navigate('/Admin')
            }else if(data.role == 'etudiant' || data.role == 'enseignant'){
                console.log('owefn')
                navigate('/dashboard')
            }
            


        }catch(err){
            alert(err.message)

        }

    



    }

   






    return (
      <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1 className="form-title">Login</h1>
        <div className="form-box">
          <label htmlFor="email">Entrer votre email :</label><br />
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="form-input"
          /><br /><br />

          <label htmlFor="password">Entrer votre mot de passe :</label><br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="form-input"
          /><br /><br />

          <button type="submit" className="form-button">Se connecter</button>
        </div>

        <p className="form-footer">
          Pas de compte ?{' '}
          <Link to="/" className="form-link">
            Inscrivez‑vous ici
          </Link>
        </p>
      </form>
    </div>

    )
}