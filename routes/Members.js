const express = require('express')
const router = express.Router();
const member = require('../controllers/members');
const { authentication } = require('../utils/validation');

router.get('/', (req, res, next) => member.init(req, res));
router.post('/signin', (req, res, next) => member.signin(req, res));
router.post('/create', authentication, (req, res, next) => member.create(req, res));
// router.put('/edit/:id', authentication, (req, res, next) => member.edit(req, res));
// router.delete('/:id', authentication, (req, res, next) => member.remove(req, res));

module.exports = router;