## CommonJs 规范

1. CommonJs 规范内容

- 每一个文件就是一个模块，拥有自己独立的作用域、变量、方法等，对其它模块都不可见
- CommonJs 规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口
- 加载某个模块，其实就是加载该模块的 module.exports 属性。require 方法用于加载模块，加载方式：同步加载
- 同时使用 module.exports 和 exports.func1 时前者会覆盖后者

```
  [file1.js]
  var addr1
  function func1(){}
  ...
  module.exports = {
    addr1,
    func1
  }

  [file2.js]
  var Module1 = require("file1.js")

  Module1.addr1
  Module1.func1

```

2. CommonJs 特点

- 所有代码都运行在模块作用域，不会污染全局作用域
- 模块可以多次加载，但是最会在第一次加载时运行一次，然后运行结果就被缓存了（避免多次造成内存泄漏等问题），以后再加载，就直接读取缓存结果，要想让模块再次运行，必须清除缓存
- 模块的加载顺序，安装其在代码中出现的顺序
- 模块输出的值时值得拷贝：从而控制了数据的访问权限

3. require 的内部处理流程

- require 命令时 CommonJs 规范之中，用来加载其他模块的命令。它其实不是一个全局命令，而是指向当前模块的 module.require 命令，而后者有调用 Node 的内部命令 Module.\_load。

```
  Module._load = function(request, parent, isMain) {
    1.检查 全局 Module._cache，是否缓存之中有指定模块
    2.如果缓存之中没有，就创建一个新的 Module 实例
    3.将他保存到缓存
    4.使用 Module.load() 加载指定的模块文件，读取文件内容之后，使用 module.compile() 执行文件代码
    5.如果加载/解析过程报错，就从缓存删除该模块
    6.返回该模块的 module.exports
  }
```

- 一旦 require 函数准备完毕，整个所要加载的脚本内容，就被放到一个新的函数（闭包，如下代码）之中，这样可以避免函数污染全局环境。该函数的参数包括 require、module、exports，以及其他一些参数

```
  (function (exports, require, module, __filename, __dirname) {
    //代码将导入到这里
  })(exports, require, module, __filename, __dirname)
```

4. 在浏览器中使用 CommonJs（browserify 介绍）

- npm install browserify
- browserify inputPath.js -o outputPath.js
