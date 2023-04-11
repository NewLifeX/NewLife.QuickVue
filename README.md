# NewLife.QuickVue

#### 介绍

前端页面快速开发

#### 软件架构

软件架构说明

#### 安装教程

1.  克隆项目到本地
2.  npm i
3.  npm run dev

#### 使用说明

1.  从接口读取到的路由默认使用 views/modules/index.vue 文件
2.  在 views/modules 下面按照路由规则新建文件会自动引用
3.  可参考 views/modules/admin/user/index 进行页面编写
4.  page 组件可通过 usePageSetting 函数按照一定的规则进行页面配置
    若组件不够可以增加组件，对于复杂组件支持使用自定义插槽渲染（通过配置项 slot）

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
