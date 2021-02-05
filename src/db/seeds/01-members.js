exports.seed = async knex => {
  // Deletes ALL existing entries
  await knex('members').del();

  // Inserts seed entries
  await knex('members').insert([
    {
      name: 'Alain NIYONEMA',
      email: 'alainyern@gmail.com',
      location: 'ETE Year 3',
      shares: 7,
      committee: 'IT Manager',
    },
  ]);

  await knex('login').del();
  const done = await knex('login').insert([
    {
      member_id: 1,
      member_email: 'alainyern@gmail.com',
      // password is test
      hash: '$2a$10$si3eGwiNW0D/tguNcKsDgegE9VdlPyp5OqO0uEq6U/B2fVYKO0QKe',
    },
  ]);
  return done;
};
