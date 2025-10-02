import { useState } from "react"
import { apiRequest } from "../utils/fetchapi"
import { useNavigate, Link } from "react-router-dom"
import '../src/styleCss/Login.css'

export function Register() {
    const [prenom, setPrenom] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nom, setNom] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const data = await apiRequest("/register", "POST", {
                nom: nom, 
                prenom: prenom,
                email: email, 
                password: password
            })
            alert(data.message)
            navigate('/login')
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
                        <span className="logo-letter">S</span>
                        <span className="logo-letter">m</span>
                        <span className="logo-letter">a</span>
                        <span className="logo-letter">r</span>
                        <span className="logo-letter">t</span>
                        <span className="logo-space"></span>
                        <span className="logo-letter">M</span>
                        <span className="logo-letter">o</span>
                        <span className="logo-letter">o</span>
                        <span className="logo-letter">d</span>
                        <span className="logo-letter">l</span>
                        <span className="logo-letter">e</span>
                    </div>
                    <h2 className="hero-title">Rejoignez Notre Communauté Éducative</h2>
                    <p className="hero-subtitle">Votre première étape vers un apprentissage personnalisé</p>
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
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <h1 className="form-title">Créez votre compte</h1>
                        <p className="form-subtitle">Remplissez les informations requises</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="elegant-form">
                        <div className="form-group">
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="nom"
                                    value={nom}
                                    onChange={e => setNom(e.target.value)}
                                    required
                                    className="elegant-input"
                                    placeholder="Nom"
                                />
                                <div className="input-border"></div>
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-container">
                                <input
                                    type="text"
                                    id="prenom"
                                    value={prenom}
                                    onChange={e => setPrenom(e.target.value)}
                                    required
                                    className="elegant-input"
                                    placeholder="Prénom"
                                />
                                <div className="input-border"></div>
                            </div>
                        </div>

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
                            <span>S'inscrire</span>
                            <div className="button-hover-effect"></div>
                        </button>
                        
                        <p className="form-footer">
                            Vous avez déjà un compte ?{' '}
                            <Link to="/login" className="elegant-link">
                                Connectez-vous
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}