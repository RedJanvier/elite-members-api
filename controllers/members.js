const bcrypt = require('bcrypt-nodejs');
const db = require('../config/db-config');
const validate = require('./validation');
const jwt = require('jsonwebtoken'); // for signing token sign

const handleCreate = (req, res) => {
    const {
        name,
        email,
        password,
        location,
        committee,
        img
    } = req.body;

    if (validate.name(name) && validate.email(email)) {
        if (validate.password(password) && committee) {
            const hash = bcrypt.hashSync(password);
            db('members').insert({
                    name,
                    email,
                    location,
                    img: (typeof img !== 'undefined' || typeof img !== 'null') ? img : undefined,
                    committee,
                    joined: new Date()
                    
                })
                .returning('email')
                .then(eEmail => {
                    return db('login').insert({
                            email: eEmail[0],
                            hash
                        })
                        .returning('*')
                        .then(member => {
                            console.log(req.userData.email + 'created a new user: ' + member[0].email);
                            res.status(201).json(member[0])
                        })
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: 'Unable to register user'
                    });
                });
        } else {
            return db('members').insert({
                    name,
                    email,
                    location,
                    img: (typeof img !== 'undefined' || typeof img !== 'null') ? img : undefined,
                    joined: new Date()
                })
                .returning('*')
                .then(member => {
                    console.log(req.userData.email + 'created a new user: ' + member[0].email);
                    res.status(201).json(member[0])
                })
                .catch(err => res.status(500).json('Unable to register user'))
        }
    } else {
        res.status(500).json("unable to register");
    }
}

const handleDelete = (req, res) => {
    const {
        id
    } = req.params;
    const {
        email
    } = req.body;
    if (id > 0 && validate.email(email)) {
        db('members')
            .where({
                id: id,
                email: email
            })
            .del()
            .returning('*')
            .then((user) => {
                console.log(`${req.userData.email} just deleted ${user[0].email}`);
                if (user[0].committee && validate.email(user[0].email)) {
                    db('login')
                        .where('email', '=', user[0].email)
                        .del()
                        .returning('email')
                        .then(rEmail => res.json(user[0].email + ' deleted password'))
                        .catch(err => res.status(400).json("user doesn't have password"))
                } else if (validate.email(user[0].email)) {
                    res.json(user[0].email + ' was successfully deleted')
                } else {
                    res.status(404).json('user not found');
                }
            })
            .catch(err => {
                console.log(err);
                res.status(404).json('member not found');
            })
    } else {
        res.status(400).json('Failed to delete ' + email)
    }
}

const handleEdit = (req, res) => {
    const {
        id
    } = req.params;
    if (String(req.body.do) === 'add' && id > 0) {
        db('members')
            .where('id', '=', id)
            .increment('shares', 1)
            .returning('*')
            .then(user => {
                console.log(`${req.userData.email} added a share to ${user.email}.`);
                res.status(201).json({
                    message: 'successfully added a share to ' + user[0].name,
                    shares_now: user[0].shares
                })
            })
            .catch(err => res.status(500).json('Error occurred, Try again'))
    } else if (String(req.body.do) === 'min' && id > 0) {
        db('members')
            .where('id', '=', id)
            .returning('shares')
            .then(user => {
                const newShares = user[0].shares - 1;

                return db('members')
                    .where('id', '=', id)
                    .update({
                        shares: newShares
                    })
                    .returning('*')
                    .then(user => {
                        console.log(`${req.userData.email} removed a share to ${user.email}.`);
                        res.status(201).json({
                            message: 'successfully removed a share from account of ' + user[0].name,
                            shares_now: user[0].shares
                        });
                    })
            }).catch(err => {
                console.log(err);
                res.status(500).json('Error occurred, Try again')
            });
    } else {
        res.status(400).json('UNKOWN REQUEST');
    }

}

const handleSignIn = (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (validate.email(email)) {
        db.select('email', 'hash')
            .from('login')
            .where('email', '=', email)
            .returning('*')
            .then(data => {
                const isValid = bcrypt.compareSync(password, data[0].hash)
                if (isValid) {
                    db.select('*')
                        .from('members')
                        .where('email', '=', email)
                        .then(user => {
                            const token = jwt.sign(user[0], "elite-members-secret", {
                                expiresIn: "1h"
                            });
                            res.status(200).json({
                                message: "you are successfully logged in",
                                token
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(404).json('user not found');
                        });
                } else {
                    return res.status(403).json('wrong credentials! FORBIDEN');
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(403).json('wrong credentials! FORBIDEN');
            });
    } else {
        return res.status(404).json('invalid email');
    }
}

const init = (req, res) => {
    db
        .select('*')
        .from('members')
        .orderBy('name', 'asc')
        .returning('*')
        .then(users => res.json(users))
        .catch(err => {
            console.log(err);
            res.status(400).json('Error getting members');
        });
}

module.exports = {
    init,
    handleSignIn,
    handleEdit,
    handleDelete,
    handleCreate
}