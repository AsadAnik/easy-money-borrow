const router = require('express').Router();
const LoanRoutes = require('../routes/loan');
const CompanyRoutes = require('../routes/company');
const AuthRoutes = require('../routes/auth');
const UserRoutes = require('../routes/user');

// Middlewares..
const auth = require('../middleware/auth');
const authCompany = require('../middleware/authCompany');

// Address Of API v1..
const API_ENDPOINT = "/api/v1";

// Use Ticket Routes..
// router.use('/api/v1/tickets', require('../routes/ticketRoutes'));
router.use(`${API_ENDPOINT}/loan`, LoanRoutes);
router.use(`${API_ENDPOINT}/company`, authCompany, CompanyRoutes);
router.use(`${API_ENDPOINT}/auth`, AuthRoutes);
router.use(`${API_ENDPOINT}/user`, auth, UserRoutes);

// Initial Health Checker endpoint..
router.get('/health', (_req, res) => {
    res.status(200).json({ message: 'Success' });
});

module.exports = router;
