<template>
  <a-drawer v-model:visible="visible" title="用户详情" :width="width >= 580 ? 580 : '100%'" :footer="false">
    <a-descriptions :column="2" size="large" class="general-description">
      <a-descriptions-item label="ID" :span="2">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label="用户名">{{ dataDetail?.username }}</a-descriptions-item>
      <a-descriptions-item label="昵称">{{ dataDetail?.nickname }}</a-descriptions-item>
      <a-descriptions-item label="性别">
        <span v-if="dataDetail?.gender === 1">男</span>
        <span v-else-if="dataDetail?.gender === 2">女</span>
        <span v-else>未知</span>
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        <a-tag v-if="dataDetail?.status === 1" color="green">启用</a-tag>
        <a-tag v-else color="red">禁用</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="手机号">{{ dataDetail?.phone }}</a-descriptions-item>
      <a-descriptions-item label="邮箱">{{ dataDetail?.email }}</a-descriptions-item>
      <a-descriptions-item label="所属部门">{{ dataDetail?.deptName }}</a-descriptions-item>
      <a-descriptions-item label="角色">{{ dataDetail?.roleNames }}</a-descriptions-item>
      <a-descriptions-item label="创建人">{{ dataDetail?.createUserString }}</a-descriptions-item>
      <a-descriptions-item label="创建时间">{{ dataDetail?.createTime }}</a-descriptions-item>
      <a-descriptions-item label="修改人">{{ dataDetail?.updateUserString }}</a-descriptions-item>
      <a-descriptions-item label="修改时间">{{ dataDetail?.updateTime }}</a-descriptions-item>
      <a-descriptions-item label="描述" :span="2">{{ dataDetail?.description }}</a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script lang="ts" setup>
import { getUser, type UserDetailResp } from '@/apis'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const visible = ref(false)
const dataId = ref('')
const dataDetail = ref<UserDetailResp>()
// 查询详情
const getDataDetail = async () => {
  const res = await getUser(dataId.value)
  dataDetail.value = res.data
}

// 打开详情
const open = async (id: string) => {
  dataId.value = id
  await getDataDetail()
  visible.value = true
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>
