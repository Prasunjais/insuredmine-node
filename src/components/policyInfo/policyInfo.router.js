const multer = require('multer');
const multipartMiddleware = multer();

// user controller 
const ctrl = require('./policyInfo.controller');

// custom joi validation
const {

} = require('./policyInfo.validators');

const {
  readCsvForData
} = require('../../hooks');

// exporting the user routes 
function userRoutes() {
  return (open, closed) => {
    closed.route('/policy/upload/csv').post(
      multipartMiddleware.single('file'), // multer middleware
      readCsvForData, // fetch the data from the csv file
      ctrl.insertCsv // controller function 
    );


  };
}

module.exports = userRoutes();
