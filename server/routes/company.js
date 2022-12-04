const router = require('express').Router();
const { 
    getLoansOfCompany, 
    getCompanyById, 
    getAllCompanies, 
    logoutCompany,
    userInfoByUserId,
    companyAuth,
    updateCompany
} = require('../controllers/company.controller');


/**
 * ----- Update Company -----
 */
router.post('/edit', updateCompany);

/**
 * ------ Company Auth Checker -----
 */
router.get('/auth', companyAuth);

/**
 * ---- User Information By UserId ----
 */
router.get('/userInfo', userInfoByUserId);

/**
 * ---- User Logout ----
 */
router.get('/logout', logoutCompany);

/**
 * ----- Get Company By Id -----
 */
router.get('/', getCompanyById);

/**
 * ------ See All Companies ----
 */
router.get('/all', getAllCompanies);

/**
 * ---- Get Company Loans ----
 */
router.get('/company_loans', getLoansOfCompany);

module.exports = router;