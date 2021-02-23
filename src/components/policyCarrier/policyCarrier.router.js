// user controller 
const ctrl = require('./policyCarrier.controller');
// custom joi validation
const {
  joiLogInValidate
} = require('./policyCarrier.validators');

// exporting the user routes 
function userRoutes() {
  return (open, closed) => {
  };
}

module.exports = userRoutes();
