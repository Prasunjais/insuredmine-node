const BaseController = require('../baseController');
const Model = require('./models/agent.model');
const {
  error,
  info
} = require('../../utils').logging;

// getting the model 
class agentController extends BaseController {
  // constructor 
  constructor() {
    super();
    this.messageTypes = this.messageTypes.userAuthentication;
  }

  // get all 
  getAll = async () => {
    try {
      info('Get All the Users !');

      // creating the data inside the database 
      return Model.aggregate([{
        $match: {
          'status': 1,
          'isDeleted': 0
        }
      }]).allowDiskUse(true).then((res) => {
        if (res && res.length)
          return {
            success: true,
            data: res
          };
        else return {
          success: true,
          data: []
        }
      });
    } catch (err) {
      error(err);
      return {
        success: false,
        error: err
      }
    }
  }

  // create a new user 
  create = async (insertObj) => {
    try {
      info('Create a new entry !');

      // creating the data inside the database 
      return Model.create({
        ...insertObj
      }).then((res) => {
        if (res)
          return {
            success: true,
            data: res
          };
        else return {
          success: true,
          data: []
        }
      });

      // catch any runtime error
    } catch (err) {
      error(err);
      return {
        success: false,
        error: err
      }
    }
  }
}

// exporting the modules 
module.exports = new agentController();
