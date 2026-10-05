import inventoryService from './inventory.service.js';

export async function getItems(req, res, next) {
    try {
        const items = await inventoryService.getItems();
        return res.status(200).json({ success: true, data: items });
    } catch (error) {
        return next(error);
    }
}

export async function getItemById(req, res, next) {
    try {
        const item = await inventoryService.getItemById(req.params.id);
        return res.status(200).json({ success: true, data: item });
    } catch (error) {
        return next(error);
    }
}

export async function createItem(req, res, next) {
    try {
        const item = await inventoryService.createItem(req.body);
        return res.status(201).json({ success: true, data: item });
    } catch (error) {
        return next(error);
    }
}

export async function getStats(req, res, next) {
    try {
        const stats = await inventoryService.getStats();
        return res.status(200).json({ success: true, data: stats });
    } catch (error) {
        return next(error);
    }
}