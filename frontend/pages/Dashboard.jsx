import { useContext, useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Usersidebar } from "../components/Usersidebar";
import '../src/styleCss/dashboard.css';
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/fetchapi";

export function Dashboard() {
  const { user } = useContext(AuthContext);
  const [pdfsByModule, setPdfsByModule] = useState({});

  const fetchCours = async () => {
    try {
      const data = await apiRequest(`/cours/${user.userId}`, 'GET');
      const grouped = data.reduce((acc, cours) => {
        const modNom = cours.module_nom;
        if (!acc[modNom]) acc[modNom] = [];
        acc[modNom].push(cours);
        return acc;
      }, {});
      setPdfsByModule(grouped);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPdf = async (e, moduleId) => {
    const files = Array.from(e.target.files);
    const pdfFiles = files.filter(file => file.type === "application/pdf");
    if (pdfFiles.length === 0) return;

    for (const file of pdfFiles) {
      try {
        const formData = new FormData();
        formData.append('fichier_pdf', file);
        const titre = file.name.replace(/\.pdf$/i, '');
        formData.append('titre', titre);
        formData.append('module_id', moduleId);
        formData.append('enseignant_id', user.userId);

        const uploadResult = await apiRequest('/cours', 'POST', formData);
        alert(uploadResult.message);
      } catch (error) {
        console.error('Erreur upload:', error);
        alert('Erreur lors de l\'upload du fichier: ' + file.name);
      }
    }

    e.target.value = null;
    fetchCours(); // Rafraîchir après ajout
  };




  

  const handleDeleteCours = async (coursId, moduleNom) => {
    console.log(coursId)
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;

    try {
      const res = await apiRequest(`/cours/${coursId}`, 'DELETE');
      alert(res.message);

      setPdfsByModule(prev => {
        const updatedModule = prev[moduleNom].filter(c => c.id !== coursId);
        return {
          ...prev,
          [moduleNom]: updatedModule
        };
      });
    } catch (err) {
      console.error('Erreur suppression :', err);
      alert("Erreur lors de la suppression du cours.");
    }
  };

  useEffect(() => {
    if (user?.userId) fetchCours();
  }, [user]);

  return (
    <div className="page-container">
      <Navbar />
      <Usersidebar />

      {user?.Modules?.map((module, index) => (
        <div key={index} className="cours-container">
          <div className="cours-box">
            <h2 className="cours-title">{module.nom}</h2>
            <div className="pdf-list">
              {pdfsByModule[module.nom]?.length > 0 ? (
                pdfsByModule[module.nom].map((pdf, i) => (
                  <div key={i} className="pdf-card">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                      alt="PDF"
                      className="pdf-icon-img"
                    />
                    <div className="pdf-title">{pdf.titre}</div>

                    <div className="pdf-actions">
                      <a
                        href={pdf.fichier_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-link"
                      >
                        Voir le PDF 🔗
                      </a>

                      {user.role === 'enseignant' && (
                        <button
                          onClick={() => handleDeleteCours(pdf.id, module.nom)}
                          className="delete-btn"
                        >
                          Supprimer ❌
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-message">Aucun PDF ajouté pour le moment.</p>
              )}
            </div>
          </div>

          {user.role === 'enseignant' && (
            <label className="add-btn-floating">
              Ajouter
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => handleAddPdf(e, module.id)}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>
      ))}
    </div>
  );
}
