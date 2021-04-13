import { Router, Request, Response, NextFunction } from 'express';
const { bring, edit, withdrawal, liveRank } = require('../controllers/user');

const router = Router();

router.post('/', bring);
router.patch('/', edit);
router.delete('/', withdrawal);
router.get('/', liveRank);

export default router;