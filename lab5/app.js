import express from 'express';
import cors from 'cors';
import inventoryRouter from './src/inventory/inventory.routes.js';

const app = express();

// Дозволяємо крос-доменні запити з фронтенду
app.use(cors({ origin: 'http://localhost:3000' }));

// Парсинг вхідного тіла запиту у форматі JSON
app.use(express.json());

// Базовий тестовий маршрут із ЛР №1
app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

// Підключення маршрутів інвентарю
app.use('/api/inventory', inventoryRouter);

// Централізована обробка помилок (підключається строго після всіх маршрутів)
app.use((error, req, res, next) => {
    const statusCode = error.statusCode ?? 500;
    if (statusCode === 500) {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Внутрішня помилка сервера' : error.message,
    });
});

export default app;