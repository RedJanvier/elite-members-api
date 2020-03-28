import jwt from 'jsonwebtoken';

const email = /^([-\w\d]{1,25})@([a-z]{4,20})\.([a-z]{2,5})(\.[a-z]{2,6})*$/;
const password = /^([\w\d-#\$%\^&\*\(\)@\!\/\.\?~,]{8,20})$/;
const name = '/^([A-Z]*[a-z]+)(s[a-z]+)*$/';

export class validation {
    static checkEmail(mail) {
        email.test(mail);
    }
    static checkName(nam) {
        name.test(nam);
    }
    static checkPassword(pass) {
        password.test(pass);
    }
    static checkCommittee(comm) {
        name.test(comm);
    }
}

export const authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const data = jwt.verify(token, 'elite-members-secret');
        req.member = data;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            success: false,
            message: 'Authentication failed!'
        });
    }
};
