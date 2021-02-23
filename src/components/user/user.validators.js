// base joi 
const BaseJoi = require('joi');
// joi date extension 
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
// handling the joi response 
const Response = require('../../responses/response');

// add joi schema 
const schemas = {
  joiSearchPolicy: Joi.object().keys({
    page: Joi.number().integer().min(1).label('Page').required(),
    search: Joi.string().trim().lowercase().label('Search Query').optional().allow(''),
  }),

  joiAggregatedPolicy: Joi.object().keys({
    page: Joi.number().integer().min(1).label('Page').required(),
  }),
};

const options = {
  // generic option
  basic: {
    abortEarly: false,
    convert: true,
    allowUnknown: false,
    stripUnknown: true
  },
  // Options for Array of array
  array: {
    abortEarly: false,
    convert: true,
    allowUnknown: true,
    stripUnknown: {
      objects: true
    }
  }
};

module.exports = {
  // exports validate admin signin 
  joiSearchPolicy: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.joiSearchPolicy;
    let option = options.basic;

    // validating the schema 
    schema.validate(req.query, option).then(() => {
      return next();
      // if error occured
    }).catch((err) => {
      let error = [];
      err.details.forEach(element => {
        error.push(element.message);
      });

      // returning the response 
      Response.joierrors(req, res, err);
    });
  },

  // joi agg policies 
  joiAggregatedPolicy: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.joiAggregatedPolicy;
    let option = options.basic;

    // validating the schema 
    schema.validate(req.query, option).then(() => {
      return next();
      // if error occured
    }).catch((err) => {
      let error = [];
      err.details.forEach(element => {
        error.push(element.message);
      });

      // returning the response 
      Response.joierrors(req, res, err);
    });
  },

}
