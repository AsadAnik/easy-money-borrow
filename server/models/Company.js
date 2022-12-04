const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const SALT_I = 10;

// Company Schema..
const companySchema = mongoose.Schema({
    name: { type: String },
    logo: { type: String },
    logoURI: { type: String },
    email: { type: String },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    offersRate: { type: Number, default: 10 },
    loans: { type: String }
}, {
    timestamps: true
});



// Let's Impementing the in database functionalities..
// Schema Middleware function to Hashing Password..
companySchema.pre('save', async function (next) {
    var company = this;

    if (company.isModified('password')) {
        try {
            // Make Salt..
            const salt = await bcrypt.genSalt(SALT_I);

            // Make Hash The Password..
            const hash = await bcrypt.hash(company.password, salt);

            // Restore / Update Existing password to Hash..
            company.password = hash;
            next();

        } catch (error) {
            next(error);
        }

    } else {
        next();
    }
});



// Schema Method to Comapare Password to Register Password..
companySchema.methods.comparePassword = async function (candidatePassword, cb) {
    var company = this;

    try {
        // Comparing Password..
        const matchedPassword = await bcrypt.compare(candidatePassword, company.password);
        cb(null, matchedPassword);

    } catch (error) {
        cb(error)
    }
};


// Schema Method to Generate token for cookie when company login..
companySchema.methods.ganarateToken = function (cb) {
    var company = this;
    var token = JWT.sign(company._id.toHexString(), process.env.SECRET);
    company.token = token;

    company.save(function (err, company) {
        if (err) return cb(err);
        cb(null, company);
    });
};


// Schema Method to Generate Token For Cookie When company Login..
companySchema.statics.findByToken = async function (token, cb) {
    var company = this;

    try {
        // Decode Token For ID..
        const decodeToken = JWT.verify(token, process.env.SECRET);

        // Find company By Decoded Token ID..
        const findCompany = await company.findOne({ _id: decodeToken, token: token });
        cb(null, findCompany);

    } catch (error) {
        cb(error);
    }
};


// Schema Method for Delete Token..
companySchema.methods.deleteToken = function (cb) {
    var company = this;

    // console.log("---- I am Schema Method Of Delete Token Here ----");

    // Make Update To Remove The Token From company Doc..
    company.updateOne({ $unset: { token: 1 } }, function (err) {
        if (err) return cb(err);
        cb(null);
    });
};



// Company Model..
const Company = mongoose.model('Company', companySchema);

module.exports = Company;