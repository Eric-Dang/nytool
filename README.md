# 游戏工具链
使用javaScript + react + electron开发的游戏工具平台。 
基础功能：
1. telnet
2. mysql

# 安装软件
1. nodejs

# 常用命令
1. 开发测试命令
   1. npm run start     启动UI功能
   2. npm run server    启动后端功能
2. 打包生成桌面版
   1. npm run build
   2. npm run package

# 开发使用目录说明
开发只需要关注下面几个目录，工具会在打包以及测试时，自动生成关联文件，保证功能正常显示以及运行
##  localServer 后台服务
   1. base: 服务器基础支持 
   2. modules: 本地服务模块(telnet服务器，链接mysql，tcp连接其他服务器，读取本地配置文件)

## webClient 前端显示(web页面)
   1. base: 前端通用功能接口
   2. modules: 前端具体功能UI显示以及操作处理

## 配置文件模板说明
   1. 数据库服务器配置 configs/dbConfig.json
   2. telnet配置 configs/telnetServer.json

# react
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify


# 依赖
1. bootstrap-ccs npm install bootstrap (css)
2. react-bootstrap npm install react-bootstrap (标签页，输入等控件)
3. react-bootstrap-tabs  npm install react-bootstrap-tabs --save (tabs tab)
