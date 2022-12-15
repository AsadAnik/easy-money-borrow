const router = require('express').Router();
const { 
    loanAcceptance, 
    allLoans, 
    loansStatus, 
    loanDetailsById, 
    loanUpdate, 
    loanDispatch,
    dispatchAction 
} = require('../controllers/loan.controller');


/**
 * ----- Check Loan By LoanId ----
 */
router.get('/', loanDetailsById);

/**
 * ---- Check Loan Status -----
 */
router.get('/status', loansStatus);

/**
 * ---- Loan Acceptance ----
 */
router.post('/acceptance', loanAcceptance);

/**
 * ---- See all loans ----
 */
router.get('/all', allLoans);

/**
 * ---- Loan Dates Update ----
 */
//router.get('/loan_periods_update', loanPeriodsUpdate);

/**
* ----- Update / Edit Loan -----
*/
router.put('/edit/:loanId', loanUpdate);

/**
* ----- Loan Dispatch -----
*/
router.post('/dispatch', loanDispatch);

/**
 * ---- Set Dispatch Action ----
 */
router.post('/dispatch/action', dispatchAction)

module.exports = router;