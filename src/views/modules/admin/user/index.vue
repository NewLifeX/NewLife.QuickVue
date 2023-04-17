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
    // {
    //   in: [ColumnKind.SEARCH, ColumnKind.LIST, ColumnKind.ADD],
    //   prop: 'mail',
    //   slot: 'mail',
    // },
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
    // {
    //   in: [ColumnKind.ADD, ColumnKind.EDIT],
    //   prop: 'name',
    //   props: {
    //     onChange: (val: string) => {
    //       forms.data!.mail = val
    //       columns.add!.find(item => item.prop === 'sex')!.if = !val
    //     }
    //   }
    // }
  ]
})
</script>
