import { useState, useEffect, useRef } from "react";
import { apiRequest } from "../../utils/fetchapi";
import '../../src/styleCss/Chatbot.css';



// l'api ne fonction pas::::::::::

export function Chatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(Date.now().toString()); // ID unique par session

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Message utilisateur
    const userMessage = { 
      sender: 'user', 
      text: message,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Réponse du bot
    try {
      const data = await apiRequest('/chat', 'POST', { 
        message,
        sessionId: sessionId.current 
      });
      
      // Simulation de délai de frappe
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const botMessage = { 
        sender: 'bot', 
        text: data.reply,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        sender: 'bot', 
        text: "Désolé, je rencontre un problème. Veuillez réessayer plus tard.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

 


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-app">
      <div className="particles-background"></div>
      
      <div className="chat-container glassmorphism">
        <div className="chat-header">
          <h2>Assistant Virtuel</h2>
          <div className="status-dot"></div>
        </div>
        
        <div className="messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-bubble ${msg.sender}`}>
              <div className="message-content">
                {msg.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <div className="message-time">
                {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message-bubble bot typing-indicator">
              <div className="typing-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            aria-label="Message input"
            autoFocus
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!message.trim() || isTyping}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}