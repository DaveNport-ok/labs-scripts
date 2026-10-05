'use client';

import { useEffect, useState } from 'react';

export default function InventoryList() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadItems() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/inventory`
                );
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const payload = await response.json();
                setItems(payload.data ?? []);
            } catch (requestError) {
                console.error('Помилка завантаження даних:', requestError);
                setError('Не вдалося завантажити інвентар');
            } finally {
                setLoading(false);
            }
        }
        loadItems();
    }, []);

    // Фільтрація списку за назвою товару на стороні клієнта
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Завантаження інвентарю...</p>;
    if (error) return <p role="alert">{error}</p>;

    return (
        <div className="p-4 border rounded shadow-sm w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Система інвентаризації</h2>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Пошук за назвою..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Пошук товарів"
                />
            </div>

            {items.length === 0 ? (
                <p>Інвентар порожній.</p>
            ) : filteredItems.length === 0 ? (
                <p>Товарів не знайдено.</p>
            ) : (
                <ul className="list-disc pl-5">
                    {filteredItems.map((item) => (
                        <li key={item.id ?? item._id}>
                            {item.name} — <strong>{item.quantity} шт.</strong>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}