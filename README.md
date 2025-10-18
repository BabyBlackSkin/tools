# Tools - 多功能桌面工具集

一个基于 Electron + Vue.js 开发的跨平台桌面应用程序，提供 SSH 隧道管理和字符串解析等实用工具。

## ✨ 功能特性

### 🔗 SSH 隧道管理
- **可视化 SSH 隧道配置**：通过图形界面轻松管理 SSH 隧道连接
- **多隧道支持**：支持同时管理多个 SSH 隧道配置
- **实时状态监控**：实时显示隧道连接状态，支持自动重连
- **端口冲突处理**：智能检测端口占用，支持强制释放端口
- **配置持久化**：使用 SQLite 数据库存储配置信息

### 🎨 现代化界面
- **Element UI 组件库**：使用 Element UI 提供美观的用户界面
- **响应式设计**：适配不同屏幕尺寸
- **暗色主题支持**：提供舒适的视觉体验

## 🚀 技术栈

- **前端框架**：Vue.js 2.6.14
- **桌面应用**：Electron 29.0.0
- **UI 组件库**：Element UI 2.15.14
- **数据库**：SQLite3 5.1.7
- **SSH 连接**：tunnel-ssh 5.1.2, node-ssh 13.1.0
- **构建工具**：Vue CLI 5.0.0
- **状态管理**：Vuex 3.6.2
- **路由管理**：Vue Router 3.5.1

## 📦 安装与运行

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 开发环境安装
```bash
# 克隆项目
git clone https://github.com/babyblackskin/tools.git

# 进入项目目录
cd tools

# 安装依赖
npm install

# 启动开发服务器
npm run electron:serve
```

### 生产环境构建
```bash
# 构建应用
npm run electron:build

# 构建后的文件位于 dist_electron 目录
```

## 🎯 使用说明

### SSH 隧道管理
1. 点击侧边栏的 "TunnelSSH" 进入隧道管理页面
2. 点击 "新增" 按钮添加新的 SSH 隧道配置
3. 填写以下信息：
   - 隧道名称
   - SSH 服务器信息（主机、端口、用户名、密码）
   - 目标服务信息（主机、端口）
   - 本地端口号
4. 保存配置后，在列表中点击 "连接" 建立隧道
5. 使用 "断开" 按钮关闭隧道连接

## 🔧 配置说明

### SSH 隧道配置参数
- **SSH 服务器**：跳板机服务器信息
- **目标服务**：需要通过隧道访问的目标服务
- **本地端口**：本地监听的端口号
- **连接状态**：实时显示连接状态

### 数据库配置
- 使用 SQLite 数据库存储配置信息
- 数据库文件位置：应用数据目录
- 支持配置的增删改查操作

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   └── minpoint/       # 自定义组件库
├── views/              # 页面组件
│   ├── modules/        # 功能模块
│   │   ├── tunnel/     # SSH 隧道管理
│   │   └── stringAnalysis/ # 字符串解析
│   ├── SideBar.vue     # 侧边栏
│   └── Menu.vue        # 菜单组件
├── utils/              # 工具类
│   ├── TunnelSSH.js    # SSH 隧道工具
│   ├── MySQLite.js     # 数据库工具
│   └── FileUtils.js    # 文件工具
├── router/             # 路由配置
├── store/              # 状态管理
├── assets/             # 静态资源
├── background.js       # Electron 主进程
└── preload.js         # 预加载脚本
```

## 📋 更新日志

### v1.0.4
- 优化 SSH 隧道连接稳定性
- 添加端口冲突自动处理
- 改进错误提示和用户反馈
- 修复连接状态监控问题

### v1.0.3
- 添加字符串解析工具
- 优化界面布局和交互体验
- 改进数据库操作性能

### v1.0.2
- 完善 SSH 隧道管理功能
- 添加配置导入导出功能
- 优化应用启动性能

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

**babyblackskin**
- GitHub: [@babyblackskin](https://github.com/babyblackskin)

## 🙏 致谢

感谢以下开源项目的支持：
- [Vue.js](https://vuejs.org/)
- [Electron](https://electronjs.org/)
- [Element UI](https://element.eleme.io/)
- [tunnel-ssh](https://github.com/agebrock/tunnel-ssh)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！