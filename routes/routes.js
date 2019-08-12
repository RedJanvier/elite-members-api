const express = require('express')
const router  = express.Router();
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const cors = require('cors');

const start = require('../controllers/start');
const create = require('../controllers/create');
const edit = require('../controllers/edit');
const signin = require('../controllers/signin');
const deletes = require('../controllers/delete');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'RedJanvier',
        password: 'test',
        database: 'elite'
    }
})

router.use(cors());

router.get('/', (req, res) => { start.init(db)(req, res) })
router.post('/create', (req, res) => { create.handleCreate(db, bcrypt)(req, res) });
router.put('/edit/:id', (req, res) => { edit.handleEdit(db)(req, res) });
router.post('/signin', (req, res) => { signin.handleSignIn(db, bcrypt)(req, res) });
router.delete('/member/:id', (req, res) => { deletes.handleDelete(db)(req, res)});
router.delete('/delete', (req, res) => { 
    const emails = ["alain@gmail.com"]
    emails.forEach(email => {
        db('login').where({email})
        .del()
        .returning('email')
        .then(console.log)
        .catch(console.log)
    })
});

module.exports = router;