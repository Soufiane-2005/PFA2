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

        const deleteQuery = 'DELETE FROM users WHERE email = ?';
        connection.query(deleteQuery, [email], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.log(deleteErr)
                return res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
            }

            //logique de supprimer les cours lier a cette utilisateur. mais le probleme c'est que 
            // les enregistrements de tableau cours vont etre supprime avant que je puisse recuperer les 
            // chemins correspendants a chaque cours pour supprimer les cours dans le drive. 


            return res.status(200).json({ message: "L'enseignant a été supprimé avec succès." });
        });
    });
});


             // le nombres des enseignants: 
router.get('/Enseignant', (req, res)=>{
    const query = "SELECT count(*) as nbr FROM USERS WHERE ROLE = 'Enseignant'"
    connection.query(query, (err, result)=>{
        if(err) return res.status(500).json({message: 'Erreur de serveur!'});
        return res.status(200).json({nbr: result[0].nbr})
    })
})

             // le nombre des etudiants: 

            
router.get('/Etudiant', (req, res)=>{
    const query = "SELECT count(*) as nbr FROM USERS WHERE ROLE = 'Etudiant'"
    connection.query(query, (err, result)=>{
        if(err) return res.status(500).json({message: 'Erreur de serveur!'});
        return res.status(200).json({nbr: result[0].nbr})
    })
})



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



router.get('/Alerts/unread/:user_id', (req, res)=>{
    const user_id = req.params.user_id
    const query = 'select count(*) as unread from Alerts where user_id = ? and is_read = 0'
    connection.query(query, [user_id], (err,result)=>{
        if(err) return res.status(400).json({message: 'erreur de serveur'});
        return res.status(200).json({unread : result[0].unread})
    })
    
})

router.put('/Alerts/mark-as-read/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const query = 'UPDATE Alerts SET is_read = TRUE WHERE user_id = ?';
    
    connection.query(query, [user_id], (err, result) => {
        if(err) return res.status(500).json({message: "Erreur de serveur!!"});
        return res.status(200).json({message: "Alerts marquée comme lue"});
    });
});




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
        if(err) return res.status(500).json({message: "Erreur de serveur!! "});
        return res.status(200).json({message: "La notificatino a ete bien modifiee "})
    })
})


// savoir combien des notifications n'ont pas encore lu: 


router.get('/Notifications/unread/:user_id', (req, res)=>{
    const user_id = req.params.user_id
    const query = 'select count(*) as unread from notifications where user_id = ? and is_read = 0'
    connection.query(query, [user_id], (err,result)=>{
        if(err) return res.status(400).json({message: 'erreur de serveur'});
        return res.status(200).json({unread : result[0].unread})
    })
    
})

router.put('/Notifications/mark-as-read/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    const query = 'UPDATE notifications SET is_read = TRUE WHERE user_id = ?';
    
    connection.query(query, [user_id], (err, result) => {
        if(err) return res.status(500).json({message: "Erreur de serveur!!"});
        return res.status(200).json({message: "Notifications marquée comme lue"});
    });
});



//nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn




// cette partie est pour l'ajout des modules: 

router.post('/Modules', isAuthenticated, (req,res)=>{
    const {nom}= req.body
    const query1 = 'select * from modules where nom = ?'
    const query2 = 'INSERT INTO Modules (nom) values (?)'
    
    
    connection.query(query1, [nom.toLowerCase()], (err, result)=>{
        if(err) return res.status(500).json({message: "Erreur de serveur!"});
        if(!result.length==0) return res.status(400).json({message: "Ce module est deja existe !!"});
        connection.query(query2, [nom.toLowerCase()], (err, result)=>{
        if(err){
            return res.status(400).json({message: "il y'a une erreur lors de l'insertion de modules"})
        }
        return res.status(200).json({message: 'le module a ete bien inscrit!'})

    })


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


router.get('/Modules', (req, res) => {
    const query = "SELECT id, nom FROM MODULES";

    connection.query(query, (err, result) => {
        if (err) return res.status(400).json({ message: "Erreur lors de l'affichage des modules" });
        
        return res.status(200).json({result, nbr: result.length});
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


const multer = require('multer');
const {uploadFileToDrive} = require('../drive'); // le fichier qu’on vient de modifier

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});






//ajouter des profile_picture: 



router.post('/profile_picture', upload.single('profile_picture'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "image manquant" });


    
    // Ici pas besoin de body-parser sur ce endpoint pour fichier
    const {user_id} = req.body;
    const imagePath = req.file.path;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype
    console.log(imagePath)
    console.log(originalName)
    const query = 'update users set profile_picture = ? where id = ?'

 
  
    // Upload vers Drive ou traitement...
    const driveUrl = await uploadFileToDrive(imagePath, originalName, mimeType);

  
  connection.query(query,[driveUrl, user_id], (err, result)=>{
    if(err) return res.status(400).json({message: err });
    return res.status(200).json({message: 'Photo de profil mise à jour avec succès!', url: driveUrl})
  })
});


router.get('/profile_picture/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID utilisateur invalide' });
  }

  const query = `SELECT profile_picture FROM users WHERE id = ?`;
  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    console.log(results.length)
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Photo de profil non trouvée' });
    }

    // Renvoie directement l'URL de la photo
    res.json({ profile_picture: results[0].profile_picture });
  });
});








