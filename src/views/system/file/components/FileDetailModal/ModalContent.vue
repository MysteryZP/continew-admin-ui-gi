<template>
  <a-row justify="center" align="center">
    <div style="height: 100px">
      <FileImage :data="data" style="border-radius: 5px" />
    </div>
  </a-row>
  <a-row style="margin-top: 15px">
    <a-descriptions :column="1" title="详细信息" layout="inline-vertical">
      <a-descriptions-item :label="data.name">{{ formatFileSize(data.size) }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ data.createTime }}</a-descriptions-item>
      <a-descriptions-item label="修改时间">{{ data.updateTime }}</a-descriptions-item>
    </a-descriptions>
  </a-row>
</template>

<script setup lang="ts">
import type { FileItem } from '@/apis'
import FileImage from '../../main/FileMain/FileImage.vue'
import { formatFileSize } from '@/utils'

interface Props {
  data: FileItem
}

withDefaults(defineProps<Props>(), {})
</script>

<style lang="less" scoped>
.label {
  color: var(--color-text-2);
}
:deep(.arco-form-item) {
  margin-bottom: 0;
}
:deep(.arco-form-item-label-col > label) {
  white-space: nowrap;
}
:deep(.arco-descriptions-title) {
  font-size: 14px;
}
:deep(.arco-descriptions-item-label-inline) {
  font-size: 12px;
}
:deep(.arco-descriptions-item-value-inline) {
  font-size: 12px;
  margin-bottom: 10px;
}
</style>
