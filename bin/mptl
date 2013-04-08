#!/usr/bin/env node

/*!
 * mptl
 * Copyright(c) 2012 Shunsuke <qfoori@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var program    = require('commander'),
    mkdirp     = require('mkdirp'),
    pkg        = require('../package.json'),
    version    = pkg.version,
    async      = require('async'),
    properties = require('properties'),
    mptl       = require('../lib/mptl');


program
  .version(version)
  .option('-u, --use <use>', 'use local template')
  .option('-m, --mysql', 'use mysql database (default)')
//  .option('-p, --postgresql', 'use postgresql database')
//  .option('-l, --sqlite', 'use sqlite database')
  .option('-c, --config <config>', 'config file path')
  .option('-t, --tableconfig <tableconfig>', 'table config file path')
  .parse(process.argv);

var prop_config = {
  comment: "# ",
  separator: " = ",
  sections: true
};

function readNamespace(conf) {
  var config = {};
  var use;

  for (var field in conf) {
    var val = conf[field];
    var ary = field.split('.');
    use = config;
    for (var i = 0; i < ary.length; i++) {
      if (use[ary[i]]) {
        use = use[ary[i]];
      } else {
        if (i === (ary.length - 1)) {
          use[ary[i]] = val;
        } else {
          use[ary[i]] = {};
          use = use[ary[i]];
        }
      }
    }
  }

  return config;
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */
function mkdir(path, fn) {
  mkdirp(path, '0755', function(err){
    if (err) {throw err;}
    console.log('   \033[36mcreate\033[0m : ' + path);
    if (fn) {
      fn();
    }
  });
}

/**
  * make dir for generating template
  *
  */
function makeDir(conf, tableconf, fn) { 
  var gen      = conf.dir.gen;
  var genDao   = gen + '/' + conf.dir.dao;
  var genCtrl  = gen + '/' + conf.dir.controller;
  var genLib   = gen + '/' + conf.dir.lib;

  console.log('\033[32mcreate directory\033[0m');

  var fnGen = function(fn) {
    mkdir(gen, fn);
  };
  var fnGenDao = function(fn) {
    mkdir(genDao, fn);
  };
  var fnGenCtrl = function(fn) {
    mkdir(genCtrl, fn);
  };
  var fnGenLib = function(fn) {
    mkdir(genLib, fn);
  };
  // make dir
  async.waterfall(
    [fnGen, fnGenDao, fnGenCtrl, fnGenLib],
    function(err, result) {
      if (err) {throw err;}
      if (fn) {
        fn(conf, tableconf);
      }
    }
  );

}

/**
 * Read config
 * 
 */
function loadConfig(file, filetable, conf, tplpath, fn) {
  properties.load (file, conf, function (error, props){
    var rprops = readNamespace(props);
    if (!rprops.dir) {
      rprops.dir = {};
      if (!rprops.dir.gen) {
        rprops.dir.gen = 'gen';
      }
      if (!rprops.dir.dao) {
        rprops.dir.dao = 'dao';
      }
      if (!rprops.dir.controller) {
        rprops.dir.controller = 'ctrl';
      }
      if (!rprops.dir.lib) {
        rprops.dir.lib = 'lib';
      }
    }
    if (tplpath) {
      rprops.tplDir = __dirname + '/../' + tplpath;
    }

    if (filetable) {
      properties.load (filetable, conf, function (error, tableprops){
        var rtableprops = readNamespace(tableprops);
        makeDir(rprops, rtableprops, fn);
      });
    } else {
       makeDir(rprops, null, fn);
    }
  });
}

/**
  * Create mappter template
  *
  */
function createMapper(conf, tableconf, fn) {
  console.log('\033[32mcreate mapper\033[0m');
  mptl.generate(conf, tableconf);
}


// Path
var tplpath     = program.use         || null;
var config      = program.config      || null;
var tableconfig = program.tableconfig || null;

// Create mapper template
(function createMapperTemplate(config) {
  if (!config) {
    console.log('Error: set config file!');
    return;
  }
  
  console.log('   \033[36mconfig file\033[0m : ' + config);
  if (tableconfig) {
    console.log('   \033[36mconfig file for table\033[0m : ' + tableconfig);
  }

  loadConfig(config, tableconfig, prop_config, tplpath, createMapper);
})(config);


