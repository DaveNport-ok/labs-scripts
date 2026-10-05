import 'dotenv/config';
import app from './app.js';
import { connectDB } from './src/config/database.js';

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
    try {
        // Спочатку очікуємо підключення до MongoDB
        await connectDB();

        // Запускаємо HTTP-сервер лише після успішного підключення до бази
        app.listen(PORT, () => {
            console.log(`Server: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Не вдалося запустити сервер:', error.message);
        process.exit(1);
    }
}

startServer();