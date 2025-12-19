import express from 'express'
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('swagger');
});

router.get('/openapi.json', (req, res) => {
    const filePath = path.join(__dirname,'./../public/swagger.json');
    // Read JSON file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err.message);
            return res.status(500).json({ error: 'Failed to read JSON file' });
        }

        try {
            const jsonData = JSON.parse(data); // Parse JSON safely
            res.json(jsonData); // Send JSON response
        } catch (parseErr: any) {
            console.error('Error parsing JSON:', parseErr.message);
            res.status(500).json({ error: 'Invalid JSON format' });
        }
    });
});


export default router;
