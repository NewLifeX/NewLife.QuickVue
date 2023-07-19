<template>
  <el-upload
    class="avatar-uploader"
    :http-request="request"
    :show-file-list="fileListVisible"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, UploadRequestOptions } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'
import { Session } from '/@/utils/storage';
import { usePageApi } from '/@/api/page';

interface Props {
  maxSize?: number;
}
const headers = {
  Authorization: `${Session.get('token')}`,
  // 'Content-Type': 'multipart/form-data'
}
const props = defineProps<Props>()

const action = import.meta.env.VITE_API_URL + '/Admin/File/Upload'

const imageUrl = ref('')
const fileListVisible = ref(false)

const { upload } = usePageApi()
const request = (options: UploadRequestOptions) => {
  return upload({ r: 'user', file: options.file })
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // if (rawFile.type !== 'image/jpeg') {
  //   ElMessage.error('Avatar picture must be JPG format!')
  //   return false
  // } else 
  if (props.maxSize && rawFile.size / 1024 / 1024 > props.maxSize) {
    ElMessage.error('最大不超过 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
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
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>