// pour ajouter les cours : 






router.post('/cours', upload.single('fichier_pdf'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Fichier manquant" });


    
    // Ici pas besoin de body-parser sur ce endpoint pour fichier
    const {module_id, enseignant_id } = req.body;
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    console.log(filePath)
    console.log(originalName)
    const titre = originalName.replace(/\.pdf$/i, '');
    const query = 'INSERT INTO cours (titre, fichier_pdf, module_id, enseignant_id, uploaded_at) VALUES (?, ?, ?, ?,Now())'

 
  
    // Upload vers Drive ou traitement...
    const driveUrl = await uploadFileToDrive(filePath, originalName, 'application/pdf');

  
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



// chatbot : il ne fnoction pas::::::::::: update : ca fonction


const { GoogleGenerativeAI } = require('@google/generative-ai');




// Configure Gemini API
const genAI = new GoogleGenerativeAI(process.env.api_key);


// Stockage de l'historique de conversation par session
const conversationHistory = new Map();

router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        
        // Récupérer l'historique ou initialiser si nouvelle session
        if (!conversationHistory.has(sessionId)) {
            conversationHistory.set(sessionId, []);
        }
        const history = conversationHistory.get(sessionId);
        
        // Construire le contexte de la conversation
        const chatContext = history.map(entry => 
            `${entry.role}: ${entry.content}`
        ).join('\n');
        
        const fullPrompt = `Voici le contexte de la conversation:\n${chatContext}\n\nNouveau message: ${message}\n\nAssistant:`;
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Utiliser l'historique comme contexte
        const chat = model.startChat({
            history: history.map(entry => ({
                role: entry.role === 'user' ? 'user' : 'model',
                parts: [{ text: entry.content }]
            })),
            generationConfig: {
                maxOutputTokens: 1000
            }
        });
        
        const result = await chat.sendMessage(message + ' (Dans ta réponse, évite le markdown et sois concis)');
        const response = result.response;
        const reply = response.text();
        
        // Mettre à jour l'historique
        history.push(
            { role: 'user', content: message },
            { role: 'assistant', content: reply }
        );
        
        // Limiter la taille de l'historique pour éviter la surcharge
        if (history.length > 20) { // Garder les 10 derniers échanges
            conversationHistory.set(sessionId, history.slice(-20));
        }
        
        return res.status(200).json({ reply });
        
    } catch (error) {
        console.error('Chat error:', error);
        return res.status(500).json({ 
            reply: "Désolé, je rencontre un problème technique. Veuillez réessayer." 
        });
    }
});


//............................................................................................................

router.get('/profiled/:user_id', (req,res)=>{
    const user_id = parseInt(req.params.user_id);
    const query = 'select module_id , profiling from etudiant_modules_profiling where user_id = ?;'
    
    connection.query(query, [user_id], (err, result)=>{
        if(err) return res.status(400).json({ message: 'Erreur !' });
        
        res.status(200).json(result)
    })
    
   
    
    
})


router.put('/profiled/:user_id/:module_id', (req, res) => {
    const user_id = parseInt(req.params.user_id);
    const module_id = parseInt(req.params.module_id);

    const query = `
        INSERT INTO user_module_profiling (user_id, module_id, is_profiled) 
        VALUES (?, ?, TRUE)
        ON DUPLICATE KEY UPDATE is_profiled = TRUE
    `;

    connection.query(query, [user_id, module_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Profiling status updated successfully' });
    });
});




router.post('/supprimer', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email=?';
    
   
    

    connection.query(query, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Une erreur de serveur" });
        }
        if (result.length === 0) {
            return res.status(400).json({ message: "Cet email n'existe pas !!" });
        }

        const user = result[0];
        const valid = await bcrypt.compare(password, user.password);

        return res.status(200).json({valid})
        })
})

router.get('/supprimer',isAuthenticated, (req, res)=>{
    const id = req.user.userId
    console.log(id)
    const query = 'delete from users where id = ?'
    connection.query(query, [id], (err, resrult)=>{
        console.log(err)
        if(err) return res.status(500).json({message: 'Erreur de serveur !!'});

        res.clearCookie("token", {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        });

        return res.status(200).json({message: "Le compte a ete bien supprimer !! "})
    })   
})





module.exports = router;