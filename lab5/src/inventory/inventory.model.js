import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'Кількість має бути цілим числом',
        },
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, { timestamps: true });
const InventoryItem = mongoose.model(
    'InventoryItem',
    inventoryItemSchema
);

export default InventoryItem;