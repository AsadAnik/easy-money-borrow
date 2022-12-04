const router = require('express').Router();
const { 
    logout, 
    deleteAccount, 
    getUserLoans, 
    authChecker, 
    getAllCompanies, 
    getCompany,
    loanRequest,
    loanDispatch,
    updateProfile
} = require('../controllers/user.controller');


/**
 * ----- Update the Profile ----
 */
router.post('/edit', updateProfile);

/**
 * ------ User's Loan Request for the Company -------
 */
router.post('/loan_request', loanRequest);

/**
 * ------ User Loans Dispatching ----
 */
router.post('/loan_dispatch', loanDispatch)

/**
 * ------- Auth Checker ------
 */
 router.get('/company', getCompany);

/**
 * ------- Auth Checker ------
 */
 router.get('/companies', getAllCompanies);

/**
 * ------- Auth Checker ------
 */
router.get('/auth_check', authChecker);

/**
 * ----- Getting User Loans -----
 */
router.get('/user_loans', getUserLoans);

/**
 * ---- Delete User Account ----
 */
router.delete('/delete', deleteAccount);

/**
 * ---- User Logout ----
 */
router.get('/logout', logout);

module.exports = router;