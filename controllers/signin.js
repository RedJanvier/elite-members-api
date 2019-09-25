const jwt = require('jsonwebtoken');

const handleSignIn = (db, bcrypt) => (req, res) => {
    const {
        email,
        password
    } = req.body;
    const validateEmail = (vemail) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(vemail).toLowerCase());
    };
    if (validateEmail(email)) {
        db.select('email', 'hash')
            .from('login')
            .where('email', '=', email)
            .returning('*')
            .then(data => {
                const isValid = bcrypt.compareSync(password, data[0].hash)
                if (isValid) {
                    db.select('*')
                        .from('members')
                        .where('email', '=', email)
                        .then(user => {
                            const token = jwt.sign(user[0], "elite-members-secret", {
                                expiresIn: "2h"
                            });
                            return res.status(200).json({
                                message: "you are successfully logged in",
                                token
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(404).json('user not found')
                        });
                } else {
                    res.status(403).json('wrong credentials! FORBIDEN');
                }
            })
            .catch(err => {
                console.log(err);
                res.status(403).json('wrong credentials! FORBIDEN')
            })
    }
}

module.exports = {
    handleSignIn
}