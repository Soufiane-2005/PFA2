import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import { Usersidebar } from "../components/Usersidebar";
import '../src/styleCss/dashboard.css';
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/fetchapi";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  // États et contextes
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(localStorage.getItem('theme'))
  
  // États pour l'interface
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tabsContainerRef = useRef(null);
  
  // États pour les données
  const [pdfsByModule, setPdfsByModule] = useState({});
  const [profilingStatus, setProfilingStatus] = useState({});
  
  // États pour le modal de profiling
  const [showProfilingModal, setShowProfilingModal] = useState(false);
  const [selectedModuleForProfiling, setSelectedModuleForProfiling] = useState({ id: null, nom: null });
  
  // États pour la modal d'upload
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [currentFile, setCurrentFile] = useState('');
  const [filesToUpload, setFilesToUpload] = useState([]);

  // Fonction pour basculer la sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Récupérer le statut de profiling
  const fetchProfilingStatus = useCallback(async () => {
    if (user?.role === 'etudiant') {
      try {
        const response = await apiRequest(`/profiled/${user.userId}`, 'GET');
        const statusMap = response.reduce((acc, curr) => {
          acc[curr.module_id] = curr.profiling;
          return acc;
        }, {});
        setProfilingStatus(statusMap);
      } catch (error) {
        console.error("Erreur lors de la récupération du profiling:", error);
      }
    }
  }, [user]);

  // Récupérer les cours
  const fetchCours = useCallback(async () => {
    try {
      const data = await apiRequest(`/cours/${user.userId}`, 'GET');
      console.log(data)
      const grouped = data.reduce((acc, cours) => {
        const modNom = cours.module_nom;
        if (!acc[modNom]) acc[modNom] = [];
        acc[modNom].push(cours);
        return acc;
        
      }, {});
      setPdfsByModule(grouped);
      if (user?.Modules?.[0]?.nom) setActiveModule(user.Modules[0].nom);
    } catch (err) {
      console.error("Erreur lors de la récupération des cours:", err);
    }
  }, [user]);

  // Effets initiaux
  useEffect(() => {
    if (user?.userId) {
      fetchCours();
      fetchProfilingStatus();
    }
  }, [user, fetchCours, fetchProfilingStatus]);

  // Gestion du scroll des onglets
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    };

    container.addEventListener('scroll', checkScroll);
    checkScroll();

    return () => container.removeEventListener('scroll', checkScroll);
  }, [user?.Modules]);

  // Fonction pour vérifier le profiling avant d'afficher un PDF
  const checkProfilingBeforeView = (pdf, moduleId, moduleNom) => {
    if (profilingStatus[moduleId] !== 1) {
      setSelectedModuleForProfiling({ id: moduleId, nom: moduleNom });
      setShowProfilingModal(true);
    } else {
      window.open(pdf, '_blank');
    }
  };

  // Fonction pour vérifier le profiling avant de faire le quiz
  const checkProfilingBeforeQuiz = (pdf, moduleId, moduleNom) => {
    if (profilingStatus[moduleId] !== 1) {
      setSelectedModuleForProfiling({ id: moduleId, nom: moduleNom });
      setShowProfilingModal(true);
    } else {
      navigate(`quiz/${pdf.titre}`, { state: pdf });
    }
  };

  // Fonction pour ajouter un PDF avec suivi de progression
  const handleAddPdf = async (e, moduleId) => {
    const files = Array.from(e.target.files).filter(file => file.type === "application/pdf");
    if (files.length === 0) return;

    // Initialiser la modal d'upload
    setUploadModalOpen(true);
    setFilesToUpload(files);
    setUploadProgress(0);
    setUploadStatus('Démarrage de l\'upload...');
    setEstimatedTime('Calcul en cours...');
    setCurrentFile('');

    let uploadStartTime = Date.now();
    let uploadedCount = 0;

    for (const [index, file] of files.entries()) {
      setCurrentFile(`${index + 1}/${files.length}: ${file.name}`);
      setUploadStatus(`Upload en cours...`);

      const formData = new FormData();
      formData.append('fichier_pdf', file);
      formData.append('titre', file.name.replace(/\.pdf$/i, ''));
      formData.append('module_id', moduleId);
      formData.append('enseignant_id', user.userId);

      try {
        // Créer un intervalle pour simuler la progression
        const progressInterval = setInterval(() => {
          const elapsed = (Date.now() - uploadStartTime) / 1000;
          const progressPerFile = 100 / files.length;
          const baseProgress = uploadedCount * progressPerFile;
          const fileProgress = (elapsed % 3) * (progressPerFile / 3);
          
          setUploadProgress(Math.min(baseProgress + fileProgress, (uploadedCount + 1) * progressPerFile));
          
          // Calcul du temps estimé
          if (uploadedCount > 0) {
            const avgTimePerFile = elapsed / uploadedCount;
            const remainingFiles = files.length - uploadedCount;
            const remainingTime = avgTimePerFile * remainingFiles;
            setEstimatedTime(`${Math.round(remainingTime)}s restante(s)`);
          }
        }, 300);

        await apiRequest('/cours', 'POST', formData);
        clearInterval(progressInterval);

        uploadedCount++;
        setUploadProgress((uploadedCount / files.length) * 100);
        setUploadStatus(`${uploadedCount}/${files.length} fichiers uploadés`);

      } catch (error) {
        console.error('Erreur upload:', error);
        setUploadStatus(`Erreur lors de l'upload de ${file.name}`);
      }
    }

    // Finalisation
    setUploadStatus('Upload terminé !');
    setEstimatedTime('Opération complète');
    setCurrentFile('');

    // Fermer la modal après 2 secondes
    setTimeout(() => {
      setUploadModalOpen(false);
      fetchCours();
    }, 2000);

    e.target.value = null;
  };

  // Fonction pour supprimer un cours
  const handleDeleteCours = async (coursId, moduleNom) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;

    try {
      await apiRequest(`/cours/${coursId}`, 'DELETE');
      setPdfsByModule(prev => ({
        ...prev,
        [moduleNom]: prev[moduleNom].filter(c => c.id !== coursId)
      }));
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert("Erreur lors de la suppression du cours.");
    }
  };

  // Fonction pour naviguer vers le profiling
  const handleProfilingNavigation = () => {
    setShowProfilingModal(false);
    navigate(`profiling/${selectedModuleForProfiling.nom}/${selectedModuleForProfiling.id}`);
  };

  // Fonction pour faire défiler les onglets
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Usersidebar isOpen={sidebarOpen} />
      
      <div className={`main-content ${sidebarOpen ? '' : 'full-width'}`}>
        {/* Onglets des modules */}
        <div className="module-tabs-container">
          {showLeftArrow && (
            <button className="scroll-arrow left-arrow" onClick={() => scrollTabs('left')}>
              &lt;
            </button>
          )}
          
          <div className="module-tabs" ref={tabsContainerRef}>
            {user?.Modules?.map((module, index) => (
              <button
                key={index}
                className={`module-tab ${activeModule === module.nom ? 'active' : ''}`}
                onClick={() => setActiveModule(module.nom)}
              >
                {module.nom}
              </button>
            ))}
          </div>
          
          {showRightArrow && (
            <button className="scroll-arrow right-arrow" onClick={() => scrollTabs('right')}>
              &gt;
            </button>
          )}
        </div>

        {/* Contenu des modules */}
        {user?.Modules?.map((module) => (
          <div 
            key={module.id} 
            className={`module-content ${activeModule === module.nom ? 'active' : ''}`}
          >
            <div className="module-header">
              <h2>{module.nom}</h2>
              
              {user.role === 'enseignant' ? (
                <label className="add-pdf-btn">
                  <span>+ Ajouter PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handleAddPdf(e, module.id)}
                    disabled={uploadModalOpen}
                  />
                </label>
              ) : (
                <button 
                  className="profiling-btn"
                  onClick={() => navigate(`profiling/${module.nom}/${module.id}`)}
                >
                  Profiling
                </button>
              )}
            </div>

            {/* Liste des PDFs */}
            <div className="pdf-grid">
              {pdfsByModule[module.nom]?.length > 0 ? (
                pdfsByModule[module.nom].map((pdf) => (
                  <div key={pdf.id} className="pdf-card">
                    <div className="pdf-icon">
                      <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF" />
                    </div>
                    <div className="pdf-info">
                      <h3>{pdf.titre}</h3>
                      <div className="pdf-actions">
                        <button
                          onClick={() => user.role=='etudiant'? checkProfilingBeforeView(pdf.fichier_pdf, module.id, module.nom):  window.open(pdf.fichier_pdf, '_blank')}
                          className="view-btn"
                        >
                          <span>Voir</span>
                          <i className="fas fa-external-link-alt"></i>
                        </button>
                        
                        {user.role === 'enseignant' ? (
                          <button
                            onClick={() => handleDeleteCours(pdf.id, module.nom)}
                            className="delete-btn"
                          >
                            <i className="fas fa-trash">supprimer</i>
                          </button>
                        ) : (
                          <button
                            onClick={() => checkProfilingBeforeQuiz(pdf, module.id, module.nom)}
                            className="quiz-btn"
                          >
                            <span>quiz</span>
                            <i className="fas fa-external-link-alt"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="Empty" />
                  <p>Aucun PDF disponible pour ce module</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de profiling */}
      {showProfilingModal && (
        <div className="profiling-modal">
          <div className="modal-content">
            <h3>Profiling Requis</h3>
            <p>Vous devez compléter le profiling pour ce module avant de pouvoir accéder au cours.</p>
            <div className="modal-actions">
              <button onClick={handleProfilingNavigation} className="primary-btn">
                Passer le Profiling
              </button>
              <button 
                onClick={() => setShowProfilingModal(false)} 
                className="secondary-btn"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'upload */}
      {uploadModalOpen && (
        <div className="upload-modal-overlay">
          <div className="upload-modal">
            <h3>Upload en cours</h3>
            <div className="progress-container">
              <div 
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className="progress-text">{Math.round(uploadProgress)}%</span>
            </div>
            
            <div className="upload-details">
              <p>{uploadStatus}</p>
              {currentFile && <p className="current-file">{currentFile}</p>}
              <p className="estimated-time">{estimatedTime}</p>
            </div>
            
            <div className="file-list">
              <h4>Fichiers à uploader:</h4>
              <ul>
                {filesToUpload.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}