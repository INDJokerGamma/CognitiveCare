// backend/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const db = admin.firestore();

// 1. Save a score
router.post('/save', async (req, res) => {
    try {
        const { userId, userEmail, testType, score, mentalState } = req.body;
        const testSessionData = {
            userId,
            userEmail,
            testType,
            score,
            mentalState,
            completedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = await db.collection('testSessions').add(testSessionData);
        res.status(201).json({ success: true, sessionId: docRef.id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. Get history for a specific user
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const snapshot = await db.collection('testSessions').where('userId', '==', userId).get();
        const history = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            history.push({
                id: doc.id,
                ...data,
                completedAt: data.completedAt ? data.completedAt.toDate() : new Date()
            });
        });
        history.sort((a, b) => b.completedAt - a.completedAt);
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. ADMIN ONLY: Get all sessions for all users
router.get('/admin/all-sessions', async (req, res) => {
    try {
        const snapshot = await db.collection('testSessions').orderBy('completedAt', 'desc').limit(50).get();
        const allSessions = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            allSessions.push({
                id: doc.id,
                ...data,
                completedAt: data.completedAt ? data.completedAt.toDate() : new Date()
            });
        });
        res.json({ success: true, sessions: allSessions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;