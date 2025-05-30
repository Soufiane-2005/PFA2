const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const connection = require('../config/db')
const express = require('express')
const isAuthenticated = require('../middlewares/auth')
const router = express.Router()

require('dotenv').config()

router.post('/register', async (req, res)=>{
    const {nom, prenom, email, password} = req.body
    const query = 'INSERT INTO users (nom, prenom, email, password, role) values (?,?,?,?,?)'

    const hashpassword = await bcrypt.hash(password, 10)

    connection.query(query, [nom, prenom, email, hashpassword, "etudiant"], (err, result)=>{
        if(err){
            return res.status(500).json({message: 'une erreur de serveur'})
        }else{
          
            return res.status(200).json({message: "l'utilisateur a ete bien inscrit!! "})

        }
    })

})



router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email=?';
    const queryCoursEnseignant = 'SELECT * FROM cours WHERE enseignant_id = ?';
    const queryCours = 'SELECT * FROM Modules';
    const queryModulesEnseignant = `
            SELECT m.* 
            FROM enseignements e
            JOIN modules m ON e.module_id = m.id
            WHERE e.user_id = ?
        `;


    connection.query(query, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Une erreur de serveur" });
        }
        if (result.length === 0) {
            return res.status(400).json({ message: "Cet email n'existe pas !!" });
        }

        const user = result[0];
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(400).json({ message: "Le mot de passe est incorrect" });
        }

        // Si utilisateur = étudiant
        if (user.role === 'etudiant') {
            connection.query(queryCours, (err, coursResult) => {
                if (err) {
                    return res.status(500).json({ message: "Erreur lors de la récupération des cours" });
                }

                const token = jwt.sign({
                    userId: user.id,
                    prenom: user.prenom,
                    nom: user.nom,
                    role: user.role,
                    email: user.email,
                    numero_tele: user.numero_telephone,
                    Modules: coursResult
                }, process.env.secret_key, { expiresIn: '1h' });

                res.cookie("token", token, {
                    httpOnly: false,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 3600000
                });
                res.status(200).json({ message: "Connexion réussie", token, role: user.role });
            });

            } else if (user.role === 'enseignant') {
            connection.query(queryModulesEnseignant, [user.id], (err, coursEnsResult) => {
                if (err) {
                    return res.status(500).json({ message: "Erreur lors de la récupération des cours/modules de l'enseignant" });
                }
                                

                const token = jwt.sign({
                    userId: user.id,
                    prenom: user.prenom,
                    nom: user.nom,
                    role: user.role,
                    email: user.email,
                    numero_tele: user.numero_telephone,
                    Modules: coursEnsResult // contient aussi les noms des modules maintenant
                }, process.env.secret_key, { expiresIn: '1h' });

                res.cookie("token", token, {
                    httpOnly: false,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: 3600000
                });
                res.status(200).json({ message: "Connexion réussie", token, role: user.role });
            });
        }else {
            // Autres rôles
            const token = jwt.sign({
                userId: user.id,
                prenom: user.prenom,
                nom: user.nom,
                role: user.role,
                email: user.email,
                numero_tele: user.numero_telephone
            }, process.env.secret_key, { expiresIn: '1h' });

            res.cookie("token", token, {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                maxAge: 3600000
            });
            res.status(200).json({ message: "Connexion réussie", token, role: user.role });
        }
    });
});










// des routes que j'ai pas encore utliser===============================================
router.post('/login/Admin', isAuthenticated, async (req, res)=>{
    const {nom, email, password} = req.body
    const query = 'INSERT INTO users (nom, email, password, role) values (?,?,?,?)'

    const hashpassword = await bcrypt.hash(password, 10)

    connection.query(query, [nom, email, hashpassword, "enseignant"], (err, result)=>{
        if(err){
            return res.status(500).json({message: 'une erreur de serveur'})
        }else{
            return res.status(200).json({message: "l'utilisateur a ete bien inscrit!! "})

        }
    })

})



// ===================================================================================






// cette partie est commun pour tous les utilisateurs:%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5
router.post('/logout', (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true en production avec HTTPS
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Déconnexion réussie" });
  });



  // modifier les infos:
