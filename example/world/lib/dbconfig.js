/*!
 * dbconfig
 * Copyright(c) 2012 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

function DbConfig(options) {
  options = options || {};
  this.host            = options.host || 'localhost';
  this.port            = options.port || 3306;
  this.user            = options.user || undefined;
  this.password        = options.password || undefined;
  this.database        = options.database || undefined;
}

module.exports = DbConfig;

