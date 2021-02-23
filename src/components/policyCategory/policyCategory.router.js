// user controller 
const ctrl = require('./policyCategory.controller');
// custom joi validation
const {
  joiLogInValidate
} = require('./policyCategory.validators');

// exporting the user routes 
function userRoutes() {
  return (open, closed) => {
  };
}

module.exports = userRoutes();
