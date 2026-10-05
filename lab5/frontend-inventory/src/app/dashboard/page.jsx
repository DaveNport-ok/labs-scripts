import AddItemForm from '@/components/AddItemForm';

// Отримання даних із явним тегованим кешуванням
async function getInventoryStats() {
    const response = await fetch(
        `${process.env.API_URL}/inventory/stats`,
        {
            cache: 'force-cache',
            next: { tags: ['inventory-stats'] },
        }
    );
    if (!response.ok) {
        throw new Error('Не вдалося завантажити статистику');
    }
    const payload = await response.json();
    return payload.data;
}

export default async function DashboardPage() {
    const stats = await getInventoryStats();
    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold mb-6">Аналітичний дашборд</h1>
            {/* Змінено на 4 колонки */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="border p-6 rounded">
                    <h2>Найменувань</h2>
                    <p className="text-4xl font-bold">{stats.productCount}</p>
                </div>
                <div className="border p-6 rounded">
                    <h2>Одиниць товару</h2>
                    <p className="text-4xl font-bold">{stats.totalQuantity}</p>
                </div>
                <div className="border p-6 rounded">
                    <h2>Вартість запасів</h2>
                    <p className="text-4xl font-bold">{stats.totalValue}</p>
                </div>
                {/* Четверта картка із самостійного завдання */}
                <div className="border p-6 rounded">
                    <h2>Немає в наявності</h2>
                    <p className="text-4xl font-bold">{stats.outOfStockCount ?? 0}</p>
                </div>
            </div>
            <AddItemForm />
        </main>
    );
}