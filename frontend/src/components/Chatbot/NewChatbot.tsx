import React, { useState, useRef, useEffect, useCallback, FC, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
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

interface MediaItem {
  type: 'image' | 'document' | 'video';
  url: string;
  alt?: string;
  title?: string;
}

interface Message {
  id: number;
  text: string | ReactNode;
  sender: 'user' | 'bot';
  type: 'text' | 'options' | 'media';
  options?: string[];
  media?: MediaItem[];
  context?: {
    isServiceSelection?: boolean;
    isBookingConfirmation?: boolean;
    isHelpRequest?: boolean;
  };
}

interface BookingData {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  price?: number;
  duration?: number;
}

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

// Load messages from localStorage if available
const loadMessages = (): Message[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [{
      id: 1,
      text: "👋 Hello there! I'm your Third Eye assistant. What's your name?",
      sender: 'bot',
      type: 'text' as const
    }];
  }
  return [{
    id: 1,
    text: "👋 Hello there! I'm your Third Eye assistant. What's your name?",
    sender: 'bot',
    type: 'text' as const
  }];
};

const NewChatbot: FC = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [userName, setUserName] = useState('');
  const [hasAskedForName, setHasAskedForName] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Common questions and responses
  const commonQuestions: Record<string, string> = {
    'services': 'We offer vehicle inspections, new car consultations, rental property inspections, and holiday accommodation inspections.',
    'working hours': 'We are open Monday to Friday from 8 AM to 5 PM.',
    'contact': 'You can contact us at info@thirdeye.com or call us at (123) 456-7890.'
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Handle name input
  const handleNameInput = (name: string): boolean => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      const errorMessage: Message = {
        id: messages.length + 1,
        text: "I didn't catch your name. Could you please tell me your name?",
        sender: 'bot',
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
      return false;
    }

    const firstName = trimmedName.split(' ')[0];
    setUserName(firstName);
    setHasAskedForName(true);
    
    const welcomeMessages = [
      `Hi ${firstName}! How can I help you today?`,
      `Hello ${firstName}! What can I assist you with?`,
      `Welcome ${firstName}! How can I be of service?`
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
  };

  // Handle greetings
  const handleGreeting = (input: string): { text: string; options: string[] } | null => {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    
    if (greetings.some(greeting => input.toLowerCase().includes(greeting))) {
      const responses = [
        "Hello! How can I help you today?",
        "Hi there! What can I do for you?",
        "Greetings! How may I assist you?"
      ];
      
      return {
        text: responses[Math.floor(Math.random() * responses.length)],
        options: ['Book an inspection', 'View services', 'Contact support']
      };
    }
    
    return null;
  };

  // Start booking process
  const startBooking = useCallback((): void => {
    setIsBooking(true);
    setCurrentStep(1);
    
    const greeting = userName ? `${userName}, ` : '';
    const bookingStartMessage: Message = {
      id: messages.length + 1,
      text: `${greeting}I'd be happy to help you book an inspection. Which service are you interested in?`,
      sender: 'bot',
      type: 'options',
      options: SERVICES.map(service => service.name),
      context: { isServiceSelection: true }
    };
    
    setMessages(prev => [...prev, bookingStartMessage]);
  }, [messages.length, userName]);

  // Service-specific instructions
  const getServiceInstructions = (service: Service): string => {
    const instructions: Record<string, string> = {
      'Vehicle Inspection': 'Please have your vehicle registration and service history ready.',
      'New Car Consultation': 'Please have the vehicle details and your questions ready.',
      'Rental Property Inspection': 'Please ensure the property is accessible and have the address ready.',
      'Holiday Accommodation Inspection': 'Please have the accommodation details and check-in time ready.'
    };
    return instructions[service.name] || 'Please be ready with any relevant documents or information.';
  };

  // Get service details with rich content
  const getServiceDetails = (service: Service): { text: string; media?: MediaItem[] } => {
    if (!service) {
      return { text: 'Service details not available.', media: [] };
    }
    
    const details: { text: string; media?: MediaItem[] } = {
      text: `🔍 **${service.name}**\n\n` +
        `• Price: R${service.price}\n` +
        `• Duration: ${service.duration} minutes\n\n` +
        getServiceInstructions(service),
      media: []
    };

    // Add service-specific media
    switch(service.id) {
      case 'vehicle':
        details.media = [{
          type: 'image',
          url: '/images/vehicle-inspection.jpg',
          alt: 'Vehicle Inspection',
          title: 'Comprehensive Vehicle Inspection'
        }];
        break;
      case 'new-car':
        details.media = [{
          type: 'image',
          url: '/images/new-car-consultation.jpg',
          alt: 'New Car Consultation',
          title: 'Expert Car Buying Advice'
        }];
        break;
      case 'property':
        details.media = [{
          type: 'image',
          url: '/images/property-inspection.jpg',
          alt: 'Property Inspection',
          title: 'Thorough Property Assessment'
        }];
        break;
      case 'holiday':
        details.media = [{
          type: 'image',
          url: '/images/holiday-inspection.jpg',
          alt: 'Holiday Accommodation Inspection',
          title: 'Vacation Rental Verification'
        }];
        break;
    }

    return details;
  };

  // Handle service selection
  const handleServiceSelection = useCallback((serviceName: string): void => {
    // Check for exact match first
    let service = SERVICES.find(s => 
      s.name.toLowerCase() === serviceName.toLowerCase()
    );

    // If no exact match, try partial match
    if (!service) {
      service = SERVICES.find(s => 
        serviceName.toLowerCase().includes(s.name.toLowerCase()) || 
        s.name.toLowerCase().includes(serviceName.toLowerCase())
      );
    }
    
    if (!service) {
      // If still no match, show error with service options
      const errorMessage: Message = {
        id: Date.now(),
        text: "I'm sorry, I couldn't find that service. Please select from the options below:",
        sender: 'bot',
        type: 'options',
        options: [...SERVICES.map(s => s.name), 'Back to main menu'],
        context: { isServiceSelection: true }
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }
    
    // Update booking data with selected service
    setBookingData(prev => ({
      ...prev,
      service: service.name,
      price: service.price,
      duration: service.duration
    }));
    
    // Get service details
    const serviceDetails = getServiceDetails(service);
    
    // Create service message with options
    const serviceMessage: Message = {
      id: Date.now(),
      text: serviceDetails.text,
      sender: 'bot',
      type: serviceDetails.media?.length ? 'media' : 'text',
      media: serviceDetails.media,
      options: ['Book this service', 'View other services', 'Back to main menu'],
      context: { isServiceSelection: false }
    };
    
    // Add service message to chat
    setMessages(prev => [...prev, serviceMessage]);
    setCurrentStep(2);
  }, [messages.length]);

  // Handle booking confirmation
  const handleBookingConfirmation = useCallback((input: string): void => {
    const normalizedInput = input.toLowerCase();
    
    if (normalizedInput.includes('yes') || normalizedInput.includes('confirm') || normalizedInput.includes('book it')) {
      // Process booking confirmation
      const confirmationMessage: Message = {
        id: messages.length + 1,
        text: `✅ Booking confirmed! We've sent the details to your email. Is there anything else I can help you with?`,
        sender: 'bot',
        type: 'options',
        options: ['Book another inspection', 'View services', 'Contact support']
      };
      setMessages(prev => [...prev, confirmationMessage]);
      setIsBooking(false);
      setCurrentStep(0);
    } else if (normalizedInput.includes('change service') || normalizedInput.includes('different service')) {
      // Handle service change
      const serviceMessage: Message = {
        id: messages.length + 1,
        text: 'Which service would you like to book instead?',
        sender: 'bot',
        type: 'options',
        options: SERVICES.map(s => s.name),
        context: { isServiceSelection: true }
      };
      setMessages(prev => [...prev, serviceMessage]);
      setCurrentStep(1);
    } else if (normalizedInput.includes('cancel') || normalizedInput.includes('no')) {
      // Handle cancellation
      const cancelMessage: Message = {
        id: messages.length + 1,
        text: 'No problem! The booking has been cancelled. Is there anything else I can help you with?',
        sender: 'bot',
        type: 'options',
        options: ['Book an inspection', 'View services', 'Contact support']
      };
      setMessages(prev => [...prev, cancelMessage]);
      setIsBooking(false);
      setCurrentStep(0);
      setBookingData({});
    } else {
      // Handle other responses
      const clarificationMessage: Message = {
        id: messages.length + 1,
        text: 'I\'m not sure what you\'d like to do. Please choose an option below:',
        sender: 'bot',
        type: 'options',
        options: ['Yes, book it', 'Change service', 'Cancel booking'],
        context: { isBookingConfirmation: true }
      };
      setMessages(prev => [...prev, clarificationMessage]);
    }
  }, [messages.length]);

  // Get help message
  const getHelpMessage = (): Message => ({
    id: messages.length + 1,
    text: "I'm here to help! Here's what I can do:\n\n" +
      "• Book an inspection\n" +
      "• Provide service information\n" +
      "• Answer common questions\n" +
      "• Connect you with support\n\n" +
      "What would you like to do?",
    sender: 'bot',
    type: 'options',
    options: ['Book an inspection', 'View services', 'Contact support', 'Common questions']
  });

  // Simulate typing delay
  const simulateTyping = async (callback: () => void): Promise<void> => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    callback();
    setIsTyping(false);
  };

  // Process user input
  const processUserInput = useCallback((input: string): void => {
    const normalizedInput = input.toLowerCase().trim();
    
    // Check for context from previous message
    const lastMessage = messages[messages.length - 1];
    
    // Handle booking confirmation context
    if (lastMessage?.context?.isBookingConfirmation) {
      return handleBookingConfirmation(input);
    }
    
    // Handle service selection context
    if (lastMessage?.context?.isServiceSelection) {
      return handleServiceSelection(input);
    }
    
    // Process user input with context awareness
    const processUserInputBase = (): void => {
      // Check for goodbye
      if (['bye', 'goodbye', 'see you', 'goodbye!', 'bye!', 'see you later'].includes(normalizedInput)) {
        const goodbyeMessages = [
          `Goodbye${userName ? ' ' + userName : ''}! Have a great day! 👋`,
          `See you later${userName ? ' ' + userName : ''}! Take care! 👋`,
          `Goodbye${userName ? ' ' + userName : ''}! Thanks for chatting with us! 👋`
        ];
        
        const randomGoodbye = goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)];
        
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: randomGoodbye,
          sender: 'bot',
          type: 'text'
        }]);
        
        // Close the chat after a short delay
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
        return;
      }
      
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
        if (currentStep === 1) {
          // Handle service selection from text input
          const selectedService = SERVICES.find(service => 
            normalizedInput.includes(service.name.toLowerCase())
          );
          
          if (selectedService) {
            handleServiceSelection(selectedService.name);
          } else {
            const errorMessage: Message = {
              id: messages.length + 1,
              text: "I'm not sure which service you're referring to. Please select one from the options below:",
              sender: 'bot',
              type: 'options',
              options: SERVICES.map(service => service.name),
              context: { isServiceSelection: true }
            };
            setMessages(prev => [...prev, errorMessage]);
          }
          return;
        } else if (currentStep === 2) {
          // Handle booking details
          const bookingConfirmation: Message = {
            id: messages.length + 1,
            text: `Thank you for providing the details! I've noted your preference for ${bookingData.service} on ${input}. Our team will contact you shortly to confirm the booking.`,
            sender: 'bot',
            type: 'text'
          };
          setMessages(prev => [...prev, bookingConfirmation]);
          setIsBooking(false);
          setCurrentStep(0);
          
          // Show options after booking
          setTimeout(() => {
            const followUpMessage: Message = {
              id: messages.length + 2,
              text: "Is there anything else I can help you with?",
              sender: 'bot',
              type: 'options',
              options: ['Book another inspection', 'View services', 'Contact support']
            };
            setMessages(prev => [...prev, followUpMessage]);
          }, 1000);
          return;
        }
      }

      // Handle help command
      if (normalizedInput === 'help') {
        setMessages(prev => [...prev, getHelpMessage()]);
        return;
      }

      // Handle common questions
      const commonQuestion = Object.entries(commonQuestions).find(([key]) => 
        normalizedInput.includes(key)
      );

      if (commonQuestion) {
        const response: Message = {
          id: messages.length + 1,
          text: commonQuestion[1],
          sender: 'bot',
          type: 'options',
          options: ['Book an inspection', 'View services', 'Contact support', 'Help']
        };
        setMessages(prev => [...prev, response]);
        return;
      }

      // Default response with contextual options
      const defaultOptions = lastMessage?.options || ['Book an inspection', 'View services', 'Contact support', 'Help'];
      
      const defaultResponse: Message = {
        id: messages.length + 1,
        text: "I'm not sure how to help with that. How can I assist you today?",
        sender: 'bot',
        type: 'options',
        options: Array.from(new Set(defaultOptions)) // Remove duplicates
      };
      
      setMessages(prev => [...prev, defaultResponse]);
    };

    processUserInputBase();
  }, [
    messages, 
    userName, 
    hasAskedForName, 
    isBooking, 
    currentStep, 
    bookingData.service, 
    handleServiceSelection, 
    handleBookingConfirmation
  ]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const userInput = inputValue.trim();
    if (!userInput || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: userInput,
      sender: 'user',
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Process the message with typing indicator
    simulateTyping(() => processUserInput(userInput));
  };

  // Toggle chat window
  const toggleChat = (): void => {
    setIsOpen(!isOpen);
  };

  // Handle quick reply
  const handleQuickReply = (text: string): void => {
    if (isTyping) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process with typing indicator
    simulateTyping(() => {
      const lowerText = text.toLowerCase();
      
      // Check for navigation options first
      if (lowerText === 'back to main menu') {
        const welcomeMessage: Message = {
          id: Date.now() + 1,
          text: `Welcome back! How can I help you today?`,
          sender: 'bot',
          type: 'options',
          options: ['Book an inspection', 'View services', 'Contact support']
        };
        setMessages(prev => [...prev, welcomeMessage]);
        setCurrentStep(0);
        setIsBooking(false);
        return;
      }
      
      if (lowerText === 'view other services' || lowerText === 'view services') {
        const servicesMessage: Message = {
          id: Date.now() + 1,
          text: 'Here are our available services. Please select one:',
          sender: 'bot',
          type: 'options',
          options: [...SERVICES.map(s => s.name), 'Back to main menu'],
          context: { isServiceSelection: true }
        };
        setMessages(prev => [...prev, servicesMessage]);
        return;
      }
      
      // Check if the text matches any service name
      const selectedService = SERVICES.find(service => 
        service.name.toLowerCase() === lowerText
      );
      
      if (selectedService) {
        handleServiceSelection(selectedService.name);
      } else if (lowerText === 'book an inspection' || lowerText === 'book this service') {
        if (bookingData.service) {
          // If we already have a service selected, proceed to booking
          startBooking();
        } else {
          // Otherwise show services to select from
          const servicesMessage: Message = {
            id: Date.now() + 1,
            text: 'Please select a service to book:',
            sender: 'bot',
            type: 'options',
            options: [...SERVICES.map(s => s.name), 'Back to main menu'],
            context: { isServiceSelection: true }
          };
          setMessages(prev => [...prev, servicesMessage]);
        }
      } else if (lowerText === 'help') {
        setMessages(prev => [...prev, getHelpMessage()]);
      } else {
        processUserInput(text);
      }
    });
  };

  // Render message content
  const renderMessageContent = (message: Message): ReactNode => {
    if (isTyping && message.sender === 'bot') {
      return (
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      );
    }

    // Render media if present
    const mediaElements = message.media?.map((item, index) => {
      switch (item.type) {
        case 'image':
          return (
            <div key={index} className="my-2 rounded-lg overflow-hidden">
              <img 
                src={item.url} 
                alt={item.alt || ''} 
                title={item.title}
                className="max-w-full h-auto rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          );
        // Add cases for other media types (document, video) as needed
        default:
          return null;
      }
    });
    
    // Render text content
    const textContent = typeof message.text === 'string' 
      ? message.text.split('\n').map((line, i) => (
          <p key={i} className="mb-1">{line}</p>
        ))
      : message.text;

    return (
      <>
        {textContent}
        {mediaElements}
      </>
    );
  };

  // Get contextual quick replies based on conversation state
  const getContextualReplies = (): string[] => {
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || lastMessage.sender === 'user') {
      return [];
    }

    // Check for specific contexts in the last bot message
    if (lastMessage.context?.isServiceSelection) {
      return [
        'Vehicle Inspection', 
        'New Car Consultation',
        'Rental Property Inspection',
        'Holiday Accommodation Inspection'
      ];
    }

    if (lastMessage.context?.isBookingConfirmation) {
      return ['Yes, book it', 'No, change details', 'Cancel booking'];
    }

    if (lastMessage.context?.isHelpRequest) {
      return ['Booking help', 'Service details', 'Contact support'];
    }

    // Default quick replies
    return [
      'Book an inspection', 
      'View services', 
      'Contact support'
    ];
  };

  const chatContainerStyle = {
    height: '85vh',
    maxHeight: '600px',
    width: '95vw',
    maxWidth: '24rem',
    minWidth: '280px',
    position: 'fixed' as const,
    bottom: '1rem',
    right: '1rem',
    zIndex: 50,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    borderRadius: '0.5rem',
    backgroundColor: 'white'
  };

  const toggleButtonStyle = {
    position: 'fixed' as const,
    bottom: '1rem',
    right: '1rem',
    zIndex: 40
  };

  return (
    <>
      {!isOpen ? (
        <button
          onClick={toggleChat}
          style={toggleButtonStyle}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
          aria-label="Open chat"
        >
          <FontAwesomeIcon icon={faComments} size="lg" />
        </button>
      ) : (
        <div style={chatContainerStyle}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-blue-500 text-white">
            <h3 className="text-lg font-medium">Chat with us</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setMessages([{
                    id: Date.now(),
                    text: " Chat cleared! How can I help you today?",
                    sender: 'bot',
                    type: 'text'
                  }]);
                  setCurrentStep(0);
                  setBookingData({});
                  setHasAskedForName(false);
                }}
                className="text-white hover:bg-blue-600 focus:outline-none px-2 py-1 text-sm rounded"
                aria-label="New chat"
              >
                New Chat
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-blue-600 focus:outline-none w-8 h-8 flex items-center justify-center rounded-full"
                aria-label="Close chat"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {renderMessageContent(message)}
                  </div>
                  
                  {/* Quick reply options */}
                  {message.sender === 'bot' && message.type === 'options' && message.options && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickReply(option)}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap"
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
          <div className="p-3 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isTyping}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={!inputValue.trim() || isTyping}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
            
            {/* Quick reply suggestions */}
            {getContextualReplies().length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {getContextualReplies().map((reply, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full whitespace-nowrap"
                    disabled={isTyping}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewChatbot;
