import express from 'express';
import { PORT } from './env.config';
import router from '../routes/routes';

export default function createApp() {
    const server = express();

    server.use(express.json());
    server.use(router);

    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });

    return server;
}