const handleEdit = (db) => (req, res) => {
    const {
        id
    } = req.params;
    if (String(req.body.do) === 'add') {
        db('members')
            .where('id', '=', id)
            .increment('shares', 1)
            .returning('*')
            .then(user => {
                console.log(`${req.userData.email} added a share to ${user.email}.`);
                res.status(201).json({
                    message: 'successfully added a share to ' + user[0].name,
                    shares_now: user[0].shares
                })
            })
            .catch(err => res.status(500).json('Error occurred, Try again'))
    } else if (String(req.body.do) === 'min') {
        db('members')
            .where('id', '=', id)
            .returning('shares')
            .then(user => {
                const newShares = user[0].shares - 1;

                return db('members')
                    .where('id', '=', id)
                    .update({
                        shares: newShares
                    })
                    .returning('*')
                    .then(user => {
                        console.log(`${req.userData.email} removed a share to ${user.email}.`);
                        res.status(201).json({
                            message: 'successfully removed a share from account of ' + user[0].name,
                            shares_now: user[0].shares
                        });
                    })
            }).catch(err => {
                console.log(err);
                res.status(500).json('Error occurred, Try again')
            });
    } else {
        res.status(400).json('UNKOWN REQUEST');
    }

}

module.exports = {
    handleEdit
}