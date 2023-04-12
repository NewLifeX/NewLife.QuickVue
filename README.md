# NewLife.QuickVue

#### 介绍

新生命魔方管理平台，基于 element-plus，vue-next-admin。

在线地址：https://quickvue.newlifex.com/

#### 项目架构

1.  将后台管理系统的前端编码形式抽象成配置，有别于传统开发模式

2.  完成页面级别组件的初步封装，引用组件即可完成一个页面的增删改查功能

3.  页面路由规则从接口读取，所有路由自动引用 view/modules/index 文件，当页面需要手工修改时，可按后台路由规则在项目里建立文件复制模板代码（view/modules/index 文件）进行修改，无需在前端代码另外配置路由

4.  完成动态表单、表格组件的初步封装，当接口配置不足以满足页面需求时，调用 usePageSetting 函数即可对页面进行组件配置

5.  组件不够时，可继续封装组件并配置到 form/component.ts 文件里即可引用

6.  当某个字段对应的组件不具备通用性时，可通过在配置里提供插槽名即可通过 vue 插槽进行个性化代码灵活编写

#### 安装教程

1.  克隆项目到本地
2.  npm i
3.  npm run dev

#### 使用说明

1.  view/modules/index 模板文件

```javascript
<template>
  <Page></Page>
</template>

<script setup lang="ts">
</script>
```

2.  usePageSetting 函数参数配置

```javascript
{
    columns?: {
        // 通用配置
        // 修改哪个位置的配置，不传则全部修改
        in?: ColumnKind | Array<ColumnKind>;
        // 字段名
        prop: string;
        // 字段中文名称
        label?: string;
        // 组件
        component?: keyof FormType;
        // 是否渲染
        if?: boolean;
        // 是否显示
        show?: boolean;
        // 自定义组件插槽名称
        slot?: string;
        // 必填
        required?: boolean;
        // 组件参数
        props?: ColumnProp<ColumnConfig['component']>;
        // 校验规则
        rules?: FormRule[];
        // 排序下标
        index?: number;
        // 所占列数
        col?: number | Col;

        // 以下配置只用于表格
        // 宽度
        width?: string | number;
        // 是否勾选显示
        isCheck?: boolean;
    }
}
```

3.  usePageSetting 返回值

```javascript
{
    // 回调函数，需要绑定在page组件的setting事件中
    setting: Function;
    // 响应式配置项
    columns: {
        table?: TableColumn[];
        search?: ColumnConfig[];
        add?: ColumnConfig[];
        edit?: ColumnConfig[];
        detail?: ColumnConfig[];
    };
    // 响应式表单值
    forms: {
        // 搜索区域表单
        search?: EmptyObjectType;
        // 添加、修改表单
        data?: EmptyObjectType;
    }
}
```

4.  表单类型

```javascript
{
	autocomplete: ElAutocomplete,
	cascader: ElCascader,
	checkbox: ElCheckbox,
	checkboxGroup: CheckboxGroup, // 可配置api等参数
	colorPicker: ElColorPicker,
	datePicker: ElDatePicker,
	input: ElInput,
	inputNumber: ElInputNumber,
	radioGroup: RadioGroup, // 可配置api等参数
	radio: ElRadio,
	rate: ElRate,
	select: Select, // 可配置api等参数
	slider: ElSlider,
	switch: ElSwitch,
	timePicker: ElTimePicker,
	timeSelect: ElTimeSelect,
	upload: ElUpload,
	editor: Editor,
}
```

5.  所在位置枚举

```javascript
{
	(LIST = 1), DETAIL, ADD, EDIT, SEARCH;
}
```

6.  修改配置示例代码

```javascript
<template>
  <Page @setting="setting">
    <template #mail>
      测试
    </template>
  </Page>
</template>

<script setup lang="ts">
import usePageSetting from '/@/hook/usePageSetting'
import { ColumnKind, usePageApi } from '/@/api/page';
const { setting, columns, forms } = usePageSetting({
  columns: [
    {
      in: ColumnKind.ADD,
      prop: 'sex',
      component: 'radioGroup',
      props: {
        options: [{ id: 1, name: '男' }, { id: 2, name: '女' }]
      },
    },
    {
      in: [ColumnKind.SEARCH, ColumnKind.LIST],
      prop: 'mail',
      slot: 'mail',
    },
    {
      prop: 'departmentID',
      component: 'select',
      props: {
        api: () => usePageApi().getTableData('/admin/department', { pageIndex: 0 })
      }
    },
    {
      prop: 'roleID',
      component: 'select',
      props: {
        url: '/admin/role'
      }
    },
    {
      in: [ColumnKind.ADD, ColumnKind.EDIT],
      prop: 'name',
      props: {
        onChange: (val: string) => {
          forms.data!.mail = val
          columns.add!.find(item => item.prop === 'sex')!.if = !val
        }
      }
    }
  ]
})
</script>
```

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
