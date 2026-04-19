import express from 'express';
import { PORT } from './env.config.js';
export default function createApp() {
    const server = express();
    server.use(express.json());
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    return server;
}
//# sourceMappingURL=server.config.js.map