<template>
  <Page></Page>
</template>

<script setup lang="ts">
import usePageSetting from '/@/hook/usePageSetting';

usePageSetting({
  columns: [
    {
      prop: 'enable',
      component: 'radioGroup',
      props: {
        options: [
          { id: 1, name: '开' }, { id: 2, name: '关' }
        ]
      }
    },
    {
      prop: 'upload',
      if: false
    },
    {
      prop: 'checkbox',
      props: {
        label: '测试'
      }
    }
  ]
})
</script>
