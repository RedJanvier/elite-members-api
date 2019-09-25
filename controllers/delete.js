const handleDelete = (db) => (req, res) => {
    const {
        id
    } = req.params;
    const {
        email
    } = req.body;
    const validateEmail = (vEmail) => {
        const re = /^([\w]+)@([a-zA-Z]{2,12})+\.(([a-zA-Z]{2,5})+)(\.[a-zA-Z]{2,5})*$/;
        return re.test(String(vEmail).toLowerCase());
    }
    if (id > 0 && validateEmail(email)) {
        db('members')
            .where({
                id: id,
                email: email
            })
            .del()
            .returning('*')
            .then((user) => {
                console.log(`${req.userData.email} just deleted ${user[0].email}`);
                if (user[0].committee && validateEmail(user[0].email)) {
                    db('login')
                        .where('email', '=', user[0].email)
                        .del()
                        .returning('email')
                        .then(rEmail => res.json(user[0].email + ' deleted password'))
                        .catch(err => res.status(400).json("user doesn't have password"))
                } else if (validateEmail(user[0].email)) {
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

module.exports = {
    handleDelete
};