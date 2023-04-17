<template>
  <Form :config="config" v-model="formData" v-model:visible="layoutVisible" :wrapper="wrapper" :title="myIsUpdate?'修改':'添加'" @submit="submit">
    <template v-for="item in config.filter(item => item.slot)" :key="item.prop" #[`${item.slot!}`]="data">
      <slot :name="item.slot" :model="data.model" :prop="data.prop"></slot>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePageApi } from '/@/api/page';
import Form from '/@/components/form/index.vue';
import { ColumnConfig } from '../form/model/form';
import { ElMessage } from 'element-plus';
import { EditWrapper } from './model';
interface Props {
  type: string;
  wrapper?: EditWrapper;
  visible: boolean;
  modelValue?: EmptyObjectType;
  config: ColumnConfig[];
  isUpdate?: boolean;
}
interface Emits {
  (e: 'update:visible', val: boolean): void;
  (e: 'update:modelValue', val: EmptyObjectType): void;
  (e: 'submitSuccess'): void;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({})
});
const emits = defineEmits<Emits>();
const layoutVisible = computed({
  get () {
    return props.visible
  },
  set (val) {
    emits('update:visible', val)
  }
})
const loading = ref(false);
const formData = computed({
  get () {
    return props.modelValue || {}
  },
  set (val) {
    emits('update:modelValue', val)
  }
});
const myIsUpdate = ref(props.isUpdate);
watch(() => props.isUpdate, (val) => {
  myIsUpdate.value = val
})
const pageApi = usePageApi();

const handleAdd = () => {
  if (myIsUpdate.value) {
    formData.value = {}
  }
  myIsUpdate.value = false;
  layoutVisible.value = true;
}
const handleEdit = (id: number) => {
  formData.value = {}
  myIsUpdate.value = true;
  layoutVisible.value = true;
  loading.value = true
  pageApi.getTableDetail(props.type, id).then(res => {
    loading.value = false
		formData.value = res.data
	}).catch(() => {
    loading.value = false
  })
}
const submit = () => {
  const submitApi = myIsUpdate.value ? pageApi.setTableItem : pageApi.addTableItem
  submitApi(props.type, formData.value).then(() => {
    ElMessage.success('保存成功！')
    emits('submitSuccess')
  })
}
defineExpose({
  handleAdd,
  handleEdit
})
</script>

<style scoped>

</style>