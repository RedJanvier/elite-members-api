import express from 'express';
import * as Member from '../controllers/members';
import { authentication } from '../utils/validation';

const router = express.Router();

router.get('/', Member.init);
router.get('/:id', Member.single);
router.post('/signin', Member.signin);
router.post('/create', authentication, Member.create);
router.patch('/:id', authentication, Member.edit);
router.delete('/:id', authentication, Member.remove);

export default router;
