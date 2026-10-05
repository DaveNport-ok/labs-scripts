import { jest } from '@jest/globals';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import InventoryList from './InventoryList';

const originalFetch = global.fetch;

beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
            success: true,
            data: [
                { id: '1', name: 'Серверна стійка', quantity: 3 },
                { id: '2', name: 'Маршрутизатор', quantity: 15 },
            ],
        }),
    });
});

afterEach(() => {
    global.fetch = originalFetch;
});

describe('Компонент InventoryList', () => {
    // 1. Базовий тест із методички
    test('відображає список після завантаження', async () => {
        render(<InventoryList />);

        expect(screen.getByText('Завантаження інвентарю...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Серверна стійка/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/15 шт./i)).toBeInTheDocument();
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // 2. Тест для завдання на самостійну роботу
    test('фільтрує список товарів через поле пошуку без повторного HTTP-запиту', async () => {
        render(<InventoryList />);

        // Очікуємо завершення завантаження
        await waitFor(() => {
            expect(screen.getByText(/Серверна стійка/i)).toBeInTheDocument();
        });

        // Знаходимо поле пошуку за плейсхолдером
        const searchInput = screen.getByPlaceholderText('Пошук за назвою...');

        // Імітуємо введення тексту через fireEvent
        fireEvent.change(searchInput, { target: { value: 'маршрут' } });

        // Перевіряємо, що залишився тільки Маршрутизатор
        expect(screen.getByText(/Маршрутизатор/i)).toBeInTheDocument();
        expect(screen.queryByText(/Серверна стійка/i)).not.toBeInTheDocument();

        // Переконуємось, що повторного запиту не відбулося
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});