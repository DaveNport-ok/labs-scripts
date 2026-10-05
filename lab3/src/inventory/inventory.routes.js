import { Router } from 'express';
import {
    createItem,
    getItemById,
    getItems,
} from './inventory.controller.js';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', createItem);

export default router;