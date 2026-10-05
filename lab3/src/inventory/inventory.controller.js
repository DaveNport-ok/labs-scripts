import { randomUUID } from 'node:crypto';

// Тимчасове сховище в оперативній пам'яті
const inventoryItems = [
    { id: randomUUID(), name: 'Ноутбук Dell', quantity: 15 },
    { id: randomUUID(), name: 'Монітор LG', quantity: 30 },
];

// Контролер для отримання списку інвентарю
export function getItems(req, res) {
    return res.status(200).json({
        success: true,
        data: inventoryItems,
    });
}

// Контролер для отримання одного товару за id
export function getItemById(req, res) {
    const { id } = req.params;
    const item = inventoryItems.find((entry) => entry.id === id);

    if (!item) {
        return res.status(404).json({
            success: false,
            message: 'Товар із вказаним id не знайдено',
        });
    }

    return res.status(200).json({
        success: true,
        data: item,
    });
}

// Контролер для додавання нового товару
export function createItem(req, res) {
    const { name: rawName, quantity: rawQuantity } = req.body ?? {};
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    const quantity = typeof rawQuantity === 'number'
        ? rawQuantity
        : Number.NaN;

    // Нуль є допустимим; відхиляємо порожні, дробові та від'ємні значення
    if (!name || !Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
            success: false,
            message: 'Вкажіть назву та цілу невід’ємну кількість товару',
        });
    }

    const newItem = {
        id: randomUUID(),
        name,
        quantity,
    };

    inventoryItems.push(newItem);

    return res.status(201).json({
        success: true,
        data: newItem,
    });
}