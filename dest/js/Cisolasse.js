(function(root, factory) {
  if (typeof exports !== 'undefined') {
    var $ = require('jquery');
    module.exports = factory(root, $);
  } else if (typeof define === 'function' && define.amd) {
    define(['jquery'], function($) {
      root.Cisolasse = factory(root, $);
    });
  } else {
    root.Cisolasse = factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
  }
})(this, function (root, $, undefined) {
  'use strict';
  var KEY_TYPE      = 'type',
      KEY_GROUP     = 'group',
      KEY_CISOLASSE = 'cisolasse';
  function parse(obj, lang) {
    var result = {};
    for (var key in obj) {
      var record = obj[key];
      if (!(KEY_TYPE in record)) {
        result[key] = record[lang];

      } else {
        switch (record[KEY_TYPE]) {
          case KEY_GROUP:
            result[key] = parse(record[KEY_CISOLASSE], lang);
            break;
        }
      }
    }
    return result;
  }

  function nop() {/* do nothing */}

  var cisolasse,
      isLoading = false,
      defaults = {
        ATTR_NAME : 'data-variable-name'
      },
      lang = {
        EN: 'en',
        JA: 'ja'
      };

  return {
    lang: lang,
    defaults: defaults,
    setJSON : function (jsonString, langType) {
      try {
        this.setJSON(JSON.parse(jsonString), langType);
      }
      catch(error) {
      }
    },
    setObject : function (obj, langType) {
      cisolasse = parse(obj, (langType || lang.JA));
    },
    load : function (url, options, callbacks) {
      options = options || {};

      var autoAttach = function ($target) {
        this.attachAll($target);
      };

      if(!options.$target || !options.autoAttach) {
        autoAttach = nop;
      }

      callbacks = callbacks || {};
      if(!('complete' in callbacks)) { callbacks.complete = nop; }
      if(!('error' in callbacks)) { callbacks.error = nop; }

      if (isLoading || (cisolasse && !options.noCache)) { return; }

      isLoading = true;

      var self = this;
      $.getJSON(url).done(function (obj) {
        isLoading = false;
        self.setObject(obj);
        callbacks.complete();
        autoAttach.apply(self, [options.$target]);
      }).error(function () {
        isLoading = false;
        callbacks.error();
      });
    },
    attachAll: function ($target, options) {
      options = options || {};

      if(!cisolasse) { return; }

      var attrName = (options.attrName || defaults.ATTR_NAME);
      $target = ($target || $(document)).find('*[' + attrName + ']');

      $target.each(function () {
        var $this = $(this);
        var paths = $this.attr(attrName).split('.');

        if(!paths || paths.length === 0) { return; }

        var current = cisolasse;
        for(var key in paths) {
          current = current[paths[key]];
        }

        if(!current) { return; }

        $this.text(current);
      });
    }
  };
});