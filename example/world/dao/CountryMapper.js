/*
* Mapper for Country
*                   powered by MapperTemplate.
*/
 
var Class = require('./Country');
var Util  = require('../lib/queryutil');
 
 
var CountryMapper = {
  count: function(conn, records, options, fn) {
    records = Util.convertToArray(records);
    var sql   = 'SELECT COUNT(*) AS num FROM Country';
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
    var sql   = 'SELECT Code, Name, Continent, Region, SurfaceArea, IndepYear, Population, LifeExpectancy, GNP, GNPOld, LocalName, GovernmentForm, HeadOfState, Capital, Code2 FROM Country';
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
          ent.Code           = rows[i].Code;
          ent.Name           = rows[i].Name;
          ent.Continent      = rows[i].Continent;
          ent.Region         = rows[i].Region;
          ent.SurfaceArea    = rows[i].SurfaceArea;
          ent.IndepYear      = rows[i].IndepYear;
          ent.Population     = rows[i].Population;
          ent.LifeExpectancy = rows[i].LifeExpectancy;
          ent.GNP            = rows[i].GNP;
          ent.GNPOld         = rows[i].GNPOld;
          ent.LocalName      = rows[i].LocalName;
          ent.GovernmentForm = rows[i].GovernmentForm;
          ent.HeadOfState    = rows[i].HeadOfState;
          ent.Capital        = rows[i].Capital;
          ent.Code2          = rows[i].Code2;
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
    var set   = 'Code, Name, Continent, Region, SurfaceArea, IndepYear, Population, LifeExpectancy, GNP, GNPOld, LocalName, GovernmentForm, HeadOfState, Capital, Code2';
    var val   = '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?';
    var sql   = 'INSERT INTO Country(' + set + ') VALUES (' + val + ')';
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
        ph.push(record.Code);
        ph.push(record.Name);
        ph.push(record.Continent);
        ph.push(record.Region);
        ph.push(record.SurfaceArea);
        ph.push(record.IndepYear);
        ph.push(record.Population);
        ph.push(record.LifeExpectancy);
        ph.push(record.GNP);
        ph.push(record.GNPOld);
        ph.push(record.LocalName);
        ph.push(record.GovernmentForm);
        ph.push(record.HeadOfState);
        ph.push(record.Capital);
        ph.push(record.Code2);
        args.ph = ph;
        conn.query(query, args, cb);
      }
    };
       
    conn.connect(fnQuery);
  },
  update: function(conn, records, options, fn) {
    records = Util.convertToArray(records);
    var set = ' :Code_r :Name_r :Continent_r :Region_r :SurfaceArea_r :IndepYear_r :Population_r :LifeExpectancy_r :GNP_r :GNPOld_r :LocalName_r :GovernmentForm_r :HeadOfState_r :Capital_r :Code2_r';
    var sql = 'UPDATE Country SET ' + set;
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
        if (record.Code !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Code = ?';
          ph.push(record.Code);
          useNum ++;
        }
        query = query.replace(/:Code_r/g, repVal);
        repVal = '';
        if (record.Name !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Name = ?';
          ph.push(record.Name);
          useNum ++;
        }
        query = query.replace(/:Name_r/g, repVal);
        repVal = '';
        if (record.Continent !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Continent = ?';
          ph.push(record.Continent);
          useNum ++;
        }
        query = query.replace(/:Continent_r/g, repVal);
        repVal = '';
        if (record.Region !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Region = ?';
          ph.push(record.Region);
          useNum ++;
        }
        query = query.replace(/:Region_r/g, repVal);
        repVal = '';
        if (record.SurfaceArea !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'SurfaceArea = ?';
          ph.push(record.SurfaceArea);
          useNum ++;
        }
        query = query.replace(/:SurfaceArea_r/g, repVal);
        repVal = '';
        if (record.IndepYear !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'IndepYear = ?';
          ph.push(record.IndepYear);
          useNum ++;
        }
        query = query.replace(/:IndepYear_r/g, repVal);
        repVal = '';
        if (record.Population !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Population = ?';
          ph.push(record.Population);
          useNum ++;
        }
        query = query.replace(/:Population_r/g, repVal);
        repVal = '';
        if (record.LifeExpectancy !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'LifeExpectancy = ?';
          ph.push(record.LifeExpectancy);
          useNum ++;
        }
        query = query.replace(/:LifeExpectancy_r/g, repVal);
        repVal = '';
        if (record.GNP !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'GNP = ?';
          ph.push(record.GNP);
          useNum ++;
        }
        query = query.replace(/:GNP_r/g, repVal);
        repVal = '';
        if (record.GNPOld !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'GNPOld = ?';
          ph.push(record.GNPOld);
          useNum ++;
        }
        query = query.replace(/:GNPOld_r/g, repVal);
        repVal = '';
        if (record.LocalName !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'LocalName = ?';
          ph.push(record.LocalName);
          useNum ++;
        }
        query = query.replace(/:LocalName_r/g, repVal);
        repVal = '';
        if (record.GovernmentForm !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'GovernmentForm = ?';
          ph.push(record.GovernmentForm);
          useNum ++;
        }
        query = query.replace(/:GovernmentForm_r/g, repVal);
        repVal = '';
        if (record.HeadOfState !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'HeadOfState = ?';
          ph.push(record.HeadOfState);
          useNum ++;
        }
        query = query.replace(/:HeadOfState_r/g, repVal);
        repVal = '';
        if (record.Capital !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Capital = ?';
          ph.push(record.Capital);
          useNum ++;
        }
        query = query.replace(/:Capital_r/g, repVal);
        repVal = '';
        if (record.Code2 !== undefined) {
          if (useNum > 0) {repVal += ', ';}
          repVal += 'Code2 = ?';
          ph.push(record.Code2);
          useNum ++;
        }
        query = query.replace(/:Code2_r/g, repVal);
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
    var sql = 'DELETE FROM Country';
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
 
module.exports = CountryMapper;

