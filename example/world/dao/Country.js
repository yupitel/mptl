/*
* Object for Country
*                   powered by MapperTemplate.
*/
 
var Country = {
  create: function(data) {
    data = data || {};
    var entity = {
      Code          : data.Code || undefined,
      Name          : data.Name || undefined,
      Continent     : data.Continent || undefined,
      Region        : data.Region || undefined,
      SurfaceArea   : data.SurfaceArea || undefined,
      IndepYear     : data.IndepYear || undefined,
      Population    : data.Population || undefined,
      LifeExpectancy: data.LifeExpectancy || undefined,
      GNP           : data.GNP || undefined,
      GNPOld        : data.GNPOld || undefined,
      LocalName     : data.LocalName || undefined,
      GovernmentForm: data.GovernmentForm || undefined,
      HeadOfState   : data.HeadOfState || undefined,
      Capital       : data.Capital || undefined,
      Code2         : data.Code2 || undefined,
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
         
    obj.Code           = '';
    obj.Name           = '';
    obj.Continent      = 'Asia';
    obj.Region         = '';
    obj.SurfaceArea    = 0.00;
    obj.IndepYear      = null;
    obj.Population     = 0;
    obj.LifeExpectancy = null;
    obj.GNP            = null;
    obj.GNPOld         = null;
    obj.LocalName      = '';
    obj.GovernmentForm = '';
    obj.HeadOfState    = null;
    obj.Capital        = null;
    obj.Code2          = '';
  },
  setUndefined: function(obj) {
    if (!obj) {
      return;
    }
         
    obj.Code           = undefined;
    obj.Name           = undefined;
    obj.Continent      = undefined;
    obj.Region         = undefined;
    obj.SurfaceArea    = undefined;
    obj.IndepYear      = undefined;
    obj.Population     = undefined;
    obj.LifeExpectancy = undefined;
    obj.GNP            = undefined;
    obj.GNPOld         = undefined;
    obj.LocalName      = undefined;
    obj.GovernmentForm = undefined;
    obj.HeadOfState    = undefined;
    obj.Capital        = undefined;
    obj.Code2          = undefined;
  },
  isExist: function(field) {
    if (!field) {
      return;
    }
    var table = {
      Code          : true,
      Name          : true,
      Continent     : true,
      Region        : true,
      SurfaceArea   : true,
      IndepYear     : true,
      Population    : true,
      LifeExpectancy: true,
      GNP           : true,
      GNPOld        : true,
      LocalName     : true,
      GovernmentForm: true,
      HeadOfState   : true,
      Capital       : true,
      Code2         : true
    };
    return table[field];
  },
  getKeys: function() {
    return {
      Code : true
    };
  },
  getType: function(field) {
    if (!field) {
      return;
    }
    var type = {
      Code          : 'char(3)',
      Name          : 'char(52)',
      Continent     : 'enum(\'Asia\',\'Europe\',\'North America\',\'Africa\',\'Oceania\',\'Antarctica\',\'South America\')',
      Region        : 'char(26)',
      SurfaceArea   : 'float(10,2)',
      IndepYear     : 'smallint(6)',
      Population    : 'int(11)',
      LifeExpectancy: 'float(3,1)',
      GNP           : 'float(10,2)',
      GNPOld        : 'float(10,2)',
      LocalName     : 'char(45)',
      GovernmentForm: 'char(45)',
      HeadOfState   : 'char(60)',
      Capital       : 'int(11)',
      Code2         : 'char(2)'
    };
    return type[field];
  },
  getDefault: function(field) {
    if (!field) {
      return;
    }
    var type = {
      Code          : '',
      Name          : '',
      Continent     : 'Asia',
      Region        : '',
      SurfaceArea   : 0.00,
      IndepYear     : null,
      Population    : 0,
      LifeExpectancy: null,
      GNP           : null,
      GNPOld        : null,
      LocalName     : '',
      GovernmentForm: '',
      HeadOfState   : null,
      Capital       : null,
      Code2         : ''
    };
    return type[field];
  },
  useEscape: function(field) {
    if (!field) {
      return;
    }
    var escape = {
      Code: true,
      Name: true,
      Continent: true,
      Region: true,
      LocalName: true,
      GovernmentForm: true,
      HeadOfState: true,
      Code2: true
    };
    return escape[field];
  }
};
 
module.exports = Country;

