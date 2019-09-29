const jwt = require('jsonwebtoken');

exports.email = (address) => {
    const regex = /^([-\w\d]{1,25})@([a-z]{4,20})\.([a-z]{2,5})(\.[a-z]{2,6})*$/;
    return regex.test(address);
}

exports.password = (input) => {
    const regex = /^([\w\d-#\$%\^&\*\(\)@\!\/\.\?~,]{8,20})$/;
    return regex.test(input);
}

exports.name = (input) => {
    const regex = /^([A-Z]*[a-z]+)(\s[A-Z]*[a-z]+)*$/;
    return regex.test(input);
}

exports.committee = (input) => {
    const regex = /^([A-Z]*[a-z]+)(\s[a-z]+)*$/;
    return regex.test(input);
}

exports.authenication = (req, res, next) => {
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