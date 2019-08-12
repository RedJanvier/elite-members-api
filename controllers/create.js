const handleCreate = (db, bcrypt) => (req, res) => {
    const { name, email, password, location, committee } = req.body;
    if(name, email){
        if(password && committee){
            const hash = bcrypt.hashSync(password);
            db('login').insert({ email, hash })
            .returning('email')
            .then(eEmail => {
                return db('members').insert({
                    name,
                    email: eEmail[0],
                    location,
                    committee,
                    joined: new Date()
                })
                .returning('*')
                .then(member => {
                    res.json(member[0])
                })
                .catch(err => res.status(400).json('Unable to register user'));
            })
            .catch(err => res.status(400).json('Unable to register user'));
        }else{
            return db('members').insert({
                name,
                email,
                location,
                joined: new Date()
            })
            .returning('*')
            .then(member => {
                res.json(member[0])
            })
            .catch(err => res.status(400).json('Unable to register user'))
        }
    }else{
        res.status(400).json("unable to register");
    }
}

module.exports ={
    handleCreate
}


