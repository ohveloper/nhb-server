import { Router } from 'express';
const { topicUpload, topicBring, adminCheck, topicEdit } = require('../controllers/admin');
const router = Router();

router.use('/', adminCheck); //? 전역으로 어드민 체크
router.post('/topic', topicUpload);
router.get('/topic', topicBring);
router.patch('/topic', topicEdit);

export default router;