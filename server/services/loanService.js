const Loan = require('../models/Loan');
const { isAfter } = require('date-fns');
const { getMonthFromNow } = require('../services/getTimesService');
const { getFormatedDate } = require('../services/dateFormatService');


/**
 * ------ Reuse The Loan Action Dispatch things -----
 * @param {String} actionDispatchStatus 
 */
const setLoanActionDispatch = async function (loanId, actionDispatchStatus) {
    const loan = await Loan.findById(loanId);
    loan.dispatchAction = actionDispatchStatus;
    loan.save();
};


/**
* ----- Make Loan Dispatch -----
* @param {Array} periods
* @param {Number} payForMonth
* @param {Boolean} paidStatus
* @returns {Array}
*/
const loanDispatch = async function (loanId, res, payAmounts, payForMonth) {
    try {
        const loan = await Loan.findById(loanId);
        if (!loan) throw new Error("Loan Not Found!");

        const { expiredDate, loanPeriods } = loan;
        const haveToPay = getSumOfLoanPeriods(loanPeriods, payForMonth);

        if (!isAfter(new Date(), new Date(expiredDate))) {
            if (loan.amounts === 0 || loan.payDuration === 0) {
                loan.status = 'FINISHED';
                loan.payPerMonth = 0;
                await loan.save();

                return res.status(200).json({
                    success: false,
                    message: 'You dont\'t Have to pay',
                    paySprintFinished: true
                });
            }

            if (payAmounts < haveToPay) {
                const lessPay = haveToPay - payAmounts;
                return res.status(200).json({
                    success: false,
                    message: 'Can\'t Pay Less ',
                    amounts: lessPay.toFixed(2),
                    loan
                });
            }

            if (payAmounts > haveToPay) {
                const morePay = payAmounts - haveToPay;
                return res.status(200).json({
                    success: false,
                    message: 'You Can\'t Pay More',
                    amounts: morePay.toFixed(2),
                    loan
                });
            }

            if (payAmounts == haveToPay) {
                // Change the loanPeriods Status..
                const updatedPeriods = await setLoanPeriodsStatus(loanId, payForMonth, true);
                loan.loanPeriods = updatedPeriods;

                // udpate User balance..
                const companyRate = await getCompanyRate(loan.companyId);
                const percentageAmount = getWithPercentage(payAmounts, companyRate);
                const minusFromPercentage = payAmounts - percentageAmount;
                // console.log(payAmounts, minusFromPercentage, percentageAmount, companyRate);
                minusBalance(loan.userId, minusFromPercentage.toFixed(2));

                // Pay and Minus in Original Payments..
                loan.amounts -= payAmounts;
                loan.payDuration -= payForMonth;
                await loan.save();

                return res.status(200).json({
                    success: true,
                    loan,
                });
            }
        } else {
            return res.status(200).json({
                success: false,
                message: 'Your Loan Time is Expired!'
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

/**
 * ----- Make the loan period status update -----
 * @param {Array} periods
 * @param {Number} payForMonth
 * @param {Boolean} paidStatus
 * @returns {Array}
 */
const setLoanPeriodsStatus = async function (loanId, payForMonth = 1, paidStatus = true) {
    const { loanPeriods } = await Loan.findById(loanId);

    const unPaidLoanPeriods = loanPeriods.filter(period => !period.isPaid);

    unPaidLoanPeriods.forEach((_, index) => {
        if (index < payForMonth) {
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
const getSumOfLoanPeriods = function (periods, payForMonth = 1) {
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
    getLoansByUserId,
    setLoanActionDispatch
};