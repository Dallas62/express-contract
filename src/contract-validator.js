function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

class ContractValidator {

    constructor(validator, schema, property) {
        if (!validator || 'function' !== typeof validator.validate) {
            throw new Error('The validator must have a .validate(value, schema, callback) method.');
        }

        if ('undefined' === typeof schema) {
            throw new Error('No schema provided.');
        }

        this._schema = schema;
        this._validator = validator;
        this._property = property;
    }

    get middleware() {
        return (req, res, next) => {
            if (false === req.compliance) {
                return next();
            }

            let property = 'body';

            if ('string' === typeof this._property) {
                property = this._property;
            } else if ('GET' === req.method) {
                property = 'query';
            }

            req.compliance = true;
            req['original' + capitalize(property)] = req[property];

            this._validator.validate(req[property], this._schema, (err, value) => {
                if (err) {
                    req.compliance = false;
                    req.violation = err;
                }

                req[property] = value;

                next();
            });
        };
    }
}

module.exports = ContractValidator;
