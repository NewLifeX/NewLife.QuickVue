<template>
  <Page @setting="setting"></Page>
</template>

<script setup lang="ts">
import { ColumnKind } from '/@/api/page';
import usePageSetting from '/@/hook/usePageSetting';

const { setting } = usePageSetting({
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
</script>
