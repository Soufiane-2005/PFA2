import {useContext, useState } from "react"
import { apiRequest } from "../utils/fetchapi"
import { useNavigate , Link} from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Cookies from "js-cookie";
import '../src/styleCss/Login.css'
import { FaGraduationCap } from "react-icons/fa";

export function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const {loadUser} = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const data = await apiRequest("/Login", "POST", {email, password})
            alert(data.message)
            await loadUser()

            if (data.role == 'admin') {
                navigate('/Admin')
            } else if(data.role == 'etudiant' || data.role == 'enseignant') {
                navigate('/dashboard')
            }
        } catch(err) {
            alert(err.message)
        }
    }


    

    return (
        <div className="login-page-container">
            <div className="login-image-section">
                <div className="login-image-overlay"></div>
                <div className="login-image-content">
                    <div className="platform-logo">
                        <FaGraduationCap></FaGraduationCap>
                        <span>SmartMoodle</span>
                       
                    </div>
                    <h2 className="hero-title">L'Excellence Académique Intelligente</h2>
                    <p className="hero-subtitle">Votre passerelle vers une éducation adaptative et transformative</p>
                    <div className="animated-dots">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="dot" style={{ animationDelay: `${i * 0.1}s` }}></div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="login-form-section">
                <div className="login-form-wrapper">
                    <div className="form-header">
                        <svg className="form-icon" viewBox="0 0 24 24">
                            <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.115l-.78 2.77 3.116-1.65c.88.275 1.823.425 2.775.425 4.97 0 9-3.186 9-7.115C21 6.186 16.97 3 12 3z"/>
                        </svg>
                        <h1 className="form-title">Accédez à votre espace</h1>
                        <p className="form-subtitle">Entrez vos identifiants pour continuer</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="elegant-form">
                        <div className="form-group">
                            <div className="input-container">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="elegant-input"
                                    placeholder="Adresse email"
                                />
                                <div className="input-border"></div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-container">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="elegant-input"
                                    placeholder="Mot de passe"
                                />
                                <div className="input-border"></div>
                            </div>
                        </div>

                        <button type="submit" className="elegant-button">
                            <span>Connexion</span>
                            <div className="button-hover-effect"></div>
                        </button>
                        
                        <p className="form-footer">
                            Première visite sur <strong>SmartMoodle</strong> ?{' '}
                            <Link to="/" className="elegant-link">
                                Créez votre compte
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}