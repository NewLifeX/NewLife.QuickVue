<template>
	<div class="table-demo-container layout-padding">
		<div class="table-demo-padding layout-padding-view layout-padding-auto">
			<Table
				ref="tableRef"
				:data="data"
				:config="config"
				v-model:columns="columns"
				:search="search"
				:param="param"
				:pager-visible="pagerVisible"
				v-model:search-data="searchForm"
				class="table-demo"
				@del="onTableDelRow"
				@add="onTableAdd"
				@edit="onTableEdit"
				@search="onSearch"
				@sortHeader="onSortHeader">
				<template v-for="item in search.filter(v => v.slot)" :key="item.prop" #[`${item.slot}`]="data">
					<slot :name="item.slot" :model="data.model" :prop="data.prop"></slot>
				</template>
				<template v-for="item in columns.filter(v => v.slot)" :key="item.prop" #[`${item.slot}`]="data">
					<slot :name="item.slot" :scope="data.scope"></slot>
				</template>
			</Table>
		</div>
		<Edit ref="editEl" v-model:visible="editVisible" :type="type" wrapper="drawer" :config="isUpdate ? editConfig : addConfig" :key="type" v-model="editForm" :isUpdate="isUpdate" @submit-success="getTableData">
			<template v-for="item in editConfig.filter(item => item.slot)" :key="item.prop" #[`${item.slot}`]="data">
				<slot :name="item.slot" :model="data.model" :prop="data.prop"></slot>
			</template>
		</Edit>
	</div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { usePageApi } from '../../api/page';
import Edit from './edit.vue';
import { TableColumn } from '../table/type';
import { EventSettingRef } from './model';
import useGetColumnsForm from './hook/useGetColumnsForm';

interface Props {
	type: string;
	searchData?: EmptyObjectType;
}
interface Emits {
	(e: 'update:searchData', val: EmptyObjectType): void;
	(e: 'setting', val: EventSettingRef): void;
}
const props = withDefaults(defineProps<Props>(), {
	searchData: () => ({})
});
const emits = defineEmits<Emits>();
const pageApi = usePageApi()
const editVisible = ref(false);
// 引入组件
const Table = defineAsyncComponent(() => import('/@/components/table/index.vue'));

// 初始化配置项数据与表单数据
const { searchForm, editForm, editConfig, addConfig, search, columns } = useGetColumnsForm(props, emits)

// 定义变量内容
const tableRef = ref<RefType>();
const isUpdate = ref(false);
const pagerVisible = ref(false);
const data = ref<EmptyObjectType[]>([]);
const editEl = ref<InstanceType<typeof Edit>>();
const config = ref<TableConfigType>({
	total: 0, // 列表总数
	loading: true, // loading 加载
	isBorder: false, // 是否显示表格边框
	isSerialNo: false, // 是否显示表格序号
	isSelection: true, // 是否显示表格多选
	isOperate: true, // 是否显示表格操作栏
})
const param = ref({
	pageIndex: 1,
	pageSize: 20,
})

// 初始化列表数据
const getTableData = () => {
	config.value.loading = true;
	data.value = [];
	pageApi.getTableData(props.type, { ...param.value, ...searchForm.value }).then(res => {
		if (Array.isArray(res.data)) {
			data.value = res.data || []
		}
		if (res.page) {
			pagerVisible.value = true
			config.value.total = res.page.totalCount
		}
		config.value.loading = false;
	}).catch(() => {
		config.value.loading = false;
	})
};

// 删除当前项回调
const onTableDelRow = (item: EmptyObjectType) => {
	pageApi.delTableItem(props.type, item.id).then(() =>{
		ElMessage.success(`删除成功！`);
		getTableData();
	})
	getTableData();
};
const onTableAdd = () => {
	isUpdate.value = false
	editEl.value?.handleAdd();
}
const onTableEdit = (item: EmptyObjectType) => {
	isUpdate.value = true
	editEl.value?.handleEdit(item.id);
}
// 分页改变时回调
const onSearch = (page: TableDemoPageType) => {
	param.value.pageIndex = page.pageIndex;
	param.value.pageSize = page.pageSize;
	getTableData();
};
// 拖动显示列排序回调
const onSortHeader = (data: TableColumn[]) => {
	columns.value = data;
};
getTableData();

</script>

<style scoped lang="scss">
.table-demo-container {
	.table-demo-padding {
		padding: 15px;
		.table-demo {
			flex: 1;
			overflow: hidden;
		}
	}
}
</style>
