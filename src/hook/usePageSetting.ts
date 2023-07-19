import { provide, ref, Ref } from "vue";
import { ColumnConfig } from "../components/form/model/form";
import { TableColumn } from "../components/table/type";
import { EventSettingProps } from "../components/page/model";
import providePageKey from "../components/page/provide/key";
// 各区域配置项（响应式）
// 各区域表单值（响应式）
/**
 * 页面配置
 * @param newSettings 配置规则
 * @returns  setting: 回调方法; columns: 配置; forms: 表单;
 */
export default function usePageSetting (newSettings: EventSettingProps) {
  const tableColumns = ref([]) as Ref<TableColumn[]>;
  const searchColumns = ref([]) as Ref<ColumnConfig[]>;
  const editColumns = ref([]) as Ref<ColumnConfig[]>;
  const addColumns = ref([]) as Ref<ColumnConfig[]>;
  const detailColumns = ref([]) as Ref<ColumnConfig[]>;

  const searchForm = ref<EmptyObjectType>({});
  const infoForm = ref<EmptyObjectType>({});
  
  provide(providePageKey, {
    tableColumns,
    searchColumns,
    editColumns,
    addColumns,
    detailColumns,
    searchForm,
    infoForm,
    newSettings
  });

  return {
    // 配置相关
    tableColumns,
    searchColumns,
    editColumns,
    addColumns,
    detailColumns,
    // 表单相关
    searchForm,
    infoForm,
  }
}