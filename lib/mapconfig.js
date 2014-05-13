/*!
 * mapconfig
 * Copyright(c) 2012 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

function MapConfig(options) {
  options = options || {};

  this.type            = options.type || 'mysql';
  this.host            = options.host || 'localhost';
  this.port            = options.port || 3306;
  this.user            = options.user || undefined;
  this.password        = options.password || undefined;
  this.database        = options.database || undefined;
  this.tableConfig     = options.tableConfig || undefined;
  this.tableConfigs    = options.tableConfigs || {};
}
module.exports = MapConfig;

