const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
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

// ── HTTP Security Headers (Helmet) ───────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── Database Connection with Tuned Pooling ────────────────────────────────────
const mongooseConnectPromise = mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: 50,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
});

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

// ── Session (Reusing Mongoose Connection Pool) ───────────────────────────────
app.use(session({
  secret: process.env.JWT_SECRET || 'endura_session_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    clientPromise: mongooseConnectPromise.then(m => m.connection.getClient()),
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: isProduction,
    sameSite: 'lax', 
    maxAge: 24 * 60 * 60 * 1000
  },
}));

// ── Passport ──────────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ── Rate Limiting ─────────────────────────────────────────────────────────────
// 1. General API Limiter (Generous 1000 req / 15 min for normal SPA navigation)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', apiLimiter);

// 2. Authentication routes limiter (150 req / 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again in 15 minutes.' },
});
app.use('/api/auth', authLimiter);

// 3. Vault decryption code sync limiter (strict: 25 attempts / 15 min to prevent brute force)
const vaultSyncLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many decryption attempts. Please try again in 15 minutes.' },
});
app.use('/api/vault/sync', vaultSyncLimiter);

// 4. File uploads limiter (40 uploads / 15 min)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Upload limit reached. Please wait a few minutes before trying again.' },
});
app.use('/api/upload', uploadLimiter);

// 5. Checkout order creation limiter (30 orders / 10 min)
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many order requests. Please try again shortly.' },
});
app.use('/api/orders', orderLimiter);

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
app.use('/api/coupons', require('./routes/couponRoutes'));

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

// ── Server Start ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

mongooseConnectPromise
  .then(() => {
    console.log('✅ Successfully connected to MongoDB (Connection pool configured: 50 max, 5 min)');
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
