import express from 'express';
import { PORT } from './env.config.js'
import router from '../routes/routes.js';

export default function createApp() {
    
    const server = express();
    
    server.use(express.json());
    server.use(router);
    server.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`)
    })

    return server;
}