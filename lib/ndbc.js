/*!
 * ndbc
 * Copyright(c) 2013 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

var Ndbc = (function () {
  function Ndbc(config, type) {
    this._config   = config || undefined;
    this._type     = type || undefined;
    this._conn     = undefined;
    this._pool     = undefined;
    this._connpool = {};
    this._logger   = undefined;
  }  
  
  Ndbc.prototype.getType = function(fn) {
    return this._type;
  };
  
  Ndbc.prototype.create = function() {
    this._pool = undefined;
    var ndbc = require('./ndbcfactory').create(this._config, this._type);
    ndbc._logger = this._logger;
    ndbc._conn = this._create();
    return ndbc;
  };
  
  Ndbc.prototype.createpool = function() {
    this._pool = this._createpool();
    return this;
  };

  Ndbc.prototype.setLogger = function(logger) {
    this._logger = logger;
  };
  
  Ndbc.prototype.connect = function(fn) {
    if (!this._pool) {
      if (!this._conn) {console.log('no conn');return;}
      this._connect(this._conn);
      if (fn) {fn(this);}
    } else {
      if (this._conn) {
        this.end();
      }
      var self = this;
      this._pool.getConnection(function(err, connection) {
        var ndbc = require('./ndbcfactory').create(self._config, self._type);
        ndbc._logger = self._logger;
        ndbc._conn = connection;
        if (fn) {fn(ndbc);}
      });
    }
  };

  Ndbc.prototype.close = function(fn) {
    if (this._conn) {
      this._close(this._conn);
    }
    if (fn) {fn();}
  };  
  
  Ndbc.prototype.end = function(fn) {
    if (this._conn) {
      this._end(this._conn);
    }
    if (fn) {fn();}
  };
  
  Ndbc.prototype.query = function(sql, args, fn) {
    if (!this._conn && !this._pool) {return;}
    if (args) {
      if (typeof args === 'function') {
        fn = args;
        args = undefined;
      }
    }
    var conn = this._conn;
    this._query(conn, sql, args, fn);
  };
  
  Ndbc.prototype.beginTransaction = function(fn) {
    var conn = this._conn;
    this._beginTransaction(conn, fn);
  };
  
  Ndbc.prototype.commit = function(fn) {
    var conn = this._conn;
    this._commit(conn, fn);
  };
  
  Ndbc.prototype.rollback = function(fn) {
    var conn = this._conn;
    this._rollback(conn, fn);
  };

  // private wrapped function
  Ndbc.prototype._create = function() {
    console.log('_create is not implemented');
  };
  
  Ndbc.prototype._createpool = function() {
    console.log('_createpool is not implemented');
  };
  
  Ndbc.prototype._getconnection = function() {
    console.log('_getconnection is not implemented');
  };

  Ndbc.prototype._connect = function(conn) {
    console.log('_connect is not implemented');
  };

  Ndbc.prototype._close   = function(conn) {
    console.log('_close is not implemented');
  };

  Ndbc.prototype._error   = function(conn) {
    console.log('_error is not implemented');
  };
  
  Ndbc.prototype._query   = function(conn, sql, record, errFn) {
    console.log('_query is not implemented');
  };

  Ndbc.prototype._executequery = function(conn, sql, record, errFn, fn) {
    console.log('_executequery is not implemented');
  };

  // transaction query
  Ndbc.prototype._beginTransaction = function(conn) {
    console.log('_beginTransaction is not implemented');
  };

  Ndbc.prototype._commit = function(conn) {
    console.log('_commit is not implemented');
  };

  Ndbc.prototype._rollback = function(conn) {
    console.log('_rollback is not implemented');
  };

  return Ndbc;
})();

module.exports = Ndbc;

