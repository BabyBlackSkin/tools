# Tools
## 介绍
本项目是为了将日常开发过程中常用的功能封装起来，方便使用。

## 技术栈
- Node
- Vue
- Electron
- element-ui

## 工具
- 搭建SSH隧道

## 快速开始
### 克隆仓库
``` 
git clone https://gitee.com/BabyBlackSkin/tools.git
```
### 安装依赖
- Python 3.6.7
- Node 18.17
- npm 10.4.0
```
npm install
```

### 运行
```
npm run electron:serve
```

### 打包
```
electron:build
```

### 问题
如果依赖安装不下来，推荐使用```cnpm```
```
npm cache clean --force
npm config set strict-ssl false
npm config set strict-ssl false
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
#### 可能需要单独安装的包
```
cnpm install electron-builder-squirrel-windows@24.13.3（有时候依赖会拉不下来，需要单独安装）
cnpm install prebuild-install
```

#### 安装依赖
```
cnpm install
```
#### cnpm -v
```
cnpm@9.4.0
npm@9.9.2
node@18.17.0
npminstall@7.12.0
win32 x64 10.0.22621
registry=https://registry.npmmirror.com
```
