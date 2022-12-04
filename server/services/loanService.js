const Loan = require('../models/Loan');
const { getMonthFromNow } = require('../services/getTimesService');
const { getFormatedDate } = require('../services/dateFormatService');


/**
* ----- Make Loan Dispatch -----
* @param {Array} periods
* @param {Number} payForMonth
* @param {Boolean} paidStatus
* @returns {Array}
*/
// const loanDispatch = async function () {

// }

/**
 * ----- Make the loan period status update -----
 * @param {Array} periods
 * @param {Number} payForMonth
 * @param {Boolean} paidStatus
 * @returns {Array}
 */
const setLoanPeriodsStatus = async function (loanId, payForMonth=1, paidStatus = true) {
    const { loanPeriods } = await Loan.findById(loanId);

    const unPaidLoanPeriods = loanPeriods.filter(period => !period.isPaid);

    unPaidLoanPeriods.forEach((_, index) => {
        if (index < payForMonth){
            unPaidLoanPeriods[index].isPaid = paidStatus;
        }
    });

    // Loan Periods For After all refreshment..
    console.log('Full Range Of Dates Period -- ', loanPeriods);

    return loanPeriods;
}


/**
 * ------ Get Sumation of the Loan Periods ----
 * @param {Array} periods
 * @param {Number} payForMonth
 * @returns {Number}
 */
const getSumOfLoanPeriods = function (periods, payForMonth=1) {
    // Have to pay for one or multiple months..
    let haveToPay = 0;

    for (let i = 0; i < payForMonth; i++) {
        if (payForMonth > 1) {
            haveToPay = haveToPay + parseInt(periods[i].payPerMonth);
        } else {
            haveToPay = parseInt(periods[i].payPerMonth);
        }
    }

    return haveToPay;
}


/**
 * To Getting the all periods..
 * @param {Number} payDuration
 * @param {Number} payPerMonth
 * @returns {Array}
 */
const getPeriods = function (payDuration, payPerMonth) {
    // let's make create Periods..
    let periods = [];

    for (let i = 0; i < payDuration; i++) {
        periods.push({
            id: i + 1,
            isActive: false,
            isPaid: false,
            date: getFormatedDate(getMonthFromNow(i)),
            payPerMonth
        });
    }

    return periods;
};


/**
 * ----- All of the Running Loans for checking the status -----
 * @returns 
 */
const getAllLoans = async function () {
    const loans = await Loan.find({ status: 'RUNNING' });
    return loans;
};


/**
 * ----- Getting the Loans Of Company -----
 * @param {String} companyId 
 * @returns 
 */
const getLoansByCompanyId = async function (companyId) {
    const loans = await Loan.find({ companyId: companyId }).sort({ createdAt: -1 });
    return loans;
};


/**
 * ----- Getting the Loans Of User ----
 * @param {String} userId 
 * @returns 
 */
const getLoansByUserId = async function (userId) {
    const loans = await Loan.find({ userId: userId }).sort({ createdAt: -1 });
    return loans;
};


module.exports = {
    setLoanPeriodsStatus,
    getSumOfLoanPeriods,
    getPeriods,
    getAllLoans,
    getLoansByCompanyId,
    getLoansByUserId
};