const BaseController = require('../baseController');
const Model = require('./models/policyInfo.model');
const {
  error,
  info
} = require('../../utils').logging;

// getting the model 
class userController extends BaseController {
  // constructor 
  constructor() {
    super();
    this.messageTypes = this.messageTypes.policyInfo;
  }

  // do something 
  insertCsv = async (req, res) => {
    try {
      info('Insert CSV to DB !');

      // inserting the data 
      let isInserted = await Model.insertMany(req.body.policyInfo);

      // success response 
      return this.success(req, res, this.status.HTTP_OK, isInserted, 'Data Inserted Success !');

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, e));
    }
  }

  // do something else 
  doSomethingElse = async (req, res) => {
    try {
      const resp = {
        status: 200,
        message: 'Its working'
      };

      // success response 
      return this.success(req, res, this.status.HTTP_OK, resp);

      // catch any runtime error 
    } catch (e) {
      error(e);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }
}

// exporting the modules 
module.exports = new userController();
