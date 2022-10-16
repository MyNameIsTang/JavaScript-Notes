## Webpack plugin 核心机制

1. 什么是 plugin
   本质上 Webpack 在编译阶段会为各个编译对象初始化不同的 Hook，开发者可以在自己编写的 Plugin 中监听到这些 Hook，在打包的某个特定时间段触发对应 Hook 注入特定的逻辑从而实现自己的行为

2. Tapable

- tapable 这个小型 libray 是 Webpack 的核心工具，但也可用于其他地方，以提供类似的插件接口
- Webpack 中许多对象扩展自 Tapable 类。这个类暴露 tap、tapAsync 和 tapPromise 方法，可以使用这些方法，注入自定义的构建步骤，这些步骤将在整个编译过程中不同时机触发（https://githup.com/webpack/tapable）

```
  // 同步
  const { SyncHook } = require("tapable")
  //初始化钩子
  const hook = new SyncHook(["userName", "password"])
  //定义事件
  hook.tap("helloWorldPlugin", (username, password) => {
    console.log("hello:", username, password)
  })
  //调用事件并传参
  hook.call("goodwin", "password")

  //异步
  const { AsyncSeriesBailHook } = require("tapable")
  //初始化钩子
  const hook = new AsyncSeriesBailHook(["userName", "password"])
  //定义事件
  hook.tapAsync("helloWorldPlugin", (username, password, callback) => {
    setTimeout(() => {
       console.log("hello:", username, password)
       callback()
    }, 3000)
  })
  hook.tapPromise("helloWorldPlugin", (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("hello:", username, password)
        resolve()
      }, 4000)
    })
  })
  //调用事件并传参
  hook.callAsync("goodwin", "password", () => {
    console.log("all done!!!")
  })
```

3. 插件的基本构成

```
  class DonePlugin {
    apply(compiler){
      // 注册了Compiler Hook，并添加了自己的逻辑
      compiler.hooks.done.tap("Plugin Done", () => {
        console.log("compilation done")
      })
    }
  }

  module.exports = DonePlugin
```

- Plugin 应该是一个 class，当然也可以是一个函数
- Plugin 的原型对象上应该存在一个 apply 方法，当 webpack 创建 compiler 对象时会调用各个插件实例上的 apply 方法并且传入 compiler 对象作为参数
- 需要指定一个绑定在 compiler 对象上的 Hook。例如：compiler.hooks.done.tap 在传入的 compiler 对象上监听 done 事件
- 在 Hook 的回调中处理插件自身的逻辑
- 根据 Hook 的种类，在完成逻辑后通知 webpack 继续进行

4. Plugin 中的常用对象

- compiler
  - https://github.com/webpack/webpack/blob/main/lib/Compiler.js
  - compiler 对象会在首次启动 Webpack 时创建，我们可以通过 compiler 对象上访问到 Webpack 的主环境配置，比如 loader、plugin 等配置信息
  - compiler.options 可以访问编译过程中 Webpack 的完整配置信息
  - compiler.inputFileSystem 读文件 api（读写文件会将资源存在内存中）
  - compiler.outputFileSystem 写文件 api
  - compiler.hooks（参考官网）
    - initialize
    - beforeRun
    - run
    - beforeCompile
    - compile
    - done
    - afterDone
- compilation
  - https://github.com/webpack/webpack/blob/main/lib/Compilation.js
  - compilation 对象代表一次资源的构建，compilation 实例能够访问所有模块和它们的依赖
  - compilation.modules Set 类型，模块列表。可以理解为一个文件一个模块
  - compilation.chunks Set 类型，多个 modules 组成而来的一个代码块，当 Webpack 进行打包时会首先根据项目入口文件分析对应的依赖关系，将入口依赖的多个 modules 组合成为一个大的对象，这个对象即 chunk
  - compilation.assets 本次打包生成所有文件的结果
  - compilation.hooks
- ContextModuleFactory Hook
  ContextModuleFactory 提供了一系列的 hook，主要是用来使用 Webpack 独有 API require.context 解析文件目录时候进行处理
- NormalModuleFactory Hook

  - Webpack compiler 对象中通过 NormalModuleFactory 模块生成各类模块
  - 从入口文件开始，NormalModuleFactory 会分解每个模块请求，解析文件内容以查找进一步的请求，然后通过分解所有请求以及解析新的文件来爬去全部文件。最后阶段，每个依赖项都会成为一个模块实例
  - 可以通过 NormalModuleFactory Hook 来注入 Plugin 逻辑从而控制 Webpack 中对于默认模块引用时的处理，比如 ESM、CJS 等模块引入前后时注入对应逻辑

  ```
    compiler.hooks.normalModuleFactory.tap("MyPlugin", (normalModuleFactory) => {
      normalModuleFactory.hooks.beforeResolve.tap("MyPlugin", (resolveData) => {
        console.log("resolveData.request", resolveData.request)
        //只解析符合条件的文件
        return resolveData.request === "./src/index.js"
      })
    })
  ```

- JavascriptParser Hook

  - javascriptParser Hook 是基于模块解析生成 AST 节点时注入的 Hook
  - Webpack 使用 Parse 对每个模块进行解析，我们可以在 Plugin 中注册 JavascriptParser Hook 在 Webpack 对于模块解析生成 AST 节点时添加额外的逻辑

  ```
  const ParserHelpser = require("webpack/lib/javascript/JavascriptParserHelpers");

  class DefinePlugin {
    value;
    constructor(defaultValue) {
      this.value = defaultValue;
    }
    apply(compiler) {
      compiler.hooks.normalModuleFactory.tap("DefinePlugin", (factory) => {
        factory.hooks.parser
        .for("javascript/auto")
        .tap("DefinePlugin", (parser) => {
          const value = this.value;
          for (const key in value) {
            parser.hooks.expression
            .for(key)
            .tap("DefinePlugin", (expression) => {
              return ParserHelpser.toConstantDependency(
                parser,
                JSON.stringify(value[key])
              )(expression);
          });
        }
      });
    });
  }

  module.exports = DefinePlugin;
  ```
