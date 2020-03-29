import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import queries from '../db/queries';

export const init = async (req, res) => {
  try {
    const users = await queries.getAll();
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
    const user = await queries.getSingle(id);
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

    const data = await queries.getLogin(email);

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
        process.env.SECRET,
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
    const { password, committee } = req.body;

    const hash =
      typeof password === 'string' ? bcrypt.hashSync(password, 10) : null;
    const id = await queries.createMember(req.body);

    if (hash && committee) {
      const member = await queries.storeHash(hash, id[0]);
      console.log(
        `${req.userData.email} created a new user: ${member[0].member_id}`
      );
    }
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
    const member = await queries.editMember(id, job);

    const msg = `${req.member.email} ${job}ed a share to ${member[0].email}.`;

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
    await queries.deleteMember(id);

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
