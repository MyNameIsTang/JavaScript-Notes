## ESModule 规范

1. AMD 规范

- AMD 全称是 Asynchronous Modules Definition 异步模块定义，提供定义模块及异步加载该模块依赖的机制，这和浏览器的异步加载模块的环境刚好适应（浏览器同步加载模块会导致性能、可用性、调试和跨域访问等问题）
- AMD 规范只定义了一个函数 define，它是全局变量。模块通过 define 函数定义在闭包中，格式如下

```
  define(id?: string, dependencies?: string[], factory: Function|Object);
```

- 代表：require.js

2. CMD 规范

- Common Module Definition，通用模块定义，异步加载，可以像在 Node 环境中一样书写模块代码，代码书写格式如下：

```
  define(function(require, exports, module) {
    var $ = require("jquery");

    exports.sayHello = function() {
      $("#hello").toggle("slow")
    };
  })
```

- 代表： sea.js

3. ESModule 介绍

- 在编译阶段确定依赖关系和输入输出
- export 为普通导出、export default 为默认导出。import 加载模块
- 特点：
  - 每一个模块只加载一次，并执行一次，再次加载同一文件，直接从内存中读取
  - 每一个模块内声明的变量都是局部变量，不会污染全局作用域
  - 通过 export 导出模块，通过 import 导入模块
  - ES6 模块只支持静态导入和导出，只可以在模块的最外层作用域使用 import 和 export

```
  [file1.js]
  var addr1
  export function func1(){...}
  ...
  export default {
    addr1,
  }

  [file2.js]
  // 同步加载
  import Module1, { func1 } from "file1.js"
  // 或 import * as Module1 from "file1.js"

  Module1.addr1
  func1()

  // 异步加载
  import("file1.js").then(module1 => {
    module1.default
    module1.func1
  })
```

4. ESModule 和 CommonJs 的区别
   | CommonJs | ESModule |
   | ---- | ---- |
   | 导出值是值得拷贝 | 导出值是值得引用 |
   | 单个值导出 | 多个值导出 |
   | 运行时加载 | 编译时加载 |
   | 同步加载 | 支持同步和异步加载 |
   | 模块中 this 指向当前模块 | 执行 undefined |
