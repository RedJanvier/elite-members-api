const handleEdit = (db) => (req, res) => {
    const { id } = req.params;
    if(String(req.body.do) === 'add'){
        db('members')
        .where('id', '=', id)
        .increment('shares', 1)
        .returning('shares')
        .then(shares => {
            res.json(shares[0])
        })
        .catch(err => res.status(500).json('Error occurred, Try again'))
    }else if(String(req.body.do) === 'min'){
        db('members')
        .where('id', '=', id)
        .returning('shares')
        .then(user => {
            const newShares = user[0].shares - 1;
            db('members')
            .where('id', '=', id)
            .update({ shares: newShares })
            .returning('shares')
            .then(s => res.json(s[0]))
            .catch(err => res.status(500).json('Error occurred, Try again'))
        })
        .catch(err => res.status(500).json('Error occurred, Try again'))
    }else{
        res.status(404).json('UNKOWN REQUEST');
    }

}

module.exports = {
    handleEdit
}