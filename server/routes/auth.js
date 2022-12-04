const router = require('express').Router();
// const emailChecker = require('../middleware/emailCheck');
const { login, register, forgotPassword, loginCompany, makeCompany } = require('../controllers/auth.controller');

/**
 * ---- Make Company ----
 */
router.post('/company_register', makeCompany);

/**
 * ----- Company Login ------
 */
router.post('/company_login', loginCompany);

/**
 * ---- Login User ----
 */
router.post('/login', login);

/**
 * ---- Register User ----
 */
router.post('/register', register);

/**
 * ---- Forgot Passsord ----
 */
router.get('/forgot_password', forgotPassword);

module.exports = router;