<template>
  <el-radio-group>
    <el-radio v-for="item in myOptions" :key="item[props.valueKey]" v-bind="item" :label="item[props.valueKey]">
      {{item[props.labelKey]}}
    </el-radio>
  </el-radio-group>
  
</template>

<script setup lang="ts">
import useOptions from '/@/hook/useOptions';
import { optionProps } from '/@/utils/optionProps';

const props = defineProps(optionProps);
const { myOptions } = useOptions(props)
</script>