router.put('/modifier-info', isAuthenticated, (req,res)=>{
    const {prenom, nom, email, numero_telephone} = req.body;
    const id = req.user.userId
    
    const query2 = 'UPDATE users SET prenom = ?, nom = ?, email = ?, numero_telephone = ? WHERE id = ?';
    const query1 = 'Select * from users where id = ?'
    connection.query(query1, [id], (err, result)=>{
        if(err) return res.status(500).json({message: "Erreur de serveur"});
        connection.query(query2, [prenom, nom, email, numero_telephone, id], (err, result)=>{
            if(err) return res.status(400).json({message: "cette email existe deja"}) // j'ai fait 400 car cette requete ne soit pas
            // fausse sauf qu'il y'a deja un utilisateur avec cette nouvelle email.
            return res.status(200).json({message: "Informations modifiées avec succès."})
        })
       
    })
})

  
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%




// cette partie est dedie a l'Admin &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&










//Enseignant: 
//eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

//ajouter des enseignant: 
router.post('/AjouterEnseignant', isAuthenticated, async (req, res) => {
    const {nom, prenom, email, password } = req.body;

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(checkQuery, [email], async (checkErr, results) => {
        if (checkErr) {
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users (nom, prenom, email, password, role) VALUES (?, ?, ?, ?, ?)';

        connection.query(insertQuery, [nom, prenom, email, hashpassword, "enseignant"], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur serveur lors de l\'insertion.' });
            } else {
                return res.status(200).json({ message: "L'enseignant a été bien ajouté !" });
            }
        });
    });
});




//modifier enseignant: 

router.put('/ModifierEnseignant', isAuthenticated, (req, res) => {
    const {nom, prenom, ancienEmail, email} = req.body;

    const checkQuery = 'SELECT * FROM users WHERE email = ? AND role = "enseignant"';
    
    connection.query(checkQuery, [ancienEmail], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun enseignant trouvé avec cet email." });
        }

        
        const updateQuery = 'UPDATE users SET nom = ? , prenom = ?, email = ? WHERE email = ? AND role = "enseignant"';
        
        connection.query(updateQuery, [nom, prenom, email, ancienEmail], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
            } else {
                return res.status(200).json({ message: "L'enseignant a été bien modifié !" });
            }
        });
    });
});




//supprimer Enseignant: 

router.delete('/SupprimerEnseignant/:email', isAuthenticated, (req, res) => {
    const email = req.params.email;

    const checkQuery = 'SELECT * FROM users WHERE email = ? AND role = "enseignant"';
    connection.query(checkQuery, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun enseignant trouvé avec cet email." });
        }

        const deleteQuery = 'DELETE FROM users WHERE email = ? AND role = "enseignant"';
        connection.query(deleteQuery, [email], (deleteErr, deleteResult) => {
            if (deleteErr) {
                return res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
            }

            return res.status(200).json({ message: "L'enseignant a été supprimé avec succès." });
        });
    });
});

//eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee





//Alerts: 
//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


const findIdByEmail = require('../utils/findidbyemail')

//Ajouter une alerte

router.post('/Alerts', isAuthenticated, async (req, res) => {
    const { titre, contenu, email } = req.body;

    try {
        const userId = await findIdByEmail(email);

        if (typeof userId !== 'number') {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const query = `INSERT INTO alerts (titre, contenu, created_at, user_id) VALUES (?, ?, NOW(), ?)`;
        connection.query(query, [titre, contenu, userId], (err, result) => {
            if (err) {
                console.error("Erreur d'insertion :", err);
                return res.status(500).json({ message: "Erreur serveur lors de la création de l'alerte." });
            }

            return res.status(200).json({ message: "Alerte créée avec succès." });
        });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ message: error });
    }
});



//afficher les alertes: 


router.get('/Alerts/:email',isAuthenticated, async (req, res)=>{
    const email = req.params.email
    const id = await findIdByEmail(email)
    const query = 'Select * from Alerts where user_id= ?'
    connection.query(query, [id], (err, result)=>{
        if(err){
            return res.status(500).json({message: "Erreur de serveur !!"})
        }
        return res.status(200).json(result)
    })
})


//supprimer les alertes: 

