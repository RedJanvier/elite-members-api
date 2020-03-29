import db from './knex';

export default {
  async getAll() {
    const members = await db
      .select('*')
      .from('members')
      .orderBy('name', 'asc');

    return members;
  },
  async getSingle(id) {
    const member = await db('members')
      .select('*')
      .where({ id });

    return member;
  },
  async getLogin(email) {
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

    return data;
  },
  async createMember({ name, email, shares, location, img, committee }) {
    const data = await db('members')
      .insert({
        name,
        email,
        shares,
        location,
        img: typeof img === 'string' && img,
        committee,
      })
      .returning('id');
    return data;
  },
  async storeHash(hash, id) {
    const stored = await db('login').insert({ member_id: id, hash });
    return stored;
  },
  async editMember(id, job) {
    const member = await db('members')
      .where({ id })
      [job]('shares', 1)
      .returning('*');
    return member;
  },
  async deleteMember(id) {
    const member = await db('members')
      .where({ id })
      .del();
    return member;
  },
};
