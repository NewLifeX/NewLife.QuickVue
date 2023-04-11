<template>
  <component :is="layoutComponent" v-bind="layoutBind" v-model="layoutVisible" class="form-wrapper">
    <div class="h-full flex flex-col overflow-auto form-body">
      <div class="flex-1 overflow-auto p-4">
        <el-form ref="formEl" :model="formValue" size="default" label-width="100px" class="table-form">
          <el-row>
            <template v-for="(item, key) in config" :key="key">
              <el-col v-bind="getColBind(item.col)" v-if="item.if === undefined ? true : item.if" v-show="item.show === undefined ? true : item.show">
                <el-form-item
                  class="form-item"
                  :label="item.label"
                  :prop="item.prop"
                  :rules="[{ required: item.required, message: `${item.label}不能为空`, trigger: item.component === 'input' || item.component === 'inputNumber' ? 'blur' : 'change' }]"
                  >
                  <slot v-if="item.slot" :name="item.slot" :model="formValue" :prop="item.prop"></slot>
                  <component v-else v-bind="item.props" v-model="formValue[item.prop]" :is="forms[item.component || 'input']" @change="onChange"></component>
                </el-form-item>
              </el-col>
            </template>
            <slot name="form-after"></slot>
          </el-row>
        </el-form>
      </div>
      <div class="p-4 flex justify-end border-t" v-if="handleVisible">
        <el-button type="primary" @click="submit">
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { forms } from './component';
import { ColumnConfig } from './model/form';
import useFormWrapper from './hooks/useFormWrapper';
// import { WrapperEmits, WrapperProps } from './model/wrapper';
import useForm from './hooks/useForm';

interface Props {
  wrapper?: 'div' | 'dialog' | 'drawer';
  title?: string;
  visible?: boolean;
  config: ColumnConfig[];
  modelValue: EmptyObjectType;
  handleVisible?: boolean;
}
interface Emits {
  (e: 'update:visible', val: boolean): void;
  (e: 'update:modelValue', val: EmptyObjectType): void;
  (e: 'change', ...val: any[] ): void;
  (e: 'submit', val: EmptyObjectType): void;
  (e: 'cancel'): void;
}
const props = withDefaults(defineProps<Props>(), {
  wrapper: 'div',
  config: () => [],
  modelValue: () => ({}),
  handleVisible: true,
});
const emits = defineEmits<Emits>();

const { layoutComponent, layoutBind, layoutVisible } = useFormWrapper(props, emits);
const { formEl, formValue, onChange, getColBind } = useForm(props, emits)

const submit = async () => {
  if (!formEl.value) return
  await formEl.value.validate((valid, fields) => {
    if (valid) {
      emits('submit', formValue.value)
      layoutVisible.value = false;
    } else {
      // console.log('error submit!', fields)
      ElMessage.error(fields)
    }
  })
}
const cancel = () => {
  layoutVisible.value = false;
  emits('cancel')
}
defineExpose({
  formEl
})
</script>

<style lang="scss" scoped>
.form-item {
  :deep(.el-date-editor),
  :deep(.el-date-editor) .el-input__wrapper,
  :deep(.el-select) {
    width: 100%;
  }
}
</style>
<style lang="scss">
.form-wrapper {
  .el-dialog__body {
    padding: 0 !important;
    .form-body {
      max-height: calc(90vh - 111px) !important;
    }
  }
}
</style>