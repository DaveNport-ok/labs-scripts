'use server';

import { updateTag } from 'next/cache';

export async function addInventoryItem(previousState, formData) {
    const nameValue = formData.get('name');
    const quantityValue = formData.get('quantity');
    const priceValue = formData.get('price');

    const name = typeof nameValue === 'string' ? nameValue.trim() : '';
    const quantity = typeof quantityValue === 'string'
    && quantityValue.trim() !== ''
        ? Number(quantityValue)
        : Number.NaN;
    const price = typeof priceValue === 'string'
    && priceValue.trim() !== ''
        ? Number(priceValue)
        : Number.NaN;

    const isInvalid = !name
        || !Number.isInteger(quantity)
        || quantity < 0
        || !Number.isFinite(price)
        || price < 0;

    if (isInvalid) {
        return {
            success: false,
            message: 'Перевірте введені дані',
            submittedAt: 0,
        };
    }
    try {
        const response = await fetch(`${process.env.API_URL}/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity, price }),
            cache: 'no-store',
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
            return {
                success: false,
                message: payload?.message ?? 'Не вдалося додати товар',
                submittedAt: 0,
            };
        }

        updateTag('inventory-stats');

        return {
            success: true,
            message: 'Товар успішно додано',
            submittedAt: Date.now(),
        };
    } catch (error) {
        console.error('Помилка додавання товару:', error);
        return {
            success: false,
            message: 'Не вдалося з’єднатися з API',
            submittedAt: 0,
        };
    }
}