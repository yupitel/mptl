/*
* Mapper for City
*                   powered by MapperTemplate.
*/
 
var Class = require('./City');
var Util  = require('../lib/queryutil');
 
 
var CityMapper = {
  count: function(conn, records, options, fn) {
    records = Util.convertToArray(records);
    var sql   = 'SELECT COUNT(*) AS num FROM City';
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
    var sql   = 'SELECT ID, Name, CountryCode, District, Population FROM City';
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
          ent.ID          = rows[i].ID;
          ent.Name        = rows[i].Name;
          ent.CountryCode = rows[i].CountryCode;
          ent.District    = rows[i].District;
          ent.Population  = rows[i].Population;
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
    var set   = 'ID, Name, CountryCode, District, Population';
    var val   = '?, ?, ?, ?, ?';
    var sql   = 'INSERT INTO City(' + set + ') VALUES (' + val + ')';
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
        ph.push(record.ID);
        ph.push(record.Name);
        ph.push(record.CountryCode);
        ph.push(record.District);
        ph.push(record.Population);
        args.ph = ph;
        conn.query(query, args, cb);
      }
    };
       
    conn.connect(fnQuery);
  },
  update: function(conn, records, options, fn) {
    records = Util.convertToArray(records);
    var set = ' :ID_r :Name_r :CountryCode_r :District_r :Population_r';
    var sql = 'UPDATE City SET ' + set;
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
        if (record.ID !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'ID = ?';
          ph.push(record.ID);
          useNum ++;
        }
        query = query.replace(/:ID_r/g, repVal);
        repVal = '';
        if (record.Name !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Name = ?';
          ph.push(record.Name);
          useNum ++;
        }
        query = query.replace(/:Name_r/g, repVal);
        repVal = '';
        if (record.CountryCode !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'CountryCode = ?';
          ph.push(record.CountryCode);
          useNum ++;
        }
        query = query.replace(/:CountryCode_r/g, repVal);
        repVal = '';
        if (record.District !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'District = ?';
          ph.push(record.District);
          useNum ++;
        }
        query = query.replace(/:District_r/g, repVal);
        repVal = '';
        if (record.Population !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Population = ?';
          ph.push(record.Population);
          useNum ++;
        }
        query = query.replace(/:Population_r/g, repVal);
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
    var sql = 'DELETE FROM City';
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
 
module.exports = CityMapper;

