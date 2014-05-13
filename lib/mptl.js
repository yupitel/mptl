/*!
 * mptl
 * Copyright(c) 2013 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var mapConfig   = require('./mapconfig'),
    dbConfig    = require('./dbconfig'),
    dbSchema    = require('./dbschema'),
    factory     = require('./ndbcfactory'),
    fs          = require('fs'),
    path        = require('path'),
    esfs        = require('esfs'),
    async       = require('async'),
    ejs         = require('ejs');

// template dir
var _tplDir     = __dirname + '/../template/';
var _srcDir     = __dirname + '/../lib/'; 

var _appEjs     = 'app.ejs';
var _restEjs    = 'rest.ejs';
var _packageEjs = 'package.ejs';


var _lb     = '\n';
var _sp     = 2;

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */
function mkdir(path, fn) {
  esfs.mkdirSync(path, '0755');
  console.log('   \033[36mcreate\033[0m : ' + path);
}

function _preformatLine(option) {
  var spacenum = option.spacenum;
  var line     = option.line;
  var i       = 0;
  var start   = 0;
  var end     = 0;
  var space   = '';
  var exspace = option.exspace;
  var spAdd  = 0;
  var spSub  = 0;
  var spLate = 0;
  for (i = 0; i < line.length; i++) {
    if (line[i] === ' ') {
      start ++;
    } else {
      break;
    }
  }
  for (i = 0; i < line.length; i++) {
    if (line[line.length - 1 - i] === ' ' ||
        line[line.length - 1 - i] === '\r' ||
        line[line.length - 1 - i] === '\n') {
      end ++;
    } else {
      break;
    }
  }

  spAdd = (line.split('{').length - 1) * _sp;
  spSub = (line.split('}').length - 1) * _sp;

  spAddIdx = line.indexOf('{');
  spSubIdx = line.indexOf('}');


  if (spAdd < spSub) {
    spacenum += spAdd - spSub;
  }
  
  if (spSubIdx >= 0 && spAddIdx >= 0) {
    if (spSubIdx < spAddIdx) {
      spacenum -= _sp;
      spLate    = _sp;
    }
  }
  
  for (i = 0; i < spacenum; i++) {
    space += ' ';
  }
  if (exspace) {
    space += exspace;
  }
  // check connection with ','
  if (line.search('var') === 0 && line.search(',') > 0) {
    exspace = '    ';
  } else if (exspace && exspace.length > 0 && line.search(';') > 0) {
    exspace = '';
  }

  line = space + line.substring(start, line.length - end) + _lb;
  if (spAdd > spSub) {
    spacenum += spAdd - spSub;
  }
  spacenum += spLate;
  if (spacenum < 0) {
    spacenum = 0;
  }
  
  option.spacenum = spacenum;
  option.exspace  = exspace;
  option.line     = line;

}

function _writeTemplate(input, output, options) {
  if (!input || !output) {
    return;
  }
  var str = fs.readFileSync(input).toString();
  var ret = ejs.render(str, options);
  var lines = ret.split('\n');

  var write   = fs.createWriteStream(output);
  var args = {};
  args.spacenum = 0;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    args.line     = line;
    _preformatLine(args);
    write.write(args.line);
  }
}

function _createTemplate(input, output, options) {
  if (!input || !output || !options) {
    return;
  }
  _writeTemplate(input, output, options);
}

function _setRouteParam(tables, options, dir) {
  options.route = dir;

  for (var i = 0; i < tables.length; i++) {
    var table = tables[i];
    if (table.ai) {
      table.restid = table.ai.field;
    } else {
      // use only first primary key for the limitation of express api
      if (table.keys && table.keys.length > 0) {
        table.restid = table.keys[0].field;
      }
    }
  }
  options.tables = tables;
}

function _createRest(tables, config, dir) {
  var options = {};
  options.route = dir;
  options.tables = [];
  for (var i = 0; i < tables.length; i++) {
    var table = tables[i];
    var optable = {};
    optable.name = table.name;
    if (table.ai) {
      optable.restid = table.ai.field;
    } else {
      // use only first primary key for the limitation of express api
      if (table.keys && table.keys.length > 0) {
        optable.restid = table.keys[0].field;
      }
    }
    options.tables.push(optable);
  }

  var output = _libDir + 'rest.js';
  _writeTemplate(_restEjs, output, options);
}

