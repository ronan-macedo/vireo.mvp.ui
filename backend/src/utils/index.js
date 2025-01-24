const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utils = {};

/**
 * Sends a successful response with the provided result object.
 * @param {Object} res Express response object.
 * @param {Object} objectResult The result object to be included in the response.
 * @returns {Promise<void>} A Promise that resolves after sending the successful response.
 */
utils.okResponse = async (res, objectResult) => {
    res.status(200)
        .setHeader('Content-Type', 'application/json')
        .json(objectResult);
}

/**
 * Sends a successful paginated response with the provided total pages, current page, and object result.
 * @param {Object} res Express response object.
 * @param {number} totalPages The total number of pages available.
 * @param {number} page The current page.
 * @param {Array} objectResult The result object to be included in the response.
 * @returns {Promise<void>} - A Promise that resolves after sending the successful paginated response.
 */
utils.okPaginatedResponse = async (res, totalPages, page, objectResult) => {
    res.status(200)
        .setHeader('Content-Type', 'application/json')
        .json({
            totalPages: totalPages,
            page: page,
            results: objectResult
        });
}

/**
 * Sends a no content response.
 * @param {Object} res Express response object.
 * @returns {Promise<void>} A Promise that resolves after sending the no content response.
 */
utils.noContentResponse = async (res) => {
    res.status(204).send();
}

/**
 * Sends a successful created response with the provided message.
 * @param {Object} res Express response object.
 * @param {string} message The message to be included in the response.
 * @returns {Promise<void>} A Promise that resolves after sending the created response.
 */
utils.createdResponse = async (res, message) => {
    res.status(201)
        .setHeader('Content-Type', 'application/json')
        .json({ message: message });
}

/**
 * Sends a successful created response with the provided object result.
 * @param {Object} res Express response object.
 * @param {Object} objectResult The result object to be included in the response.
 * @returns {Promise<void>} A Promise that resolves after sending the created response.
 */
utils.createdObjecResultResponse = async (res, objectResult) => {
    res.status(201)
        .setHeader('Content-Type', 'application/json')
        .json(objectResult);
}

/**
 * Sends a bad request response with the provided error message.
 * @param {Object} res Express response object.
 * @param {string} error The error message to be included in the response.
 * @returns {Promise<void>} A Promise that resolves after sending the bad request response.
 */
utils.badRequestResponse = async (res, error) => {
    res.status(400)
        .setHeader('Content-Type', 'application/json')
        .json({
            errors: [
                { error: error }
            ]
        });
}

/**
 * Sends a bad request response with a list of error messages.
 * @param {Object} res - Express response object.
 * @param {Array} errorList - An array of error objects with a 'msg' property.
 * @returns {Promise<void>} - A Promise that resolves after sending the bad request response.
 */
utils.badRequestErrorListResponse = async (res, erroList) => {
    let errors = [];

    for (let error of erroList) {
        errors.push({ error: error.msg })
    }

    res.status(400)
        .setHeader('Content-Type', 'application/json')
        .json({ errors: errors });
}

utils.unauthorizedResponse = async (res, error) => {
    res.status(401)
        .setHeader('Content-Type', 'application/json')
        .json({ error: error });
}

utils.forbiddenResponse = async (res, error) => {
    res.status(403)
        .setHeader('Content-Type', 'application/json')
        .json({ error: error });
}

/**
 * Sends a not found response for the specified entity.
 * @param {Object} res Express response object.
 * @param {string} entity The entity that was not found.
 * @returns {Promise<void>} A Promise that resolves after sending the not found response.
 */
utils.notFoundResponse = async (res, entity) => {
    res.status(404)
        .setHeader('Content-Type', 'application/json')
        .json({ error: `${entity} not found.` });
}

/**
 * Sends an internal server error response with the provided error message.
 * @param {Object} req Express request object.
 * @param {Error} error An error object if the request fails.
 * @returns {Promise<void>} A Promise that resolves after sending the internal server error response.
 */
utils.internalServerErrorResponse = async (res, error) => {
    res.status(500)
        .setHeader('Content-Type', 'application/json')
        .json({ error: error.message });
}

/**
 * Middleware that handles any untreated exception.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 * @param {Function} fn Callback function responsible for handling any untreated exception.
 * @returns {Promise} A Promise that resolves the result of the provided callback function
 */
utils.errorHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Generates a JSON Web Token (JWT) for the given account data.
 * @param {Object} res - Express response object.
 * @param {Object} accountData - The data to be encoded in the JWT.
 */
utils.generateJwtToken = (res, accountData) => {
    delete accountData.password;
    const expiresIn = 3600 * 1000;
    const accessToken = jwt.sign(accountData, process.env.SECRET, { expiresIn: expiresIn });
    return utils.okResponse(res, { accessToken: accessToken, email: accountData.email, isAdmin: accountData.isAdmin, expiresIn: expiresIn });
}

utils.checkJwtToken = (req) => {
    const token = getJwtToken(req);

    if (!token) {
        return this.unauthorizedResponse(res, 'Unauthorized');
    }

    return jwt.verify(token, process.env.SECRET, (err) => {
        if (err) {
            return this.forbiddenResponse(res, 'Forbidden');
        }
        next();
    });
}

utils.checkIsAdmin = (req, res, next) => {
    const token = getJwtToken(req);

    if (!token) {
        return this.unauthorizedResponse(res, 'Unauthorized');
    }

    jwt.verify(token, process.env.SECRET, (err, account) => {
        if (err) {
            return this.forbiddenResponse(res, 'Forbidden');
        }

        if (!account.isAdmin) {
            return this.forbiddenResponse(res, 'Forbidden');
        }

        next();
    });
}


const getJwtToken = (req) => {
    const authHeader = req.headers['authorization']
    return authHeader && authHeader.split(' ')[1]
}

/**
 * Hashes the provided password.
 * @param {string} password The password to hash.
 * @returns {Promise<string>} A Promise that resolves with the hashed password.
 */
utils.comparePasswords = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

module.exports = utils;