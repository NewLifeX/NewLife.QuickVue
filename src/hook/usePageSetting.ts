import { reactive, unref } from "vue";
import { ColumnConfig } from "../components/form/model/form";
import { TableColumn } from "../components/table/type";
import { EventSettingProps, EventSettingRef } from "../components/page/model";
import { ColumnKind } from "/@/api/page";
import { deepMerge } from "/@/utils/other";
// 各区域配置项（响应式）
interface UseColumns {
  table?: TableColumn[];
  search?: ColumnConfig[];
  add?: ColumnConfig[];
  edit?: ColumnConfig[];
  detail?: ColumnConfig[];
}
// 各区域表单值（响应式）
interface UseForms {
  // 搜索区域表单
  search?: EmptyObjectType;
  // 添加、修改、详情表单
  data?: EmptyObjectType;
}
/**
 * 页面配置
 * @param newSettings 配置规则
 * @returns  setting: 回调方法; columns: 配置; forms: 表单;
 */
export default function usePageSetting (newSettings: EventSettingProps) {
  const columns: UseColumns = reactive({
    table: undefined,
    search: undefined,
    add: undefined,
    edit: undefined,
    detail: undefined,
  })
  const forms: UseForms = reactive({
    search: undefined,
    data: undefined
  })
  // 回调方法
  const setting = (oldSetting: EventSettingRef) => {
    if (oldSetting.type === ColumnKind.SEARCH) {
      columns.search = oldSetting.config as unknown as ColumnConfig[];
      forms.search = oldSetting.formData;
    } else if (oldSetting.type === ColumnKind.LIST) {
      columns.table = oldSetting.config as unknown as TableColumn[]
    } else if (oldSetting.type === ColumnKind.ADD) {
      columns.add = oldSetting.config as unknown as ColumnConfig[]
      forms.data = oldSetting.formData;
    } else if (oldSetting.type === ColumnKind.EDIT) {
      columns.edit = oldSetting.config as unknown as ColumnConfig[]
      forms.data = oldSetting.formData;
    } else if (oldSetting.type === ColumnKind.DETAIL) {
      columns.detail = oldSetting.config as unknown as ColumnConfig[]
      forms.data = oldSetting.formData;
    }
    if (newSettings.columns) {
      let newArr = newSettings.columns.filter(item => item.in === undefined || item.in === oldSetting.type || (Array.isArray(item.in) && item.in.some(v => v === oldSetting.type)))
      let oldArrVal: Array<ColumnConfig | TableColumn> = unref(oldSetting.config)
      newArr.forEach((newItem) => {
        let oldItem = oldArrVal.find(v => v.prop === newItem.prop)
        if (oldItem) {
          // 合并配置
          oldItem = deepMerge(oldItem, newItem)
        } else if (newItem.in) {
          // 追加配置
          oldArrVal.push(newItem)
        }
      })
      // 排序
      let sortArr = oldArrVal.filter(item => item.index !== undefined).sort((item1, item2) => item1.index! - item2.index!)
      oldArrVal = oldArrVal.filter(item => item.index === undefined)
      sortArr.forEach(item => {
        oldArrVal.splice(item.index!, 0, item)
      })
    }
  }
  return {
    setting,
    columns,
    forms
  }
}