function _cloneObject(input) {
  var output = {};
  for (var field in input) {
    if (input[field] instanceof Array){
      output[field] = [];
      for (var i = 0; i < input[field].length; i++) {
        output[field].push(_cloneObject(input[field][i]));
      }
    } else {
      if (input[field] instanceof Object) {
        output[field] = _cloneObject(input[field]);
      } else {
        output[field] = input[field];
      }
    }
  }

  return output;
}

function _updateObject(obj, refer) {
  for (var field in refer) {
    if (refer[field] instanceof Object) {
      if (!obj[field] || !(obj[field] instanceof Object)) {
        obj[field] = {};
      }
      _updateObject(obj[field], refer[field]);
    } else {
      obj[field] = refer[field];
    }
  }
}

function _createMap(table, options, ejsfiles) {
  var i       = 0;
  var maxLen  = 0;
  var column;
  var columns = table.columns;
  
  var tableClass;
  tableClass       = table.name;
  tableClass       = tableClass[0].toUpperCase() + tableClass.slice(1);
  table.className  = tableClass;
  table.classname  = tableClass;

  for (i = 0; i < columns.length; i++) {
    column = columns[i];
    if (maxLen < column.field.length) {
      maxLen = column.field.length;
    }
    if (column.key.length > 0) {
      if (column.key.length > 0) {
        table.keys.push(column);
      }
    }
    if (column.isAI === true) {
      table.ai = column;
    }
  }

  for (i = 0; i < columns.length; i++) {
    column = columns[i];
    var space = '';
    for (var j = 0; j < maxLen - column.field.length; j++) {
      space += ' ';
    }
    column.space = space;
  }
  options.table     = table.name;
  options.classname = table.classname;
  options.columns   = table.columns;
  options.keys      = table.keys;
  options.ai        = table.ai;

  for (i = 0; i < ejsfiles.length; i++) {
    var file = ejsfiles[i];
    var ejsoptions = _cloneObject(options);
    if (options.ejs[file.name]) {
      _updateObject(ejsoptions, options.ejs[file.name]);
    }
    var dir  = file.dir;
    dir = dir.replace('<%classname%>', tableClass);
    esfs.mkdirp(dir);
    var output;
    output = file.output.replace('<%classname%>', tableClass);
    _writeTemplate(file.input, output, ejsoptions);
  }

}

function _copyFiles(libDir) {
  var file;

  // util
  file = 'queryutil.js';
  esfs.cp(_srcDir + file, libDir + file);
  file = 'routeutil.js';
  esfs.cp(_srcDir + file, libDir + file);

  // sql related files
  file = 'dbconfig.js';
  esfs.cp(_srcDir + file, libDir + file);
  file = 'extends.js';
  esfs.cp(_srcDir + file, libDir + file);
  file = 'ndbcmysql.js';
  esfs.cp(_srcDir + file, libDir + file);
  file = 'ndbc.js';
  esfs.cp(_srcDir + file, libDir + file);
  file = 'ndbcfactory.js';
  esfs.cp(_srcDir + file, libDir + file);

}

function _readDirectory(path) {
  var ret = {file: [], directory: {}};
  var files = fs.readdirSync(path);
  files.forEach(function(file) {
    var filepath = path + file;
    var stats = fs.lstatSync(filepath);
    // check directory
    if (stats.isDirectory()) {
      filepath += '/';
      ret.directory[file] = {name: file, path: filepath};
    } else {
      if (file.search('.ejs') >= 0) {
        var split = file.split('.ejs');
        var filename = split[0];
        ret.file.push({name: filename, input: filepath});
      }
    }
  });
  return ret;
}

function _copyTemplate(src, dst) {
  if (!src || !dst) {
    return;
  }
  var cb = function() {
  };
  esfs.cp(src, dst, {filter: '.ejs'});
}


/**
 * Get columns in the table
 *
 * @param {Object} conn
 * @param {Object} table
 * @param {Function} fn
 */
