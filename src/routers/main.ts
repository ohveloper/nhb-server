import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', (req:Request, res:Response, next: NextFunction) => {
  res.send('this is /main router');
})

export default router;