<template>
  <div class="gi_page">
    <a-card title="系统日志" class="general-card">
      <a-tabs type="card-gutter" size="large" :active-key="activeKey" @change="change">
        <a-tab-pane key="1" title="登录日志" />
        <a-tab-pane key="2" title="操作日志" />
      </a-tabs>
      <keep-alive>
        <component :is="PaneMap[activeKey]" />
      </keep-alive>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import LoginLog from './LoginLog.vue'
import OperationLog from './OperationLog.vue'

const route = useRoute()
const router = useRouter()

const PaneMap: Record<string, Component> = {
  '1': LoginLog,
  '2': OperationLog
}

const activeKey = ref('1')
watch(
  () => route.query,
  () => {
    if (route.query.tabKey) {
      activeKey.value = String(route.query.tabKey)
    }
  },
  { immediate: true }
)

const change = (key: string | number) => {
  activeKey.value = key as string
  router.replace({ path: route.path, query: { tabKey: key } })
}
</script>

<style lang="scss" scoped>
:deep(.arco-tabs .arco-tabs-nav-type-card-gutter .arco-tabs-tab-active) {
  box-shadow: inset 0 2px 0 rgb(var(--primary-6)), inset -1px 0 0 var(--color-border-2),
    inset 1px 0 0 var(--color-border-2);
  position: relative;
}

:deep(.arco-tabs-nav-type-card-gutter .arco-tabs-tab) {
  border-radius: var(--border-radius-medium) var(--border-radius-medium) 0 0;
}

:deep(.arco-tabs-type-card-gutter > .arco-tabs-content) {
  border: none;
}

:deep(.arco-tabs-nav::before) {
  left: -20px;
  right: -20px;
}

:deep(.arco-tabs) {
  overflow: visible;
}

:deep(.arco-tabs-nav) {
  overflow: visible;
}
</style>
