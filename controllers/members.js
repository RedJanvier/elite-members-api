import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db-config';

export const init = async (req, res) => {
  try {
    const users = await db
      .select('*')
      .from('members')
      .orderBy('name', 'asc');
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: 'Unable to GET users! Try again',
    });
  }
};

export const single = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db('members')
      .select('*')
      .where({ id });
    return res.status(200).json({
      success: true,
      user: user[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: 'Unable to GET users! Try again',
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await db('members')
      .join('login', 'members.id', 'login.member_id')
      .select(
        'login.hash as hash',
        'members.id as id',
        'members.name as name',
        'members.committee as committee',
        'members.location as location'
      )
      .where('members.email', '=', email);

    if (!data[0]) throw new Error('member not found!');
    if (bcrypt.compareSync(password, data[0].hash)) {
      const token = jwt.sign(
        {
          id: data[0].id,
          email,
          name: data[0].name,
          committee: data[0].committee,
          location: data[0].location,
        },
        'elite-members-secret',
        { expiresIn: '2h' }
      );
      return res.status(200).json({ success: true, token });
    }
    return res.status(401).json({
      success: false,
      message: 'Email or Password wrong',
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ success: false, message: 'unable to signin' });
  }
};

export const create = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      location,
      committee,
      img,
      shares,
    } = req.body;

    let member;
    const hash =
      typeof password === 'string' ? bcrypt.hashSync(password, 10) : null;
    const id = await db('members')
      .insert({
        name,
        email,
        shares,
        location,
        img: typeof img === 'string' ? img : null,
        committee,
      })
      .returning('id');

    if (hash && committee) {
      member = await db('login').insert({ member_id: id[0], hash });
    }
    console.log(
      `${req.userData.email} created a new user: ${member[0].member_id}`
    );
    return res.status(201).json({
      success: true,
      message: 'Member created successfully',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Unable to register user',
    });
  }
};

export const edit = async (req, res) => {
  const { id } = req.params;
  const { act } = req.body;
  const job = act === 'add' ? 'increment' : 'decrement';
  try {
    const user = await db('members')
      .where({ id })
      [job]('shares', 1)
      .returning('*');

    const msg = `${req.member.email} ${job}ed a share to ${user[0].email}.`;

    return res.status(200).json({ success: true, message: msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: `Request failed to edit the user ${id}`,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await db('members')
      .where({ id })
      .del();

    console.log(`${req.userData.email} just deleted a Member`);
    return res.status(200).json({
      success: true,
      message: `${req.userData.email} just deleted a Member`,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      message: 'member not found',
    });
  }
};
