import express from 'express';
import cors from 'cors';
import inventoryRouter from './src/inventory/inventory.routes.js';

const app = express();

// 2. Дозволяємо запити з порту фронтенду (Next.js)
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware для синтаксичного аналізу JSON має виконуватися до маршрутів
app.use(express.json());

// Маршрут із ЛР №1 зберігається
app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

// Підключення всіх маршрутів inventory за спільним префіксом
app.use('/api/inventory', inventoryRouter);

export default app;