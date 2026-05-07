// backend/server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// --- SECURITY MIDDLEWARE ---
app.use(helmet());
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
// Corrected: Now uses environment variables instead of a physical JSON file
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: "alzheimers-platform", // From your JSON
                clientEmail: "firebase-adminsdk-fbsvc@alzheimers-platform.iam.gserviceaccount.com", // From your JSON
                // Fixes the "Invalid PEM formatted message" error by correctly parsing newlines
                privateKey: process.env.key.replace(/\\n/g, '\n'),
            })
        });
        console.log(`🔥 Firebase Admin SDK Initialized Successfully`);
    } catch (error) {
        console.error("❌ Firebase Initialization Error:", error.message);
    }
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
});