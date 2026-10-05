// tests/inventory.api.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { connectDB } from '../src/config/database.js';
import InventoryItem from '../src/inventory/inventory.model.js';

beforeAll(async () => {
    await connectDB('mongodb://127.0.0.1:27017/inventory_test_db');
});

beforeEach(async () => {
    await InventoryItem.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Inventory API', () => {
    test('GET /api/inventory повертає список товарів', async () => {
        const response = await request(app).get('/api/inventory');
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('POST /api/inventory створює товар', async () => {
        const response = await request(app)
            .post('/api/inventory')
            .send({ name: 'Клавіатура', quantity: 50, price: 1500 });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Клавіатура');
        expect(response.body.data.quantity).toBe(50);
        expect(response.body.data.price).toBe(1500);
    });

    test('POST /api/inventory відхиляє null-значення', async () => {
        const response = await request(app)
            .post('/api/inventory')
            .send({ name: 'Миша', quantity: null, price: null });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    // Інтеграційні тести для самостійної роботи (GET /api/inventory/:id)
    test('GET /api/inventory/:id повертає 200 та знайдений товар', async () => {
        const createdItem = await InventoryItem.create({
            name: 'Навушники',
            quantity: 12,
            price: 2500,
        });

        const response = await request(app).get(`/api/inventory/${createdItem._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Навушники');
        expect(response.body.data._id).toBe(createdItem._id.toString());
    });

    test('GET /api/inventory/:id повертає 404 для неіснуючого ObjectId', async () => {
        const randomObjectId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/api/inventory/${randomObjectId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test('GET /api/inventory/:id повертає 404 для некоректного рядка id', async () => {
        const response = await request(app).get('/api/inventory/123-not-an-objectid');

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });
});