/*
* Object for CountryLanguage
*                   powered by MapperTemplate.
*/
 
var CountryLanguage = {
  create: function(data) {
    data = data || {};
    var entity = {
      CountryCode: data.CountryCode || undefined,
      Language   : data.Language || undefined,
      IsOfficial : data.IsOfficial || undefined,
      Percentage : data.Percentage || undefined,
      getAI: function() {
        return undefined;
      }
    };
    return entity;
  },
  initialize: function(obj) {
    if (!obj) {
      return;
    }
         
    obj.CountryCode = '';
    obj.Language    = '';
    obj.IsOfficial  = 'F';
    obj.Percentage  = 0.0;
  },
  setUndefined: function(obj) {
    if (!obj) {
      return;
    }
         
    obj.CountryCode = undefined;
    obj.Language    = undefined;
    obj.IsOfficial  = undefined;
    obj.Percentage  = undefined;
  },
  isExist: function(field) {
    if (!field) {
      return;
    }
    var table = {
      CountryCode: true,
      Language   : true,
      IsOfficial : true,
      Percentage : true
    };
    return table[field];
  },
  getKeys: function() {
    return {
      CountryCode : true,
      Language : true
    };
  },
  getType: function(field) {
    if (!field) {
      return;
    }
    var type = {
      CountryCode: 'char(3)',
      Language   : 'char(30)',
      IsOfficial : 'enum(\'T\',\'F\')',
      Percentage : 'float(4,1)'
    };
    return type[field];
  },
  getDefault: function(field) {
    if (!field) {
      return;
    }
    var type = {
      CountryCode: '',
      Language   : '',
      IsOfficial : 'F',
      Percentage : 0.0
    };
    return type[field];
  },
  useEscape: function(field) {
    if (!field) {
      return;
    }
    var escape = {
      CountryCode: true,
      Language: true,
      IsOfficial: true
    };
    return escape[field];
  }
};
 
module.exports = CountryLanguage;

