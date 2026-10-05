import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { InventoryService } from './inventory.service.js';

describe('InventoryService', () => {
    let repository;
    let service;

    beforeEach(() => {
        repository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
        };
        service = new InventoryService(repository);
    });

    test('повертає товари з репозиторію', async () => {
        const items = [{ name: 'Монітор', quantity: 5, price: 5000 }];
        repository.findAll.mockResolvedValue(items);
        await expect(service.getItems()).resolves.toEqual(items);
        expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    test('створює валідний товар', async () => {
        const item = { name: 'Клавіатура', quantity: 10, price: 1500 };
        repository.create.mockResolvedValue(item);
        await expect(service.createItem(item)).resolves.toEqual(item);
        expect(repository.create).toHaveBeenCalledWith(item);
    });

    test('відхиляє некоректні дані при створенні', async () => {
        await expect(
            service.createItem({ name: '', quantity: 1, price: 0 })
        ).rejects.toMatchObject({ statusCode: 400 });

        await expect(
            service.createItem({ name: 'Миша', quantity: null, price: null })
        ).rejects.toMatchObject({ statusCode: 400 });

        await expect(service.createItem()).rejects.toMatchObject({ statusCode: 400 });
        expect(repository.create).not.toHaveBeenCalled();
    });

    // Тести для самостійної роботи
    test('повертає товар за валідним id', async () => {
        const validId = new mongoose.Types.ObjectId().toString();
        const item = { _id: validId, name: 'Планшет', quantity: 4, price: 8000 };
        repository.findById.mockResolvedValue(item);

        await expect(service.getItemById(validId)).resolves.toEqual(item);
        expect(repository.findById).toHaveBeenCalledWith(validId);
    });

    test('повертає 404, якщо товар з вказаним ObjectId не знайдено', async () => {
        const unknownId = new mongoose.Types.ObjectId().toString();
        repository.findById.mockResolvedValue(null);

        await expect(service.getItemById(unknownId)).rejects.toMatchObject({
            statusCode: 404,
        });
        expect(repository.findById).toHaveBeenCalledWith(unknownId);
    });

    test('повертає 404 при некоректному форматі ObjectId без звернення до бази', async () => {
        await expect(service.getItemById('invalid-mongo-id')).rejects.toMatchObject({
            statusCode: 404,
        });
        expect(repository.findById).not.toHaveBeenCalled();
    });
});