const BaseController = require('../baseController');
const Model = require('./models/user.model');
const {
  error,
  info
} = require('../../utils').logging;

// getting the model 
class userController extends BaseController {
  // constructor 
  constructor() {
    super();
    this.messageTypes = this.messageTypes.userAuthentication;
  }

  // get all the users 
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

  // get the policy using the user name 
  getPolicy = async (req, res) => {
    try {
      info('Get User List !');
      let page = req.query.page || 1,
        pageSize = 20,
        searchKey = req.query.search || '',
        sortBy = req.query.sortBy || 'createdAt',
        sortingArray = {};

      sortingArray[sortBy] = -1;
      let skip = parseInt(page - 1) * pageSize;

      // city filter for allocated city 
      let searchObject = {
        'isDeleted': 0
      };

      // creating a match object
      if (searchKey !== '')
        searchObject = {
          ...searchObject,
          '$or': [{
            'firstName': {
              $regex: searchKey,
              $options: 'is'
            }
          }, {
            'lastName': {
              $regex: searchKey,
              $options: 'is'
            }
          }]
        };

      // get the total customer
      let totalPolicies = await Model.aggregate([{
        $match: {
          ...searchObject
        }
      }, {
        $count: 'sum'
      }]).allowDiskUse(true);

      // calculating the total number of applications for the given scenario
      if (totalPolicies[0] !== undefined)
        totalPolicies = totalPolicies[0].sum;
      else
        totalPolicies = 0;

      // get the asms list 
      let policyList = await Model.aggregate([{
        $match: {
          ...searchObject
        }
      }, {
        $sort: sortingArray
      }, {
        $skip: skip
      }, {
        $limit: pageSize
      }, {
        $lookup: {
          from: 'policyinfos',
          let: {
            'id': '$_id'
          },
          pipeline: [
            {
              $match: {
                'status': 1,
                'isDeleted': 0,
                '$expr': {
                  '$eq': ['$userId', '$$id']
                }
              }
            }, {
              $project: {
                'status': 1,
                'agentId': 1,
                'isDeleted': 1,
                'policyNumber': 1,
                'premiumAmountWritten': 1,
                'premiumAmount': 1,
                'policyType': 1,
                'policyStartDate': { $dateToString: { format: "%d-%m-%Y", date: "$policyStartDate", timezone: "+05:30" } },
                'policyEndDate': { $dateToString: { format: "%d-%m-%Y", date: "$policyEndDate", timezone: "+05:30" } },
              }
            }, {
              $lookup: {
                from: 'agents',
                let: {
                  'id': '$agentId'
                },
                pipeline: [
                  {
                    $match: {
                      'status': 1,
                      'isDeleted': 0,
                      '$expr': {
                        '$eq': ['$_id', '$$id']
                      }
                    }
                  }, {
                    $project: {
                      'status': 1,
                      'isDeleted': 1,
                      'name': 1,
                      'nameToDisplay': 1
                    }
                  }
                ],
                as: 'agent'
              }
            }, {
              $unwind: {
                path: '$agent',
                preserveNullAndEmptyArrays: true
              }
            }
          ],
          as: 'policies'
        }
      }]).allowDiskUse(true);

      // success 
      return this.success(req, res, this.status.HTTP_OK, {
        results: policyList,
        pageMeta: {
          skip: parseInt(skip),
          pageSize: pageSize,
          total: totalPolicies
        }
      }, this.messageTypes.userDetailsFetched);

      // catch any runtime error 
    } catch (err) {
      error(err);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }

  // get the aggregated policies per user 
  getPolicyAggregated = async (req, res) => {
    try {
      info('Get Policies as per user aggreagate !');

      let page = req.query.page || 1,
        pageSize = 20;

      let skip = parseInt(page - 1) * pageSize;

      // get the total customer
      let totalPolicies = await Model.aggregate([{
        $count: 'sum'
      }]).allowDiskUse(true);

      // calculating the total number of applications for the given scenario
      if (totalPolicies[0] !== undefined)
        totalPolicies = totalPolicies[0].sum;
      else
        totalPolicies = 0;


      // get the asms list 
      let policyList = await Model.aggregate([{
        $skip: skip
      }, {
        $limit: pageSize
      }, {
        $lookup: {
          from: 'policyinfos',
          let: {
            'id': '$_id'
          },
          pipeline: [
            {
              $match: {
                'status': 1,
                'isDeleted': 0,
                '$expr': {
                  '$eq': ['$userId', '$$id']
                }
              }
            }, {
              $project: {
                'status': 1,
                'agentId': 1,
                'categoryId': 1,
                'carrierId': 1,
                'isDeleted': 1,
                'policyNumber': 1,
                'premiumAmountWritten': 1,
                'premiumAmount': 1,
                'policyType': 1,
                'policyStartDate': { $dateToString: { format: "%d-%m-%Y", date: "$policyStartDate", timezone: "+05:30" } },
                'policyEndDate': { $dateToString: { format: "%d-%m-%Y", date: "$policyEndDate", timezone: "+05:30" } },
              }
            }, {
              $lookup: {
                from: 'agents',
                let: {
                  'id': '$agentId'
                },
                pipeline: [
                  {
                    $match: {
                      'status': 1,
                      'isDeleted': 0,
                      '$expr': {
                        '$eq': ['$_id', '$$id']
                      }
                    }
                  }, {
                    $project: {
                      'status': 1,
                      'isDeleted': 1,
                      'name': 1,
                      'nameToDisplay': 1
                    }
                  }
                ],
                as: 'agent'
              }
            }, {
              $unwind: {
                path: '$agent',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'policycategorys',
                let: {
                  'id': '$categoryId'
                },
                pipeline: [
                  {
                    $match: {
                      'status': 1,
                      'isDeleted': 0,
                      '$expr': {
                        '$eq': ['$_id', '$$id']
                      }
                    }
                  }, {
                    $project: {
                      'status': 1,
                      'isDeleted': 1,
                      'categoryName': 1
                    }
                  }
                ],
                as: 'category'
              }
            }, {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true
              }
            }, {
              $lookup: {
                from: 'policycarriers',
                let: {
                  'id': '$carrierId'
                },
                pipeline: [
                  {
                    $match: {
                      'status': 1,
                      'isDeleted': 0,
                      '$expr': {
                        '$eq': ['$_id', '$$id']
                      }
                    }
                  }, {
                    $project: {
                      'status': 1,
                      'isDeleted': 1,
                      'companyName': 1
                    }
                  }
                ],
                as: 'carrier'
              }
            }, {
              $unwind: {
                path: '$carrier',
                preserveNullAndEmptyArrays: true
              }
            }
          ],
          as: 'policies'
        }
      }]).allowDiskUse(true);

      // success 
      return this.success(req, res, this.status.HTTP_OK, {
        results: policyList,
        pageMeta: {
          skip: parseInt(skip),
          pageSize: pageSize,
          total: totalPolicies
        }
      }, this.messageTypes.policiesFetched);


      // catch any runtime error 
    } catch (err) {
      error(err);
      this.errors(req, res, this.status.HTTP_INTERNAL_SERVER_ERROR, this.exceptions.internalServerErr(req, err));
    }
  }

}

// exporting the modules 
module.exports = new userController();
