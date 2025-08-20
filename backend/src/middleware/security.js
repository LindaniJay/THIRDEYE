import helmet from 'helmet';
import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import sanitizeRequest from './sanitize.js';
import xssSanitizeRequest from './xssSanitize.js';
import hpp from 'hpp';
import { StatusCodes } from 'http-status-codes';

// Security headers with Helmet
export const setSecurityHeaders = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          process.env.FRONTEND_URL,
          'http://localhost:3000',
          'http://127.0.0.1:3000'
        ],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for now, enable if using iframes
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 15552000, includeSubDomains: true },
    ieNoOpen: true,
    noSniff: true,
    xssFilter: true,
  });
};

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Data sanitization against NoSQL query injection
export const sanitize = mongoSanitize({
  onSanitize: ({ req, key }) => {
    console.warn(`This request[${key}] is sanitized`, req);
  },
  replaceWith: '_',
});

// Data sanitization against XSS
// legacy alias retained for minimal change risk
export const preventXSS = xssSanitizeRequest;

// Prevent parameter pollution
export const preventParamPollution = hpp({
  whitelist: [
    'price',
    'ratingsAverage',
    'ratingsQuantity',
    'duration',
    'maxGroupSize',
    'difficulty'
  ]
});

// CORS configuration
export const configureCors = (req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(StatusCodes.NO_CONTENT).end();
  }
  
  next();
};

// Security middleware setup
export const setupSecurity = (app) => {
  const skipForSocketIO = (middleware) => (req, res, next) => {
    if (req.path && req.path.startsWith('/socket.io')) {
      return next();
    }
    return middleware(req, res, next);
  };

  // Set security HTTP headers
  app.use(setSecurityHeaders());
  
  // Rate limiting
  app.use('/api', rateLimiter);
  
  // Body parser, reading data from body into req.body
  app.use(express.json({ limit: '10kb' }));
  
  // Data sanitization against NoSQL query injection (Express 5-safe)
  app.use(skipForSocketIO(sanitizeRequest));
  
  // Data sanitization against XSS
  app.use(skipForSocketIO(xssSanitizeRequest));
  
  // Prevent parameter pollution
  app.use(preventParamPollution);
  
  // Configure CORS
  app.use(configureCors);
};
