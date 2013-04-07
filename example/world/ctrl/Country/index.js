var Class     = require('../../dao/Country'),
    Mapper    = require('../../dao/CountryMapper'),
    Util      = require('../../lib/queryutil'),
    RouteUtil = require('../../lib/routeutil');
 
function getQuery(params) {
  var queparams = RouteUtil.getQueryParams(Class, params);
  return Util.createQueryWithParams(Class, queparams);
}
 
function getRecord(req) {
  if (!req.body && !req.query) {
    return;
  }
  if (!req.body.record && !req.query.record) {
    return;
  }
  if (req.body.record) {
    if (req.body.record instanceof Array) {
      return req.body.record;
    } else {
      return [req.body.record];
    }
  } else {
    var record = JSON.parse(req.query.record);
    if (record instanceof Array) {
      return record;
    } else {
      return [record];
    }
  }
}
 
function execute(req, res, method, view) {
  var dbconn = req.dbconn;
   
  var format = req.params.format;
  var cb = function(records) {
    if (format === 'json') {
      res.json(records);
    } else {
      res.render(view, {records: records});
    }
  };
   
  if (dbconn) {
    // get param pair
    var params  = RouteUtil.getParams(req);
    var query   = getQuery(params);
    var records = getRecord(req);
    var options = {};
    var userecords = [];
     
    if (records) {
      for (var i = 0; i < records.length; i++) {
        // check existence of field
        var isExist = false;
        for (field in records[i]) {
          isExist = Class.isExist(field);
          if (isExist) {
            break;
          }
        }
        if (isExist) {
          userecords.push(Class.create(records[i]));
        }
      }
    }
     
    options.que = query;
    if (method === 'select') {
      if (params.limit) {
        options.limit = params.limit;
        if (params.offset) {
          options.offset = params.offset;
        }
      }
    }
    try {
      if (Mapper[method]) {
        Mapper[method](dbconn, userecords, options, cb);
      } else {
        cb();
      }
    } catch(err) {
      res.json({result: 'FAIL'});
    }
  } else {
    res.json({result: 'FAIL', error: 'no db connection'});
  }
}
 
module.exports = {
  index: function(req, res){
    execute(req, res, 'select', 'show');
  },
  new: function(req, res){
    execute(req, res, 'insert', 'new');
  },
  create: function(req, res){
    execute(req, res, 'insert', 'create');
  },
  show: function(req, res){
    execute(req, res, 'select', 'show');
  },
  edit: function(req, res){
    execute(req, res, 'select', 'edit');
  },
  update: function(req, res){
    execute(req, res, 'update', 'update');
  },
  destroy: function(req, res){
    execute(req, res, 'delete', 'destroy');
  }
};

