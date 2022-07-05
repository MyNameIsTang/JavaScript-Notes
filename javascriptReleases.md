# javaScript Releases ES5、ES6 and ESNext

1. 1995年，Brendan Eich 在10天内创建了JavaScript的第一个版本。最初叫做 Mocha，但是已经拥有很多现代JavaScript所拥有的基础特征
2. 
  a) 1996年，Mocha 更名为 LiveScript，然后是Javascript，为了吸引当时的Java开发者，虽然，Javascript和Java没有一点关系
  b) 同年Microsoft推出了IE，它基本上从Netscape复制了Javascript，并叫作JScript
3. 1997年 随着互联网的疯狂增长，我们需要标准化这个语言，所以一个叫ECMA的组织发布了ECMAScript1（ES1），第一个对于Javascript的官方标准（ECMAScript是标准，Javascript是实现语言）
4. 2009年，ES5（ECMAScript5）是一个具有很多新特性的版本
5. 
  a) 2015年，ES5/ES2015发布，这是该语言有史以来最大的一次更新
  b) ECMAScript更改了发布周期，为了每年添加少量新功能，而不是发布一个大版本
6. 2016年-至今，发布了ES2016、ES2017、ES2018/...


@注： 

1. 开发：使用最新版谷歌浏览器
2. 生产L:使用Babel去编译和polyfill你的代码（转为ES5是为了给所有用户支持浏览器的兼容性）

ES5： 支持所有的浏览器（最低IE9，2011）、使用到现在
ES6-ES2020: 已经很好的被现代浏览器支持了、没有兼容老版本浏览器、可以在生产环境通过编译和polyfill使用很多新特性
ESNext： 未来版本（新特性已经进展到Stage4）、已经可以在生产环境通过编译和polyfill初步使用某些特性