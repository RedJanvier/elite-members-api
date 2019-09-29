const router = require('express').Router();
const cors = require('cors');

const checkAuth = require('../controllers/validation').authenication;

router.use(cors());

const member_handle = require('../controllers/members');

router.get('/', (req, res, next) => member_handle.init(req, res));
router.post('/create', (req, res, next) => member_handle.handleCreate(req, res));
router.put('/edit/:id', checkAuth, (req, res, next) => member_handle.handleEdit(req, res));
router.post('/signin', (req, res, next) => member_handle.handleSignIn(req, res));
router.delete('/member/:id', checkAuth, (req, res, next) => member_handle.handleDelete(req, res));

module.exports = router;