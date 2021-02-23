// user controller 
const ctrl = require('./user.controller');

// custom joi validation
const {
  joiSearchPolicy, // joi search policy
  joiAggregatedPolicy, // aggreagted policies
} = require('./user.validators');

// exporting the user routes 
function userRoutes() {
  return (open, closed) => {
    // search the collection as per user name
    closed.route('/user/policy').get(
      [joiSearchPolicy], // joi validation 
      ctrl.getPolicy // controller function 
    );

    // get Aggregated of policies 
    closed.route('/user/policy/list').get(
      [joiAggregatedPolicy], // joi validation 
      ctrl.getPolicyAggregated // controller function 
    );
  };
}

module.exports = userRoutes();
