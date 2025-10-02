import {useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

export function Quiz() {
    const location = useLocation();
    const navigate = useNavigate();
    const {titre, fichier_pdf } = location.state;
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showQuestionCountModal, setShowQuestionCountModal] = useState(true);
    const [questionCount, setQuestionCount] = useState(10);

    const fetchQuestions = async (count) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await fetch('http://localhost:3000/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pdfUrl: fichier_pdf,
                    questionCount: count
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la récupération des questions');
            }

            const data = await response.json();
            
            if (!data.quiz || data.quiz.length === 0) {
                throw new Error('Aucune question générée à partir du PDF');
            }

            setQuizQuestions(data.quiz);
            setQuizAnswers(new Array(data.quiz.length).fill(null));
        } catch (err) {
            console.error("Erreur:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartQuiz = () => {
        setShowQuestionCountModal(false);
        fetchQuestions(questionCount);
    };

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        const newAnswers = [...quizAnswers];
        newAnswers[questionIndex] = answerIndex;
        setQuizAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        quizQuestions.forEach((question, index) => {
            if (quizAnswers[index] === question.correct_answer) {
                correct++;
            }
        });
        setScore(Math.round((correct / quizQuestions.length) * 100));
        setQuizCompleted(true);
    };

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    if (showQuestionCountModal) {
        return (
            <ModalOverlay>
                <QuestionCountModal>
                    <h2>Configuration du Quiz</h2>
                    <p>Combien de questions souhaitez-vous pour ce quiz ?</p>
                    
                    <QuestionCountInput
                        type="number"
                        min="1"
                        max="50"
                        value={questionCount}
                        onChange={(e) => {
                            const value = Math.min(50, Math.max(1, parseInt(e.target.value) || 1));
                            setQuestionCount(value);
                        }}
                    />
                    
                    <p>Maximum: 50 questions</p>
                    
                    <StartQuizButton onClick={handleStartQuiz}>
                        Commencer le Quiz
                    </StartQuizButton>
                </QuestionCountModal>
            </ModalOverlay>
        );
    }

    if (isLoading) {
        return (
            <QuizContainer>
                <LoadingSpinner>
                    <div className="spinner"></div>
                    <p>Génération du quiz à partir du PDF...</p>
                </LoadingSpinner>
            </QuizContainer>
        );
    }

    if (error) {
        return (
            <QuizContainer>
                <ErrorContainer>
                    <h3>Erreur lors de la génération du quiz</h3>
                    <p>{error}</p>
                    <p>Veuillez réessayer ou utiliser un autre fichier PDF.</p>
                    <BackButton onClick={handleBackToDashboard}>
                        Retour au Dashboard
                    </BackButton>
                </ErrorContainer>
            </QuizContainer>
        );
    }

    if (quizCompleted) {
        return (
            <QuizContainer>
                <ResultCard>
                    <h2>Résultats du Quiz</h2>
                    <ScoreCircle score={score}>
                        <span>{score}%</span>
                    </ScoreCircle>
                    <p>
                        Vous avez répondu correctement à {Math.round((score / 100) * quizQuestions.length)} 
                        questions sur {quizQuestions.length}.
                    </p>
                    
                    <ReviewSection>
                        <h3>Réponses correctes :</h3>
                        {quizQuestions.map((question, qIndex) => (
                            <QuestionReview key={qIndex}>
                                <p><strong>Question {qIndex + 1}:</strong> {question.question}</p>
                                <p>
                                    <strong>Réponse correcte:</strong> {String.fromCharCode(65 + question.correct_answer)}. {question.options[question.correct_answer]}
                                </p>
                                {quizAnswers[qIndex] !== question.correct_answer && (
                                    <p className="incorrect">
                                        <strong>Votre réponse:</strong> {quizAnswers[qIndex] !== null 
                                            ? `${String.fromCharCode(65 + quizAnswers[qIndex])}. ${question.options[quizAnswers[qIndex]]}`
                                            : 'Non répondue'}
                                    </p>
                                )}
                            </QuestionReview>
                        ))}
                    </ReviewSection>
                    
                    <ButtonGroup>
                        <ReviewButton onClick={() => setQuizCompleted(false)}>
                            Revoir les questions
                        </ReviewButton>
                        <BackButton onClick={handleBackToDashboard}>
                            Retour au Dashboard
                        </BackButton>
                    </ButtonGroup>
                </ResultCard>
            </QuizContainer>
        );
    }

    if (quizQuestions.length === 0) {
        return (
            <QuizContainer>
                <EmptyState>
                    <h3>Aucune question disponible</h3>
                    <p>Le quiz n'a pas pu être généré à partir du PDF fourni.</p>
                    <BackButton onClick={handleBackToDashboard}>
                        Retour au Dashboard
                    </BackButton>
                </EmptyState>
            </QuizContainer>
        );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];

    return (
        <QuizContainer>
            <QuizHeader>
                <h2>{titre}</h2>
                <HeaderControls>
                    <ProgressIndicator>
                        Question {currentQuestionIndex + 1} / {quizQuestions.length}
                    </ProgressIndicator>
                    <BackButton onClick={handleBackToDashboard}>
                        Retour au Dashboard
                    </BackButton>
                </HeaderControls>
            </QuizHeader>

            <QuestionCard>
                <QuestionText>{currentQuestion.question}</QuestionText>
                
                <OptionsList>
                    {currentQuestion.options.map((option, optionIndex) => (
                        <OptionItem 
                            key={optionIndex}
                            selected={quizAnswers[currentQuestionIndex] === optionIndex}
                            onClick={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                        >
                            <OptionMarker>
                                {String.fromCharCode(65 + optionIndex)}.
                            </OptionMarker>
                            <OptionText>{option}</OptionText>
                        </OptionItem>
                    ))}
                </OptionsList>
            </QuestionCard>

            <NavigationControls>
                {currentQuestionIndex > 0 && (
                    <NavButton onClick={handlePreviousQuestion}>
                        ← Question précédente
                    </NavButton>
                )}
                
                {currentQuestionIndex < quizQuestions.length - 1 ? (
                    <NavButton 
                        onClick={handleNextQuestion}
                        disabled={quizAnswers[currentQuestionIndex] === null}
                        primary
                    >
                        Question suivante →
                    </NavButton>
                ) : (
                    <SubmitButton 
                        onClick={calculateScore}
                        disabled={quizAnswers[currentQuestionIndex] === null}
                    >
                        Terminer le quiz
                    </SubmitButton>
                )}
            </NavigationControls>
        </QuizContainer>
    );
}