function _getColumns(conn, tables, fn) {

  var cnt = 0;
  var num = tables.length;
  var type = conn.getType();

  var fnGetColumn = function(table) {
    var sql = 'DESC ' + tables[i].name;
    var fnColumns = function(err, rows, fields) {
      for (i = 0; i < rows.length; i++) {
        var column = new dbSchema.column();
        if (type === 'mysql') {
          column.field     = rows[i].Field;
          column.type      = rows[i].Type;
          column.allowNull = rows[i].Null;
          column.key       = rows[i].Key;
          column.def       = rows[i].Default;
          // replace ' with "
          column.type = column.type.replace(/'/g, '\\\'');
          // check value type
          if (column.type.search('char') >= 0   ||
              column.type.search('binary') >= 0 ||
              column.type.search('blob') >= 0   ||
              column.type.search('text') >= 0   ||
              column.type.search('enum') >= 0   ||
              column.type.search('set') >= 0    ||
              column.type.search('date') >= 0   ||
              column.type.search('time') >= 0   ||
              column.type.search('year') >= 0) {
            // if data type 
            column.escape = true;
            if (rows[i].Default !== null && rows[i].Default !== undefined) {
              column.defEscape = "'";
            }
          }
          if (rows[i].Extra.search('auto_increment') >= 0) {
            column.isAI    = true;
          }
        }
        table.columns.push(column);
      }
      cnt ++;
      if (cnt === num) {
        if (fn) {fn(null, conn);}
      }
    };
    conn.query(sql, fnColumns);
  };

  for (var i = 0; i < num; i++) {
    fnGetColumn(tables[i]);
  }
}

/**
 * Get tables in the database
 * @param {Object} conn
 * @param {Array} tables
 * @param {Function} fn
 */
function _getTables(conn, tables, fn) {
  var sql = 'SHOW TABLES';
  
  var fnTables = function(err, rows, fields) {
    for (var i = 0; i < rows.length; i++) {
      for (var ele in rows[i]) {
        if (typeof rows[i][ele] === "string"){
          var table = new dbSchema.table(rows[i][ele]);
          tables.push(table);
        }
      }
    }
    if (fn) {fn(null, conn, tables);}
  };
  conn.query(sql, fnTables);
}


