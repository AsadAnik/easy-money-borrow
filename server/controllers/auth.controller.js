const User = require('../models/User');
const Company = require('../models/Company');

/**
 * ---- Make Company ----
 * @param {*} req 
 * @param {*} res 
 */
 const makeCompany = async (req, res) => {
    const company = new Company(req.body);

    try {
        const foundCompany = await Company.find({ name: req.body.name, email: req.body.email, phone: req.body.phone });
        if (foundCompany.length) return res.status(400).json({ success: false, message: 'Company Is Already Exists!' });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

    company.save((err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json(result);
    });
};

/**
 * ----- Company Login -----
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const loginCompany = async function (req, res) {
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    if (!loginEmail || !loginPassword) return res.status(400).json({ isAuth: false, message: 'Cradentials Error!' });

    try {
        const findCompany = await Company.findOne({ email: loginEmail });
        if (!findCompany) return res.status(404).json({ isAuth: false, message: 'Company Not Found!' });

        // Compare password with registered Company..
        findCompany.comparePassword(loginPassword, function (err, isMatch) {
            if (!isMatch) return res.status(200).json({ isAuth: false, message: "Auth Failed! Wrong Password" });
            if (err) return res.status(400).json({ isAuth: false, message: err.message })

            // Ganarate Token when User Password is Fine..
            findCompany.ganarateToken(function (err, company) {
                if (err) return res.status(400).json({ isAuth: false, message: err.message });

                res.cookie('auth', company.token).json({
                    isAuth: true,
                    id: company._id,
                    email: company.email
                });
            });

        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * ---- Register Controller ----
 * @param {*} req 
 * @param {*} res 
 * @param {*} _next 
 */
const register = async function (req, res, _next) {
    const user = new User(req.body);

    try {
        const foundUser = await User.find({ phone: req.body.phone });
        if (foundUser.length) return res.status(400).json({ success: false, message: 'User Is Already Exists!' })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

    // Users Age Should Be Greater Then 18..
    if (user.age < 18) return res.status(400).json({ success: false, message: "You Are Not Capable To Loan" });

    // Saving the User With New Data..
    user.save(function (error, docs) {
        if (error) return res.json({ success: false, error });

        res.status(200).json({
            success: true,
            message: 'User created successfully.',
            user: {
                firstname: docs.firstname,
                lastname: docs.lastname,
                phone: docs.phone,
                nid: docs.nid,
                age: docs.age,
                balance: docs.balance,
                createdAt: docs.createdAt,
            }
        });
    });
};

/**
 * ---- Login Controller ----
 * @param {*} req 
 * @param {*} res 
 * @param {*} _next 
 */
const login = async function (req, res, _next) {
    const loginPhone = req.body.phone;
    const loginPassword = req.body.password;

    if (!loginPhone || !loginPassword) return res.status(400).json({ isAuth: false, message: 'Cradentials Error!' });

    try {
        const findUser = await User.findOne({ phone: loginPhone });
        if (!findUser) return res.status(404).json({ isAuth: false, message: 'User Not Found!' });

        // Compare password with registered User..
        findUser.comparePassword(loginPassword, function (err, isMatch) {
            if (!isMatch) return res.status(200).json({ isAuth: false, message: "Auth Failed! Wrong Password" });
            if (err) return res.status(400).json({ isAuth: false, message: err.message })

            // Ganarate Token when User Password is Fine..
            findUser.ganarateToken(function (err, user) {
                if (err) return res.status(400).json({ isAuth: false, message: err.message });

                res.cookie('auth', user.token).json({
                    isAuth: true,
                    id: user._id,
                    phone: user.phone
                });
            });

        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * ---- Forgot Password Controller ----
 * @param {*} req 
 * @param {*} res 
 */
const forgotPassword = (_req, res) => {
    res.status(200).send('Route for forgot password!');
};

module.exports = {
    login,
    register,
    forgotPassword,
    loginCompany,
    makeCompany
};