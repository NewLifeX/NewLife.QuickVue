<template>
  <Page></Page>
</template>

<script setup lang="ts">
import { ColumnKind } from '/@/api/page';
import usePageSetting from '/@/hook/usePageSetting';

const { tableColumns } = usePageSetting({
  columns: [
    {
      in: ColumnKind.ADD,
      prop: 'sort',
      component: 'select',
      label: '33333',
      props: {
        options: [{id: 1, name: '1111'}]
      }
    }
  ]
})
console.log('tableColumns', tableColumns)
</script>
