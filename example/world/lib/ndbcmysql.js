/*!
 * ndbcmysql
 * Copyright(c) 2012 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

var mysql     = require('mysql'),
    Ndbc      = require('./ndbc'),
    __extends = require('./extends');


var NdbcMySql = (function (_super) {
  __extends(NdbcMySql, _super);

  function NdbcMySql(config) {
    _super.call(this, config, 'mysql');
  }

  NdbcMySql.prototype._create = function() {
    var conf = this._config;
    return mysql.createConnection({
      host     : conf.host,
      user     : conf.user,
      password : conf.password,
      database : conf.database
    });
  };

  NdbcMySql.prototype._createpool = function() {
    var conf = this._config;
    return mysql.createPool({
      host     : conf.host,
      user     : conf.user,
      password : conf.password,
      database : conf.database
    });
  };

  NdbcMySql.prototype._connect = function(conn) {
    conn.connect();
  };

  NdbcMySql.prototype._close   = function(conn, pool) {
    conn.destroy();
    pool = undefined;
  };

  NdbcMySql.prototype._end     = function(conn) {
    conn.end();
  };
  
  NdbcMySql.prototype._error   = function(conn) {
    console.log('error');
  };

  NdbcMySql.prototype._beginTransaction = function(conn) {
    return 'START TRANSACTION;';
  };

  NdbcMySql.prototype._commit = function(conn) {
    return 'COMMIT;';
  };

  NdbcMySql.prototype._rollback = function(conn) {
    return 'ROLLBACK;';
  };
  
  NdbcMySql.prototype.test = function(conn) {

    return 'ROLLBACK;';
  };

  
  NdbcMySql.prototype._query   = function(conn, sql, args, fn) {
    if (!conn) {
      console.log('connection is not set!');
    }
    var record;
    var values;
    var type;
    if (args) {

      if (args.record) {
        record = args.record;
        values = record;
      }
      if (args.ph) {
        values = args.ph;
      }
      if (args.type) {
        type = args.type;
      }
      var limit;
      var offset;
      if (args.limit) {
        limit = args.limit;
        if (args.offset) {
          offset = args.offset;
        }
      }
      if (limit) {
        sql += ' LIMIT ';
        if (offset) {
          sql += offset + ', ';
        }
        sql += limit;
      }
      var orders;
      if (args.orders) {
        orders = args.orders;
        sql += 'ORDER BY ';
        for (var i = 0; i < orders.length; i++) {
          if (i > 0) {
            sql += ', ';
          }
          var order = orders[i];
          sql += order.key;
          if (order.sort) {
            sql += ' ' + order.sort;
          }
        }
      }
    }
    //console.log(sql);
    conn.query(sql, values, function(err, rows, fields) {
      if (err) {throw err;}
      if (type === 'I') {
        var key = record.getAI();
        if (key) {
          record[key] = rows.insertId;
        }
      }
      fn(rows, fields);
    });
  };
  
  return NdbcMySql;
})(Ndbc);

module.exports = NdbcMySql;
