const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const start = require('../controllers/start');
const create = require('../controllers/create');
const edit = require('../controllers/edit');
const signin = require('../controllers/signin');
const deletes = require('../controllers/delete');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssh: true
    }
})

router.use(cors());

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = jwt.verify(token, 'elite-members-secret');

        req.userData = data;
        next();

    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: 'Authentication failed! FORBIDEN'
        });
    }
};

router.get('/', (req, res) => {
    start.init(db)(req, res)
})
router.post('/create', (req, res) => {
    create.handleCreate(db, bcrypt)(req, res)
});
router.put('/edit/:id', checkAuth, (req, res) => {
    edit.handleEdit(db)(req, res)
});
router.post('/signin', (req, res) => {
    signin.handleSignIn(db, bcrypt)(req, res)
});
router.delete('/member/:id', checkAuth, (req, res) => {
    deletes.handleDelete(db)(req, res)
});

module.exports = router;