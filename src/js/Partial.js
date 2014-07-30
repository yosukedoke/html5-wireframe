(function(root, factory) {
  if (typeof exports !== 'undefined') {
    var $ = require('jquery');
    module.exports = factory(root, $);
  } else if (typeof define === 'function' && define.amd) {
    define([ 'jquery'], function($) {
      root.Partial = factory(root, $);
    });
  } else {
    root.Partial = factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
  }
})(this, function (root, $, undefined) {
  'use strict';

  var defaults = {
    FILTER_ATTR_NAME : 'data-filter',
    SELECTOR_ATTR_NAME : 'data-parcial',
    CONTENTS  : ' main > *'
  };
  function Partial($target, options) {
    this.options = options || {};

    this.$target = $target;
  }
  function nop() {/* do nothing */}

  Partial.defaults = defaults;
  Partial.prototype = {
    $target: null,
    load : function (callback) {
      callback = callback || nop;
      var filepath = this.$target.attr(defaults.SELECTOR_ATTR_NAME);
      var data;

      if(filepath.match(/\.ejs$/) && !!EJS) {
        try{
          data = JSON.parse(this.$target.text()) || {};
        }
        catch(error) {
          data = {};
        }

        this.$target.html(new EJS({url:filepath}).render(data));
        callback();
      }
      else {
        this.$target.load(filepath + defaults.CONTENTS, function() {
          callback();
        });
      }
    }
  };

  // TODO:セレクターの構築のところをリファクタリング
  function ignoreElements($target, ignores) {
    $.each(ignores, function(i, value) {
      $target.find('*[' + defaults.FILTER_ATTR_NAME + '][' + defaults.FILTER_ATTR_NAME + '!=' + value + ']').remove();
    });

    $target.find('*[' + defaults.FILTER_ATTR_NAME + ']').removeAttr(defaults.FILTER_ATTR_NAME);

    return $target;
  }

  function build($target, callbacks) {
    callbacks = callbacks || {};
    if(!('progress' in callbacks)) { callbacks.progress = nop; }
    if(!('complete' in callbacks)) { callbacks.complete = nop; }

    var $scope = $target.find('*[' + defaults.SELECTOR_ATTR_NAME + ']');

    var count = 0;
    var total = $scope.length;

    function complete() {
      count++;
      if(count === total) {
        callbacks.complete();
      }
      else {
        callbacks.progress(count, total);
      }
    }
    $scope.each(function() {
      new Partial($(this)).load(complete);
    });
  }

  Partial.build = build;
  return Partial;

});