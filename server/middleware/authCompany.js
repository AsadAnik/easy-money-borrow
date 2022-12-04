// import Model..
const Company = require('../models/Company');

// auth middleware..
const authCompany = function (req, res, next) {
    const token = req.cookies.auth;

    Company.findByToken(token, function (err, company) {
        if (err) return res.json({ isAuth: false, error: true, msg: err.message });
        if (!company) return res.json({ isAuth: false, error: true, msg: 'Company not found!' });

        req.token = token;
        req.company = company;
        next();
    });
}

module.exports = authCompany;