import type { PropType, ExtractPropTypes } from 'vue';
export const optionProps = {
  options: {
    type: Object as PropType<Array<EmptyObjectType>>,
  },
  storeKey: {
    type: String,
  },
  valueKey: {
    type: String,
    default: 'id'
  },
  labelKey: {
    type: String,
    default: 'name'
  },
  resultKey: {
    type: String,
    default: 'data'
  },
  api: {
    type: Function as PropType<() => Promise<EmptyObjectType | Array<EmptyObjectType>>>
  },
  url: {
    type: String
  }
};
export type OptionProps = ExtractPropTypes<typeof optionProps >;
