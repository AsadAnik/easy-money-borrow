import { API_URI } from '@env';
// const API_URI = "http://192.168.0.189:8080/api/v1";
import Axios from 'axios';
const auth_api = `${API_URI}/auth`;
const user_api = `${API_URI}/user`;
const loan_api = `${API_URI}/loan`;
const company_api = `${API_URI}/company`;

// Have to see the API URI here..
console.log("API ENDPOINT ---- ", API_URI);


/**
 * ------- Dispatch Loan By LoanId --------
 * @param {String} loanId 
 * @returns 
 */
export async function dispatchLoan(loanId, data) {
    // Loan Dispatch endpoint..
    const user_dispatch_loan_endpoint = `${loan_api}/dispatch?loanId=${loanId}`;

    try {
        const request = await Axios.post(user_dispatch_loan_endpoint, {
            payAmounts: data?.payAmounts,
            payForMonth: data?.payForMonth
        });
        return request?.data;

    } catch (err) {
        console.log('ERR! When Try to Dispatch Loan -- ', err.message);
    }
};


/**
 * ----- Update / Edit Loan -----
 * @param {Object} data 
 * @returns 
 */
export async function updateLoan(loanId, data) {
    // Loan Update Endpoint..
    const loan_update_endpoint = `${loan_api}/edit/${loanId}`;

    try {
        const request = await Axios.put(loan_update_endpoint, data);
        return request?.data;

    } catch (err) {
        console.log('ERR! When try to Update Company Profile -- ', err.message);
    }
};

/**
 * ------ Edit / Update Company Data ------
 * @param {Object} data 
 * @returns 
 */
export async function updateCompany(data) {
    // Company Edit Endpoint..
    const company_edit_endpoint = `${company_api}/edit`;

    try {
        const request = await Axios.post(company_edit_endpoint, data);
        return request?.data;

    } catch (err) {
        console.log('ERR! When try to Update Company Profile -- ', err.message);
    }
};

/**
 * ------ Check The Status Of Loans Condition Very first time of application opens ------
 * @returns 
 */
export async function loanStatus() {
    // Loan Status endpoint..
    const loan_status_endpoint = `${loan_api}/status`;

    try {
        const request = await Axios.get(loan_status_endpoint);
        return request?.data;

    } catch (err) {
        console.log('ERR! When try to check loan status -- ', err.message);
    }
}

/**
 * ------- Company Auth Or Profile ------
 * @returns 
 */
export async function companyAuth() {
    // Company endpoint..
    const company_endpoint = `${company_api}/auth`;

    try {
        const request = await Axios.get(company_endpoint);
        return request?.data;

    } catch (err) {
        console.log('ERR! When try to get company auth -- ', err.message);
    }
};

/**
 * ---- Request Acceptance ----
 * @param {String} id 
 * @param {String} request 
 * @returns 
 */
export async function requestAcceptance(id, request) {
    // Loan endpoint..
    const loan_endpoint = `${loan_api}/acceptance?id=${id}&request=${request}`;

    try {
        const request = await Axios.post(loan_endpoint);
        return request?.data;

    } catch (err) {
        console.log('ERR! When try to post request acceptance -- ', err.message);
    }
};

/**
 * ----- Get User Info By UserId ----
 * @param {String} userId 
 * @returns 
 */
export async function getUserInfoById(userId) {
    // Company endpoint..
    const userInfo_endpoint = `${company_api}/userInfo?userId=${userId}`;

    try {
        const request = await Axios.get(userInfo_endpoint);
        return request?.data;

    } catch (err) {
        console.log('ERR! When try to get userInfo by userId -- ', err.message);
    }
};

/**
 * ------ Get the Company Loans -----
 * @param {String} companyId 
 * @returns 
 */
export async function getCompanyLoanRequests() {
    // Company endpoint..
    const company_endpoint = `${company_api}/company_loans`;

    try {
        const request = await Axios.get(company_endpoint);
        return request?.data;

    } catch (err) {
        console.log('ERR! When Try to get loans of company -- ', err.message);
    }
};

