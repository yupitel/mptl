/*!
 * ndbc
 * Copyright(c) 2013 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */


var Crypto = require('crypto');

var Ndbc = (function () {
  function Ndbc(config, type) {
    this._config   = config || undefined;
    this._type     = type || undefined;
    this._conn     = undefined;
    this._pool     = undefined;
    this._connpool = {};
  }  
  
  Ndbc.prototype.getType = function(fn) {
    return this._type;
  };
  
  Ndbc.prototype.create = function(fn) {
    if (this._conn) {
      this.end();
    }
    this._pool = undefined;
    this._conn = this._create();
    if (fn) {fn();}
  };
  
  Ndbc.prototype.createpool = function(fn) {
    this._pool = this._createpool();
  };
  
  Ndbc.prototype.connect = function(fn) {
    if (!this._pool) {
      if (!this._conn) {console.log('no conn');return;}
      this._connect(this._conn);
      if (fn) {fn();}
    } else {
      if (this._conn) {
        this.end();
      }
      var self = this;
      this._pool.getConnection(function(err, connection) {
        //generate a unique correlation id for this call
        var key = Crypto.randomBytes(16).toString('hex');
        self._connpool[key] = connection;
        if (fn) {fn(key);}
      });
    }
  };
  
  Ndbc.prototype.close = function(key, fn) {
    if (key) {
      if (typeof key === 'function') {
        fn = key;
        key = undefined;
      }
    }
    if (key) {
      if (this._connpool[key]) {
        this._close(this.connpool[key]);
      }
    } else {
      if (this._conn) {
        this._close(this._conn);
      }
    }
    if (fn) {fn();}
  };  
  
  Ndbc.prototype.end = function(key, fn) {
    if (key) {
      if (typeof key === 'function') {
        fn = key;
        key = undefined;
      }
    }
    console.log('end : ' + key);
    if (key) {
      if (this._connpool[key]) {
        this._close(this._connpool[key]);
        delete this._connpool[key];
      }
    } else {
      if (this._conn) {
        this._close(this._conn);
      }
    }
    if (fn) {fn();}
  };
  
  Ndbc.prototype.query = function(sql, args, fn) {
    if (!this._conn && !this._pool) {return;}
    var key;
    if (args) {
      if (typeof args === 'function') {
        fn = args;
        args = undefined;
        key  = undefined;
      } else {
        if (args.key) {
          key = args.key;
        }
      }
    }
    var conn = this._conn;
    if (key && this._connpool[key]) {
      conn = this._connpool[key];
    } 
    this._query(conn, sql, args, fn);
  };
  
  Ndbc.prototype.beginTransaction = function(key, fn) {
    if (key) {
      if (typeof key === 'function') {
        fn = key;
        key = undefined;
      }
    }
    var conn = this._conn;
    if (key && this._connpool[key]) {
      conn = this._connpool[key];
    }
    this._beginTransaction(conn, fn);
//    this._query(this._conn, this._beginTransaction, null, fn);
  };
  
  Ndbc.prototype.commit = function(key, fn) {
    if (key) {
      if (typeof key === 'function') {
        fn = key;
        key = undefined;
      }
    }
    var conn = this._conn;
    if (key && this._connpool[key]) {
      conn = this._connpool[key];
    }
    this._commit(conn, fn);
    //this._query(this._conn, this._commit, null, fn);
  };
  
  Ndbc.prototype.rollback = function(key, fn) {
    if (key) {
      if (typeof key === 'function') {
        fn = key;
        key = undefined;
      }
    }
    var conn = this._conn;
    if (key && this._connpool[key]) {
      conn = this._connpool[key];
    }
    this._rollback(conn, fn);
    //this._query(this._conn, this._rollback, null, fn);
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

