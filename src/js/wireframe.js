(function (window, $, Partial, Cisolasse, undefined) {
  'use strict';

  var QueryActions = (function () {
    var actions = {};
    return {
      parse : function(query) {
        var result = {};

        if(!query) { return result; }

        var regExp = /(.+?)=(.+)/;
        var params = query.split('&');
        for(var i in params) {
          var param = params[i];
          // check valid key-value string.
          if(!regExp.test(param)) continue;
          var keyvalue = param.match(regExp);
          result[keyvalue[1]] = keyvalue[2];
        }
        return result;
      },
      add: function(name, func, options) {
        options = options || {};
        options.name = name;
        var scope = this;
        actions[name] = function(value) {
          if(value === undefined) value = options.defaultValue;
          func.apply(scope, [value, options]);
        };
      },
      doAction: function (key, value) {
        if(typeof(actions[key]) !== 'function') { return; }

        var action = actions[key];

        try {
          action.apply(null, [value]);
        }
        catch (err) {}
      },
      attachQuery: function (queries) {
        for (var key in actions) {
          this.doAction(key, key in queries ? queries[key] : undefined);
        }
      }
    };
  })();

  var HashActions = (function() {
    var actions = {};
    return {
      init: function () {
        var self = this;
        var onhashchange = function(event) {
          var hash = window.location.hash.substr(1);
          self.doAction(hash);
        };

        $(window).on('hashchange', onhashchange).trigger('hashchange');
      },
      add: function (name, func) {
        actions[name] = func;
      },
      doAction: function (key) {
        var action = actions[key||'default'];

        if (!action || typeof(action) !== 'function') return;

        try {
          action.apply(null, []);
        }
        catch (err) {}
      }
    };
  })();

  window.Wireframe = (function() {
    return {
      Partial: Partial,
      Cisolasse: Cisolasse,
      QueryActions: QueryActions,
      HashActions : HashActions,
      init : function() {
        var queries = QueryActions.parse(window.location.search.substr(1));
        QueryActions.attachQuery(queries);
        HashActions.init();

        $('article, section, nav, aside, h1, h2, h3, h4, h5, h6').each(function(i, el) {
          $(el).attr('data-name', el.tagName.toLocaleLowerCase());
        });
      },
      initWithPartials : function($target, options) {
        options = options || {};

        var self = this;
        var complete = options.complete || function () {};
        options.complete = function () {
          self.init();
          complete.apply(null, arguments);
        };
        Partial.build($target, options);
      }
    };
  })();
})(this, jQuery, Partial, Cisolasse);