// Styles
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const QuestionCountModal = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    h2 {
        margin-top: 0;
        color: #2c3e50;
    }

    p {
        margin: 1rem 0;
        color: #7f8c8d;
    }
`;

const QuestionCountInput = styled.input`
    padding: 0.8rem;
    font-size: 1.2rem;
    width: 80px;
    text-align: center;
    border: 2px solid #3498db;
    border-radius: 8px;
    margin: 0.5rem 0;
`;

const StartQuizButton = styled.button`
    padding: 0.8rem 1.5rem;
    margin-top: 1rem;
    background: #2ecc71;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
    font-size: 1rem;

    &:hover {
        background: #27ae60;
    }
`;

const BackButton = styled.button`
    padding: 0.6rem 1.2rem;
    background: #7f8c8d;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
    margin-left: 1rem;

    &:hover {
        background: #616a6b;
    }
`;

const HeaderControls = styled.div`
    display: flex;
    align-items: center;
`;

const ReviewSection = styled.div`
    margin: 2rem 0;
    text-align: left;
`;

const QuestionReview = styled.div`
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;

    p {
        margin: 0.5rem 0;
    }

    .incorrect {
        color: #c62828;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
`;

// Les autres styles restent les mêmes que dans votre code original
const QuizContainer = styled.div`
    max-width: 800px;
    margin: 2rem auto;
    padding: 1.5rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
`;

const LoadingSpinner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;

    .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    p {
        color: #7f8c8d;
        font-size: 1.1rem;
    }
`;

const QuizHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;

    h2 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.8rem;
    }
`;

const ProgressIndicator = styled.span`
    background: #3498db;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
`;

const QuestionCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
`;

const QuestionText = styled.h3`
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #2c3e50;
    font-size: 1.3rem;
    line-height: 1.5;
`;

const OptionsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const OptionItem = styled.li`
    padding: 1rem;
    margin-bottom: 0.8rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    background: ${props => props.selected ? '#e3f2fd' : '#f5f5f5'};
    border: 1px solid ${props => props.selected ? '#90caf9' : '#e0e0e0'};

    &:hover {
        background: ${props => !props.selected && '#e3f2fd'};
    }
`;

const OptionMarker = styled.span`
    font-weight: bold;
    margin-right: 1rem;
    color: #3498db;
`;

const OptionText = styled.span`
    flex: 1;
`;

const NavigationControls = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
`;

const NavButton = styled.button`
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    background: ${props => props.primary ? '#3498db' : '#f5f5f5'};
    color: ${props => props.primary ? 'white' : '#333'};
    cursor: pointer;
    transition: all 0.2s;
    font-weight: bold;

    &:hover {
        background: ${props => props.primary ? '#2980b9' : '#e0e0e0'};
    }

    &:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
    }
`;

const SubmitButton = styled(NavButton)`
    background: #2ecc71;
    color: white;

    &:hover {
        background: #27ae60;
    }
`;

const ResultCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const ScoreCircle = styled.div`
    width: 150px;
    height: 150px;
    margin: 2rem auto;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => {
        if (props.score >= 80) return '#e8f5e9';
        if (props.score >= 50) return '#fff8e1';
        return '#ffebee';
    }};
    border: 5px solid ${props => {
        if (props.score >= 80) return '#a5d6a7';
        if (props.score >= 50) return '#ffd54f';
        return '#ef9a9a';
    }};
    color: ${props => {
        if (props.score >= 80) return '#2e7d32';
        if (props.score >= 50) return '#f57f17';
        return '#c62828';
    }};
    font-size: 2rem;
    font-weight: bold;
`;

const ReviewButton = styled.button`
    padding: 0.8rem 1.5rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;

    &:hover {
        background: #2980b9;
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 2rem;
    background: #f5f5f5;
    border-radius: 12px;

    h3 {
        color: #7f8c8d;
    }
`;

const ErrorContainer = styled.div`
    text-align: center;
    padding: 2rem;
    background: #ffebee;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    h3 {
        color: #c62828;
    }

    p {
        color: #7f8c8d;
        margin: 0.5rem 0;
    }
`;