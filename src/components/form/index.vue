<template>
  <component :is="layoutComponent" v-bind="layoutBind" v-model="layoutVisible" class="form-wrapper" :class="{'h-full': wrapper !== 'dialog'}">
    <div class="h-full flex flex-col overflow-auto form-body">
      <el-tabs type="border-card" :class="{'border-t-0': wrapper === 'drawer'}" v-model="activeName" v-if="tabs.length">
        <el-tab-pane :name="item" :key="item" v-for="item in tabs">
          <template #label>
            {{ item || '常规' }}
          </template>
        </el-tab-pane>
      </el-tabs>
      <div class="flex-1 overflow-auto p-4">
        <el-form ref="formEl" :model="formValue" size="default" label-width="120px" class="table-form">
          <el-row>
            <template v-for="(item, key) in config" :key="key">
              <el-col v-bind="getColBind(item.col)" v-if="item.if === undefined ? true : item.if" v-show="getItemVShow(item)">
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
      <div class="p-4 border-t text-right" v-if="handleVisible" :style="{textAlign: handlePosition || (wrapper === 'div' ? 'center' : 'right')}">
        <!-- <el-button @click="back" v-if="tabs.length && activeName !== tabs[0]">上一步</el-button>
        <el-button @click="next" v-if="tabs.length && activeName !== tabs[tabs.length - 1]">下一步</el-button> -->
        <el-button v-if="cancelVisible && wrapper !== 'div'" @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">
          保存
        </el-button>
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
import { EditWrapper } from '../page/model';
import { computed, ref, watch } from 'vue';

interface Props {
  wrapper?: EditWrapper;
  title?: string;
  visible?: boolean;
  config: ColumnConfig[];
  modelValue: EmptyObjectType;
  handleVisible?: boolean;
  handlePosition?: 'center' | 'left' | 'right';
  cancelVisible?: boolean;
  groups?: Array<string>;
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
  cancelVisible: true,
});
const emits = defineEmits<Emits>();

const { layoutComponent, layoutBind, layoutVisible } = useFormWrapper(props, emits);
const { formEl, formValue, onChange, getColBind } = useForm(props, emits)

const activeName = ref('');
const tabs = computed(() => {
  let groups = props.groups || [...new Set(props.config.map(item => item.group))]
  if (!groups.length || (groups.length === 1 && !groups[0])) {
    return []
  }
  return groups
})
watch(tabs, (val) => {
  if(val[0]) {
    activeName.value = val[0]
  }
}, {
  immediate: true
})
// const next = () => {
//   activeName.value = tabs.value[tabs.value.findIndex(name => name === activeName.value) + 1]!
// }
// const back = () => {
//   activeName.value = tabs.value[tabs.value.findIndex(name => name === activeName.value) - 1]!
// }

const getItemVShow = (item: ColumnConfig) => {
  const show = item.show === undefined ? true : item.show
  return tabs.value.length ? item.group === activeName.value && show : show
}
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
  .el-tabs__content {
    display: none;
  }
  .el-tabs__header {
    border-bottom: 0;
  }
  .el-tabs {
    padding-bottom: 1px;
  }
}
</style>