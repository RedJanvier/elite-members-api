import express from 'express';
import memberRoutes from './Members';

const router = express.Router();

router.use('/members', memberRoutes);

export default router;
