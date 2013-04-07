/*!
 * dbschema
 * Copyright(c) 2012 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

 // to wrap various type of sql column
function Column() {
  this.field     = undefined;
  this.type      = undefined;
  this.allowNull = true;
  this.key       = undefined;
  this.defVal    = undefined;
  this.defEscape = '';
  this.escape    = false;
  this.isAI      = false;
}

function Table(name) {
  this.name      = name || undefined;
  this.columns   = [];
  this.className = name || undefined;
  this.keys      = [];
  this.exkeys    = [];
}

module.exports = {
 table     : Table,
 column    : Column
};
