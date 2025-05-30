

import { useState } from "react"
import { apiRequest } from "../utils/fetchapi"
import { useNavigate , Link} from "react-router-dom"

import '../src/styleCss/Login.css'



export function Register(){
    const [prenom, setPrenom] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nom, setNom] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        

        try {
            const data = await apiRequest("/register", "POST", {nom: nom, prenom: prenom,email:  email, password: password})
            alert(data.message)
            navigate('/login')

        }catch(err){
            alert(err.message)

        }

    



    }
    





    return (
        <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1 className="form-title">Inscription</h1>
          <div className="form-box">

            
            <label htmlFor="nom">Entrer votre nom :</label><br />
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={e => setNom(e.target.value)}
              required
              className="form-input"
            /><br /><br />
            




            <label htmlFor="prenom">Entrer votre prenom :</label><br />
            <input
              type="text"
              id="prenom"
              value={prenom}
              onChange={e => setPrenom(e.target.value)}
              required
              className="form-input"
            /><br /><br />
  
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
  
            <button type="submit" className="form-button">S'inscrire</button>
          </div>
  
          <p className="form-footer">
            Déjà un compte ?{' '}
            <Link to="/login" className="form-link">
              Connectez-vous ici
            </Link>
          </p>
        </form>
      </div>
  


    )
}