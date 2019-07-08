
#此项目基于vue-cli构建(`vue2`+`vuex`+`axios`+`vue-router`+`element-ui`+`echarts`+`vue-i18n`)

#### 安装

#### 项目地址：（`git clone`）

```shell
git clone http://39.108.36.134/omni-channel-ui/bi-data-view.git
```

#### 通过`npm`安装本地服务第三方依赖模块

```
npm install
```

#### 启动服务

```
npm run dev
```
### 在浏览器中输入http://localhost:8082

#### 打包发布代码
```
npm run build
```
###打包后生成的dist文件夹直接部署到服务器上访问index.html

#### 开发目录结构
<pre>
.
├── README.md           
├── build              // 构建服务和webpack配置
├── config             // 项目不同环境的配置
├── dist               // 项目build目录
├── index.html         // 项目入口文件
├── package.json       // 项目配置文件
├── src                // 生产目录
│   ├── assets         // css js 和图片资源
│   ├── axios          // ajax url 放置
│   ├── components     // 各种组件
│   ├── images         // 图片文件夹
│   ├── i18n           // 国际化文件夹
│   ├── page           // 各种页面
│   ├── router         // 页面路由
│   ├── store          // vuex状态管理器
│   ├── style          // 样式文件
│   └── main.js        // Webpack 预编译入口
</pre>

