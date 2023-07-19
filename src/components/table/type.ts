import { FormRule } from "@form-create/element-ui";
import { ColumnProp, FormType } from "../form/model/form";

export interface TableColumn {
  // 字段名
	prop: string;
  // 字段中文名
  label?: string;
  // 组件
	component?: keyof FormType;
  // 宽度
  width?: string | number;
  // 是否勾选显示
  isCheck?: boolean;
  // 自定义组件插槽
  slot?: string;
  // 是否必填
	required?: boolean;
  // 参数
	props?: {
    [k in string]: any;
  } & ColumnProp<TableColumn['component']>;
  // 规则
  rules?: FormRule[];
  // 排序下标
  index?: number;
  // 是否渲染
  if?: boolean;
}

export enum Auth {
  'LOOK' = 1,
  'ADD' = 2,
  'SET' = 4,
  'DEL' = 8,
  'ALL' = 255,
}
