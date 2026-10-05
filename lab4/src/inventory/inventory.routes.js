import { Router } from 'express';
import { getItems, getItemById, createItem } from './inventory.controller.js';

const router = Router();

router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', createItem);

export default router;