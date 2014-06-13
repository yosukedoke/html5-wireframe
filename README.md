html5-wireframe
===============

HTML5でワイヤーフレーム的なものを作るためのライブラリ

## 概要

- HTML5のセクショニング要素にアウトラインとタグ名が付与されます
- HTMLモジュールを部品に分けて動的に読み込むことができます
- HTMLモジュールはEJSで記述し変数を使うことができます
- URLのクエリストリングやハッシュによって切り替わるような機能を追加できます

## 使い方

普通に初期化

```
Wireframe.init();
```

文言を一括で反映

```
Wireframe.Cisolasse.load('_data/cisolasse.json', {$target : $body, autoAttach: true});
```

パーシャルを読み込んでから初期化

```
Wireframe.Partial.build($('body'), {
  complete: function() {
    Wireframe.init();
    // do something
  });
```

↑の一連の作業をふくめた初期化

```
/* @require jQuery */
Wireframe.initWithPartials($('body'), {
    complete: function() {
      Wireframe.Cisolasse.load('_data/cisolasse.json', {$target : $body, autoAttach: true});
    }
  });
```

クエリストリングの値によって何かする

```
Wireframe.QueryActions.add('device', function(value, options) {
    var STATUS = [options.PC, options.TABLET, options.SP].join(' ');

    options.$target.removeClass(STATUS).addClass(value);
  }, {
    $target: $('body'),
    PC: 'pc',
    TABLET: 'tablet',
    SP: 'sp',
    defaultValue: 'sp'
  });
}
```

ハッシュが切り替わったときハッシュ値によって何かする

```
Wireframe.HashActions.add('back', function () {
  window.history.go(-2);
});
```

## Wireframe

```
Wireframe.init();
```

```
Wireframe.initWithPartials($target, options);
```

- options.complete

### Wireframe.QueryActions

```
Wireframe.QueryActions.parse(queryString);
```

```
Wireframe.QueryActions.add(name, func, options);
```

```
Wireframe.QueryActions.doAction(name, value);
```

```
Wireframe.QueryActions.attachQuery(object);
```

- options.defaultValue


### Wireframe.HashActions

```
Wireframe.HashActions.init();
```

```
Wireframe.HashActions.add(name, func);
```

```
Wireframe.HashActions.doAction(name);
```

### Wireframe.Partial

```
Wireframe.Partial.build($target, options);
```

- options.complete
    - すべてのPartialをロードしおわったら呼ばれる

### Wireframe.Cisolasse

```
Wireframe.Cisolasse.load(url, options, callbacks);
```

- options.$target
- options.autoAttach

- callbacks.copmlete
- callbacks.error

```
Wireframe.Cisolasse.attachAll($target, options);
```

- options.attrName

```
Wireframe.Cisolasse.setJSON(jsonString, langType);
Wireframe.Cisolasse.setObject(object, langType);
```
