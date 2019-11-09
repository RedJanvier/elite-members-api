const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db-config');
const { validation } = require('../utils/validation');

const init = (req, res) => {
  db('members')
    .select('*')
    .orderBy('name', 'asc')
    .then(users => res.status(200).json({
      success: true,
      count: users.length,
      users
    }))
    .catch(err => {
      console.log(err);
      res.status(500).json({ success: false, error: 'Unable to GET users! Try again' });
    });
};

const single = (req, res) => {
  const { id } = req.params;
  db('members')
    .select('*')
    .where({ id: id })
    .then(user => res.status(200).json({
      success: true,
      user: user[0]
    }))
    .catch(err => {
      console.log(err);
      res.status(500).json({ success: false, error: 'Unable to GET users! Try again' });
    });
};

const signin = (req, res) => {
  const { email, password } = req.body;

    db('login')
      .join('members', 'login.member_id', 'members.id')
      .select('members.email as email', 'login.hash as hash', 'members.name as name', 'members.committee as committe', 'members.location as location')
      .where('email', '=', email)
      .then(data => {
        const user = data[0];

        if (bcrypt.compareSync(password, user.hash)) {
          const token = jwt.sign({
            email: user.email,
            name: user.name,
            committee: user.committee,
            location: user.location
          }, 'elite-members-secret', { expiresIn: '2h' });
          return res.status(200).json({ success: true, token });
        } else {
          res.status(401).json({ success: false, message: 'Email or Password wrong' });
        }

      })
      .catch(err => {
        console.log(err);
        return res.status(400).json({ success: false, message: 'wrong credentials' });
      });
};

const create = (req, res) => {
  const { name, email, password, location, committee, img } = req.body;

  if (validate.name(name) && validate.email(email)) {
    if (validate.password(password) && committee) {
      const hash = bcrypt.hashSync(password);
      db('members')
        .insert({
          name,
          email,
          location,
          img: typeof img !== 'undefined' || typeof img !== 'null' ? img : null,
          committee,
          joined: new Date()
        })
        .returning('email')
        .then(eEmail => {
          return db('login')
            .insert({
              email: eEmail[0],
              hash
            })
            .returning('*')
            .then(member => {
              console.log(
                req.userData.email + 'created a new user: ' + member[0].email
              );
              res.status(201).json(member[0]);
            });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            message: 'Unable to register user'
          });
        });
    } else {
      return db('members')
        .insert({
          name,
          email,
          location,
          img:
            typeof img !== 'undefined' || typeof img !== 'null'
              ? img
              : undefined,
          joined: new Date()
        })
        .returning('*')
        .then(member => {
          console.log(
            req.userData.email + ' created a new user: ' + member[0].email
          );
          res.status(201).json(member[0]);
        })
        .catch(err => res.status(500).json('Unable to register user'));
    }
  } else {
    res.status(500).json('unable to register');
  }
};

const remove = (req, res) => {
  const { id } = req.params;
  const { email, committee } = req.body;
  console.log(committee);
  if (id > 0 && validate.email(email)) {
    db('members')
      .where({
        id: id,
        email: email
      })
      .del()
      .returning('*')
      .then(() => {
        console.log(`${req.userData.email} just deleted ${email}`);
        if (typeof committee !== 'undefined' && validate.email(email)) {
          return db('login')
            .where('email', '=', email)
            .del()
            .returning('email')
            .then(() => res.status(200).json(email + ' deleted password'));
        } else if (validate.email(email)) {
          return res.status(200).json(email + ' was successfully deleted');
        } else {
          return res.status(404).json('member not found');
        }
      })
      .catch(err => {
        console.log(err);
        res.status(404).json('member not found');
      });
  } else {
    res.status(500).json('Failed to delete ' + email);
  }
};

const edit = (req, res) => {
  const { id } = req.params;
  if (String(req.body.do) === 'add' && id > 0) {
    db('members')
      .where('id', '=', id)
      .increment('shares', 1)
      .returning('*')
      .then(user => {
        console.log(`${req.userData.email} added a share to ${user[0].email}.`);
        res.status(201).json({
          message: 'successfully added a share to ' + user[0].name,
          shares_now: user[0].shares
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json('Error occurred, Try again');
      });
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
            console.log(
              `${req.userData.email} removed a share to ${user[0].email}.`
            );
            res.status(201).json({
              message:
                'successfully removed a share from account of ' + user[0].name,
              shares_now: user[0].shares
            });
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json('Error occurred, Try again');
      });
  } else {
    res.status(400).json('UNKOWN REQUEST');
  }
};



module.exports = {
  init,
  single,
  signin,
  edit,
  remove,
  create
};
