// Loan Modal...
const mongoose = require('mongoose');

// Loan Schema..
const loanSchema = mongoose.Schema({
    amounts: { type: Number, required: true },
    staticAmounts: { type: Number, required: false },
    username: { type: String, required: false },
    phone: { type: String, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    request: { type: String, default: 'PENDING', enum: ['PENDING', 'ACCEPTED', 'DENIED'] },
    status: { type: String, default: 'NULL', enum: ['NULL', 'RUNNING', 'FINISHED'] },
    dispatchAction: { type: String, default: 'NULL', enum: ['NULL', 'PENDING', 'ACCEPTED', 'DENIED'] },
    payDuration: { type: Number, required: false, default: 6 },
    staticPayDuration: { type: Number, required: false, default: 6 },
    requestedTo: { type: String, required: false },
    nextPayDate: { type: String },
    nextPayRound: { type: Number, default: 1 },
    payPerMonth: { type: Number },
    expiredDate: { type: String },
    loanPeriods: [{}]
    // loanPeriods: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Period"
    //     }
    // ]
}, {
    timestamps: true
});

// Loan Model..
const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;