const Loan = require('../models/Loan');
const { getPeriods, getLoansByUserId, setLoanPeriodsStatus, getSumOfLoanPeriods } = require("../services/loanService");
const { getCompanyById, getCompanyRate } = require("../services/companyService");
const { updateBalance, minusBalance } = require("../services/userService");
const { getWithPercentage } = require('../services/percentageService');
const { getMinutesFromNow, getMonthFromNow } = require('../services/getTimesService');
const { getFormatedDate, getFormatedTime } = require('../services/dateFormatService');
const { addMinutes, isAfter, addMonths } = require('date-fns');


/**
* ----- Update / Edit Loan -----
* @param {*} req
* @param {*} res
*/
const loanUpdate = async function (req, res) {
    const loanId = req.params.loanId;
    const updatedData = req.body;

    if (updatedData){
        try {
            const loan = await Loan.findByIdAndUpdate(loanId, updatedData);
            if (!loan) throw new Error("Loan Not Found!");

            res.status(200).json({
                success: true,
                loan
            });

        } catch(error){
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

/**
 * ----- The user Loan Status -----
 * @param {*} req 
 * @param {*} res 
 */
const loansStatus = async function (_req, res) {
    try {
        const loans = await Loan.find({ status: 'RUNNING' });
        if (!loans) throw new Error("No Loans Here!");

        loans.forEach(async (loan, _key) => {
            // Checking with Months Rounds..
            if (loan.payDuration === 0) {
                loan.status = "FINISHED";
                await loan.save()
            }
            
            // Checking with TimeStamp..
            const started = addMonths(new Date(loan.createdAt), loan.payDuration);
            const isTimeOver = isAfter(new Date(), started);

            if (isTimeOver) {
                loan.status = 'FINISHED';
                await loan.save();
            }
        });

        res.status(200).json({
            success: true,
            loans
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * ----- Get Loan By Id ----
 * @param {*} req 
 * @param {*} res 
 */
const loanDetailsById = async function (req, res) {
    const { loanId } = req.query;

    try {
        const loan = await Loan.findById({ _id: loanId });
        if (!loan) throw new Error("No Loan Found!");
        res.status(200).json({
            success: true,
            loan
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * ---- Dispatch Action taker (Accept Or Denied) ----
 * @param {*} req 
 * @param {*} res 
 */
const dispatchAction = async function (req, res){
    const { request } = req.query;

    if (request === "ACCEPTED") {
        loanDispatch();
    } else if (request === "DENIED") {

    } else {

    }
};


/**
* ---- Dispatching The Loan ----
* @param {*} req
* @param {*} res
*/
const loanDispatch = async function (req, res) {
    const { loanId } = req.query;
    const { payAmounts, payForMonth } = req.body;

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
 * ---- Make Loan Acceptance ----
 * @param {*} req 
 * @param {*} res 
 */
const loanAcceptance = async function (req, res) {
    const { id, request } = req.query;

    if (request === 'ACCEPTED') {
        try {
            const loan = await Loan.findById({ _id: id });
            const { amounts, companyId, status } = loan;
            const { offersRate } = await getCompanyById(companyId);

            if (status === 'NULL') {
                // Update the amounts with company interest..
                const percentageAmount = getWithPercentage(parseFloat(amounts), parseFloat(offersRate));
                const sumWithPercentageAmount = amounts + percentageAmount;
                loan.amounts = sumWithPercentageAmount;

                // Update the User Balance With Loan..
                updateBalance(loan.userId, amounts);

                // Update something else..
                loan.request = "ACCEPTED";
                loan.status = "RUNNING";

                // Let gets Minutes from now when acceptance is okay..
                const payDuration = loan.payDuration;
                const haveToPayIn = getMonthFromNow(payDuration);
                const formatedHaveToPayIn = getFormatedDate(haveToPayIn);
                loan.expiredDate = formatedHaveToPayIn;

                // Let's Working On NextPay Month Date..
                const nextPay = loan.nextPayRound;
                const haveToPayNextIn = getMonthFromNow(nextPay);
                const formatedHaveToPayNextIn = getFormatedDate(haveToPayNextIn);
                loan.nextPayDate = formatedHaveToPayNextIn;

                // Pay To Next Month..
                /**
                 * (Total Amount - Month Duration)
                 */
                const payPerMonth = sumWithPercentageAmount / payDuration;
                loan.payPerMonth = payPerMonth.toFixed(2);

                console.log('Amounts -- ', amounts, ' Month -- ', payDuration);
                console.log('Pay Per Month -- ', payPerMonth);

                // To get the loan date periods to given next all months..
                const periods = getPeriods(payDuration, payPerMonth.toFixed(2));
                loan.loanPeriods = periods;
            }

            // Make the database populate here..
            // await Loan.updateOne({ _id: id }, {
            //     $push: {
            //         loanPeriods: 
            //     }
            // });

            loan.save((error, docs) => {
                if (error) throw error;
                res.status(200).json({
                    success: true,
                    docs
                });
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    if (request === 'DENIED') {
        Loan.findByIdAndUpdate({ _id: id }, { request: request }, { new: true })
            .then(loan => {
                res.status(200).json({
                    success: true,
                    loan
                });
            })
            .catch(error => {
                res.status(400).json({
                    success: false,
                    error
                });
            });
    }
}

/**
 * ---- See All Loans -----
 * @param {*} req 
 * @param {*} res 
 */
const allLoans = async function (_req, res) {
    try {
        const loans = await Loan.find({}).sort({ createdAt: -1 });
        if (!loans.length) throw new Error("Loans not found");
        res.status(200).json({
            success: true,
            loans
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    loanDispatch,
    loanUpdate,
    loansStatus,
    loanDetailsById,
    loanAcceptance,
    allLoans
};