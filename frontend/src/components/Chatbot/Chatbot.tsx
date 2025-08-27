import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Third Eye assistant. How can I help you with our services today?",
      sender: 'bot'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const serviceInfo = {
    'vehicle': 'We offer comprehensive vehicle inspections starting at R800. Our 200+ point inspection covers mechanical, electrical, and cosmetic aspects of the vehicle.',
    'new-car': 'Our new car consultation service (R500) helps you make an informed decision when purchasing a new vehicle, including market value assessment and model comparison.',
    'property': 'Our rental property inspections (R600) ensure your potential rental property is in good condition and help identify any potential issues before you sign a lease.',
    'holiday': 'Our holiday accommodation inspection service (R700) verifies that your vacation rental meets all advertised features and is in proper condition for your stay.'
  };

  const commonQuestions = {
    'services': 'We offer four main services: 1) Vehicle Inspections (R800), 2) New Car Consultation (R500), 3) Rental Property Inspections (R600), and 4) Holiday Accommodation Inspections (R700).',
    'working hours': 'Our standard working hours are Monday to Friday from 8:00 AM to 5:00 PM. We also offer weekend appointments for urgent inspections.',
    'contact': 'You can reach us at info@thirdeye.co.za or call us at +27 82 123 4567. Feel free to also use our contact form for detailed inquiries.',
    'chauffeur': 'We offer chauffeur services for R500, available with all our inspection services except for new car consultations.'
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue.toLowerCase());
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const generateBotResponse = (input: string): string => {
    // Check for service-related queries
    if (input.includes('vehicle') || input.includes('car') || input.includes('auto')) {
      return serviceInfo.vehicle;
    } else if (input.includes('new car') || input.includes('new vehicle')) {
      return serviceInfo['new-car'];
    } else if (input.includes('rental') || input.includes('property') || input.includes('apartment') || input.includes('house')) {
      return serviceInfo.property;
    } else if (input.includes('holiday') || input.includes('vacation') || input.includes('accommodation')) {
      return serviceInfo.holiday;
    }

    // Check common questions
    for (const [key, response] of Object.entries(commonQuestions)) {
      if (input.includes(key)) {
        return response;
      }
    }

    // Default response
    return "I'm here to help! Could you please rephrase your question or ask about our services, working hours, or contact information?";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="bg-gray-800 rounded-lg shadow-xl w-80 flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Third Eye Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-700">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span 
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-600 bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white rounded-lg px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Open chat"
        >
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
