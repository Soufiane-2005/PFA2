
const jwt = require('jsonwebtoken')
require('dotenv').config()



const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token
  
    if (!token) {
      return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }

  
    try {
      const decoded = jwt.verify(token, process.env.secret_key); // Remplace par ta vraie clé secrète
      // il nous donne les valeurs qu'on a vont inserer dans jwt.sign(.....)
      req.user = decoded; // On ajoute l'utilisateur à la requête
      
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Token invalide.' });
    }
  };

  
  
module.exports = isAuthenticated