import mongoose from 'mongoose';
import inventoryRepository from './inventory.repository.js';

export class InventoryService {
    constructor(repository = inventoryRepository) {
        this.repository = repository;
    }

    getItems() {
        return this.repository.findAll();
    }

    async getItemById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('Товар не знайдено');
            error.statusCode = 404;
            throw error;
        }

        const item = await this.repository.findById(id);
        if (!item) {
            const error = new Error('Товар не знайдено');
            error.statusCode = 404;
            throw error;
        }

        return item;
    }

    async createItem(data = {}) {
        const name = typeof data.name === 'string' ? data.name.trim() : '';
        const { quantity, price } = data;

        const isInvalid =
            !name ||
            typeof quantity !== 'number' ||
            !Number.isInteger(quantity) ||
            quantity < 0 ||
            typeof price !== 'number' ||
            !Number.isFinite(price) ||
            price < 0;

        if (isInvalid) {
            const error = new Error('Некоректні дані товару');
            error.statusCode = 400;
            throw error;
        }

        return this.repository.create({ name, quantity, price });
    }

    getStats() {
        return this.repository.getStats();
    }
}

export default new InventoryService();