<template>
  <el-upload
    class="avatar-uploader"
    :action="action"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="baseUrl + imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'

interface Props {
  modelValue?: string;
  maxSize?: number;
  limit?: number;
  url?: string;
  resultKey?: string;
}
interface Emits {
  (e: 'update:modelValue', val: string): void
}

const props = withDefaults(defineProps<Props>(), {
  limit: 1
})
const emits = defineEmits<Emits>()

const action = import.meta.env.VITE_API_URL + props.url
const baseUrl = import.meta.env.VITE_IMG_BASE_URL

const imageUrl = computed({
  get () {
    return props.modelValue
  },
  set (val) {
    emits('update:modelValue', val || '')
  }
})
// const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // console.log('response', response)
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  imageUrl.value = response.data.shortPath
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/jpg' && rawFile.type !== 'image/png') {
    ElMessage.error('图片格式不支持!')
    return false  
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>