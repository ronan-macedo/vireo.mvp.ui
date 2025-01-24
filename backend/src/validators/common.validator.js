const { param, validationResult } = require('express-validator');
const utils = require('../utils');
const commonValidator = {};

/**
 * Validation rules for entities id.
 * @returns {Array} Validations rules.
 */
commonValidator.idRules = () => {
    return [
        param('id')
            .trim()
            .notEmpty()
            .withMessage('ID is required.')
            .isMongoId()
            .withMessage('Invalid ID.'),
    ];
}

/**
 * Check validation rules before move to the controller.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 * @returns {Promise<void>} Moves to the next function if validation passes; 
 * otherwise, sends a 400 response with validation errors.
 */
commonValidator.checkValidationRules = async (req, res, next) => {
    let validationErrors = [];
    validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        await utils.badRequestErrorListResponse(res, validationErrors.array())
        return;
    }

    next();
}

module.exports = commonValidator;