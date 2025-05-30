
const connection = require('../config/db')


const findIdByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM users WHERE email = ?';
    
        connection.query(query, [email], (err, res) => {
            if (err) {
                return reject("Erreur lors de la recherche de l'utilisateur.");
            }

            if (res.length === 0) {
                return resolve("Il n'y a aucun utilisateur avec cet email.");
            }

            return resolve(res[0].id);
        });
    });
};


module.exports = findIdByEmail;