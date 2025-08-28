import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, X, HelpCircle } from "lucide-react";

// Define message type
type Message = {
  sender: "bot" | "user";
  text: string;
  type?: string;
  options?: { text: string; action: () => void }[];
  snip_old_id?: number;
};

interface Service {
  name: string;
  emoji: string;
  duration: string;
  price: number;
  description: string;
}

interface Context {
  step:
    | "greeting"
    | "chooseOption"
    | "confirmServiceAfterInfo"
    | "selectService"
    | "schedule"
    | "getName"
    | "getPhone"
    | "getEmail"
    | "reminderConfirmation"
    | "finalConfirmation"
    | "humanHandoff"
    | "help";
  service?: string;
}

interface UserData {
  service?: string;
  schedule?: string;
  name?: string;
  phone?: string;
  email?: string;
}

const services: Service[] = [
  {
    name: "Used Car Inspection",
    emoji: "🚗",
    duration: "1h",
    price: 899,
    description:
      "Comprehensive 120-point inspection covering all major vehicle systems, including roadworthy checks and service history verification",
  },
  {
    name: "Property Inspection",
    emoji: "🏡",
    duration: "1h 30m",
    snip_old_id: 2,
    price: 1499,
    description:
      "Detailed inspection of residential properties, including structural integrity, electrical, and plumbing checks",
  },
  {
    name: "Vehicle Roadworthy Check",
    emoji: "🔧",
    duration: "45m",
    price: 599,
    description:
      "Official roadworthy inspection to ensure your vehicle meets South African road safety standards",
  },
  {
    name: "Rental Property Snag List",
    emoji: "📝",
    duration: "1h",
    price: 1299,
    description:
      "Comprehensive snag list for rental properties, including high-resolution photos and detailed report",
  },
  {
    name: "Pre-Purchase Vehicle Inspection",
    emoji: "🔍",
    duration: "1h 15m",
    price: 999,
    description:
      "Thorough inspection of used vehicles before purchase, including test drive and VIN verification",
  },
];

// Centralized service options
const getServiceOptions = (
  setContext: React.Dispatch<React.SetStateAction<Context>>,
  addBotMessage: (text: string, type?: string, options?: { text: string; action: () => void }[]) => void
) => ({
  type: "service-selection",
  options: services.map((service) => ({
    text: `${service.emoji} ${service.name}\n⏱ ${service.duration} • ${formatPrice(service.price)}\n${service.description}`,
    action: () => {
      setContext({ step: "schedule", service: service.name });
      addBotMessage(
        `You've selected: ${service.emoji} *${service.name}*\n` +
          `⏱ Duration: ${service.duration}\n` +
          `💰 Price: ${formatPrice(service.price)} (VAT incl.)\n\n` +
          `${service.description}\n\n` +
          `Would you like to book this service?`,
        "service-confirmation",
        [
          {
            text: "✅ Yes, book now",
            action: () => {
              const availableDates = getAvailableDates();
              addBotMessage(
                "When would you like to schedule your service? Here are some available time slots:\n" +
                  availableDates.join("\n"),
                "schedule-options",
                availableDates.map((date) => ({
                  text: date,
                  action: () => {
                    setUserData((prev) => ({ ...prev, schedule: date }));
                    addBotMessage(`Got it! For ${service.name}, we've noted "${date}" as your preferred time.`);
                    addBotMessage("What's your full name?");
                    setContext({ step: "getName" });
                  },
                }))
              );
            },
          },
          {
            text: "🔄 View other services",
            action: () => {
              addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
              setContext({ step: "selectService" });
            },
          },
          {
            text: "❓ Help",
            action: () => {
              addBotMessage(getHelpMessage("selectService"), "help");
              setContext({ step: "help" });
            },
          },
          {
            text: "❌ Cancel",
            action: () => resetChat(setContext, setMessages, setUserData),
          },
        ]
      );
    },
  })),
});

// Centralized available dates
const getAvailableDates = () => [
  `Today (${new Date().toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })})`,
  `Tomorrow (${new Date(Date.now() + 86400000).toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })})`,
  `${new Date(Date.now() + 172800000).toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })}`,
  `${new Date(Date.now() + 259200000).toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })}`,
];

