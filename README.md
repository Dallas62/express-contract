# express-contract [![Build Status](https://travis-ci.org/Dallas62/express-contract.svg?branch=master)](https://travis-ci.org/Dallas62/express-contract)

*express-contract* is a small project that add contract validation to your API.

## Installation

```console
npm install --save express-contract
```

## Usage

```js
const Joi = require('@hapi/joi'); // Or any schema validator (must have a .validate() method)
const contract = require('express-contract').contract;

const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required()
});

app.post('/api/user', contract(schema), function(req, res) {
    if(!req.compliance) {
        // Look at req.violation for validation errors
    
        res.status(400).json({
            error: 'Bad request'
        });
        
        return;
    }
    
    res.status(200).json(req.body);
});

```

Variables:

- `req.compliance` to know if the contract is respected
- `req.body` to access the object return by validator
- `req.originalBody` to access original object return by validator
- `req.query` to access the object return by validator (GET only)
- `req.originalQuery` to access original object return by validator (GET only)
- `req.violation` for validation error

You can also precise the `property` to validate (usually `body` or `query`, but can be whatever you want), by default it's `body`, expect for GET requests.

```js

// like /api/user?username=tot even if it's a POST method
app.post('/api/user', contract(schema, 'query'), function(req, res) {
    if(!req.compliance) {
        // Look at req.violation for validation errors
    
        res.status(400).json({
            error: 'Bad request'
        });
        
        return;
    }
    
    res.status(200).json(req.query);
});

```

Or using multiple contract, but while not validate others contracts the previous failed.

```js
app.post('/api/user', contract(schema_query, 'query'), contract(schema_body, 'body'), function(req, res) {
    if(!req.compliance) {
        // Look at req.violation for validation errors
    
        res.status(400).json({
            error: 'Bad request'
        });
        
        return;
    }
    
    res.status(200).json({
        query: req.query,
        body: req.body
    });
});

```


Actually, it was test with [Joi](https://github.com/hapijs/joi), and need [body-parser](https://github.com/expressjs/body-parser).

But should work with other validators if the `.validate()` method has the following signature:

```js
Schema.validate(schema, callback(err, value)); 
```

`value` returned by the validator's callback is used to get defaults values that are set in the schema.

[Keep in touch!](https://twitter.com/BorisTacyniak)