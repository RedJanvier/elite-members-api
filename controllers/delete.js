const handleDelete = (db) => (req, res) => {
    const { id } = req.params;
    const { email } = req.body;
    const validateEmail = (vEmail) => {
        // const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // return re.test(String(vEmail).toLowerCase());
        return true
    }
    if(id > 0 && validateEmail(email)){
        db('members')
        .where({ id: id , email: email })
        .del()
        .returning('*')
        .then((user) => {
            if(user[0].committee && validateEmail(user[0].email)){
                db('login')
                .where('email', '=', user[0].email)
                .del()
                .returning('email')
                .then(rEmail => res.json(user[0].email + ' deleted password'))
                .catch(err => res.status(400).json("user doesn't have password"))
            }else if(validateEmail(user[0].email)){
                res.json(user[0].email + ' was successfully deleted')
            }else{
                res.status(404).json('user not found')
            }
        })
        .catch(err => res.status(404).json('user not found'))
    }else{
        res.status(400).json('Failed to delete ' + email)
    }
}

module.exports = {
    handleDelete
};