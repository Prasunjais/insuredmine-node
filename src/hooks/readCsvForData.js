// controller
const UserCtrl = require('../components/user/user.controller');
const AgentCtrl = require('../components/agent/agent.controller');
const PolicyCategory = require('../components/policyCategory/policyCategory.controller');
const PolicyCarrier = require('../components/policyCarrier/policyCarrier.controller');

// Responses & others utils 
const Response = require('../responses/response');
const StatusCodes = require('../facades/response');
const MessageTypes = require('../responses/types');
const Exceptions = require('../exceptions/Handler');
const camelcase = require('camelcase');
const moment = require('moment');
const {
  error,
  info
} = require('../utils').logging;
const csv = require('csvtojson');
const mime = require('mime-types');
const _ = require('lodash');
const { resolve } = require('path');
const { ConsoleTransportOptions } = require('winston/lib/winston/transports');

// exporting the hooks 
module.exports = async (req, res, next) => {
  try {
    // checking the extension of the file 
    info('Converting the csv to json');

    // check the request file
    if (req.file) {
      let ext = mime.extension(req.file.mimetype); // 'csv'
      info(`Checking the file type which is : ${ext}`);
      let valid_ext = ['csv', 'xls'];

      // checking the file buffer and converting to string 
      if (req.file.buffer.toString('utf-8').length > 0) {
        if (valid_ext.indexOf(ext) >= 0) {
          info('Valid File');

          // get all the data 
          let [allUsers, allAgent, allPolicyCategory, allPolicyCarrier] = await Promise.all([
            UserCtrl.getAll(),
            AgentCtrl.getAll(),
            PolicyCategory.getAll(),
            PolicyCarrier.getAll()
          ]);

          if (allUsers.success) allUsers = allUsers.data || [];
          else allUsers = [];

          if (allAgent.success) allAgent = allAgent.data || [];
          else allAgent = [];

          if (allPolicyCategory.success) allPolicyCategory = allPolicyCategory.data || [];
          else allPolicyCategory = [];

          if (allPolicyCarrier.success) allPolicyCarrier = allPolicyCarrier.data || [];
          else allPolicyCarrier = [];

          // converting the csv buffer to string of utf-8
          let csvString = req.file.buffer.toString('utf-8');

          // getting the json array from csvString
          const policyInfo = await csv().fromString(csvString).subscribe(async (json) => {
            if (!_.isEmpty(json))
              new Promise(async (resolve, reject) => {

                // policy mode  
                if (json['policy_mode']) {
                  Object.defineProperty(json, 'policyMode', Object.getOwnPropertyDescriptor(json, 'policy_mode'));
                  delete json['policy_mode'];
                } else json.policyMode = '';

                // producer
                if (json['producer']) {
                  Object.defineProperty(json, 'producer', Object.getOwnPropertyDescriptor(json, 'producer'));
                  // deleting the existing column name
                  delete json['producer'];
                } else json.producer = '';

                // policy number
                if (json['policy_number']) {
                  Object.defineProperty(json, 'policyNumber', Object.getOwnPropertyDescriptor(json, 'policy_number'));
                  // deleting the existing column name
                  delete json['policy_number'];
                } else json.policyNumber = '';

                // premium amount written
                if (json['premium_amount_written']) {
                  Object.defineProperty(json, 'premiumAmountWritten', Object.getOwnPropertyDescriptor(json, 'premium_amount_written'));
                  // deleting the existing column name
                  delete json['premium_amount_written'];
                } else json.premiumAmountWritten = '';

                // premium amount 
                if (json['premium_amount']) {
                  Object.defineProperty(json, 'premiumAmount', Object.getOwnPropertyDescriptor(json, 'premium_amount'));
                  // deleting the existing column name
                  delete json['premium_amount'];
                } else json.premiumAmount = 0;

                // policy type 
                if (json['policy_type']) {
                  Object.defineProperty(json, 'policyType', Object.getOwnPropertyDescriptor(json, 'policy_type'));
                  // deleting the existing column name
                  delete json['policy_type'];
                } else json.policyType = '';

                // company name 
                if (json['company_name']) {
                  Object.defineProperty(json, 'companyName', Object.getOwnPropertyDescriptor(json, 'company_name'));
                  // deleting the existing column name
                  delete json['company_name'];
                } else json.companyName = '';

                // category name 
                if (json['category_name']) {
                  Object.defineProperty(json, 'categoryName', Object.getOwnPropertyDescriptor(json, 'category_name'));
                  // deleting the existing column name
                  delete json['category_name'];
                } else json.lessThan7BeyondDue = 0;

                // 8to15Days
                if (json['policy_start_date']) {
                  Object.defineProperty(json, 'policyStartDate', Object.getOwnPropertyDescriptor(json, 'policy_start_date'));
                  // deleting the existing column name
                  delete json['policy_start_date'];
                } else json['policyStartDate'] = 0;

                // 16to21Days
                if (json['policy_end_date']) {
                  Object.defineProperty(json, 'policyEndDate', Object.getOwnPropertyDescriptor(json, 'policy_end_date'));
                  // deleting the existing column name
                  delete json['policy_end_date'];
                } else json['policyEndDate'] = 0;

                // 22to30Days
                if (json['account_name']) {
                  Object.defineProperty(json, 'accountName', Object.getOwnPropertyDescriptor(json, 'account_name'));
                  // deleting the existing column name
                  delete json['account_name'];
                } else json['accountName'] = 0;

                // 31to60Days
                if (json['firstname']) {
                  Object.defineProperty(json, 'firstName', Object.getOwnPropertyDescriptor(json, 'firstname'));
                  // deleting the existing column name
                  delete json['firstname'];
                } else json['firstName'] = 0;

                // greaterThan60Days
                if (json['account_type']) {
                  Object.defineProperty(json, 'accountType', Object.getOwnPropertyDescriptor(json, 'account_type'));
                  // deleting the existing column name
                  delete json['account_type'];
                } else json.accountType = 0;

                return resolve(json);
              }).catch(err => console.error(err));
            else return resolve();
          });

          // policy 
          for (let i = 0; i < policyInfo.length; i++) {

            // policy start date 
            if (policyInfo[i].policyStartDate) policyInfo[i].policyStartDate = moment(policyInfo[i].policyStartDate, 'MM/DD/YYYY').toDate();
            if (policyInfo[i].policyEndDate) policyInfo[i].policyEndDate = moment(policyInfo[i].policyEndDate, 'MM/DD/YYYY').toDate();

            // agent list 
            let agentExist = _.find(allAgent, {
              'nameToDisplay': camelcase(policyInfo[i]['agent'])
            });

            // creating new column name as per db schema 
            if (agentExist)
              policyInfo[i].agentId = agentExist._id;
            else {
              // create a new user id 
              let isCreated = await AgentCtrl.create({
                name: policyInfo[i]['agent'],
                nameToDisplay: camelcase(policyInfo[i]['agent'])
              });
              if (isCreated.success) allAgent.push(isCreated.data);
            }

            // get the user 
            let userExist = _.find(allUsers, {
              'email': policyInfo[i]['email']
            });

            // creating new column name as per db schema 
            if (userExist)
              policyInfo[i].userId = userExist._id;
            else {
              // create a new user id 
              let isUserCreated = await UserCtrl.create({
                email: policyInfo[i]['email'],
                firstName: policyInfo[i]['firstName'],
                dateOfBirth: moment(policyInfo[i]['dob'], 'MM/DD/YYYY').toDate(),
                gender: policyInfo[i]['gender'],
                address: policyInfo[i]['address'],
                phoneNumber: policyInfo[i]['phone'],
                state: policyInfo[i]['state'],
                zipCode: policyInfo[i]['zip'],
              });
              if (isUserCreated.success) allUsers.push(isUserCreated.data);
            }

            // allPolicyCategory 
            // get the policy category 
            let policyExists = _.find(allPolicyCategory, {
              'categoryName': policyInfo[i]['categoryName']
            });

            // creating new column name as per db schema 
            if (policyExists)
              policyInfo[i].categoryId = policyExists._id;
            else {
              // create a new user id 
              let isPolicyCreated = await PolicyCategory.create({
                'categoryName': policyInfo[i]['categoryName']
              });
              if (isPolicyCreated.success) allPolicyCategory.push(isPolicyCreated.data);
            }

            // allPolicyCarrier
            let policyCarrierExists = _.find(allPolicyCarrier, {
              'companyName': policyInfo[i]['companyName']
            });

            // creating new column name as per db schema 
            if (policyCarrierExists)
              policyInfo[i].carrierId = policyCarrierExists._id;
            else {
              // create a new user id 
              let isCarrierCreated = await PolicyCarrier.create({
                'companyName': policyInfo[i]['companyName']
              });
              if (isCarrierCreated.success) allPolicyCarrier.push(isCarrierCreated.data);
            }
          }

          // injecting into the request body 
          req.body.policyInfo = policyInfo;

          // move on
          return next();

          // move on to the next hook
        } else Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.policy.policyNotFound);
      } else Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.policy.unbaleToFetchDataFromCsv);
    } else Response.errors(req, res, StatusCodes.HTTP_CONFLICT, MessageTypes.policy.unbaleToFetchDataFromCsv);

    // catch any runtime error 
  } catch (e) {
    error(e);
    Response.errors(req, res, StatusCodes.HTTP_INTERNAL_SERVER_ERROR, Exceptions.internalServerErr(req, e));
  }
};