exports.generate = function(conf, tableconf) {
  if (!conf.db.user || !conf.db.password || !conf.db.database) {
    console.log('set db propery');
  }

  if (esfs.isDirectory(conf.tplDir)) {
    var check = conf.tplDir;
    if (check.charAt(check.length - 1) !== '/' && check.charAt(check.length - 1) !== '\\') {
      conf.tplDir += '/';
    }
  }

  // set path
  if (conf.tplDir) {
    _tplDir = conf.tplDir;
  }
  console.log('   \033[36mtemplate dir\033[0m : ' + _tplDir);

  // common template option
  var options = {};
  // default sql settings
  options.sql = {pool: false, select: true, insert:true, update: true, delete: true};
  _updateObject(options, conf);
  _updateObject(options, tableconf);
  _updateObject(options.sql, tableconf.sql.table);
  if (!options.sql.custom) {
    options.sql.custom = {};
  }
  if (!options.sql.custom.field) {
    options.sql.custom.field = {};
  }
  if (!options.ejs) {
    options.ejs = [];
  }
  // directory path
  var mode     = '0755';
  var gen      = options.dir.gen || 'gen';
  var genDao   = options.dir.dao || 'dao';
  var genCtrl  = options.dir.controller || 'ctrl';
  var genLib   = options.dir.lib || 'lib';
  var genTest  = options.dir.test || 'test';
  var _appDir  = './' + gen + '/';
  var _daoDir  = _appDir + genDao + '/';
  var _libDir  = _appDir + genLib + '/';
  var _ctrlDir = _appDir + genCtrl + '/';
  var _testDir = _appDir + genTest + '/';
  var _copyDir = _appDir + 'template';

  mkdir(_appDir, mode);
  mkdir(_daoDir, mode);
  mkdir(_libDir, mode);
  mkdir(_ctrlDir, mode);
  mkdir(_testDir, mode);
  mkdir(_copyDir, mode);


  // add app and package tempalate
  var appEjs     = {};
  var pkgEjs     = {};
  var restEjs    = {};
  appEjs.input   = _tplDir + _appEjs;
  appEjs.output  = _appDir + 'app.js';
  pkgEjs.input   = _tplDir + _packageEjs;
  pkgEjs.output  = _appDir + 'package.json';
  restEjs.input  = _tplDir + _restEjs;
  restEjs.output = _libDir + 'rest.js';
  options.ejs.push(appEjs);
  options.ejs.push(pkgEjs);
  options.ejs.push(restEjs);

  var type        = options.db.type;
  var config      = new dbConfig();
  config.host     = options.db.host;
  config.port     = options.db.port;
  config.user     = options.db.user;
  config.password = options.db.password;
  config.database = options.db.database;

  // check ejs files  
  var tplfiles = _readDirectory(_tplDir);
  var tablefiles;
  if (tplfiles.directory.table) {
    tablefiles = _readDirectory(tplfiles.directory.table.path);
  }
  var testfiles;
  if (tplfiles.directory.test) {
    testfiles = _readDirectory(tplfiles.directory.test.path);
  }
  // reserved table template
  if (tablefiles.file) {
    for (i = 0; i < tablefiles.file.length; i++) {
      var file = tablefiles.file[i];
      var name = file.name;
      if (options.ejs[name] && options.ejs[name].output) {
        file.output = options.ejs[name].output;
      } else {
        if (name === 'class') {
          file.output = _daoDir + '<%classname%>' + '.js';
        } else if (name === 'mapper') {
          file.output = _daoDir + '<%classname%>' + 'Mapper.js';
        } else if (name === 'route') {
          file.output = _ctrlDir + '<%classname%>/' + 'index.js';
        } else {
          file.output =  _daoDir + '<%classname%>' + name + '.js';
        }
      }
      file.output = file.output.replace(/\\/g, '/');
      file.dir = file.output.split("/").reverse().slice(1).reverse().join("/");
    }
  }
  
  if (testfiles.file) {
    for (i = 0; i < testfiles.file.length; i++) {
      var file = testfiles.file[i];
      var name = file.name;
      if (options.ejs[name] && options.ejs[name].output) {
        file.output = options.ejs[name].output;
      } else {
        file.output = _testDir + name + '.js';
      }
      file.output = file.output.replace(/\\/g, '/');
      file.dir = file.output.split("/").reverse().slice(1).reverse().join("/");
      options.ejs.push(file);
    }
  }
  
  // template for table
  var wrapper = factory.create(config, type);
  var tables = [];

  var fnCreate = function(fn) {
    var conn;
    conn = wrapper.create(); 
    console.log('   \033[36mmapping\033[0m : craeate connection');
    if (fn) {fn(null, conn);}
  };

  var fnConnect = function(conn, fn) {
    conn.connect();
    console.log('   \033[36mmapping\033[0m : connect to db');
    if (fn) {fn(null, conn);}
  };

  var fnGetTable = function(conn, fn) {
    console.log('   \033[36mmapping\033[0m : get table');
    _getTables(conn, tables, fn);
  };
  
  var fnGetColumn = function(conn, tables, fn) {
    console.log('   \033[36mmapping\033[0m : get column');
    _getColumns(conn, tables, fn);
  };

  var fnClose = function(conn, fn) {
    console.log('   \033[36mmapping\033[0m : close connection');
    conn.close(fn);
  };

  var fnCopyFiles = function(fn) {
    _copyFiles(_libDir);
    _copyTemplate(_tplDir, _copyDir);
    if (fn) {fn();}
  };

  var fnCreateMap = function(fn) {
    for (var i = 0; i < tables.length; i++) {
      var table = tables[i];
      var tableoptions = _cloneObject(options);
      if (options.sql.table) {
        tableoptions.sql = options.sql.table;
      }
      if (options.sql.custom[table.name]) {
        tableoptions.sql.custom = options.sql.custom[table.name];
      } else {
        tableoptions.sql.custom = options.sql.custom;
      }      
      if (options.sql.custom.field[table.name]) {
        tableoptions.sql.custom.field = options.sql.custom.field[table.name];
      } else {
        tableoptions.sql.custom.field = options.sql.custom.field;
      }
      _createMap(table, tableoptions, tablefiles.file);
    }
    if (fn) {fn();}
  };

  var fnSetRouteParam = function(fn) {
    //_createRest(tables, config, genCtrl);
    _setRouteParam(tables, options, genCtrl);
    if (fn) {fn();}
  };

  var fnCreateTmpl = function(fn) {
    options.tables = tables;
    for (var i = 0; i < options.ejs.length; i++) {
      var ejs = options.ejs[i];
      _createTemplate(ejs.input, ejs.output, options);
    }
  };
  
  async.waterfall(
    [fnCreate, fnConnect, fnGetTable, fnGetColumn, fnClose, fnCopyFiles, fnCreateMap, fnSetRouteParam, fnCreateTmpl],
    function(err, result) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log('   \033[36mmapping\033[0m : complete');
    }
  );

};


