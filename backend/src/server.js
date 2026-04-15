const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const rateLimit = require('express-rate-limit');

dotenv.config({ override: true });

// Initialize passport AFTER dotenv so env vars are available
const passport = require('./config/passport');

const app = express();

// ── Trust Proxy (needed for Render / Heroku / etc.) ──────────────────────────
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  app.set('trust proxy', 1);
}

// ── CORS ─────────────────────────────────────────────────────────────────────
const envConfiguredOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS || '').split(',').map((origin) => origin.trim()),
].filter(Boolean);

const allowedOrigins = Array.from(new Set([
  ...envConfiguredOrigins,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5177',
  'https://wearendura.com',
  'https://www.wearendura.com',
  'https://admin.wearendura.com',
]));

console.log('✅ [Server] CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.error(`❌ [Server] CORS blocked origin: ${origin}`);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

// ── Body Parsers (CRITICAL: MUST be before routes to prevent empty req.body) ──
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Logger ────────────────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ── Session (Assetion Ready with MongoDB Store) ─────────────────────────────
app.use(session({
  secret: process.env.JWT_SECRET || 'endura_session_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: false, // Set to false for local development
    sameSite: 'lax', 
    maxAge: 24 * 60 * 60 * 1000
  },
}));

// ── Passport ──────────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ── Rate Limiting (auth routes) ───────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: 'Too many requests, please try again in 15 minutes.' },
});
app.use('/api/auth', authLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Endura API is running ✅' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/vault', require('./routes/vaultRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));


// Serve uploads folder statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(require('./middleware/errorHandler'));

// ── Database + Server Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // 30 seconds wait
    socketTimeoutMS: 45000,         // 45 seconds wait
  })
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
    // Set explicit timeouts for long-running image uploads
    server.timeout = 60000;
    server.headersTimeout = 65000;
    server.keepAliveTimeout = 61000;
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });
