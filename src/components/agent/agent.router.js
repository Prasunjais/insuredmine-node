// user controller 
const ctrl = require('./agent.controller');
// custom joi validation
const {
  joiLogInValidate
} = require('./agent.validators');

// exporting the user routes 
function userRoutes() {
  return (open, closed) => {

  };
}

module.exports = userRoutes();
