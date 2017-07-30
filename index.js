const ContractValidator = require('./src/contract-validator');

module.exports = {
    ContractValidator,
    contract(validator, schema) {

        if ('undefined' === typeof schema) {
            return (schema) => {
                return new ContractValidator(validator, schema).middleware;
            }
        }

        return new ContractValidator(validator, schema).middleware;
    }
};
