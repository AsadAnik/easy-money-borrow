// DispatchAction Modal...
const mongoose = require('mongoose');

// DispatchAction Schema..
const dispatchActionSchema = mongoose.Schema({
   loanId: { type: mongoose.Schema.Types.ObjectId },
   amounts: { type: Number },
   months: { type: Number },
   status: { type: String, default: "PENDING", enum: ["PENDING", "ACCEPTED", "DENIED"] },
}, {
    timestamps: true
});

// DispatchAction Model..
const DispatchAction = mongoose.model('DispatchAction', dispatchActionSchema);

module.exports = DispatchAction;