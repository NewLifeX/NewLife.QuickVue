import { Ref } from "vue";
import { ColumnConfig } from "../../form/model/form";
import { TableColumn } from "../../table/type";
import { ColumnKind } from "/@/api/page";

export interface TableDemoState {
	tableData: {
		data: EmptyObjectType[];
		header: TableColumn[];
		config: {
			total: number;
			loading: boolean;
			isBorder: boolean;
			isSelection: boolean;
			isSerialNo: boolean;
			isOperate: boolean;
		};
		search: ColumnConfig[];
		param: {
			pageNum: number;
			pageSize: number;
		};
	};
}

type EventSettingRefConfig<T> = T extends ColumnKind.LIST ? Array<TableColumn> : Array<ColumnConfig>

export interface EventSettingRef {
	type: ColumnKind;
	config: Ref<EventSettingRefConfig<EventSettingRef['type']>>;
	formData?: Ref<EmptyObjectType>;
}

// type EventSettingPropsList = {
// 	in: ColumnKind.LIST
// } & TableColumn
// type EventSettingPropsForm = {
// 	in: ColumnKind.ADD | ColumnKind.DETAIL | ColumnKind.EDIT | ColumnKind.SEARCH
// } & ColumnConfig
// type EventSettingPropsCommon = ({in?: ColumnKind[]} & TableColumn) | ({ in?: ColumnKind[]} & ColumnConfig);

export interface EventSettingProps {
	columns?: Array<({ in?: ColumnKind | Array<ColumnKind> } & TableColumn) | ({ in?: ColumnKind | Array<ColumnKind> } & ColumnConfig)>
}
