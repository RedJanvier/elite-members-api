const init = (db) => (req, res) => {
    db
    .select('*')
    .from('members')
    .orderBy('name', 'asc')
    .returning('*')
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error getting members'))
}

module.exports = {
    init
}