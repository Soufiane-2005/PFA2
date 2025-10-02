import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { FaFilePdf, FaChartPie, FaBrain, FaCheck, FaBookOpen, FaChartLine, FaUserGraduate, FaArrowRight } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import "../src/styleCss/Profiling.css"; // Import des styles
import { apiRequest } from "../utils/fetchapi";

export function Profiling() {
  const { moduleNom, module_id} = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()

  console.log(user.userId, parseInt(module_id))
  
  

  

  const changeProfiling = async ()=>{
    try {
    const response = await apiRequest(`/profiled/${user.userId}/${parseInt(module_id)}`, 'PUT');
    console.log(response.message);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profiling:", error);
    // Vous pouvez choisir de ne pas afficher d'erreur à l'utilisateur
    // car ce n'est pas critique pour l'expérience principale
  }
  }

  // États et données
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [learningStyleQuestions, setLearningStyleQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [learningStyleAnswers, setLearningStyleAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswerRequired, setShowAnswerRequired] = useState(false);


  // Effets initiaux
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/profiling/${moduleNom}`);
        const data = await response.json();
        setQuizQuestions(data.quizQuestions || []);
        setLearningStyleQuestions(data.lsQuestions || []);
        setQuizAnswers(new Array(data.quizQuestions?.length || 0).fill(null));
        setLearningStyleAnswers(new Array(data.lsQuestions?.length || 0).fill(null));
      } catch (error) {
        console.error("Erreur lors de la récupération des questions :", error);
      }
    };

    fetchQuestions();
  }, [moduleNom]);

  // Gestion des réponses
  const handleAnswerChange = (answerIndex) => {
    if (activeTab === 'quiz') {
      const newAnswers = [...quizAnswers];
      newAnswers[currentQuestion] = answerIndex;
      setQuizAnswers(newAnswers);
    } else {
      const newAnswers = [...learningStyleAnswers];
      newAnswers[currentQuestion] = answerIndex;
      setLearningStyleAnswers(newAnswers);
    }
    setShowAnswerRequired(false);
  };

  // Soumission des réponses
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/profiling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cours: moduleNom,
          quiz_answers: quizAnswers,
          learning_style_answers: learningStyleAnswers,
          quizQuestions,
          lsQuestions: learningStyleQuestions,
          nom: user.prenom
        }),
      });

      const data = await response.json();
      setResults(data);
      setShowResults(true);

      await changeProfiling();
    } catch (error) {
      console.error("Erreur d'envoi :", error);
      alert("Erreur lors de la soumission.");
    }
  };

  // Navigation entre questions
  const handleNextQuestion = () => {
    const currentAnswers = activeTab === 'quiz' ? quizAnswers : learningStyleAnswers;
    
    // Vérifie si l'utilisateur a répondu
    if (currentAnswers[currentQuestion] === null) {
      setShowAnswerRequired(true);
      return;
    }
    
    setShowAnswerRequired(false);
    
    const maxQuestions = activeTab === 'quiz' ? quizQuestions.length : learningStyleQuestions.length;
    
    // Vérifie si on est à la dernière question du quiz
    if (activeTab === 'quiz' && currentQuestion === quizQuestions.length - 1) {
      // Passe au style d'apprentissage s'il y a des questions
      if (learningStyleQuestions.length > 0) {
        setActiveTab('learning');
        setCurrentQuestion(0);
      }
    } 
    // Navigation normale
    else if (currentQuestion < maxQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (activeTab === 'learning') {
      setActiveTab('quiz');
      setCurrentQuestion(quizQuestions.length - 1);
    }
  };

  // Affichage des résultats - Version élégante
  if (showResults && results) {
    return (
      <div className="elegant-results-container">
        {/* Header élégant */}
          <div className="results-header">
            <div className="header-content">
              <RiDashboardFill className="dashboard-icon" />
              <div>
                <h1>Profil d'Apprentissage - {moduleNom}</h1>
                <p className="welcome-message">
                  Bonjour <span className="user-name">{user.prenom}</span>, voici votre analyse personnalisée
                </p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => navigate('/dashboard')}
                className="dashboard-button"
              >
                <RiDashboardFill className="button-icon" />
                Retour au Dashboard
              </button>
            </div>
            <div className="header-decoration"></div>
          </div>
        {/* Grille de résultats */}
        <div className="results-grid">
          {/* Carte de score */}
          <div className="result-card score-card">
            <div className="card-header">
              <FaChartPie className="card-icon" />
              <h2>Performance Globale</h2>
            </div>
            <div className="card-body">
              <div className="radial-progress" style={{ "--progress": results.score }}>
                <div className="progress-content">
                  <span className="progress-value">{results.score}%</span>
                  <span className="progress-label">Score</span>
                </div>
              </div>
              <div className="level-badge">
                <FaUserGraduate className="badge-icon" />
                <span>{getLevelLabel(results.level)}</span>
              </div>
              <div className="recommendations">
                <h3>Points Forts</h3>
                <ul>
                  {results.quiz_recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index}>
                      <FaCheck className="check-icon" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Carte de style d'apprentissage */}
          <div className="result-card style-card">
            <div className="card-header">
              <FaBrain className="card-icon" />
              <h2>Votre Style d'Apprentissage</h2>
            </div>
            <div className="card-body">
              <div className="style-visualization">
                <div className="style-badge">
                  <span>{results.learning_style}</span>
                </div>
                <div className="style-chart">
                  {Object.entries(results.ls_Repartition).map(([style, value]) => (
                    <div key={style} className="chart-item">
                      <div className="chart-label">
                        <span>{style}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar" 
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="style-tips">
                <h3>Conseils Personnalisés</h3>
                <ul>
                  {results.ls_recommendations.slice(0, 3).map((tip, index) => (
                    <li key={index}>
                      <div className="tip-number">{index + 1}</div>
                      <p>{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Ressources recommandées */}
          <div className="result-card resources-card">
            <div className="card-header">
              <FaBookOpen className="card-icon" />
              <h2>Ressources Recommandées</h2>
            </div>
            <div className="card-body">
              <div className="resource-category">
                <h3>Pour votre niveau</h3>
                <ul>
                  <li>
                    <FaFilePdf className="resource-icon" />
                    <span>Guide complet {moduleNom} (PDF)</span>
                    
                  </li>
                  <li>
                    <FaChartLine className="resource-icon" />
                    <span>Exercices ciblés niveau {getLevelLabel(results.level)}</span>
                    
                  </li>
                </ul>
              </div>
              <div className="resource-category">
                <h3>Pour votre style</h3>
                <ul>
                  <li>
                    <FaFilePdf className="resource-icon" />
                    <span>Méthodes adaptées aux {results.learning_style}</span>
                   
                  </li>
                  <li>
                    <FaChartLine className="resource-icon" />
                    <span>Plan d'étude personnalisé</span>
                    
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Plan d'action */}
          <div className="action-plan">
            <h2>
              <FaChartLine className="title-icon" />
              Plan d'Action Personnel
            </h2>
            <div className="plan-steps">
              <div className="plan-step completed">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Évaluation Initiale</h3>
                  <p>Complétée le {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="plan-step current">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Étude des Ressources</h3>
                  <p>À commencer cette semaine</p>
                </div>
              </div>
              <div className="plan-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Réévaluation</h3>
                  <p>Prévue dans 2 semaines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage du questionnaire
  const questions = activeTab === 'quiz' ? quizQuestions : learningStyleQuestions;
  const answers = activeTab === 'quiz' ? quizAnswers : learningStyleAnswers;

  if (questions.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des questions...</p>
      </div>
    );
  }

  return (
    <div className="profiling-container">
      <div className="profiling-header">
        <h1>
          {activeTab === 'quiz' ? 'Quiz Évaluation' : 'Style d\'Apprentissage'} - {moduleNom}
        </h1>
        <div className="progress-indicator">
          Question {currentQuestion + 1} sur {questions.length}
        </div>
      </div>

      <div className="question-container">
        <div className="question-card">
          <h2>{questions[currentQuestion].question}</h2>
          <div className="options-list">
            {questions[currentQuestion].options.map((option, index) => (
              <label 
                key={index} 
                className={`option-item ${answers[currentQuestion] === index ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswerChange(index)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {showAnswerRequired && (
          <div className="error-message">
            Veuillez sélectionner une réponse avant de continuer.
          </div>
        )}

        <div className="navigation-buttons">
          <button 
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0 && activeTab === 'quiz'}
            className="nav-btn prev-btn"
          >
            Précédent
          </button>
          
          {currentQuestion < questions.length - 1 || (activeTab === 'quiz' && learningStyleQuestions.length > 0) ? (
            <button onClick={handleNextQuestion} className="nav-btn next-btn">
              {currentQuestion === questions.length - 1 && activeTab === 'quiz' ? 
                "Passer au style d'apprentissage" : "Suivant"}
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              className="submit-btn"
              disabled={answers.some(a => a === null)}
            >
              Soumettre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function
function getLevelLabel(level) {
  const levels = {
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advanced: "Avancé",
    expert: "Expert"
  };
  return levels[level.toLowerCase()] || level;
}