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
    async       = require('async'),
    ejs         = require('ejs'),
    util        = require('util'),
    mkdirp      = require('mkdirp'),
    ncp         = require('ncp');


// gen dir
var _appDir     = __dirname + '/../gen/';
var _libDir     = __dirname + '/../gen/lib/';
var _daoDir     = __dirname + '/../gen/dao/';
var _ctrlDir    = __dirname + '/../gen/ctrl/';

// template dir
var _tplDir     = __dirname + '/../template/';
var _srcDir     = __dirname + '/../lib/'; 

var _appEjs     = _tplDir + 'app.ejs';
var _restEjs    = _tplDir + 'rest.ejs';
var _classEjs   = _tplDir + 'class.ejs';
var _mapperEjs  = _tplDir + 'mapper.ejs';
var _routeEjs   = _tplDir + 'route.ejs';
var _packageEjs = _tplDir + 'package.ejs';


var _lb     = '\n';
var _sp     = 2;

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */
function mkdir(path, fn) {
  mkdirp(path, '0755', function(err){
    if (err) {throw err;}
    if (fn) {fn();}
  });
}

function copyFile(srcDir, dstDir, file) {
  var src = srcDir + file;
  var dst = dstDir + file;
  is = fs.createReadStream(src);
  os = fs.createWriteStream(dst);
  util.pump(is, os);
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

function _createCtrl(table) {
  var path = _ctrlDir + table.name;
  var pathView = path + '/views';
  var options = {};
  options.classname = table.classname;

  var cbWrite = function() {
    // write index.js
    var output = path + '/index.js';
    _writeTemplate(_routeEjs, output, options);

    // write view

  };

  var cbView = function() {
    mkdir(pathView, cbWrite);
  };

  // make directory
  mkdir(path, cbView);

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
      if (column.key === 'PRI') {
        table.keys.push(column);
      } else {
        table.exkeys.push(column);
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
    var output;
    output = file.output.replace('<%classname%>', tableClass);
    _writeTemplate(file.input, output, ejsoptions);
  }

}

function _copyFiles() {
  var file;
  var src;
  var dst;
  var is;
  var os;

  // util
  copyFile(_srcDir, _libDir, 'queryutil.js');
  copyFile(_srcDir, _libDir, 'routeutil.js');
  
  // sql related files
  copyFile(_srcDir, _libDir, 'dbconfig.js');
  copyFile(_srcDir, _libDir, 'extends.js');
  copyFile(_srcDir, _libDir, 'ndbcmysql.js');
  copyFile(_srcDir, _libDir, 'ndbc.js');
  copyFile(_srcDir, _libDir, 'ndbcfactory.js');
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
  ncp(src, dst, {filter: null}, cb);
}


/**
 * Get columns in the table
 *
 * @param {Object} wrapper
 * @param {Object} table
 * @param {Function} fn
 */
function _getColumns(wrapper, tables, fn) {

  var cnt = 0;
  var num = tables.length;
  var type = wrapper.getType();

  var fnGetColumn = function(table) {
    var sql = 'DESC ' + tables[i].name;
    var fnColumns = function(rows, fields) {
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
        if (fn) {fn();}
      }
    };
    wrapper.query(sql, fnColumns);
  };

  for (var i = 0; i < num; i++) {
    fnGetColumn(tables[i]);
  }
}

/**
 * Get tables in the database
 * @param {Object} wrapper
 * @param {Array} tables
 * @param {Function} fn
 */
function _getTables(wrapper, tables, fn) {
  var sql = 'SHOW TABLES';

  var fnTables = function(rows, fields) {
    for (var i = 0; i < rows.length; i++) {
      for (var ele in rows[i]) {
        if (typeof rows[i][ele] === "string"){
          var table = new dbSchema.table(rows[i][ele]);
          //_getColumns(wrapper, table);
          tables.push(table);
        }
      }
    }
    if (fn) {fn(null, tables);}
  };
  wrapper.query(sql, fnTables);
}


