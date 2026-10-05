import InventoryItem from './inventory.model.js';

class InventoryRepository {
    findAll() {
        return InventoryItem.find({});
    }

    findById(id) {
        return InventoryItem.findById(id);
    }

    create(itemData) {
        return InventoryItem.create(itemData);
    }
}

export default new InventoryRepository();