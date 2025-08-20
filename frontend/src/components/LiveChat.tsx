import React, { useState, useEffect, useRef } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
// @ts-ignore - Importing default export
import { io } from 'socket.io-client';
// @ts-ignore - Socket type is available in socket.io-client
type Socket = any;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'expert';
  timestamp: Date;
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize chat
    const initializeChat = async () => {
      try {
        const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 5000,
          transports: ['websocket', 'polling']
        });
        
        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('Connected to chat server');
          setIsConnected(true);
          
          // Add welcome message
          setMessages([{
            id: '1',
            text: 'Hello! How can I help you with your vehicle inspection today?',
            sender: 'expert',
            timestamp: new Date()
          }]);
        });

        socket.on('disconnect', (reason) => {
          console.log('Disconnected from chat server:', reason);
          setIsConnected(false);
          
          // Show offline message if not a normal disconnection
          if (reason !== 'io client disconnect') {
            setMessages(prev => [...prev, {
              id: `offline-${Date.now()}`,
              text: 'Chat is currently offline. Please try again later or contact us via email/phone.',
              sender: 'expert',
              timestamp: new Date()
            }]);
          }
        });

        socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          setIsConnected(false);
        });

        socket.on('message', (message: Omit<Message, 'timestamp'> & { timestamp: string }) => {
          setMessages(prev => [...prev, {
            ...message,
            timestamp: new Date(message.timestamp)
          }]);
        });

        socket.on('typing', (isTyping: boolean) => {
          setIsTyping(isTyping);
        });

        return () => {
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        };
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        setIsConnected(false);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = newMessage.trim();
    if (!messageText) return;

    const message: Omit<Message, 'id' | 'timestamp'> = {
      text: messageText,
      sender: 'user' as const
    };

    // Optimistically update UI
    setMessages(prev => [...prev, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]);

    // Only try to send if connected
    if (isConnected && socketRef.current?.connected) {
      try {
        socketRef.current.emit('message', message);
      } catch (error) {
        console.error('Failed to send message:', error);
        // Show error message to user
        setMessages(prev => [...prev, {
          id: `error-${Date.now()}`,
          text: 'Failed to send message. Please try again later.',
          sender: 'expert',
          timestamp: new Date()
        }]);
      }
    } else {
      // Show offline message
      setMessages(prev => [...prev, {
        id: `offline-${Date.now()}`,
        text: 'Message not sent. Chat is currently offline. Please contact us via email or phone.',
        sender: 'expert',
        timestamp: new Date()
      }]);
    }
    
    setNewMessage('');
  };

  const handleTyping = () => {
    if (!isConnected) return;
    socketRef.current?.emit('typing', newMessage.length > 0);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Open chat"
      >
        <FiMessageCircle size={24} />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-lg overflow-hidden w-64 z-50">
        <div className="bg-blue-600 text-white p-3 flex justify-between items-center cursor-pointer" onClick={() => setIsMinimized(false)}>
          <span className="font-medium">Inspection Support</span>
          <div className="flex space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-80 bg-white rounded-lg shadow-xl flex flex-col z-50" style={{ height: '500px' }}>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Inspection Support</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsMinimized(true)}
            className="text-white hover:text-gray-200 p-1"
            aria-label="Minimize chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 p-1"
            aria-label="Close chat"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-100 text-blue-900 rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-1 mb-4">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (newMessage.trim() && isConnected) {
                  handleSendMessage(e);
                }
              }
            }}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!newMessage.trim() || !isConnected}
          >
            <FiSend size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;
