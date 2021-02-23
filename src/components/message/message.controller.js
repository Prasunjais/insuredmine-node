const BaseController = require('../baseController');
const Model = require('./models/message.model');
const {
  error,
  info
} = require('../../utils').logging;

// getting the model 
class agentController extends BaseController {
  // constructor 
  constructor() {
    super();
    this.messageTypes = this.messageTypes.message;
  }
  // create a new user 
  insertMessage = async (req, res) => {
    try {
      info('Insert Message into DB !');
      let arrayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      let hour = req.body.hour;
      let mins = req.body.mins;
      let day = req.body.day;
      let message = req.body.message;

      // insert Object 
      let insertObj = {
        dayTimeInMins: parseInt(hour) + parseFloat(60 * mins),
        day: arrayOfWeek.indexOf(day),
        message: message,
        insertedAt: new Date()
      };

      let isInserted = await Model.create({
        ...insertObj
      })

      // success 
      return this.success(req, res, this.status.HTTP_OK, isInserted, this.messageTypes.messageCreated);

      // catch any runtime error 
    } catch (err) {
      error(err);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }
}

// exporting the modules 
module.exports = new agentController();
