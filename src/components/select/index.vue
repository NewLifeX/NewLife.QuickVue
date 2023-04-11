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

<style scoped>

</style>