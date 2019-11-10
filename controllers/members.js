const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db-config');

const init = (req, res) => {
  db.select('*')
    .from('members')
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

    db('members')
      .join('login', 'members.id', 'login.member_id')
      .select('login.hash as hash', 'members.id as id', 'members.name as name', 'members.committee as committe', 'members.location as location')
      .where('members.email', '=', email)
      .then(data => {
        if (bcrypt.compareSync(password, data[0].hash)) {
          const token = jwt.sign({
            id: data[0].id,
            email: data[0].email,
            name: data[0].name,
            committee: data[0].committee,
            location: data[0].location
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
  const { name, email, password, location, committee, img, shares } = req.body;

  const hash = typeof password === 'string' ? bcrypt.hashSync(password, 10) : null;
  db('members')
    .insert({
      name,
      email,
      shares,
      location,
      img: typeof img !== 'undefined' || typeof img !== 'null' ? img : null,
      committee
    })
    .returning('id')
    .then(id => {
      if (hash && committee) {
        return db('login')
          .insert({ member_id: id[0], hash })
          .then(member => {
            console.log(`${req.userData.email} created a new user: ${member[0].member_id}`);
            res.status(201).json({ 
              success: true, 
              message: 'Member created successfully' 
            });
          });
      }
      res.status(201).json({
        success: true,
        message: 'Member created successfully'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Unable to register user'
      });
    });
};


const edit = async (req, res) => {
  const { id } = req.params;
  const { act } = req.body;
  let msg;

  act === 'add' 
  ? db('members')
    .where('id', '=', id)
    .increment('shares', 1)
    .returning('*')
    .then(user => { msg = `${req.member.email} added a share to ${user[0].email}.`; console.log(msg); })
    .catch(err => console.log(err))

  : db('members')
    .where('id', '=', id)
    .decrement('shares', 1)
    .returning('*')
    .then(user => { msg = `${req.member.email} removed a share to ${user[0].email}.`; console.log(msg); })
    .catch(err => console.log(err));

setTimeout(() => {
  res.status(200).json({ success: true, message: msg });
},200);

};

const remove = (req, res) => {
  const { id } = req.params;
    db('members')
      .where({ id })
      .del()
      .then(() => {
        console.log(`${req.userData.email} just deleted a Member`);
        res.status(200).json({ success: true, message: `${req.userData.email} just deleted a Member` });
      })
      .catch(err => {
        console.log(err);
        res.status(404).json({ success: false, message: 'member not found'});
      });
};

module.exports = {
  init,
  single,
  signin,
  edit,
  remove,
  create
};
