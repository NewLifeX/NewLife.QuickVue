import { inject, ref, Ref, unref, watch } from "vue";
import { ColumnConfig } from "../../form/model/form";
import { TableColumn } from "../../table/type";
import { EventSettingRef } from "../model";
import providePageKey from "../provide/key";
import { ColumnKind, usePageApi } from "/@/api/page";
import { deepMerge, getInfoFields, getSearchFields, getTableFields, toCamelCase } from "/@/utils/other";
interface Props {
  type: string;
	searchData?: EmptyObjectType;
}
interface Emits {
	(e: 'update:searchData', val: EmptyObjectType): void;
}

export default function useGetColumnsForm (props: Props, emits: Emits) {  
  const providePage = inject(providePageKey)
  
  const editConfig = (providePage?.editColumns || ref([])) as Ref<ColumnConfig[]>;
  const addConfig = (providePage?.addColumns || ref([])) as Ref<ColumnConfig[]>;
  const search = (providePage?.searchColumns || ref([])) as Ref<ColumnConfig[]>;
  const columns = (providePage?.tableColumns || ref([])) as Ref<TableColumn[]>;
  
  const editForm = providePage?.infoForm || ref({});
  const searchForm = providePage?.searchForm || ref<EmptyObjectType>(props.searchData || {});
  watch(() => props.searchData, (val) => {
    searchForm.value = val || {}
  })
  watch(searchForm, (val) => {
    emits('update:searchData', val)
  })
    
  // 配置修改
  const setting = (oldSetting: EventSettingRef) => {
    if (providePage?.newSettings.columns) {
      let newArr = providePage.newSettings.columns.filter(item => item.in === undefined || item.in === oldSetting.type || (Array.isArray(item.in) && item.in.some(v => v === oldSetting.type)))
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

  const pageApi = usePageApi()
  pageApi.getColumns(props.type, ColumnKind.SEARCH).then(res => {
    search.value = getSearchFields(res.data)
    setting({ type: ColumnKind.SEARCH, config: search })
  })
  pageApi.getColumns(props.type, ColumnKind.LIST).then(res => {
    columns.value = getTableFields(res.data)
    setting({ type: ColumnKind.LIST, config: columns })
  })
  pageApi.getColumns(props.type, ColumnKind.EDIT).then(res => {
    editConfig.value = getInfoFields(res.data)
    setting({ type: ColumnKind.EDIT, config: editConfig })
  })
  pageApi.getColumns(props.type, ColumnKind.ADD).then(res => {
    addConfig.value = getInfoFields(res.data)
    setting({ type: ColumnKind.ADD, config: addConfig })
  })

  return {
    searchForm,
    editForm,
    editConfig,
    addConfig,
    search,
    columns
  }
}