/**
 * ------ Get Company By Id -----
 * @param {String} companyId 
 * @returns 
 */
export async function getCompanyById(companyId) {
    // Company engpoint..
    const company_by_id_endpoint = `${company_api}?companyId=${companyId}`;

    try {
        const request = await Axios.get(company_by_id_endpoint);
        return request?.data;

    } catch (err) {
        console.log('ERR! When Try to get Company By companyId -- ', err.message);
    }
};

/**
 * ----- Get Loan Details By Loan ID -----
 * @param {String} loanId 
 * @returns 
 */
export async function getLoanDetailsByLoanId(loanId) {
    // Loan endpoint..
    const loan_details_by_loanId_endpoint = `${loan_api}?loanId=${loanId}`;

    try {
        const request = await Axios.get(loan_details_by_loanId_endpoint);
        return request?.data;

    } catch (err) {
        console.log('ERR! When Try to get Loan Details By Loan Id -- ', err.message);
    }
};

/**
 * ----- Get User Loan Requests -----
 * @returns {Object}
 */
export async function getUserLoanRequests() {
    // Loan Requests..
    const user_loans_endpoint = `${user_api}/user_loans`;

    try {
        const request = await Axios.get(user_loans_endpoint);
        return request?.data;

    } catch (err) {
        console.log('ERR! When Try to get Users Loans requests -- ', err.message);
    }
}

/**
 * ----- Get All Companies -----
 * @returns {Object}
 */
export async function getCompanies() {
    // All Companies endpoint..
    const all_companies_endpoint = `${company_api}/all`;

    try {
        const request = await Axios.get(all_companies_endpoint);
        return request?.data;

    } catch (err) {
        console.log('ERR! When Try to get all companies -- ', err.message);
    }
};


/**
 * ----- Make Loan Request -----
 * @param {Object} data 
 */
export async function loanRequest(data) {
    // Loan Request engpoint..
    const loan_request_endpoint = `${loan_api}/request`;

    try {
        const request = await Axios.post(loan_request_endpoint, data);
        return request.data;

    } catch (err) {
        console.log('ERR! When Try to call loan request -- ', err.message);
    }
};

/**
 * ---- Auth Checker can use for Profile Data too ----
 * @returns {Object}
 */
export async function authChecker() {
    // Auth Checker endpoint..
    const auth_checker_endpoint = `${user_api}/auth_check`;

    try {
        const request = await Axios.get(auth_checker_endpoint);
        return request.data;

    } catch (err) {
        console.log('ERR! When Try to call auth checker -- ', err.message);
    }
};

/**
 * ---- REGISTER ----
 * @param {Object} data 
 * @returns {Object}
 */
export async function registerAuth(data) {
    // Register endpoint..
    const auth_register_endpoint = `${auth_api}/company_register`;

    try {
        const request = await Axios.post(auth_register_endpoint, data);
        if (!request.data) throw new Error("Already User Created!");
        return request?.data;

    } catch (err) {
        console.log('ERR! When Try to Register -- ', err.message);
    }
}

/**
 * ----- LOGIN ------
 * @param {Object} data 
 * @returns {Object}
 */
export async function loginAuth(data) {
    // Login endpoint..
    const auth_login_endpoint = `${auth_api}/company_login`;

    try {
        const request = await Axios.post(auth_login_endpoint, data);
        if (!request) throw new Error("User Not Found");
        return request?.data;

    } catch (err) {
        console.log('ERR! When Try to Login -- ', err.message);
    }
};

/**
 * ----- LOG-OUT -----
 * @returns {Object}
 */
export async function logoutCompany() {
    try {
        const request = await Axios.get(`${company_api}/logout`);
        return request;

    } catch (err) {
        console.log('ERR! When Try to LogOut -- ', err.message);
    }
};