exports.up = async knex => {
  const login = await knex.schema.createTable('login', table => {
    table.increments('id').primary();
    table.string('hash').unique();
    table
      .string('member_email')
      .notNullable()
      .unique();
    table
      .integer('member_id')
      .unsigned()
      .notNullable()
      .unique();

    table
      .foreign('member_id')
      .references('id')
      .inTable('members');
  });
  return login;
};

exports.down = knex => knex.schema.dropTable('login');
