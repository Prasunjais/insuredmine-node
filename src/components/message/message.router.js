// user controller 
const ctrl = require('./message.controller');
// custom joi validation
const {
  joiInsertMessage
} = require('./message.validators');

// exporting the user routes 
function userRoutes() {
  return (open, closed) => {
    closed.route('/message').post(
      [joiInsertMessage], // joi validation 
      ctrl.insertMessage // controller function 
    );
  };
}

module.exports = userRoutes();