// Help message generator
const getHelpMessage = (step: Context["step"]) => {
  const generalHelp =
    "I'm here to assist you with booking services or answering questions! 😊\n\n" +
    "• You can *type* your responses or *click* the option buttons.\n" +
    "• To book a service, select 'Book a Service' and follow the steps.\n" +
    "• To learn more, choose 'Learn about Services' for details.\n" +
    "• Need human support? Select 'Talk to a Human' or contact us at info@thirdeye.co.za or 0861 123 456.\n" +
    "• Type 'help' anytime or select the ❓ Help option for assistance.\n" +
    "• To start over, select 'Cancel' or 'Back to main menu'.\n\n";

  switch (step) {
    case "greeting":
    case "chooseOption":
      return (
        generalHelp +
        "What can I do for you now? Try selecting an option like 'Book a Service' or type 'help' for more guidance."
      );
    case "confirmServiceAfterInfo":
      return (
        generalHelp +
        "You're deciding whether to book a service. Select 'Yes' to choose a service or 'No' to explore other options."
      );
    case "selectService":
      return (
        generalHelp +
        "Please select a service from the list by clicking an option or typing the exact service name (e.g., 'Used Car Inspection')."
      );
    case "schedule":
      return (
        generalHelp +
        "Choose a date for your service by clicking an option or typing a date like 'Today' or 'Tomorrow'. Check the available dates listed."
      );
    case "getName":
      return generalHelp + "Please provide your full name to continue with the booking.";
    case "getPhone":
      return (
        generalHelp +
        "Enter a valid South African phone number (e.g., 071 234 5678 or +27712345678) to proceed."
      );
    case "getEmail":
      return generalHelp + "Provide a valid email address (e.g., yourname@example.com) to finalize your booking.";
    case "reminderConfirmation":
      return (
        generalHelp +
        "You're confirming if you want a reminder for your appointment. Select 'Yes' or 'No', or let me know what else you need."
      );
    case "finalConfirmation":
      return (
        generalHelp +
        "Your booking is complete! You can book another service, return to the main menu, or end the chat."
      );
    case "humanHandoff":
      return (
        generalHelp +
        "You're being connected to a human agent. In the meantime, I can assist with other questions or bookings."
      );
    case "help":
      return generalHelp + "What can I help you with now? Select an option or type your request.";
    default:
      return generalHelp + "How can I assist you today?";
  }
};

const NewChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Sawubona! Welcome to Third Eye SA. How can I assist you today?",
      type: "greeting",
      options: [
        {
          text: "📅 Book a Service",
          action: () => {
            addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
            setContext({ step: "selectService" });
          },
        },
        {
          text: "ℹ️ Learn about Services",
          action: () => {
            const servicesList = services
              .map((s) => `${s.emoji} *${s.name}* (${s.duration}) - ${formatPrice(s.price)}`)
              .join("\n");
            addBotMessage(`Here are our services:\n\n${servicesList}`);
            addBotMessage("Would you like to book one of these services?", "options", [
              {
                text: "✅ Yes, book a service",
                action: () => {
                  addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
                  setContext({ step: "selectService" });
                },
              },
              {
                text: "❌ No, thanks",
                action: () => {
                  addBotMessage("No problem! Is there anything else I can help you with?");
                  setContext({ step: "chooseOption" });
                },
              },
              {
                text: "❓ Help",
                action: () => {
                  addBotMessage(getHelpMessage("confirmServiceAfterInfo"), "help");
                  setContext({ step: "help" });
                },
              },
            ]);
            setContext({ step: "confirmServiceAfterInfo" });
          },
        },
        {
          text: "💬 Talk to a Human",
          action: () => {
            addBotMessage("Connecting you to a human agent... Please wait a moment.");
            setContext({ step: "humanHandoff" });
          },
        },
        {
          text: "❓ Help",
          action: () => {
            addBotMessage(getHelpMessage("greeting"), "help");
            setContext({ step: "help" });
          },
        },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<Context>({ step: "greeting" });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Add bot message with typing indicator
  const addBotMessage = (
    text: string,
    type: string = "message",
    options?: { text: string; action: () => void }[]
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.text === text && lastMessage.sender === "bot") {
          return prev; // Skip adding duplicate message
        }
        return [...prev, { sender: "bot" as const, text, type, options }];
      });
      setIsTyping(false);
    }, 500); // Simulate typing delay
  };

  // Handle option click
  const handleOptionClick = (action: () => void, text: string) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    action();
  };

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validate phone number
  const isValidPhone = (phone: string) => {
    return /^(\+27|0)[6-8][0-9]{8}$/.test(phone);
  };

  // Sanitize input
  const sanitizeInput = (input: string) => {
    return input.replace(/[<>]/g, "").trim();
  };

  // Reset chat
  const resetChat = (
    setContext: React.Dispatch<React.SetStateAction<Context>>,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    setUserData: React.Dispatch<React.SetStateAction<UserData>>
  ) => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Sawubona! Welcome back to Third Eye SA. How can I assist you today?",
        type: "greeting",
        options: [
          {
            text: "📅 Book a Service",
            action: () => {
              addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
              setContext({ step: "selectService" });
            },
          },
          {
            text: "ℹ️ Learn about Services",
            action: () => {
              const servicesList = services
                .map((s) => `${s.emoji} *${s.name}* (${s.duration}) - ${formatPrice(s.price)}`)
                .join("\n");
              addBotMessage(`Here are our services:\n\n${servicesList}`);
              addBotMessage("Would you like to book one of these services?", "options", [
                {
                  text: "✅ Yes, book a service",
                  action: () => {
                    addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
                    setContext({ step: "selectService" });
                  },
                },
                {
                  text: "❌ No, thanks",
                  action: () => {
                    addBotMessage("No problem! Is there anything else I can help you with?");
                    setContext({ step: "chooseOption" });
                  },
                },
                {
                  text: "❓ Help",
                  action: () => {
                    addBotMessage(getHelpMessage("confirmServiceAfterInfo"), "help");
                    setContext({ step: "help" });
                  },
                },
              ]);
              setContext({ step: "confirmServiceAfterInfo" });
            },
          },
          {
            text: "💬 Talk to a Human",
            action: () => {
              addBotMessage("Connecting you to a human agent... Please wait a moment.");
              setContext({ step: "humanHandoff" });
            },
          },
          {
            text: "❓ Help",
            action: () => {
              addBotMessage(getHelpMessage("greeting"), "help");
              setContext({ step: "help" });
            },
          },
        ],
      },
    ]);
    setContext({ step: "greeting" });
    setUserData({});
  };

  // Render message content
  const renderMessage = (message: Message) => {
    if (message.type === "service-selection") {
      return (
        <div className="w-full mb-4">
          <div className="text-base font-medium text-gray-800 dark:text-gray-100 mb-3 px-1">
            {message.text}
          </div>
          <div className="grid gap-3">
            {message.options?.map((option, index) => {
              const [title, ...details] = option.text.split("\n").filter(Boolean);
              const emoji = title.match(
                /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1F0}-\u{1F1FF}]/u
              )?.[0] || "🔍";
              const cleanTitle = title.replace(emoji, "").replace(/^\s*\*?\s*|\s*\*?\s*$/g, "").trim();

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option.action, cleanTitle)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-0.5">{emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-base">
                        {cleanTitle}
                      </div>
                      {details.length > 0 && (
                        <div className="text-sm text-gray-700 dark:text-gray-300 mt-1.5 space-y-1">
                          {details.map((line, i) => (
                            <div key={i} className="leading-tight">{line.replace(/[\*_]/g, "")}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col ${message.sender === "user" ? "items-end" : "items-start"} mb-4 w-full px-2`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
            message.sender === "user"
              ? "bg-blue-600 text-white rounded-br-sm shadow-md"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm shadow-sm border border-gray-200 dark:border-gray-700"
          }`}
        >
          {message.text.split("\n").map((line, i) => (
            <p key={i} className="mb-1.5 text-base leading-relaxed">{line}</p>
          ))}
          {message.options && (
            <div className="mt-3 flex flex-col space-y-2.5">
              {message.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option.action, option.text)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    option.text.includes("✅") || option.text.includes("Yes")
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                      : option.text.includes("❌") || option.text.includes("No")
                      ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                      : option.text.includes("❓")
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg"
                      : "bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-500 dark:text-gray-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleUserInput = (userText: string) => {
    const sanitizedText = sanitizeInput(userText);
    if (!sanitizedText) {
      addBotMessage("Please enter a valid response.");
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: sanitizedText }]);

    // Handle "help" input in any step
    if (/help/i.test(sanitizedText)) {
      addBotMessage(getHelpMessage(context.step), "help", [
        {
          text: "🔙 Continue",
          action: () => {
            if (context.step === "selectService") {
              addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
            } else if (context.step === "schedule") {
              const availableDates = getAvailableDates();
              addBotMessage(
                "When would you like to schedule your service? Here are some available time slots:\n" +
                  availableDates.join("\n"),
                "schedule-options",
                availableDates.map((date) => ({
                  text: date,
                  action: () => {
                    setUserData((prev) => ({ ...prev, schedule: date }));
                    addBotMessage(`Got it! For ${userData.service}, we've noted "${date}" as your preferred time.`);
                    addBotMessage("What's your full name?");
                    setContext({ step: "getName" });
                  },
                }))
              );
            } else if (context.step === "getName") {
              addBotMessage("What's your full name?");
            } else if (context.step === "getPhone") {
              addBotMessage("What's the best phone number to reach you?");
            } else if (context.step === "getEmail") {
              addBotMessage("What's your email address?");
            } else if (context.step === "reminderConfirmation") {
              addBotMessage("Would you like to receive a reminder before your appointment?", "options", [
                {
                  text: "✅ Yes, please remind me",
                  action: () => {
                    addBotMessage("Great! We'll send you a reminder 24 hours before your appointment.");
                    setTimeout(() => {
                      addBotMessage("Is there anything else I can help you with?", "options", [
                        {
                          text: "📅 Book another service",
                          action: () => {
                            addBotMessage(
                              "Which service would you like to book?",
                              "service-selection",
                              getServiceOptions(setContext, addBotMessage).options
                            );
                            setContext({ step: "selectService" });
                          },
                        },
                        {
                          text: "🏠 Back to main menu",
                          action: () => setContext({ step: "chooseOption" }),
                        },
                        {
                          text: "❌ No, that's all thanks!",
                          action: () => {
                            addBotMessage("Thank you for choosing Third Eye SA! Have a lekker day! 👋");
                            setTimeout(() => resetChat(setContext, setMessages, setUserData), 2000);
                          },
                        },
                      ]);
                    }, 800);
                  },
                },
                {
                  text: "❌ No thanks",
                  action: () => {
                    addBotMessage("No problem! Is there anything else I can help you with?", "options", [
                      {
                        text: "📅 Book another service",
                        action: () => {
                          addBotMessage(
                            "Which service would you like to book?",
                            "service-selection",
                            getServiceOptions(setContext, addBotMessage).options
                          );
                          setContext({ step: "selectService" });
                        },
                      },
                      {
                        text: "🏠 Back to main menu",
                        action: () => setContext({ step: "chooseOption" }),
                      },
                      {
                        text: "❌ No, that's all thanks!",
                        action: () => {
                          addBotMessage("Thank you for choosing Third Eye SA! Have a lekker day! 👋");
                          setTimeout(() => resetChat(setContext, setMessages, setUserData), 2000);
                        },
                      },
                    ]);
                  },
                },
              ]);
            } else {
              addBotMessage("How can I assist you today?", "options", [
                {
                  text: "📅 Book a Service",
                  action: () => {
                    addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
                    setContext({ step: "selectService" });
                  },
                },
                {
                  text: "ℹ️ Learn about Services",
                  action: () => {
                    const servicesList = services
                      .map((s) => `${s.emoji} *${s.name}* (${s.duration}) - ${formatPrice(s.price)}`)
                      .join("\n");
                    addBotMessage(`Here are our services:\n\n${servicesList}`);
                    setContext({ step: "chooseOption" });
                  },
                },
                {
                  text: "💬 Talk to a Human",
                  action: () => {
                    addBotMessage("Connecting you to a human agent... Please wait a moment.");
                    setContext({ step: "humanHandoff" });
                  },
                },
                {
                  text: "❓ Help",
                  action: () => {
                    addBotMessage(getHelpMessage("chooseOption"), "help");
                    setContext({ step: "help" });
                  },
                },
              ]);
            }
            setContext({ step: context.step });
          },
        },
        {
          text: "🏠 Back to main menu",
          action: () => {
            addBotMessage("How can I assist you today?", "options", [
              {
                text: "📅 Book a Service",
                action: () => {
                  addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
                  setContext({ step: "selectService" });
                },
              },
              {
                text: "ℹ️ Learn about Services",
                action: () => {
                  const servicesList = services
                    .map((s) => `${s.emoji} *${s.name}* (${s.duration}) - ${formatPrice(s.price)}`)
                    .join("\n");
                  addBotMessage(`Here are our services:\n\n${servicesList}`);
                  setContext({ step: "chooseOption" });
                },
              },
              {
                text: "💬 Talk to a Human",
                action: () => {
                  addBotMessage("Connecting you to a human agent... Please wait a moment.");
                  setContext({ step: "humanHandoff" });
                },
              },
              {
                text: "❓ Help",
                action: () => {
                  addBotMessage(getHelpMessage("chooseOption"), "help");
                  setContext({ step: "help" });
                },
              },
            ]);
            setContext({ step: "chooseOption" });
          },
        },
      ]);
      setContext({ step: "help" });
      return;
    }

    switch (context.step) {
      case "greeting":
      case "chooseOption":
        if (/book|service/i.test(sanitizedText)) {
          addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
          setContext({ step: "selectService" });
        } else if (/learn|info|services/i.test(sanitizedText)) {
          const servicesList = services
            .map((s) => `${s.emoji} *${s.name}* (${s.duration}) - ${formatPrice(s.price)}`)
            .join("\n");
          addBotMessage(`Here are our services:\n\n${servicesList}`, "services-list", [
            {
              text: "📅 Book a Service",
              action: () => {
                addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
                setContext({ step: "selectService" });
              },
            },
            {
              text: "🔙 Back to Main Menu",
              action: () => setContext({ step: "chooseOption" }),
            },
            {
              text: "❓ Help",
              action: () => {
                addBotMessage(getHelpMessage("chooseOption"), "help");
                setContext({ step: "help" });
              },
            },
          ]);
        } else if (/human|agent|talk to someone/i.test(sanitizedText)) {
          addBotMessage("Connecting you to a human agent... Please wait a moment.");
          setContext({ step: "humanHandoff" });
        } else {
          addBotMessage("Please select one of the options below:", "options", [
            {
              text: "📅 Book a Service",
              action: () => {
                addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
                setContext({ step: "selectService" });
              },
            },
            {
              text: "ℹ️ Learn about Services",
              action: () => {
                const servicesList = services
                  .map((s) => `${s.emoji} *${s.name}* (${s.duration}) - ${formatPrice(s.price)}`)
                  .join("\n");
                addBotMessage(`Here are our services:\n\n${servicesList}`, "services-list");
              },
            },
            {
              text: "💬 Talk to a Human",
              action: () => {
                addBotMessage("Connecting you to a human agent... Please wait a moment.");
                setContext({ step: "humanHandoff" });
              },
            },
            {
              text: "❓ Help",
              action: () => {
                addBotMessage(getHelpMessage("chooseOption"), "help");
                setContext({ step: "help" });
              },
            },
          ]);
        }
        break;

      case "confirmServiceAfterInfo":
        if (/yes|y/i.test(sanitizedText)) {
          addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
          setContext({ step: "selectService" });
        } else {
          addBotMessage("No problem! Is there anything else I can help you with?");
          setContext({ step: "chooseOption" });
        }
        break;

      case "selectService": {
        const selectedService = services.find((s) => s.name.toLowerCase() === sanitizedText.toLowerCase());
        if (selectedService) {
          setUserData((prev) => ({ ...prev, service: selectedService.name }));
          const availableDates = getAvailableDates();
          addBotMessage(
            `You've selected: ${selectedService.emoji} *${selectedService.name}*\n` +
              `⏱ Duration: ${selectedService.duration}\n` +
              `💰 Price: ${formatPrice(selectedService.price)} (VAT incl.)\n\n` +
              `${selectedService.description}\n\n` +
              `Would you like to book this service?`,
            "service-confirmation",
            [
              {
                text: "✅ Yes, book now",
                action: () => {
                  addBotMessage(
                    "When would you like to schedule your service? Here are some available time slots:\n" +
                      availableDates.join("\n"),
                    "schedule-options",
                    availableDates.map((date) => ({
                      text: date,
                      action: () => {
                        setUserData((prev) => ({ ...prev, schedule: date }));
                        addBotMessage(`Got it! For ${selectedService.name}, we've noted "${date}" as your preferred time.`);
                        addBotMessage("What's your full name?");
                        setContext({ step: "getName" });
                      },
                    }))
                  );
                },
              },
              {
                text: "🔄 View other services",
                action: () => {
                  addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
                  setContext({ step: "selectService" });
                },
              },
              {
                text: "❓ Help",
                action: () => {
                  addBotMessage(getHelpMessage("selectService"), "help");
                  setContext({ step: "help" });
                },
              },
              {
                text: "❌ Cancel",
                action: () => resetChat(setContext, setMessages, setUserData),
              },
            ]
          );
        } else {
          addBotMessage(
            "I couldn't find that service. Please select from the options below:",
            "service-selection",
            getServiceOptions(setContext, addBotMessage).options
          );
        }
        break;
      }

      case "schedule":
        const availableDates = getAvailableDates();
        if (availableDates.some((date) => date.toLowerCase().includes(sanitizedText.toLowerCase()))) {
          setUserData((prev) => ({ ...prev, schedule: sanitizedText }));
          addBotMessage(`Got it! For ${userData.service}, we've noted "${sanitizedText}" as your preferred time.`);
          addBotMessage("What's your full name?");
          setContext({ step: "getName" });
        } else {
          addBotMessage(
            "Please select a valid date from the options below:",
            "schedule-options",
            availableDates.map((date) => ({
              text: date,
              action: () => {
                setUserData((prev) => ({ ...prev, schedule: date }));
                addBotMessage(`Got it! For ${userData.service}, we've noted "${date}" as your preferred time.`);
                addBotMessage("What's your full name?");
                setContext({ step: "getName" });
              },
            }))
          );
        }
        break;

      case "getName":
        if (!sanitizedText) {
          addBotMessage("Please provide your full name.");
          return;
        }
        setUserData((prev) => ({ ...prev, name: sanitizedText }));
        addBotMessage(`Thanks, ${sanitizedText}! What's the best phone number to reach you?`);
        setContext({ step: "getPhone" });
        break;

      case "getPhone":
        if (!isValidPhone(sanitizedText)) {
          addBotMessage("Please enter a valid South African phone number (e.g., 071 234 5678 or +27712345678)");
          return;
        }
        setUserData((prev) => ({ ...prev, phone: sanitizedText }));
        addBotMessage("Great! Finally, what's your email address?");
        setContext({ step: "getEmail" });
        break;

      case "getEmail":
        if (!isValidEmail(sanitizedText)) {
          addBotMessage("Please enter a valid email address (e.g., yourname@example.com)");
          return;
        }
        setUserData((prev) => ({ ...prev, email: sanitizedText }));
        const bookedService = services.find((s) => s.name === userData.service);
        const formatTime = (timeString: string) => {
          if (!timeString) return "Not specified";
          const date = new Date(timeString);
          return isNaN(date.getTime())
            ? timeString
            : date.toLocaleString("en-ZA", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Africa/Johannesburg",
              });
        };
        const summary =
          `✅ *Booking Confirmed!*\n\n` +
          `🔹 *Service*: ${userData.service || "Not specified"}\n` +
          (bookedService
            ? ` ⏱ ${bookedService.duration} • ${formatPrice(bookedService.price)} (VAT incl.)\n`
            : "") +
          `\n📅 *When*: ${formatTime(userData.schedule || "")} (SAST)\n` +
          `\n👤 *Your Details*\n` +
          ` 👤 ${userData.name || "Not specified"}\n` +
          ` 📞 ${userData.phone || "Not specified"}\n` +
          ` 📧 ${sanitizedText}\n\n` +
          `We'll send a confirmation to your email with all the details. If you need to make any changes, please contact us at info@thirdeye.co.za or call 0861 123 456.`;
        addBotMessage(summary);
        addBotMessage("Would you like to receive a reminder before your appointment?", "options", [
          {
            text: "✅ Yes, please remind me",
            action: () => {
              addBotMessage("Great! We'll send you a reminder 24 hours before your appointment.");
              setTimeout(() => {
                addBotMessage("Is there anything else I can help you with?", "options", [
                  {
                    text: "📅 Book another service",
                    action: () => {
                      addBotMessage(
                        "Which service would you like to book?",
                        "service-selection",
                        getServiceOptions(setContext, addBotMessage).options
                      );
                      setContext({ step: "selectService" });
                    },
                  },
                  {
                    text: "🏠 Back to main menu",
                    action: () => setContext({ step: "chooseOption" }),
                  },
                  {
                    text: "❌ No, that's all thanks!",
                    action: () => {
                      addBotMessage("Thank you for choosing Third Eye SA! Have a lekker day! 👋");
                      setTimeout(() => resetChat(setContext, setMessages, setUserData), 2000);
                    },
                  },
                  {
                    text: "❓ Help",
                    action: () => {
                      addBotMessage(getHelpMessage("reminderConfirmation"), "help");
                      setContext({ step: "help" });
                    },
                  },
                ]);
              }, 800);
            },
          },
          {
            text: "❌ No thanks",
            action: () => {
              addBotMessage("No problem! Is there anything else I can help you with?", "options", [
                {
                  text: "📅 Book another service",
                  action: () => {
                    addBotMessage(
                      "Which service would you like to book?",
                      "service-selection",
                      getServiceOptions(setContext, addBotMessage).options
                    );
                    setContext({ step: "selectService" });
                  },
                },
                {
                  text: "🏠 Back to main menu",
                  action: () => setContext({ step: "chooseOption" }),
                },
                {
                  text: "❌ No, that's all thanks!",
                  action: () => {
                    addBotMessage("Thank you for choosing Third Eye SA! Have a lekker day! 👋");
                    setTimeout(() => resetChat(setContext, setMessages, setUserData), 2000);
                  },
                },
                {
                  text: "❓ Help",
                  action: () => {
                    addBotMessage(getHelpMessage("reminderConfirmation"), "help");
                    setContext({ step: "help" });
                  },
                },
              ]);
            },
          },
          {
            text: "❓ Help",
            action: () => {
              addBotMessage(getHelpMessage("reminderConfirmation"), "help");
              setContext({ step: "help" });
            },
          },
        ]);
        setContext({ step: "reminderConfirmation" });
        break;

      case "reminderConfirmation":
        if (/yes|y/i.test(sanitizedText)) {
          addBotMessage("Great! We'll send you a reminder 24 hours before your appointment.");
        } else {
          addBotMessage("No problem! Your appointment is all set.");
        }
        setTimeout(() => {
          addBotMessage("Is there anything else I can help you with?", "options", [
            {
              text: "📅 Book another service",
              action: () => {
                addBotMessage(
                  "Which service would you like to book?",
                  "service-selection",
                  getServiceOptions(setContext, addBotMessage).options
                );
                setContext({ step: "selectService" });
              },
            },
            {
              text: "🏠 Back to main menu",
              action: () => setContext({ step: "chooseOption" }),
            },
            {
              text: "❌ No, that's all thanks!",
              action: () => {
                addBotMessage("Thank you for choosing Third Eye SA! Have a lekker day! 👋");
                setTimeout(() => resetChat(setContext, setMessages, setUserData), 2000);
              },
            },
            {
              text: "❓ Help",
              action: () => {
                addBotMessage(getHelpMessage("finalConfirmation"), "help");
                setContext({ step: "help" });
              },
            },
          ]);
        }, 800);
        setContext({ step: "finalConfirmation" });
        break;

      case "finalConfirmation":
        if (/yes|y/i.test(sanitizedText)) {
          addBotMessage("What would you like to do next?", "options", [
            {
              text: "📅 Book a service",
              action: () => {
                addBotMessage(
                  "Which service would you like to book?",
                  "service-selection",
                  getServiceOptions(setContext, addBotMessage).options
                );
                setContext({ step: "selectService" });
              },
            },
            {
              text: "ℹ️ Learn about services",
              action: () => {
                const servicesList = services
                  .map((s) => `${s.emoji} *${s.name}* (${s.duration}) - ${formatPrice(s.price)}`)
                  .join("\n");
                addBotMessage(`Here are our services:\n\n${servicesList}`);
                setContext({ step: "chooseOption" });
              },
            },
            {
              text: "💬 Talk to a human",
              action: () => {
                addBotMessage("Connecting you to a human agent... Please wait a moment.");
                setContext({ step: "humanHandoff" });
              },
            },
            {
              text: "❓ Help",
              action: () => {
                addBotMessage(getHelpMessage("finalConfirmation"), "help");
                setContext({ step: "help" });
              },
            },
          ]);
        } else {
          addBotMessage("Thank you for choosing Third Eye SA! Have a lekker day! 👋");
          setTimeout(() => resetChat(setContext, setMessages, setUserData), 2000);
        }
        break;

      case "humanHandoff":
        addBotMessage(
          "A friendly customer service agent will be with you shortly. Our operating hours are Monday to Friday, 8:00 to 17:00 SAST. In the meantime, is there anything else I can help you with?",
          "options",
          [
            {
              text: "📅 Book a Service",
              action: () => {
                addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
                setContext({ step: "selectService" });
              },
            },
            {
              text: "ℹ️ Learn about Services",
              action: () => {
                const servicesList = services
                  .map((s) => `${s.emoji} *${s.name}* (${s.duration}) - ${formatPrice(s.price)}`)
                  .join("\n");
                addBotMessage(`Here are our services:\n\n${servicesList}`);
                setContext({ step: "chooseOption" });
              },
            },
            {
              text: "❓ Help",
              action: () => {
                addBotMessage(getHelpMessage("humanHandoff"), "help");
                setContext({ step: "help" });
              },
            },
          ]
        );
        setContext({ step: "chooseOption" });
        break;

      case "help":
        addBotMessage("How can I assist you now?", "options", [
          {
            text: "📅 Book a Service",
            action: () => {
              addBotMessage("Which service would you like to book?", "service-selection", getServiceOptions(setContext, addBotMessage).options);
              setContext({ step: "selectService" });
            },
          },
          {
            text: "ℹ️ Learn about Services",
            action: () => {
              const servicesList = services
                .map((s) => `${s.emoji} *${s.name}* (${s.duration}) - ${formatPrice(s.price)}`)
                .join("\n");
              addBotMessage(`Here are our services:\n\n${servicesList}`);
              setContext({ step: "chooseOption" });
            },
          },
          {
            text: "💬 Talk to a Human",
            action: () => {
              addBotMessage("Connecting you to a human agent... Please wait a moment.");
              setContext({ step: "humanHandoff" });
            },
          },
          {
            text: "❓ Help",
            action: () => {
              addBotMessage(getHelpMessage("help"), "help");
              setContext({ step: "help" });
            },
          },
        ]);
        break;

      default:
        addBotMessage("Howzit! I'm here to help. How can I assist you today?");
        setContext({ step: "chooseOption" });
    }
  };

  const handleSend = () => {
    if (isTyping || !input.trim()) return;
    handleUserInput(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isTyping && input.trim()) handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 h-[500px] flex flex-col rounded-2xl shadow-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl">
              <span className="font-semibold">Third Eye Assistant</span>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg, index) => renderMessage(msg))}
              {isTyping && (
                <div className="flex justify-start px-2">
                  <div className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-sm font-medium text-blue-700 dark:text-blue-300 animate-pulse border border-blue-100 dark:border-blue-800">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(sanitizeInput(e.target.value))}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="flex-1 p-3 text-base rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="ml-3 p-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewChatbot;