//
// Util
//

Util = {
  escapeValue : function(value, escape) {
    var esvalue = '';
    if (escape === true) {
      esvalue = '\'' + value + '\'';
    } else {
      esvalue = value;
    }
    return esvalue;
  },
  whereString : function(field, values, escape, header) {
    var sql = '';
    var field = field;
    if (header) {
      field = header + field;
    }
    // check array or not
    if (typeof(values) === 'object') {
      var isBoth = false;
      var isNull = false;
      var isKey  = false;
      var keynum = 0;
      for (var i = 0; i < values.length; i++) {
        if (values[i] === null) {
          isNull = true;
        } else {
          isKey  = true;
        }
        if (isNull && isKey) {
          isBoth = true;
          break;
        }
      }
      if (isBoth) {
        sql += '(';
      }
      if (isNull) {
        sql += field + ' IS NULL';
      }
      if (isBoth) {
        sql += ' OR ';
      }
      if (isKey) {
        sql = sql + field + ' IN (';
        for (i = 0; i < values.length; i++) {
          if (!values[i]) {
            continue;
          }
          if (keynum > 0) {
            sql = sql + ', ';
          }
          sql = sql + Util.escapeValue(values[i], escape);
          keynum ++;
        }
        sql = sql + ')';
      }
      if (isBoth) {
        sql += ')';
      }
    } else {
      if (values === null) {
        sql = sql + field + ' IS NULL ';
      } else {
        sql = sql + field + ' = ' + Util.escapeValue(values, escape);
      }
    }
    return sql;
  },
  connectWord : function(front, back, word) {
    var str = '';
    if (front) {
      str = front;
    }
    if (!back || back.length === 0) {
      return str;
    }
    if (str && str.length > 0) {
      str += word + back;
    } else {
      str  = back;
    }
    return str;
  },
  connectSearchQuery : function(queries) {
    var query = '';
    if (queries) {
      for (var i = 0; i < queries.length; i++) {
        var que = queries[i];
        if (!que || que.length === 0) {
          continue;
        }
        query = Util.connectWord(query, que, ' AND ');
      }
    }
    return query;
  },
  createQuery : function(entity, records, query, useAll, allowNulli, header) {
    if (!query) {
      if (!entity || !records || records.length === 0) {
        return;
      }
    }
    var useNull = false;
    if (allowNull && allowNull === true) {
      useNull = true;
    }
    
    var queries = [];
    if (records) {
      var recordAry;
      if (records instanceof Array) {
        recordAry = records;
      } else {
        recordAry = [records];
      }
      var fields;
      if (useAll) {
        fields = entity.create();
      } else {
        fields = entity.getKeys();
      }
      for (var field in fields) {
        if (typeof(fields[field]) === 'function') {
            continue;
        }
        var values = [];
        for (i = 0; i < recordAry.length; i++) {
          if (recordAry[i][field] !== undefined) {
            if (recordAry[i][field] === null && useNull === false) {
              continue;
            }
            values.push(recordAry[i][field]);
          }
        }
        if (values.length > 0) {
          var que;
          var escape = entity.useEscape(field);
          que = Util.whereString(field, values, escape, header);
          queries.push(que);
        }
      }
    }
    if (query && query.length > 0) {
      queries.push(query);
    }

    return Util.connectSearchQuery(queries);
  },
  createQueryWithParams : function(entity, params, query, header) {
    if (!query) {
      if (!entity || !params) {
        return;
      }
    }
    
    var queries = [];
    for (var field in params) {
      // check existence of field
      var isExist = entity.isExist(field);
      if (isExist !== true) {
        continue;
      }
      var values = [];
      var value = params[field];
      if (!value) {
        continue;
      }
      if (value instanceof Array) {
        if (value.length === 0) {
          continue;
        }
        values = value;
      } else {
        values.push(value);
      }      
      if (values.length > 0) {
        var que;
        var escape = entity.useEscape(field);
        que = Util.whereString(field, values, escape, header);
        queries.push(que);
      }
    }
    if (query && query.length > 0) {
      queries.push(query);
    }

    return Util.connectSearchQuery(queries);
  },
  convertToArray : function(obj) {
    if (!obj) {return;}
    if (!(obj instanceof Array)) {
      obj = [obj];
    }
    return obj;
  }
};

module.exports = Util;

