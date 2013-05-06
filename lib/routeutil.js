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
      if (!entity.useEscape(field)) {
        if (isNaN(params[field]) === true) {
          continue;
        }
      }
      queParams[field] = params[field];
    }
    return queParams;
  },
  getRecord : function(req) {
    if (!req.body && !req.query) {
      return;
    }
    if (!req.body.record && !req.query.record) {
      return;
    }
    if (req.body.record) {
      var record = req.body.record;
      console.log(record instanceof String);
      try {
        record = JSON.parse(record);
        console.log(record);
      } catch (e) {
        console.log('not json');
      }
      if (record instanceof Array) {
        console.log('array');
        return record;
      } else {
        console.log('to array');
        return [record];
      }
    } else {
      var record = JSON.parse(req.query.record);
      if (record instanceof Array) {
        return record;
      } else {
        return [record];
      }
    }
  },
  getOrder : function(req) {
    if (!req.body && !req.query) {
      return;
    }
    if (!req.body.order && !req.query.order) {
      return;
    }
    if (req.body.order) {
      if (req.body.order instanceof Array) {
        return req.body.order;
      } else {
        return [req.body.order];
      }
    } else {
      var order = req.query.order;
      if (order instanceof Array) {
        var use = order;
        for (var i = 0; i < order.length; i++) {
          order[i] = {key: order[i]};
        }
      } else {
        try {
          order = JSON.parse(order);
        } catch (e) {
          order = {key: order};
        }
      }
      //order = JSON.parse(req.query.order);
      if (order instanceof Array) {
        return order;
      } else {
        return [order];
      }
    }
  }
};

module.exports = RouteUtil;

