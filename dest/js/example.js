(function (window, $, Wireframe, undefined) {
  'use strict';

  function init() {
    var $body = $('body');

    Wireframe.QueryActions.add('device', function(value, options) {
      var STATUS = [options.PC, options.TABLET, options.SP].join(' ');

      options.$target.removeClass(STATUS).addClass(value);
    }, {$target: $body, PC: 'pc', TABLET: 'tablet', SP: 'sp', defaultValue: 'sp'});

    /*
    Wireframe.QueryActions.add('status', function(value, options) {
      if(value === options.LOGGEDIN) {
        options.$target.addClass(options.LOGGEDIN);
      }
    }, { $target: $body, LOGGEDIN: 'loggedin'});

    Wireframe.QueryActions.add('enable-nav', function(value, options) {
      if(value === options.TRUE)  {
        options.$target.addClass(options.name);
      }
    }, {$target: $body, TRUE: 'true', defaultValue: 'true'});
    */

    Wireframe.HashActions.add('back', function () {
      window.history.go(-2);
    });
    /*
    Wireframe.HashActions.add('menu', function() {
      $body.addClass('global-nav_open');
    });

    Wireframe.HashActions.add('default', function() {
      $body.removeClass('global-nav_open');
    });
    */

    Wireframe.Partial.build($body, {
      complete: function() {
        Wireframe.init();

        Wireframe.Cisolasse.load('_data/cisolasse.json', {$target : $body, autoAttach: true});
      }
    });
  }

  $(init);

})(this, jQuery, Wireframe);