/*!
 * tableconfig
 */

function TableConfig(options) {
  this.table                 = options.table || undefined;
  this.enableUseLastInsertId = options.enableUseLastInsertId || false;
  this.enableSelectByPriKey  = options.enableSelectByPriKey || true;
  this.enableUpdateByPriKey  = options.enableUpdateByPriKey || true;
  this.enableDeleteByPriKey  = options.enableDeleteByPriKey || true;
  this.enableSelectByObject  = options.enableSelectByObject || true;
  this.enableUpdateByObject  = options.enableUpdateByObject || true;
  this.enableInsertByObject  = options.enableInsertByObject || true;
  this.enableDeleteByObject  = options.enableDeleteByObject || true;
}

module.exports = TableConfig;

