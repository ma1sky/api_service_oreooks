import express from 'express';
import { PORT } from './env.config.js'
import type { Request, Response } from 'express';

const app = express();

app.use(express.json());
app.listen(PORT, () => {
  	console.log(`Server is running on http://localhost:${PORT}`)
})

app.get('/', (req: Request, res: Response) => {
    res.send('Hello! Its working!');
})

app.post('/auth/token', async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body
        if (!login || !password) {
            return res.status(400).json({
                success: false,
                message: 'Login and password required'
            })
        }

        
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
})