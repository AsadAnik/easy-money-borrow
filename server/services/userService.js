const User = require('../models/User');

/**
 * ---- Getting User By ID ----
 * @param {String} userId 
 * @return {Object}
 */
const getUserById = async function (userId) {
    const user = await User.findById({ _id: userId });
    return user;
}

/**
 * ----- Minus User Balance when balance will dispatching ----
 * @param {String} userId
 * @param {Number} dispatchBalance
 */
const minusBalance = async function (userId, dispatchBalance) {
    const user = await User.findById({ _id: userId });

    console.log('Before Update -- ', user);

    if (user.balance >= dispatchBalance) {
        user.balance = user.balance - dispatchBalance;
    } else {
        user.balance = dispatchBalance - user.balance;
    }

    console.log('After Update -- ', user);
    
    await user.save();
};

/**
 * ----- Update The User's Balance With Loan Acceptance ----
 * @param {String} userId 
 * @param {Number} newBalance
 */
const updateBalance = async function (userId, newBalance) {
    // const updateUser = await User.findByIdAndUpdate({ _id: userId }, { balance: newBalance });
    const user = await User.findById({ _id: userId });
    user.balance = newBalance;
    await user.save();
}

module.exports = {
    minusBalance,
    getUserById,
    updateBalance
};