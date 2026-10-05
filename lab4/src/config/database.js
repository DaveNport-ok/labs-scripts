import mongoose from 'mongoose';

export async function connectDB (
    uri = process.env.MONGODB_URI
        ?? 'mongodb://127.0.0.1:27017/inventory_db')
{
    await mongoose.connect(uri);
    console.log('Успішне підключення до MongoDB');
}