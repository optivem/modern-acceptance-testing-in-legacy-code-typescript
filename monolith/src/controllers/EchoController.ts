import { Router, Request, Response } from 'express';

const router = Router();

router.get('/echo', (req: Request, res: Response) => {
  res.status(200).send();
});

export { router as echoRouter };
