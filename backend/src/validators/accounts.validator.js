const accountsModel = require('../models/accounts.model');
const { body } = require('express-validator');
const { ObjectId } = require('mongodb');
const accountsValidator = {};

const passwordValidation = [
    body('password')
        .trim()
        .escape()
        .isStrongPassword({
            minLength: 12,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
];

accountsValidator.addRules = () => {
    return [
        ...passwordValidation,
        body('email')
            .trim()
            .escape()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (email) => {
                const emailExists = await accountsModel.checkExistingEmail(email);
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email.");
                }
            }),
        body('firstName')
            .trim()
            .escape()
            .isLength({ min: 3 })
            .withMessage('First name is required.'),
        body('lastName')
            .trim()
            .escape()
            .isLength({ min: 3 })
            .withMessage('Last name is required.'),
        body('isAdmin')
            .isBoolean()
            .withMessage('Admin status is required.'),
    ];
}

accountsValidator.updateRules = () => {
    return [
        body('email')
            .trim()
            .escape()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (email, { req }) => {
                const id = new ObjectId(String(req.params.id));
                const account = await accountsModel.getAccount(id);
                if (account.email === email && account._id !== id) {
                    throw new Error("Email belongs to another user. Please choose different email.");
                }
            })
            .optional(),
        body('firstName')
            .trim()
            .escape()
            .isLength({ min: 3 })
            .withMessage('First name is required.')
            .optional(),
        body('lastName')
            .trim()
            .escape()
            .isLength({ min: 3 })
            .withMessage('Last name is required.')
            .optional(),
    ];
}

accountsValidator.updateAdminRules = () => {
    return [
        body('isAdmin')
            .isBoolean()
            .withMessage('Admin status is required.'),
    ];
}

accountsValidator.updatePasswordRules = () => {
    return [
        ...passwordValidation,
    ];
}

accountsValidator.loginRules = () => {
    return [
        ...passwordValidation,
        body('email')
            .trim()
            .escape()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),
    ];
}

module.exports = accountsValidator;