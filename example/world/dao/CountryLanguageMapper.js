/*
* Mapper for CountryLanguage
*                   powered by MapperTemplate.
*/
 
var Class = require('./CountryLanguage');
var Util  = require('../lib/queryutil');
 
 
var CountryLanguageMapper = {
  count: function(conn, records, options, fn) {
    records = Util.convertToArray(records);
    var sql   = 'SELECT COUNT(*) AS num FROM CountryLanguage';
    var whsql = '';
    var que;
    if (options) {
      if (options.que) {que = options.que;}
    }
       
    whsql = Util.createQuery(Class, records, que);
    if (whsql) {
      sql += ' WHERE ' + whsql;
    }
       
    var cb = function(rows, fields) {
      var num = 0;
      if (rows.length > 0) {
        num = rows[0].num;
      }
      conn.end();
      if (fn) {fn(num);}
    };
       
    var fnQuery = function() {
      conn.query(sql, cb);
    };
       
    conn.connect(fnQuery);
  },
  select: function(conn, records, options, fn) {
    records = Util.convertToArray(records);
    var sql   = 'SELECT CountryCode, Language, IsOfficial, Percentage FROM CountryLanguage';
    var whsql = '';
    var que;
    var limit;
    var offset;
    var args = {};
    if (options) {
      if (options.que) {que = options.que;}
      if (options.limit) {limit = options.limit;}
      if (options.offset) {offset = options.offset;}
      if (limit) {
        args.limit = limit;
        args.offset = offset;
      }
    }
       
    whsql = Util.createQuery(Class, records, que);
    if (whsql) {
      sql += ' WHERE ' + whsql;
    }
       
    var cb = function(rows, fields) {
      var entities;
      if (rows.length > 0) {
        entities = new Array(rows.length);
        for (var i = 0; i < rows.length; i++) {
          var ent = Class.create();
          ent.CountryCode = rows[i].CountryCode;
          ent.Language    = rows[i].Language;
          ent.IsOfficial  = rows[i].IsOfficial;
          ent.Percentage  = rows[i].Percentage;
          entities[i] = ent;
        }
      }
      conn.end();
      if (fn) {fn(entities);}
    };
       
    var fnQuery = function() {
      conn.query(sql, args, cb);
    };
       
    conn.connect(fnQuery);
  },
  insert: function(conn, records, options, fn) {
    if (!records) {
      if (fn) {return fn(new Error('records is null'));}
    }
    records = Util.convertToArray(records);
    var set   = 'CountryCode, Language, IsOfficial, Percentage';
    var val   = '?, ?, ?, ?';
    var sql   = 'INSERT INTO CountryLanguage(' + set + ') VALUES (' + val + ')';
    var queNum = 0;
    var recNum = records.length;
       
    var cb = function(rows, fields) {
      queNum ++;
      if (queNum === recNum) {
        conn.end();
        if (fn) {fn(records);}
      }
    };
         
    var fnQuery = function() {
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        // update undefined with default value
        for (var field in record) {
          if (typeof field === 'function') {
            continue;
          }
          if (record[field] === undefined) {
            record[field] = Class.getDefault(field);
          }
        }
        var args = {record:record, type:'I'};
        var query = sql;
        // set escaping query values
        var ph = [];
        ph.push(record.CountryCode);
        ph.push(record.Language);
        ph.push(record.IsOfficial);
        ph.push(record.Percentage);
        args.ph = ph;
        conn.query(query, args, cb);
      }
    };
       
    conn.connect(fnQuery);
  },
  update: function(conn, records, options, fn) {
    records = Util.convertToArray(records);
    var set = ' :CountryCode_r :Language_r :IsOfficial_r :Percentage_r';
    var sql = 'UPDATE CountryLanguage SET ' + set;
    var queNum = 0;
    var recNum = records.length;
    var que;
    if (options) {
      if (options.que) {que = options.que;}
    }
       
    var cb = function(rows, fields) {
      queNum ++;
      if (queNum === recNum) {
        conn.end();
        if (fn) {fn(records);}
      }
    };
     
    var fnQuery = function() {
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        var query  = sql;
        var whsql  = '';
        var queNum = 0;
        var args = {record:record, type:'U'};
        var ph = [];
        var useNum = 0;
        var repVal = '';
        repVal = '';
        if (record.CountryCode !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'CountryCode = ?';
          ph.push(record.CountryCode);
          useNum ++;
        }
        query = query.replace(/:CountryCode_r/g, repVal);
        repVal = '';
        if (record.Language !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Language = ?';
          ph.push(record.Language);
          useNum ++;
        }
        query = query.replace(/:Language_r/g, repVal);
        repVal = '';
        if (record.IsOfficial !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'IsOfficial = ?';
          ph.push(record.IsOfficial);
          useNum ++;
        }
        query = query.replace(/:IsOfficial_r/g, repVal);
        repVal = '';
        if (record.Percentage !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Percentage = ?';
          ph.push(record.Percentage);
          useNum ++;
        }
        query = query.replace(/:Percentage_r/g, repVal);
        args.ph = ph;
                  
        whsql = Util.createQuery(Class, record, que);
        if (whsql) {
          query += ' WHERE ' + whsql;
        }
             
        conn.query(query, args, cb);
      }
    };
       
    conn.connect(fnQuery);
  },
  delete: function(conn, records, options, fn) {
    records = Util.convertToArray(records);
    var sql = 'DELETE FROM CountryLanguage';
    var whsql = '';
    var que;
    if (options) {
      if (options.que) {que = options.que;}
    }
         
    whsql = Util.createQuery(Class, records, que);
    // prohibit to delete all column.
    // if delete all column, set '1' to que variable.
    if (!whsql || whsql.length === 0) {
      return;
    }
       
    if (whsql) {
      sql += ' WHERE ' + whsql;
    }
         
    var cb = function(rows, fields) {
      conn.end();
      if (fn) {fn(rows);}
    };
       
    var fnQuery = function() {
      conn.query(sql, cb);
    };
     
    conn.connect(fnQuery);
  }
};
 
module.exports = CountryLanguageMapper;

