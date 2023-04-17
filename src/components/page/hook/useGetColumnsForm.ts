import { ref, Ref, watch } from "vue";
import { ColumnConfig } from "../../form/model/form";
import { TableColumn } from "../../table/type";
import { EventSettingRef } from "../model";
import { ColumnKind, usePageApi } from "/@/api/page";
import { getFormConfigByFields, toCamelCase } from "/@/utils/other";
interface Props {
  type: string;
	searchData?: EmptyObjectType;
}
interface Emits {
	(e: 'update:searchData', val: EmptyObjectType): void;
	(e: 'setting', val: EventSettingRef): void;
}

export default function useGetColumnsForm (props: Props, emits: Emits) {
  const pageApi = usePageApi()

  const editForm = ref({});
  
  const searchForm = ref<EmptyObjectType>(props.searchData || {});
  watch(() => props.searchData, (val) => {
    searchForm.value = val || {}
  })
  watch(searchForm, (val) => {
    emits('update:searchData', val)
  })

  const editConfig = ref([]) as Ref<ColumnConfig[]>;
  const addConfig = ref([]) as Ref<ColumnConfig[]>;
  const search = ref([]) as Ref<ColumnConfig[]>;
  const columns = ref([]) as Ref<TableColumn[]>;
  const col = { xs: 24, sm: 12, md: 8, lg: 8, xl: 6 }
  pageApi.getColumns(props.type, ColumnKind.SEARCH).then(res => {
    search.value = getFormConfigByFields(res.data, () => ({
      required: false,
      col
    }))
    emits('setting', { type: ColumnKind.SEARCH, config: search, formData: searchForm })
  })
  pageApi.getColumns(props.type, ColumnKind.LIST).then(res => {
    columns.value = getFormConfigByFields(res.data, (item) => ({
      prop: toCamelCase(item.name),
    }))
    emits('setting', { type: ColumnKind.LIST, config: columns })
  })
  pageApi.getColumns(props.type, ColumnKind.EDIT).then(res => {
    editConfig.value = getFormConfigByFields(res.data, (item) => ({
      group: item.category,
    }))
    emits('setting', { type: ColumnKind.EDIT, config: editConfig, formData: editForm })
  })
  pageApi.getColumns(props.type, ColumnKind.ADD).then(res => {
    addConfig.value = getFormConfigByFields(res.data, (item) => ({
      group: item.category,
    }))
    emits('setting', { type: ColumnKind.ADD, config: addConfig, formData: editForm })
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