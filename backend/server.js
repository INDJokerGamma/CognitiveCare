// backend/server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const helmet = require('helmet'); // Adds security headers
const rateLimit = require('express-rate-limit'); // Limits requests
require('dotenv').config();

const app = express();

// --- SECURITY MIDDLEWARE ---
app.use(helmet()); // Protects against common web vulnerabilities
app.use(cors());
app.use(express.json());

// Limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});
app.use('/api/', limiter);

// --- FIREBASE INITIALIZATION ---
const serviceAccount = require('./serviceAccountKey.json');
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// --- ROUTES ---
const testRoutes = require('./routes/testRoutes');
app.use('/api/tests', testRoutes);

app.get('/', (req, res) => {
    res.send('Alzheimers Platform API is secure and running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Secure Server running on port ${PORT}`);
    console.log(`🔥 Firebase Admin SDK Initialized`);
});