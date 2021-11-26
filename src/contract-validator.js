function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class ContractValidator {
  constructor(schema, property) {
    if (!schema || "function" !== typeof schema.validate) {
      throw new Error(
        "The schema must have a .validate(value, schema, callback) method."
      );
    }

    this._schema = schema;
    this._property = property;
  }

  get middleware() {
    return (req, res, next) => {
      if (false === req.compliance) {
        return next();
      }

      let property = "body";

      if ("string" === typeof this._property) {
        property = this._property;
      } else if ("GET" === req.method) {
        property = "query";
      }

      req.compliance = true;
      req["original" + capitalize(property)] = req[property];

      const { error, value } = this._schema.validate(req[property]);

      if (error) {
        req.compliance = false;
        req.violation = error;
      }

      req[property] = value;

      next();
    };
  }
}

module.exports = ContractValidator;
