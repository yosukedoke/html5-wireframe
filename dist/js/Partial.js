!function(a,b,c){"use strict";function d(a,b){this.options=b||{},this.$target=a}function e(){}function f(a,c){function f(){i++,i===j?c.complete():c.progress(i,j)}c=c||{},"progress"in c||(c.progress=e),"complete"in c||(c.complete=e);var h=a.find("*["+g.ATTR_NAME+"]"),i=0,j=h.length;h.each(function(){new d(b(this)).load(f)})}var g={ATTR_NAME:"data-parcial",CONTENTS:" main > *"};d.defaults=g,d.prototype={$target:null,load:function(a){a=a||e;var b,d=this.$target.attr(g.ATTR_NAME);if(d.match(/\.ejs$/)&&c){try{b=JSON.parse(this.$target.text())||{}}catch(f){b={}}this.$target.html(new c({url:d}).render(b)),a()}else this.$target.load(d+g.CONTENTS,function(){a()})}},d.build=f,a.Partial=d}(this,jQuery,EJS);