import { Router } from 'express';
const { authEmail } = require('../controllers/main');

const router = Router();

router.get('/authEmail', authEmail);

export default router;