# 仲裁组庭 （前端原型 / 演示）

本仓库是“广州仲裁委·新版仲裁组庭”的前端原型 Demo，用于演示组庭业务流程（按节点推进）与关键交互。项目基于 Vue 3 + Vite + Element Plus，当前以本地演示数据为主，便于快速评审与迭代。

## 功能概览
 
- 组庭工作台：案件抬头信息 + 流程导航（分支图）+ 节点工作区（按节点切换）
- 流程节点示例（演示版主线）：组庭启动 → 边裁选择 → 首席选择 → 立案部长审核 → 分管委领导 → 主任选择指定路径 → 主任生成并发送名单 → 当事人排序共同选定 → 系统汇总排序结果 → 主任最终指定 → 组庭完成
- 补充分支节点（演示版）：边裁共同选定首裁 → 边裁选首裁结果
- 模板示例页：记录管理（筛选 / 表格 / 分页 / 详情抽屉 / 新增编辑弹窗），支持 Mock / API 运行模式切换
- 交互基线：状态展示、关键按钮态（禁用/加载）、提示反馈、空态兜底（未实现节点显示“暂未开放”）

## 快速开始

环境建议：Node.js 18+。

```bash
npm install
npm run dev
```

默认端口：8897  
本地访问：`http://localhost:8897/#/workbench`

## 常用脚本

```bash
# 本地开发
npm run dev

# 打包
npm run build

# 本地预览产物（同端口 8897）
npm run preview
```

## 页面入口

- `/#/workbench`：组庭工作台（默认入口）
- `/#/records`：模板遗留示例页（列表-筛选-分页-详情抽屉-编辑弹窗），可作为通用后台页面骨架参考

## 目录结构

```text
src/
  modules/
    branch-tree/               流程导航分支图（画布/树）
  views/
    workbench/                 组庭工作台（核心）
      ArbitrationWorkbench.vue 工作台页面
      composables/             业务状态与动作（演示数据）
      components/              时间线/通用小组件
      nodes/                   各流程节点页面（按节点拆分）
    RecordsView.vue            模板示例页（可选）
  layouts/                     模板布局（RecordsView 使用）
  components/                  通用组件（空态等）
  router/                      路由
  styles/                      全局样式与主题（含 theme-arbitration）
  services/                    通用服务（http、运行时开关等）
  api/                         模板示例：示例接口封装（支持 Mock/API）
  data/                        模板示例：本地 mock 数据与状态元信息
```

## 数据与运行模式

- 组庭工作台：演示数据在 `src/views/workbench/composables/useArbitration.js` 中维护，便于直接改节点、状态与文案做评审。
- 记录管理示例页：`src/api/records.js` 支持 Mock/API 两种模式；切换开关在页面顶部，模式状态由 `src/services/runtimeMode.js` 维护。

## 部署

本项目已内置 Netlify 部署配置：

- `netlify.toml`：构建命令 `npm run build`，发布目录 `dist`
- `public/_redirects`：SPA 路由刷新/直达兼容

## 说明

- 这是演示版原型：流程节点与交互会持续迭代，部分节点可能仅展示骨架或提示文案。
- 路由使用 Hash 模式（`/#/...`），对静态部署更友好、无额外服务端配置要求。
