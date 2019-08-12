const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    const validateEmail = (vemail) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(vemail).toLowerCase());
    };
    if(validateEmail(email)){
        db.select('email', 'hash')
        .from('login')
        .where('email', '=', email)
        .returning('*')
        .then(data => {
            const isValid = bcrypt.compareSync( password, data[0].hash )
            if( isValid ){
                db.select('*')
                .from('members')
                .where( 'email', '=', email )
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(404).json('user not found'));
            }else{
                res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
    }
}

module.exports = {
    handleSignIn
}