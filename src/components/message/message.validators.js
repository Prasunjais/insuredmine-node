// base joi 
const BaseJoi = require('joi');
// joi date extension 
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
// handling the joi response 
const Response = require('../../responses/response');

// add joi schema 
const schemas = {
  joiInsertMessage: Joi.object().keys({
    hour: Joi.number().integer().label('hours').required().max(23),
    mins: Joi.number().integer().label('mins').required().max(60),
    day: Joi.string().valid(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']).required(),
    message: Joi.string().trim().label('Message').required()
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
  joiInsertMessage: (req, res, next) => {
    // getting the schemas 
    let schema = schemas.joiInsertMessage;
    let option = options.basic;

    // validating the schema 
    schema.validate(req.body, option).then(() => {
      next();
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
