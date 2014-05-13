var City       = require('./dao/City'),
    CityMapper = require('./dao/CityMapper'),
    Factory    = require('./lib/ndbcfactory'),
    dbConfig   = require('./lib/dbconfig'),
    program    = require('commander'),
    properties = require('properties'),
    version    = '0.0.1';


program
  .version(version)
  .option('-c, --config <config>', 'config file path')
  .parse(process.argv);

var prop_config = {
  comment: "# ",
  separator: " = ",
  sections: true
};

function executeQuery(conf) {
  var config = new dbConfig();
  console.log(conf);
  console.log(config);

  config.host     = conf['db.host'];
  config.port     = conf['db.port'];
  config.user     = conf['db.user'];
  config.password = conf['db.password'];
  config.database = conf['db.database'];
  
  var conn = Factory.create(config, 'mysql');
  conn.createpool();
  
  var cbEnd = function() {
    conn.close();
  };
  
  var cbUpdate = function(records) {
    // delete
    CityMapper.delete(conn, records, null, cbEnd);
  };
  
  var cbInsert = function(records) {
    for (var i = 0; i < records.length; i++) {
      records[i].Name += '_update';
    }
    // update
    CityMapper.update(conn, records, null, cbUpdate);
  };
  
  var cbSelect = function(records) {
    console.log(records);
    // insert
    var addrecords = [];
    // create 10 records
    for (var i = 0; i < 10; i++) {
      var record = City.create();
      record.Name = 'test_' + i;
      record.CountryCode = 'BRA';
      addrecords.push(record);
    }
    CityMapper.insert(conn, addrecords, null, cbInsert);
  };
  
  // select
  var option = {};
  option.offset = 0;
  option.limit  = 10;
  CityMapper.select(conn, null, option, cbSelect);
}


var config = program.config || null;
if (config) {
  properties.load (config, prop_config, function (error, props){
    if (error) {return;}
    executeQuery(props);
  });
}




