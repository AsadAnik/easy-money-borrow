const User = require('../models/User');
const Loan = require('../models/Loan');
const { getLoansByUserId, setLoanPeriodsStatus, getSumOfLoanPeriods } = require('../services/loanService');
const { getAllCompany, getCompanyById } = require('../services/companyService');
const { addMinutes, isAfter, addMonths } = require('date-fns');


/**
 * ------ Edit/Update Profile Information ----
 * @param {*} req 
 * @param {*} res 
 */
const updateProfile = async function (req, res) {
    const userData = req.body;
    const { _id: userId } = req.user;

    try {
        const user = await User.findByIdAndUpdate(userId, userData);

        console.log(user);

        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        res.status(500).json({ success: false, err: err.message });
    }
};


/**
 * ---- Make Loan Request ----
 * @param {*} req 
 * @param {*} res 
 */
const loanRequest = function (req, res) {
    const loan = new Loan(req.body);

    console.log(loan);

    // Make userId Update With LoggedIn User..
    loan.userId = req.user._id;

    loan.save((err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(200).json(result);
    });
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
 * ----- Get All Companies ----
 * @param {Null} _req 
 * @param {*} res 
 */
const getCompany = async (req, res) => {
    const { companyId } = req.query;

    try {
        const company = await getCompanyById(companyId);
        if (!company) throw new Error("Company not found!");

        res.status(200).json({
            success: true,
            company
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * ----- Get All Companies ----
 * @param {Null} _req 
 * @param {*} res 
 */
const getAllCompanies = async (_req, res) => {
    try {
        const companies = await getAllCompany();
        if (!companies.length) throw new Error("Company not found!");

        res.status(200).json({
            success: true,
            companies
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * ----- Auth Checker -----
 * @param {*} req 
 * @param {*} res 
 */
const authChecker = (req, res) => {
    const user = req.user;

    res.status(200).json({
        isAuth: true,
        user
    });
};

/**
 * ----- Loans By User ----
 * @param {*} req 
 * @param {*} res 
 */
const getUserLoans = async function (req, res) {
    const { _id: userId } = req.user;

    try {
        const loans = await getLoansByUserId(userId);

        if (loans.length > 0) {
            res.status(200).json({
                success: true,
                loans
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, err: error.message });
    }
};

/**
 * ---- Deleting the User ----
 * @param {*} req 
 * @param {*} res 
 */
const deleteAccount = async function (req, res) {
    const { _id: userId } = req.user;

    try {
        const deletedUser = await User.findByIdAndDelete({ _id: userId });
        if (!deletedUser) throw new Error("Can't Delete This User");

        // console.log('Deleted User -- ', deletedUser);

        const deleteUsersLoan = await Loan.deleteMany({ userId: deletedUser._id });
        if (!deleteUsersLoan) throw new Error("Can't Delete This Users Releted Data!");

        // console.log('Deleted Users Loan -- ', deleteUsersLoan);

        res.status(200).json({
            deleted: true,
            message: "User Deleted Successfully!"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * ---- User Logout ----
 * @param {*} req 
 * @param {*} res 
 */
const logout = function (req, res) {
    // console.log(req.user.schema.methods.deleteToken);

    req.user.deleteToken(function (err) {
        if (err) return res.status(400).send(err);
        res.status(200).json({
            isAuth: false,
            message: 'Logged-Out, session deleted!'
        });
    });
};

module.exports = {
    updateProfile,
    loanRequest,
    loanDispatch,
    getCompany,
    getAllCompanies,
    authChecker,
    getUserLoans,
    logout,
    deleteAccount
};