class ContractValidator {

    constructor(validator, schema) {
        if (!validator || 'function' !== typeof validator.validate) {
            throw new Error('The validator must have a .validate(value, schema, callback) method.');
        }

        if ('undefined' === typeof schema) {
            throw new Error('No schema provided.');
        }

        this._schema = schema;
        this._validator = validator;
    }

    get middleware() {
        return (req, res, next) => {
            req.compliance = true;
            req._originalBody = req.body;

            this._validator.validate(req.body, this._schema, (err, value) => {
                if (err) {
                    req.compliance = false;
                    req.violation = err;
                }

                req.body = value;
                next();
            });
        };
    }
}

module.exports = ContractValidator;
