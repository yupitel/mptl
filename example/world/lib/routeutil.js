//
// RouteUtil
//

RouteUtil = {
  getParams : function(req) {
    if (!req) {
      return;
    }
    var param;
    var params = {};
    // get param in the params
    if (req.params) {
      for (param in req.params) {
        if (typeof(param) === 'function') {
          continue;
        }
        if (param === 'format') {
          continue;
        }
        params[param] = req.params[param];
      }
    }
    // get params in the query
    if (req.query) {
      for (param in req.query) {
        if (typeof(param) === 'function') {
          continue;
        }
        params[param] = req.query[param];
      }
    }
    // get params in the body
    if (req.body) {
      for (param in req.body) {
        if (typeof(param) === 'function') {
          continue;
        }
        // record is reserved to pass data.
        if (param === 'record') {
          continue;
        }
        params[param] = req.body[param];
      }
    }
    return params;
  },
  getQueryParams : function(entity, params) {
    if (!entity || !params) {
      return;
    }
    var queParams = {};
    for (var field in params) {
      // check existence of field
      var isExist = entity.isExist(field);
      if (isExist !== true) {
        continue;
      }
      queParams[field] = params[field];
    }
    return queParams;
  }
};

module.exports = RouteUtil;

