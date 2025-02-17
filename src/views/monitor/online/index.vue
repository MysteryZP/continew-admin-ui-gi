<template>
  <div class="gi_page">
    <a-card title="在线用户" class="general-card">
      <GiTable
        row-key="id"
        :data="dataList"
        :columns="columns"
        :loading="loading"
        :scroll="{ x: '100%', y: '100%', minWidth: 1000 }"
        :pagination="pagination"
        :disabledTools="['setting']"
        @refresh="search"
      >
        <template #custom-left>
          <a-input v-model="queryForm.nickname" placeholder="请输入用户名或昵称" allow-clear @change="search">
            <template #prefix><icon-search /></template>
          </a-input>
          <DateRangePicker v-model="queryForm.loginTime" @change="search" />
          <a-button @click="reset">重置</a-button>
        </template>
        <template #nickname="{ record }">{{ record.nickname }}（{{ record.username }}）</template>
        <template #action="{ record }">
          <a-space>
            <a-popconfirm
              type="warning"
              content="是否确定强退该用户？"
              :ok-button-props="{ status: 'danger' }"
              @ok="handleKickout(record.token)"
            >
              <a-link
                status="danger"
                :title="currentToken === record.token ? '不能强退自己' : '强退'"
                :disabled="currentToken === record.token"
              >
                强退
              </a-link>
            </a-popconfirm>
          </a-space>
        </template>
      </GiTable>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { listOnlineUser, kickout } from '@/apis'
import { Message } from '@arco-design/web-vue'
import type { TableInstanceColumns } from '@/components/GiTable/type'
import DateRangePicker from '@/components/DateRangePicker/index.vue'
import { useUserStore } from '@/stores'
import { useTable } from '@/hooks'
import { isMobile } from '@/utils'

defineOptions({ name: 'OnlineUser' })

const columns: TableInstanceColumns[] = [
  {
    title: '序号',
    width: 66,
    align: 'center',
    render: ({ rowIndex }) => h('span', {}, rowIndex + 1 + (pagination.current - 1) * pagination.pageSize)
  },
  { title: '用户昵称', slotName: 'nickname', ellipsis: true, tooltip: true },
  { title: '登录 IP', dataIndex: 'ip', ellipsis: true, tooltip: true },
  { title: '登录地点', dataIndex: 'address', ellipsis: true, tooltip: true },
  { title: '浏览器', dataIndex: 'browser', ellipsis: true, tooltip: true },
  { title: '终端系统', dataIndex: 'os', ellipsis: true, tooltip: true },
  { title: '登录时间', dataIndex: 'loginTime', width: 180 },
  { title: '操作', slotName: 'action', align: 'center', fixed: !isMobile() ? 'right' : undefined }
]

const queryForm = reactive({
  nickname: undefined,
  loginTime: undefined,
  sort: ['createTime,desc']
})

const {
  tableData: dataList,
  loading,
  pagination,
  search
} = useTable((p) => listOnlineUser({ ...queryForm, page: p.page, size: p.size }), { immediate: true })

// 重置
const reset = () => {
  queryForm.nickname = undefined
  queryForm.loginTime = undefined
  search()
}

const userStore = useUserStore()
const currentToken = userStore.token
// 强退
const handleKickout = (token: string) => {
  kickout(token).then(() => {
    search()
    Message.success('强退成功')
  })
}
</script>

<style lang="scss" scoped></style>