router.delete('/Alerts/:id', isAuthenticated, async (req,res)=>{
    const id = req.params.id;
    const query = 'Delete from Alerts where id = ?';
    connection.query(query, [id], (err, result)=>{
        if(err) return res.status(500).json({message: "Erreur de serveur !!"});
        return res.status(200).json({message: "l'alerte a ete bien supprimer !!"})
    })
})


// modifier les alerts: 

router.put('/Alerts/:id', isAuthenticated, (req, res)=>{
    const id = req.params.id;
    const {titre, contenu} = req.body;
    const query = 'Update Alerts set titre = ? , contenu = ? where id = ?'
    connection.query(query, [titre, contenu, id], (err, result)=>{
        if(err) return res.statut(500).json({message: "Erreur de serveur!! "});
        return res.status(200).json({message: "L'alerte a ete bien modifiee "})
    })
})

//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa


//Notifications:
//nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn


//Ajouter notification:

router.post('/Notifications', isAuthenticated, async (req, res) => {
    const { message, email } = req.body;

    try {
        const userId = await findIdByEmail(email);

        if (typeof userId !== 'number') {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const query = `INSERT INTO Notifications (message, created_at, user_id) VALUES (?, NOW(), ?)`;
        connection.query(query, [message, userId], (err, result) => {
            if (err) {
                console.error("Erreur d'insertion :", err);
                return res.status(500).json({ message: "Erreur serveur lors de la création de la notification." });
            }

            return res.status(200).json({ message: "Notification créée avec succès." });
        });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ message: error });
    }
});




//Afficher les notifications

router.get('/Notifications/:email',isAuthenticated, async (req, res)=>{
    const email = req.params.email
    const id = await findIdByEmail(email)
    const query = 'Select * from Notifications where user_id= ?'
    connection.query(query, [id], (err, result)=>{
        if(err){
            return res.status(500).json({message: "Erreur de serveur !!"})
        }
        return res.status(200).json(result)
    })
})

// supprimer notification: 
router.delete('/Notifications/:id', isAuthenticated, async (req,res)=>{
    const id = req.params.id;
    const query = 'Delete from Notifications where id = ?';
    connection.query(query, [id], (err, result)=>{
        if(err) return res.status(500).json({message: "Erreur de serveur !!"});
        return res.status(200).json({message: "la notification a ete bien supprimer !!"})
    })
})

// modifier notification: 

router.put('/Notifications/:id', isAuthenticated, (req, res)=>{
    const id = req.params.id;
    const {message} = req.body;
    const query = 'Update Notifications set message = ? where id = ?'
    connection.query(query, [message, id], (err, result)=>{
        if(err) return res.statut(500).json({message: "Erreur de serveur!! "});
        return res.status(200).json({message: "La notificatino a ete bien modifiee "})
    })
})



//nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn




// cette partie est pour l'ajout des modules: 

router.post('/Modules', isAuthenticated, (req,res)=>{
    const {nom}= req.body
    const query = 'INSERT INTO Modules (nom) values (?)'
    console.log(nom)
    connection.query(query, [nom], (err, result)=>{
        if(err){
            return res.status(400).json({message: "il y'a une erreur lors de l'insertion de modules"})
        }
        return res.status(200).json({message: 'le module a ete bien inscrit!'})

    })
})



// c'est partie c'est pour l'enseignement:
router.get('/Enseignement', isAuthenticated, (req, res) => {
    const query = "SELECT id, email FROM USERS WHERE ROLE = 'Enseignant'";
    connection.query(query, (err, result) => {
        if (err) return res.status(400).json({ message: "Erreur lors de l'affichage des enseignants" });
        return res.status(200).json(result);
    });
});


router.get('/Modules', isAuthenticated, (req, res) => {
    const query = "SELECT id, nom FROM MODULES";
    connection.query(query, (err, result) => {
        if (err) return res.status(400).json({ message: "Erreur lors de l'affichage des modules" });
        return res.status(200).json(result);
    });
});


