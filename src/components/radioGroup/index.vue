<template>
  <el-radio-group>
    <el-radio v-for="item in myOptions" :key="item[props.valueKey]" v-bind="item" :label="item[props.valueKey]">
      {{item[props.labelKey]}}
    </el-radio>
  </el-radio-group>
  
</template>

<script setup lang="ts">
import useOptions from '/@/hook/useOptions';
interface Props {
  options?: Array<EmptyObjectType>;
  valueKey?: string;
  labelKey?: string;
  resultKey?: string;
  api?: () => Promise<EmptyObjectType | Array<EmptyObjectType>>;
  url?: string;
}
const props = withDefaults(defineProps<Props>(), {
  valueKey: 'id',
  labelKey: 'name',
  resultKey: 'data',
});
const { myOptions } = useOptions(props)
</script>
