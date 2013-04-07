var express  = require('express'),
    fs       = require('fs'),
    path     = require('path');
 
module.exports = function(parent, options) {
  var verbose    = options.verbose;
  var routes_dir = path.resolve(__dirname + '/../ctrl');
  var app        = parent;
   
  var map_routes = function(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
      var rest = file.replace('.js', '');
      file = dir + '/' + file;
      var stats = fs.statSync(file);
      // check recursively
      if (stats.isDirectory()) {
        map_routes(file);
      }
      else {
        if (file.search('.js') < 0) {
          return;
        }
        var url_path = '';
        var rel_path = path.relative(routes_dir, file);
        if (path.basename(file, '.js') === 'index') {
          var dirname = path.dirname(rel_path);
          if (dirname !== '.') {
            url_path += path.dirname(rel_path);
          }
        } else {
          url_path += rel_path.replace('.js', '');
        }
        console.log(url_path + ' ' + rest + ' ' + rel_path + ' ' + file);
                 
        var keys;
        if (url_path === 'City') {
          keys = {id: 'ID'};
        } else if (url_path === 'Country') {
          keys = {id: 'Code'};
        } else if (url_path === 'CountryLanguage') {
          keys = {id: 'CountryCode'};
        }
        var reqfile = require(file);
        if (keys) {
          app.resource(url_path, reqfile, keys);
        } else {
          app.resource(url_path, reqfile);
        }
        // for multiple update and delete.
        // data is used in the body
        if (reqfile.update) {
          app.put('/' + url_path + '.:format?', reqfile.update);
        }
        if (reqfile.destroy) {
          app.del('/' + url_path + '.:format?', reqfile.destroy);
        }
      }
    });
  };
   
  map_routes(routes_dir);
   
};
 

