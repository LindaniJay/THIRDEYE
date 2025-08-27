import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComment, 
  faTimes, 
  faPaperPlane, 
  faCalendarAlt,
  faClock,
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns';

interface Message {
  id: number;
  text: string | React.ReactNode;
  sender: 'user' | 'bot';
  type: 'text' | 'options';
  options?: string[];
}

interface BookingData {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

const WORKING_HOURS = {
  start: 8, // 8 AM
  end: 17, // 5 PM
  daysOff: [0, 6] // Sunday (0) and Saturday (6)
};

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

const SERVICES: Service[] = [
  { id: 'vehicle', name: 'Vehicle Inspection', price: 800, duration: 90 },
  { id: 'new-car', name: 'New Car Consultation', price: 500, duration: 60 },
  { id: 'property', name: 'Rental Property Inspection', price: 600, duration: 120 },
  { id: 'holiday', name: 'Holiday Accommodation Inspection', price: 700, duration: 90 },
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "👋 Hello there! I'm your Third Eye assistant. What's your name?",
    sender: 'bot',
    type: 'text'
  }]);
  const [userName, setUserName] = useState('');
  const [hasAskedForName, setHasAskedForName] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle greetings
  const handleGreeting = (input: string) => {
    const greetings: Record<string, string[]> = {
      'hi': ['Hello', 'Hi there', 'Hey'],
      'hello': ['Hello', 'Hi there', 'Greetings'],
      'hey': ['Hey', 'Hi', 'Hello there'],
      'good morning': ['Good morning', 'Morning'],
      'good afternoon': ['Good afternoon', 'Afternoon'],
      'good evening': ['Good evening', 'Evening']
    };

    for (const [greeting, responses] of Object.entries(greetings)) {
      if (input.includes(greeting)) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const timeAwareResponse = greeting.includes('morning') || greeting.includes('afternoon') || greeting.includes('evening')
          ? `${randomResponse}!`
          : `${randomResponse}${userName ? ' ' + userName : ''}!`;
        
        return {
          text: timeAwareResponse,
          options: ['Book an inspection', 'View services', 'Contact support']
        };
      }
    }
    return null;
  };

  // Handle name input
  const handleNameInput = (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      const firstName = trimmedName.split(' ')[0];
      setUserName(firstName);
      setHasAskedForName(true);
      
      const welcomeMessages = [
        `Nice to meet you, ${firstName}! I'm here to help you with our services.`,
        `Great to meet you, ${firstName}! How can I assist you today?`,
        `Hello ${firstName}! What can I help you with today?`,
        `Hi ${firstName}! How can I be of service?`
      ];
      
      const welcomeMessage: Message = {
        id: messages.length + 1,
        text: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
        sender: 'bot',
        type: 'options',
        options: ['Book an inspection', 'View services', 'Contact support']
      };
      
      setMessages(prev => [...prev, welcomeMessage]);
      return true;
    }
    
    // If name is empty, ask again
    const errorMessage: Message = {
      id: messages.length + 1,
      text: "I didn't catch your name. Could you please tell me your name?",
      sender: 'bot',
      type: 'text'
    };
    
    setMessages(prev => [...prev, errorMessage]);
    return false;
  };

  // Start booking flow
  const startBooking = useCallback(() => {
    setIsBooking(true);
    setCurrentStep(1);
    
    const bookingStartMessage = {
      id: messages.length + 1,
      text: `${userName ? userName + ', ' : ''}I'd be happy to help you book an inspection. Which service are you interested in?`,
      sender: 'bot' as const,
      type: 'options' as const,
      options: SERVICES.map(service => service.name)
    };
    
    setMessages(prev => [...prev, bookingStartMessage]);
  }, [messages.length, userName]);

  // Handle service selection
  const handleServiceSelection = useCallback((serviceId: string) => {
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;

    setBookingData(prev => ({
      ...prev,
      service: service.name,
      price: service.price,
      duration: service.duration
    }));
    
    const serviceMessage: Message = {
      id: messages.length + 1,
      text: `You've selected ${service.name}. This service costs R${service.price} and takes approximately ${service.duration} minutes.`,
      sender: 'bot',
      type: 'text'
    };
    
    setMessages(prev => [...prev, serviceMessage]);
    setCurrentStep(2);
  }, [messages.length]);

  // Handle booking flow steps
  const handleBookingFlow = useCallback((input: string) => {
    // Implement booking flow steps here
    // This is a simplified version - you'll need to expand this based on your requirements
    const response: Message = {
      id: messages.length + 1,
      text: "Thanks for your interest! A booking agent will contact you shortly.",
      sender: 'bot',
      type: 'text'
    };
    
    setMessages(prev => [...prev, response]);
    setIsBooking(false);
    setCurrentStep(0);
  }, [messages.length]);

  // Process user input
  const processUserInput = useCallback((input: string) => {
    const normalizedInput = input.toLowerCase().trim();
    
    // Check for greetings
    const greetingResponse = handleGreeting(normalizedInput);
    if (greetingResponse) {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: greetingResponse.text,
        sender: 'bot',
        type: 'options',
        options: greetingResponse.options
      }]);
      return;
    }

    // Handle name input if not set
    if (!hasAskedForName) {
      handleNameInput(input);
      return;
    }

    // Handle booking flow
    if (isBooking) {
      handleBookingFlow(input);
      return;
    }

    // Handle service selection
    const selectedService = SERVICES.find(service => 
      normalizedInput.includes(service.name.toLowerCase())
    );

    if (selectedService) {
      handleServiceSelection(selectedService.id);
      return;
    }

    // Handle common questions
    const commonQuestions = {
      'services': 'We offer vehicle inspections, new car consultations, rental property inspections, and holiday accommodation inspections.',
      'working hours': 'We are open Monday to Friday from 8 AM to 5 PM.',
      'contact': 'You can contact us at info@thirdeye.com or call us at (123) 456-7890.'
    };

    const commonQuestion = Object.entries(commonQuestions).find(([key]) => 
      normalizedInput.includes(key)
    );

    if (commonQuestion) {
      const response: Message = {
        id: messages.length + 1,
        text: commonQuestion[1],
        sender: 'bot',
        type: 'options',
        options: ['Book an inspection', 'View services', 'Contact support']
      };
      setMessages(prev => [...prev, response]);
      return;
    }

    // Default response
    const defaultResponse: Message = {
      id: messages.length + 1,
      text: "I'm not sure how to help with that. Would you like to book an inspection or ask about our services?",
      sender: 'bot',
      type: 'options',
      options: ['Book an inspection', 'View services', 'Contact support']
    };
    
    setMessages(prev => [...prev, defaultResponse]);
  }, [
    hasAskedForName, 
    isBooking, 
    messages.length, 
    handleBookingFlow, 
    handleServiceSelection
  ]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const userInput = inputValue.trim();
    if (!userInput) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: userInput,
      sender: 'user',
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Process the message
    processUserInput(userInput);
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Handle quick reply
  const handleQuickReply = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'user',
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process the message
    processUserInput(text);
  };

  return (
    <div className={`fixed bottom-8 right-8 z-50`}>
      {isOpen ? (
        <div className="bg-gray-800 rounded-lg shadow-xl w-96 flex flex-col" style={{ height: '600px' }}>
          {/* Chat header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Third Eye Assistant</h3>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  {message.type === 'options' && message.options && (
                    <div className="mt-2 space-y-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(option)}
                          className="block w-full text-left px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 focus:outline-none"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
