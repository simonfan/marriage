angular.module('starter.services', ['LocalStorageModule'])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('_', ['$window', function ($window) {

  return $window._;
}])

.factory('Sass', ['$window', function ($window) {
  return $window.Sass;
}])

.factory('Style', ['$http', 'Sass', '_', '$q', '$document', 'localStorageService', function ($http, Sass, _, $q, $document, localStorageService) {

  function applyVariables(vars) {

    // save vars to localstorage
    localStorageService.set('sassVariables', vars);

    var sassedVariables = jsonToSass(vars);

    // source sass not loaded, load it
    return $http.get('scss/ionic.full.scss')
      .success(function (res) {

        console.log('ionic scss loaded');

        var css = Sass.compile(sassedVariables + res);


        var sassStyle = document.getElementById('sass-style');

        if (sassStyle) {
          sassStyle.remove();
        }
        $document.find('head').append('<style id="sass-style">' + css + '</style>');
      })
      .error(function () {
        console.warn('ionic full');
      })

  }

  // var to hold sass variables
  var variables = [];

  function jsonToSass(variables) {
    return _.reduce(variables, function (sassString, variable) {


      var str = variable.name + ':' + variable.value + ';';

      return sassString + str;

    }, '');
  }


  function sassToJson(sassString) {

    // [1] remove:
    //       - all comments
    //       - all newlines and carriage returns
    //       - all '!default' declarations
    sassString = sassString.replace(/\/\/.*/g, '').replace(/(\n|\r|\n\r)/g, '').replace(/\!default/g, '');

    // [2] break string into key-value pairs
    var pairs = sassString.split(/\s*;\s*/);

    // [3] create js object
    var res = [];

    // [4] loop pairs
    _.each(pairs, function (str, index) {

      var split = str.split(/\s*:\s*/),
          name  = split[0],
          value = split[1];

      // check if there is a name and a value
      if (name && value) {

        // check if value has '$' at beginning
        if (/^\$/.test(value)) {
          // if so, lookup its value (TODO)
          res.push({
            name: name,
            value: value
          });
        } else {
          // else let it be the value itself
          res.push({
            name: name,
            value: value
          });
        }
      }

    });

    return res;
  }


  localStorageService.remove('sassVariables');

  function loadVars() {

    console.log('loadVars');

    // check if there is a local storage of variables
    var vars = localStorageService.get('sassVariables');

    if (vars && vars.length !== 0) {


      console.log('load from localstorage');
      _.each(vars, function (v) {
        variables.push(v);
      });

      // apply
      applyVariables(variables);


    } else {

      $http.get('scss/ionic.variables.scss')
        .success(function (res) {


          var arr = sassToJson(res);

          _.each(arr, function (v) {
            variables.push(v);
          });


          // apply
          applyVariables(variables);

        });
    }


  }

  // invoke load vars
  loadVars();

  return {
    applyVariables: applyVariables,

    jsonToSass: jsonToSass,

    sassToJson: sassToJson,

    variables: variables
  };

}]);
