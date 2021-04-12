import { Router, Request, Response, NextFunction } from 'express';
const { bring, edit, withdrawal, feeds } = require('../controllers/user');

const router = Router();

router.post('/', bring);
router.patch('/', edit);
router.delete('/', withdrawal);
router.post('/feed', feeds);

export default router;