router.post('/Enseignement', isAuthenticated, (req, res) => {
    const { user_id, module_id } = req.body;

    if (!user_id || !module_id) {
        return res.status(400).json({ message: "Champs manquants." });
    }

    const insertQuery = 'INSERT INTO Enseignements (user_id, module_id) VALUES (?, ?)';
    connection.query(insertQuery, [user_id, module_id], (err, result) => {
        if (err) {
            console.error('Erreur MySQL:', err);
            return res.status(500).json({ message: "Erreur lors de l'insertion." });
        }

        res.status(201).json({ message: "Assignation réussie." });
    });
});





//aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa



























// la partie de user (enseignant et etudiant):




// pour ajouter les cours : 


const multer = require('multer');
const {uploadFileToDrive} = require('../drive'); // le fichier qu’on vient de modifier

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});







router.post('/cours', upload.single('fichier_pdf'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Fichier manquant" });


    
    // Ici pas besoin de body-parser sur ce endpoint pour fichier
    const {module_id, enseignant_id } = req.body;
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const titre = originalName.replace(/\.pdf$/i, '');
    const query = 'INSERT INTO cours (titre, fichier_pdf, module_id, enseignant_id, uploaded_at) VALUES (?, ?, ?, ?,Now())'

 
  
    // Upload vers Drive ou traitement...
    const driveUrl = await uploadFileToDrive(filePath, originalName);

  
  connection.query(query,[titre, driveUrl, module_id, enseignant_id], (err, result)=>{
    if(err) return res.status(400).json({message: err });
    return res.status(200).json({message: 'Fichier uploadé avec succès', url: driveUrl})
  })
});











//pour recupere les cours :
router.get('/cours/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID utilisateur invalide' });
  }

  // 1. Récupérer le rôle de l'utilisateur
  const roleQuery = `SELECT role FROM users WHERE id = ?`;
  connection.query(roleQuery, [userId], (err, userResults) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (userResults.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const role = userResults[0].role;

    let coursQuery = '';
    let params = [];

    if (role === 'enseignant') {
      // 2a. Pour enseignant, récupérer ses cours
      coursQuery = `
        SELECT cours.*, modules.nom as module_nom
        FROM cours
        JOIN modules ON cours.module_id = modules.id
        WHERE cours.enseignant_id = ?
        ORDER BY cours.uploaded_at DESC
      `;
      params = [userId];

    } else if (role === 'etudiant') {
      // 2b. Pour étudiant, récupérer tous les cours (ou filtrer selon inscriptions si tu veux)
      coursQuery = `
        SELECT cours.*, modules.nom as module_nom
        FROM cours
        JOIN modules ON cours.module_id = modules.id
        ORDER BY cours.uploaded_at DESC
      `;
      params = [];
    } else {
      // Pour admin ou autre, on peut renvoyer tous les cours aussi
      coursQuery = `
        SELECT cours.*, modules.nom as module_nom
        FROM cours
        JOIN modules ON cours.module_id = modules.id
        ORDER BY cours.uploaded_at DESC
      `;
      params = [];
    }

    connection.query(coursQuery, params, (err2, coursResults) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });
      return res.json(coursResults);
    });
  });
});





// supprimer les cours:









const {deleteFileFromDrive} = require('../drive')

router.delete('/cours/:id', (req, res) => {
  const coursId = parseInt(req.params.id, 10);
  if (isNaN(coursId)) {
    return res.status(400).json({ message: 'ID de cours invalide' });
  }

  // D'abord récupérer l'ID Drive associé
  const selectQuery = 'SELECT fichier_pdf FROM cours WHERE id = ?';

  connection.query(selectQuery, [coursId], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Cours non trouvé' });

    const driveFileId = results[0].fichier_pdf;

    try {
      await deleteFileFromDrive(driveFileId);
    } catch (driveErr) {
      return res.status(500).json({ message: 'Erreur lors de la suppression du fichier Drive', error: driveErr });
    }

    // Puis supprimer la ligne dans la base
    const deleteQuery = 'DELETE FROM cours WHERE id = ?';
    connection.query(deleteQuery, [coursId], (err2, result) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur', error: err2 });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cours non trouvé ou déjà supprimé' });
      }

      return res.status(200).json({ message: 'Cours et fichier Drive supprimés avec succès' });
    });
  });
});





module.exports = router;