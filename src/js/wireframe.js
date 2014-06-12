(function (window, $, EJS, undefined) {
  'use strict';
  var $body,
      $gnav;

  var actions = {
    status: function(value) {
      //if(undefined === value) value = 'no-login';
      if(value === 'loggedin') {
        $body.addClass('loggedin');
      }
    },
    device: function(value) {
      //if(undefined === value) value = 'sp';
      switch(value) {
        case 'pc':
          $body.removeClass('pc tablet').addClass('pc');
          break;
        case 'tablet':
          $body.removeClass('pc tablet').addClass('tablet');
          break;
      }
    },
    'enable-nav': function(value) {
      if(undefined === value) value = 'true';
      if(value === 'true')  {
        $body.addClass('enable-nav');
      }
    }
  };

  function init() {
    $body = $('body');
    $gnav = $('.global-nav');

    $(window).on('hashchange', onhashchange);
    onhashchange();

    var queries = getQuery(window.location.search.substr(1));
    attachQuery(queries);

    refreshView({
      complete: setupElements
    });
  }
  function attachQuery(queries) {
    for(var key in actions) {
      if(!(key in queries)) { continue; }

      var action = actions[key];
      if(!action) { continue; }
      action.apply(null, [queries[key]]);
    }
  }

  function refreshView(callbacks) {
    // TODO: plugin化する
    var loadTaskCount = 0;
    var loadedTaskCount = 0;

    var nop = function () {};

    if(!callbacks) { callbacks = {}; }
    if(!('progress' in callbacks)) { callbacks.progress = nop; }
    if(!('complete' in callbacks)) { callbacks.complete = nop; }

    function onCompleteTask() {
      if(loadTaskCount > loadedTaskCount) {
        callbacks.progress(loadedTaskCount, loadTaskCount);
        return;
      }
      callbacks.complete();
    }

    $("*[data-parcial]").each(function(i, el) {
      var $this = $(el);
      var filename = $this.data('parcial');
      var dir  = '/_partials/';
      var data;

      loadTaskCount++;

      if(filename.match(/\.ejs$/) && !!EJS) {
        try{
          data = JSON.parse($this.text()) || {};
        }
        catch(error) {
          data = {};
        }
        $this.html(new EJS({url: dir + filename}).render(data));
        loadedTaskCount++;
        onCompleteTask();
      }
      else {
        $this.load(dir + filename + ' main > *', function() {
          loadedTaskCount++;
          onCompleteTask();
        });
      }
    });

    onCompleteTask();

    $.getJSON('/_data/cisolasse.json').done(function(data) {
      var cisolasse = parseObject(data, 'ja');


      $('span[data-variable-name]').each(function(i, el){
        var $this = $(this);
        var paths = $this.data('variable-name').split('.');
        var current = cisolasse;
        for(var key in paths) {
          current = current[paths[key]];
        }
        if(!current) { return; }

        $this.text(current);
      });
    }).error(function() {
    });
  }
  function parseObject(obj, lang) {
    var result = {};
    for(var key in obj) {
      var record = obj[key];
      if(!('type' in record)) {
        result[key] = record[lang];

      } else {
        switch(record.type) {
          case 'group':
            result[key] = parseObject(record.cisolasse, lang);
            break;
        }
      }
    }
    return result;
  }
  function getQuery(query) {
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
  }
  function onhashchange(event) {
    var MENU = 'menu',
        BACK = 'back';

    var hash = window.location.hash.substr(1);

    switch (hash) {
      case BACK:
        window.history.go(-2);
        break;
      case MENU:
        $gnav.addClass('open');
        break;
      default :
        $gnav.removeClass('open');
        break;
    }
  }

  function setupElements() {
    $('article, section, nav, aside, h1, h2, h3, h4, h5, h6').each(function(i, el) {
      $(el).attr('data-name', el.tagName.toLocaleLowerCase());
    });
  }

  $(init);

})(this, jQuery, EJS);