/*!
 * ndbcfactory
 * Copyright(c) 2013 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

var ndbcMysql = require('./ndbcmysql');

(function () {
  var ndbcFactory = {};

  var root = this;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ndbcFactory;
  } else {
    root.ndbcFactory = ndbcFactory;
  }

  ndbcFactory.create = function(config, type) {
    var ndbc;
    if (type === 'mysql') {
      ndbc = new ndbcMysql(config);
    } else {
      return undefined;
    }
    return ndbc;
  };
}());

