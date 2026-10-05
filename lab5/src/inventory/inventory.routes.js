import { Router } from 'express';
import {
    getItems,
    getItemById,
    createItem,
    getStats,
} from './inventory.controller.js';

const router = Router();

router.get('/', getItems);
router.get('/stats', getStats);
router.get('/:id', getItemById);
router.post('/', createItem);

export default router;