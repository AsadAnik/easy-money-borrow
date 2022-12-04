const Company = require('../models/Company');

/**
 * ----- Getting the company rate..
 * @param {*} companyId 
 * @param {*} amounts 
 * @returns 
 */
const getCompanyRate = async function (companyId) {
    const company = await getCompanyById(companyId);
    return company.offersRate; 
};

/**
 * ----- Getting The Company By ID -----
 * @param {String} companyId 
 * @returns 
 */
const getCompanyById = async function (companyId) {
    const company = await Company.findById({ _id: companyId });
    return company;
};


/**
 * ----- Getting The Company By ID ----- 
 * @returns 
 */
 const getAllCompany = async function () {
    const company = await Company.find({}).sort({ createdAt: -1 });
    return company;
};


module.exports = {
    getCompanyRate,
    getCompanyById,
    getAllCompany
};