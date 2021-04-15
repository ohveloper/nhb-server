import { Router } from 'express';
const { authEmail, signUp, login, refreshToken, logout } = require('../controllers/main');

const router = Router();

router.post('/authemail', authEmail);
router.post('/signup', signUp);
router.post('/login', login);
router.get('/refreshtoken', refreshToken);
router.get('/logout', logout);

export default router;