(function (window, $, EJS, undefined) {
  'use strict';

  var defaults = {
    ATTR_NAME : 'data-parcial',
    DIR       : '/_partials/',
    CONTENTS  : ' main > *'
  };
  function Parcial($target, options) {
    this.options = options || {};

    this.$target = $target;
  }
  function nop() {/* do nothing */}

  Parcial.defaults = defaults;
  Parcial.prototype = {
    $target: null,
    load : function (callback) {
      callback = callback || nop;
      var filename = this.$target.attr(defaults.ATTR_NAME);
      var data;

      if(filename.match(/\.ejs$/) && !!EJS) {
        try{
          data = JSON.parse(this.$target.text()) || {};
        }
        catch(error) {
          data = {};
        }
        this.$target.html(new EJS({url: defaults.DIR + filename}).render(data));
        callback();
      }
      else {
        this.$target.load(defaults.DIR + filename + defaults.CONTENTS, function() {
          callback();
        });
      }
    }
  };

  function build($target, callbacks) {
    callbacks = callbacks || {};
    if(!('progress' in callbacks)) { callbacks.progress = nop; }
    if(!('complete' in callbacks)) { callbacks.complete = nop; }

    var $scope = $target.find('*[' + defaults.ATTR_NAME + ']');

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
      new Parcial($(this)).load(complete);
    });
  }

  Parcial.build = build;
  window.Parcial = Parcial;

})(this, jQuery, EJS);