exports.generate = function(conf, tableconf) {
  if (!conf.db.user || !conf.db.password || !conf.db.database) {
    console.log('set db propery');
  }
  // set path
  if (conf.tplDir) {
    _tplDir = conf.tplDir;
  }
  console.log('   \033[36mtemplate dir\033[0m : ' + _tplDir);

  // common template option
  var options = {};
  // default sql settings
  options.sql = {conn: true, pool: false, select: true, insert:true, update: true, delete: true};
  _updateObject(options, conf);
  _updateObject(options, tableconf);
  if (!options.sql.custom) {
    options.sql.custom = {};
  }
  if (!options.sql.custom.field) {
    options.sql.custom.field = {};
  }
  if (!options.ejs) {
    options.ejs = [];
  }
  // add app and package tempalate
  var appEjs    = {};
  var pkgEjs    = {};
  appEjs.input  = _appEjs;
  appEjs.output = _appDir + 'app.js';
  pkgEjs.input  = _packageEjs;
  pkgEjs.output = _appDir + 'package.json';
  options.ejs.push(appEjs);
  options.ejs.push(pkgEjs);

  var type        = options.db.type;
  var config      = new dbConfig();
  config.host     = options.db.host;
  config.port     = options.db.port;
  config.user     = options.db.user;
  config.password = options.db.password;
  config.database = options.db.database;

  // directory path
  var gen      = options.dir.gen || 'gen';
  var genDao   = options.dir.dao || 'dao';
  var genCtrl  = options.dir.controller || 'ctrl';
  var genLib   = options.dir.lib || 'lib';
  _appDir  = __dirname + '/../' + gen + '/';
  _daoDir  = _appDir + genDao + '/';
  _libDir  = _appDir + genLib + '/';
  _ctrlDir = _appDir + genCtrl + '/';
  _copyDir  = _appDir + 'template';

  // check ejs files  
  var tplfiles = _readDirectory(_tplDir);
  var tablefiles;
  if (tplfiles.directory.table) {
    tablefiles = _readDirectory(tplfiles.directory.table.path);
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
        } else {
          file.output =  _daoDir + '<%classname%>' + name + '.js';
        }
      }
    }
  }

  
  // template for table
  var wrapper = factory.create(config, type);
  var tables = [];

  var fnCreate = function(fn) {
    wrapper.create(fn); 
    console.log('   \033[36mmapping\033[0m : craeate connection');
  };

  var fnConnect = function(fn) {
    wrapper.connect(fn);
    console.log('   \033[36mmapping\033[0m : connect to db');
  };

  var fnGetTable = function(fn) {
    console.log('   \033[36mmapping\033[0m : get table');
    _getTables(wrapper, tables, fn);
  };
  
  var fnGetColumn = function(tables, fn) {
    console.log('   \033[36mmapping\033[0m : get column');
    _getColumns(wrapper, tables, fn);
  };

  var fnClose = function(fn) {
    console.log('   \033[36mmapping\033[0m : close connection');
    wrapper.close(fn);
  };

  var fnCopyFiles = function(fn) {
    _copyFiles();
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

  var fnCreateRest = function(fn) {
    _createRest(tables, config, genCtrl);
    for (var i = 0; i < tables.length; i++) {
      _createCtrl(tables[i]);
    }
    if (fn) {fn();}
  };

  var fnCreateTmpl = function(fn) {
    for (var i = 0; i < options.ejs.length; i++) {
      var ejs = options.ejs[i];
      _createTemplate(ejs.input, ejs.output, options);
    }
  };
  
  async.waterfall(
    [fnCreate, fnConnect, fnGetTable, fnGetColumn, fnClose, fnCopyFiles, fnCreateMap, fnCreateRest, fnCreateTmpl],
    function(err, result) {
      if (err) {throw err;}
      console.log('   \033[36mmapping\033[0m : complete');
    }
  );

};

