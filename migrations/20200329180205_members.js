exports.up = async knex => {
  const members = await knex.schema.createTable('members', table => {
    table.increments('id').primary();
    table
      .string('img')
      .defaultTo(
        'https://firebasestorage.googleapis.com/v0/b/learn-firebase-bbe9f.appspot.com/o/profiles%2Falain%40gmail.com.jpg?alt=media&token=2a01735f-6560-45ef-86b2-b6536dcfcb40'
      );
    table.string('name').unique();
    table.integer('shares').defaultTo(1);
    table.string('location').defaultTo('ETE');
    table.string('committee').unique();
    table
      .string('email')
      .notNullable()
      .unique();
  });
  return members;
};

exports.down = knex => knex.schema.dropTable('members');
