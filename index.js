const ContractValidator = require('./src/contract-validator');

module.exports = {
    ContractValidator,
    contract(validator, schema, property) {

        if ('undefined' === typeof schema) {
            return (schema, property) => {
                return new ContractValidator(validator, schema, property).middleware;
            }
        }

        return new ContractValidator(validator, schema, property).middleware;
    }
};
