const express = require('express')
const Member = require('../controllers/members');
const { authentication } = require('../utils/validation');

const router = express.Router();

router.get('/', Member.init);
router.get('/:id', Member.single);
router.post('/signin', Member.signin);
router.post('/create', authentication, Member.create);
router.patch('/:id', authentication, Member.edit);
router.delete('/:id', authentication, Member.remove);

module.exports = router;