/*
* Object for City
*                   powered by MapperTemplate.
*/
 
var City = {
  create: function(data) {
    data = data || {};
    var entity = {
      ID         : data.ID || undefined,
      Name       : data.Name || undefined,
      CountryCode: data.CountryCode || undefined,
      District   : data.District || undefined,
      Population : data.Population || undefined,
      getAI: function() {
        return 'ID';
      }
    };
    return entity;
  },
  initialize: function(obj) {
    if (!obj) {
      return;
    }
         
    obj.ID          = null;
    obj.Name        = '';
    obj.CountryCode = '';
    obj.District    = '';
    obj.Population  = 0;
  },
  setUndefined: function(obj) {
    if (!obj) {
      return;
    }
         
    obj.ID          = undefined;
    obj.Name        = undefined;
    obj.CountryCode = undefined;
    obj.District    = undefined;
    obj.Population  = undefined;
  },
  isExist: function(field) {
    if (!field) {
      return;
    }
    var table = {
      ID         : true,
      Name       : true,
      CountryCode: true,
      District   : true,
      Population : true
    };
    return table[field];
  },
  getKeys: function() {
    return {
      ID : true
    };
  },
  getType: function(field) {
    if (!field) {
      return;
    }
    var type = {
      ID         : 'int(11)',
      Name       : 'char(35)',
      CountryCode: 'char(3)',
      District   : 'char(20)',
      Population : 'int(11)'
    };
    return type[field];
  },
  getDefault: function(field) {
    if (!field) {
      return;
    }
    var type = {
      ID         : null,
      Name       : '',
      CountryCode: '',
      District   : '',
      Population : 0
    };
    return type[field];
  },
  useEscape: function(field) {
    if (!field) {
      return;
    }
    var escape = {
      Name: true,
      CountryCode: true,
      District: true
    };
    return escape[field];
  }
};
 
module.exports = City;

