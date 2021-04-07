import { Router } from 'express';
const { authEmail, signUp, login, refreshToken } = require('../controllers/main');

const router = Router();

router.post('/authemail', authEmail);
router.post('/signup', signUp);
router.post('/login', login);
router.get('/refreshtoken', refreshToken);

export default router;