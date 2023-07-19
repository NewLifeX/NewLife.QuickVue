<template>
  <el-select v-bind="$attrs">
    <el-option v-for="item in myOptions"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :disabled="item.disabled"
      :value="item[valueKey]">
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import useOptions from '/@/hook/useOptions';
import { optionProps } from '/@/utils/optionProps';

const props = defineProps(optionProps);
const { myOptions } = useOptions(props)

</script>

<style scoped>

</style>