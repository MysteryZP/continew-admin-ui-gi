<script lang="ts" setup>
import BasicSetting from './components/BasicSetting.vue'
</script>

<script lang="ts">
export default {
  name: 'Config'
}
</script>

<template>
  <div class="gi_page">
    <a-card class="general-card" title="系统配置">
      <a-tabs default-active-key="1" type="rounded">
        <a-tab-pane key="1" title="基础配置">
          <BasicSetting />
        </a-tab-pane>
        <a-tab-pane key="2" title="高级配置" disabled></a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<style scoped lang="less">
:deep(.arco-tabs-content) {
  padding-top: 5px;
}
</style>
