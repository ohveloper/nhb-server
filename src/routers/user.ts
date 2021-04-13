import { Router, Request, Response, NextFunction } from 'express';
const { bring, edit, withdrawal } = require('../controllers/user');

const router = Router();

router.post('/', bring);
router.patch('/', edit);
router.delete('/', withdrawal);

export default router;