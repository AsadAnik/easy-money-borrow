const Company = require('../models/Company');
const { getLoansByCompanyId } = require('../services/loanService');
const { getUserById } = require('../services/userService');

/**
 * ----- Company Update -----
 * @param {*} req 
 * @param {*} res 
 */
const updateCompany = async function (req, res) {
    const { _id: companyId } = req.company;
    const newCompanyData = req.body;

    try {
        const company = await Company.findByIdAndUpdate(companyId, newCompanyData);
        res.status(200).json({
            success: true,
            company
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * ----- Company Auth Checker -----
 * @param {*} req 
 * @param {*} res 
 */
const companyAuth = async function (req, res) {
    const { _id: companyId } = req.company;

    try {
        if (!companyId) {
            throw new Error("Company Id not found");
        }

        const company = await Company.findById(companyId);
        if (!company) throw new Error("Company not found!");

        return res.status(200).json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                logo: company.logo,
                logoURI: company.logoURI,
                email: company.email,
                phone: company.phone,
                address: company.address,
                offersRate: company.offersRate,
                createdAt: company.createdAt,
                updatedAt: company.updatedAt
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/**
 * ----- Get User Information By userId ------
 * @param {*} req 
 * @param {*} res 
 */
const userInfoByUserId = async function (req, res) {
    const { userId } = req.query;

    try {
        const user = await getUserById(userId);
        if (!user) throw new Error("User not found!");

        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * ---- Company Logout ----
 * @param {*} req 
 * @param {*} res 
 */
const logoutCompany = function (req, res) {
    // console.log(req.user.schema.methods.deleteToken);

    req.company.deleteToken(function (err) {
        if (err) return res.status(400).send(err);
        res.status(200).json({
            isAuth: false,
            message: 'Logged-Out, session deleted!'
        });
    });
};


/**
 * ----- Get Company By Id ------
 * @param {*} req 
 * @param {*} res 
 */
const getCompanyById = async (req, res) => {
    const { companyId } = req.query;

    try {
        const company = await Company.findById(companyId);
        if (!company) throw new Error("Company Not Found!");

        res.status(200).json({
            success: true,
            company
        });

    } catch (error) {
        res.status(200).json({
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
        const companies = await Company.find({}).sort({ createdAt: -1 });
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
 * ---- Get Company Loans ----
 * @param {*} req 
 * @param {*} res 
 */
const getLoansOfCompany = async (req, res) => {
    const { _id: companyId } = req.company;

    try {
        const companyLoans = await getLoansByCompanyId(companyId);
        if (!companyLoans.length) throw new Error("No Loans Here!");
        res.status(200).json({ success: true, loans: companyLoans });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    updateCompany,
    userInfoByUserId,
    logoutCompany,
    getCompanyById,
    getLoansOfCompany,
    getAllCompanies,
    companyAuth
};