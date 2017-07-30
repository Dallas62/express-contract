# express-contract [![Build Status](https://travis-ci.org/Dallas62/express-contract.svg?branch=master)](https://travis-ci.org/Dallas62/express-contract)

*express-contract* is a small project that add contract validation to your API.

## Installation

```
npm install --save express-contract
```

## Usage

```
const Joi = require('joi'); // Or any schema validator (must have a .validate() method)
const contract = require('express-contract').contract;

const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required()
});

app.post('/api/user', contract(Joi, schema), function(req, res) {
    if(!req.compliance) {
        // Look at req.violation for validation errors
    
        res.status(400).json({
            error: 'Bad request'
        });
        
        return;
    }
    
    res.status(200).json({});
});

```

Actually, it was test with [Joi](https://github.com/hapijs/joi).

But should work with other validators if the `.validate()` method has the following signature:

```
Validator.validate(value, schema, callback(err, value)); 
```

`value` returned by the validator's callback is used to get defaults values that are set in the schema.

[Keep in touch!](https://twitter.com/BorisTacyniak)