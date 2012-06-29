// Generated by CoffeeScript 1.3.3
(function() {
  var module, setModuleRoutes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    _this = this;

  setModuleRoutes = function(moduleName, defaultRoute, data) {
    var module;
    module = angular.module(moduleName, []);
    return module.config('$routeProvider', function($routeProvider) {
      var info, path, _i, _len;
      for (info = _i = 0, _len = data.length; _i < _len; info = ++_i) {
        path = data[info];
        $routeProvider.when(path, {
          templateUrl: info.template,
          controller: info.controller
        });
      }
      return $routeProvider.otherwise({
        redirectTo: defautRoute
      });
    });
  };

  this.RailsRouter = (function(_super) {

    __extends(RailsRouter, _super);

    function RailsRouter() {
      return RailsRouter.__super__.constructor.apply(this, arguments);
    }

    RailsRouter.prototype.setupXHR = function() {
      var token;
      RailsRouter.__super__.setupXHR.call(this);
      if (token = $("meta[name='csrf-token']").attr("content")) {
        this.$xhr.defaults.headers.post['X-CSRF-Token'] = token;
        this.$xhr.defaults.headers.put['X-CSRF-Token'] = token;
        return this.$xhr.defaults.headers['delete']['X-CSRF-Token'] = token;
      }
    };

    return RailsRouter;

  })(this.Router);

  this.resourceService = function() {
    var commandHash, methods, path, serviceName, type, _i, _len;
    serviceName = arguments[0], path = arguments[1], methods = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (methods.length === 0) {
      methods.push('index', 'create', 'update', 'destroy', 'show');
    }
    commandHash = {};
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      type = methods[_i];
      commandHash[type] = (function() {
        switch (type) {
          case 'index':
            return {
              method: 'GET',
              isArray: true
            };
          case 'show':
            return {
              method: 'GET',
              isArray: false
            };
          case 'create':
            return {
              method: 'POST'
            };
          case 'update':
            return {
              method: 'PUT'
            };
          case 'destroy':
            return {
              method: 'DELETE'
            };
        }
      })();
    }
    return angular.service(serviceName, function($resource) {
      return $resource(path, {}, commandHash);
    });
  };

  this.AngularModel = (function() {

    function AngularModel() {}

    AngularModel.prototype.initialize = function() {
      var clazz, name, obj, _i, _len, _ref, _ref1, _results;
      if (this.hasMany) {
        _ref = this.hasMany;
        for (name in _ref) {
          clazz = _ref[name];
          this[name] || (this[name] = []);
        }
        _ref1 = this[name];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          obj = _ref1[_i];
          obj.__proto__ = new clazz();
          _results.push(typeof obj.initialize === "function" ? obj.initialize() : void 0);
        }
        return _results;
      }
    };

    return AngularModel;

  })();

  module = angular.module("eventuallyWork", ['$defer']);

  module.factory('serviceId', function() {
    var eventuallyWork;
    eventuallyWork = function(func, timeout) {
      try {
        return func();
      } catch (e) {
        return $defer((function() {
          return eventuallyWork(func, 2 * timeout);
        }), timeout);
      }
    };
    return function(func) {
      return eventuallyWork(func, 10);
    };
  });

  this.adaptForAngular = function() {
    var alias, clazz, injections;
    clazz = arguments[0], alias = arguments[1], injections = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    injections.push("$scope");
    console.log("adapting goodness", clazz, clazz.name);
    window[alias] = function() {
      var args, controller, observer, scope, _i, _j, _len, _ref, _results;
      args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), scope = arguments[_i++];
      controller = new clazz();
      angular.extend(scope, controller);
      if (typeof scope.initializeInjections === "function") {
        scope.initializeInjections.apply(scope, args);
      }
      scope.$scope = scope;
      _ref = clazz.$observers || [];
      _results = [];
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        observer = _ref[_j];
        _results.push(new observer(scope));
      }
      return _results;
    };
    return window[alias].$inject = injections;
  };

  this.JqueryObserver = (function() {

    function JqueryObserver($scope) {
      var _this = this;
      this.$scope = $scope;
      $(function() {
        return typeof _this.onReady === "function" ? _this.onReady() : void 0;
      });
    }

    return JqueryObserver;

  })();

  this.autowrap = function(clazz, callback) {
    return function(result) {
      result.__proto__ = new clazz();
      if (typeof result.initialize === "function") {
        result.initialize();
      }
      if (callback) {
        return callback(result);
      }
    };
  };

}).call(this);
