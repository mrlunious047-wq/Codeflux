import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { sendMessage } from '../../services/api';
import MessageBubble from './MessageBubble';

const ChatInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { currentProject, addMessage, setGeneratedCode } = useProject();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentProject?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: message };
    addMessage(userMessage);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(message, currentProject?.id);
      const aiMessage = { role: 'assistant' as const, content: response.message };
      addMessage(aiMessage);
      
      if (response.code) {
        setGeneratedCode(response.code, response.language);
      }
    } catch (error) {
      const errorMessage = { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-cyber-gray rounded-2xl border border-neon-green/20 backdrop-blur-sm">
      {/* Chat Header */}
      <div className="p-4 border-b border-neon-green/20">
        <h2 className="text-xl font-mono font-bold text-neon-green">
          CodeFlux AI Assistant
        </h2>
        <p className="text-sm text-gray-400">Describe what you want to build...</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentProject?.messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-neon-green">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm">CodeFlux is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-neon-green/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask for a portfolio site, React component, Python script..."
            className="flex-1 bg-cyber-black border border-neon-green/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-neon-green focus:animate-pulse-glow"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="px-6 py-3 bg-neon-green text-cyber-black font-mono font-bold rounded-lg hover:bg-neon-green-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
          >
            {isLoading ? '...' : 'SEND'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Portfolio site', 'React component', 'Python API', 'CSS animation'].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setMessage(prompt)}
              className="px-3 py-1 text-xs bg-glass border border-neon-green/20 rounded-lg text-neon-green hover:border-neon-green transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
