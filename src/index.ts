import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Secret key for JWT
const SECRET_KEY = process.env.SECRET_KEY || 'your_default_secret';

// Middleware to verify JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err) => {
        if (err) return res.status(403).json({ message: 'Invalid Token' });
        next();
    });
};

// Login route to generate JWT
app.post('/login', (req: Request, res: Response) => {
    const accessKey = req.body && req.body.accessKey;
    if (accessKey !== 'foobar') return res.status(401).json({ message: 'Access Denied' });

    const user = { username: 'testUser' };
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// EODHD request route (protected)
app.post('/data', authenticateToken, async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const { code, eodhd_token } = body;
        const today = new Date();
        let ymd_to = body.ymd_to || today.toISOString().split('T')[0];
        today.setMonth(today.getMonth() - 1);
        let ymd_from = body.ymd_from || today.toISOString().split('T')[0];
        const targetUrl = `https://eodhd.com/api/eod/${code}?from=${ymd_from}&to=${ymd_to}&period=d&api_token=${eodhd_token}&fmt=json`;
        if (!targetUrl) {
            return res.status(400).json({ error: 'targetUrl is required' });
        }
        const response = await axios.get(targetUrl);
        res.json(response.data);
    } catch (error) {
        const err = error as Error;
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});