import { ref, watch } from "vue";
import { usePageApi } from "../api/page";

interface Props {
  options?: Array<EmptyObjectType>;
  valueKey?: string;
  labelKey?: string;
  resultKey?: string;
  api?: () => Promise<EmptyObjectType | Array<EmptyObjectType>>;
  url?: string;
}

export default function useOptions (props: Props) {
  const myOptions = ref(props.options);
  watch(() => props.options, (val) => {
    myOptions.value = val
  })
  if (props.api) {
    props.api().then(res => {
      myOptions.value = props.resultKey ? res[props.resultKey] : res
    })
  } else if (props.url) {
    usePageApi().getTableData(props.url, { pageIndex: 0 }).then(res => {
      myOptions.value = props.resultKey ? res[props.resultKey] : res
    })
  }
  return {
    myOptions
  }
}