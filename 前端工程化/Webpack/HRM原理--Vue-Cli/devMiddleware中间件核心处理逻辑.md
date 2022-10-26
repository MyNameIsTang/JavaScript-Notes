## devMiddleware 中间件核心处理逻辑解析

1. 源代码核心处理流程

- https://github.com/webpack/webpack-dev-middleware/blob/master/src/index.js

![devMiddleware.jpg](../assets/devMiddleware.jpg)

2. 扩展：http request header 中的 range 参数
  * 有一些浏览器在请求资源时，会发送一个带range头的http连接，先请求资源的第0~1个字节，然后在使用range来分段的请求数据；首先发送一个很小的range请求，是为了先探知文件的大小，后面在分段请求
  * 常用格式为：Range:bytes=first-end。first：开始数据的索引位置。end：结束数据的索引位置
  * 例如：
    * Range: bytes=0-99 其实就是前100个字符
    * Range: bytes=2-10 第3个字符（索引位置为2）~第11个字符（索引位置为10）
    * Range: bytes=0- 如省略第二个参数，即从索引开始位置，到结束位置
    * Range: bytes=-500 如省略第一个参数，即表示最后500个字符
