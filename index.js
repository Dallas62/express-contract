const ContractValidator = require("./src/contract-validator");

module.exports = {
  ContractValidator,
  contract(schema, property) {
    return new ContractValidator(schema, property).middleware;
  },
};
