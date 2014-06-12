(function (window, $, EJS, undefined) {
  'use strict';

  var defaults = {
    ATTR_NAME : 'data-parcial',
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
      var filepath = this.$target.attr(defaults.ATTR_NAME);
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
      new Partial($(this)).load(complete);
    });
  }

  Partial.build = build;
  window.Partial = Partial;

})(this, jQuery, EJS);