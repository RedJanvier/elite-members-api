const jwt = require('jsonwebtoken');

class validation {
    constructor() {
        this.email = /^([-\w\d]{1,25})@([a-z]{4,20})\.([a-z]{2,5})(\.[a-z]{2,6})*$/;
        this.password = /^([\w\d-#\$%\^&\*\(\)@\!\/\.\?~,]{8,20})$/;
        this.name = / ^ ([A - Z] * [a - z] +)(\s[a - z] +) * $ /;
    }

    static checkEmail(email){this.email.test(email);}
    static checkName(name){this.name.test(name);}
    static checkPassword(pass){this.password.test(pass);}
    static checkCommittee(comm){this.name.test(comm);}
}

const authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = jwt.verify(token, 'elite-members-secret');

        req.userData = data;
        next();

    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: 'Authentication failed! FORBIDEN'
        });
    }
};

module.exports = { validation, authentication };