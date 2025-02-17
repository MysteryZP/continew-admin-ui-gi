<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :modal-style="{ maxWidth: '625px' }"
    :body-style="{ maxHeight: '70vh' }"
    width="90%"
    @before-ok="save"
    @close="reset"
  >
    <a-form ref="formRef" :model="form" :rules="formRules" auto-label-width>
      <a-form-item label="菜单类型" field="type">
        <a-radio-group v-model="form.type" type="button" :disabled="isUpdate" @change="onChangeType">
          <a-radio :value="1">目录</a-radio>
          <a-radio :value="2">菜单</a-radio>
          <a-radio :value="3">按钮</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="上级菜单" field="parentId">
        <a-tree-select
          v-model="form.parentId"
          placeholder="请选择上级菜单"
          allow-clear
          allow-search
          :data="(menuSelectTree as any)"
          :fallback-option="false"
          :fieldNames="{
            key: 'id',
            title: 'title',
            children: 'children'
          }"
        />
      </a-form-item>
      <a-form-item v-if="[1, 2].includes(form.type)" label="菜单图标" field="icon">
        <GiIconSelector v-model="form.icon" />
      </a-form-item>
      <a-form-item label="菜单标题" field="title">
        <a-input v-model.trim="form.title" placeholder="请输入菜单标题" allow-clear />
      </a-form-item>
      <a-form-item v-if="[1, 2].includes(form.type)" label="路由地址" field="path">
        <a-input v-model.trim="form.path" placeholder="请输入路由地址" allow-clear />
      </a-form-item>
      <a-form-item v-if="[1, 2].includes(form.type) && !form.isExternal" label="重定向" field="redirect">
        <a-input v-model.trim="form.redirect" placeholder="请输入重定向地址" allow-clear />
      </a-form-item>
      <a-form-item v-if="[1, 2].includes(form.type) && !form.isExternal" label="组件名称" field="name">
        <a-input v-model.trim="form.name" placeholder="请输入组件名称" allow-clear />
        <template #extra>
          <div v-if="routeName">
            <span>建议组件名称：</span>
            <a-tag>{{ routeName }}</a-tag>
          </div>
        </template>
      </a-form-item>
      <a-form-item label="组件路径" field="component" v-if="form.type === 2">
        <a-input v-if="form.isExternal" v-model.trim="form.component" placeholder="请输入组件路径" allow-clear />
        <a-input v-else v-model.trim="form.component" placeholder="请输入组件路径" allow-clear>
          <template #prepend>@/views/</template>
          <template #append>.vue</template>
        </a-input>
      </a-form-item>
      <a-form-item v-if="form.type === 3" label="权限标识" field="permission">
        <a-input v-model.trim="form.permission" placeholder="system:user:add" allow-clear />
      </a-form-item>
      <a-row :gutter="16" v-if="[1, 2].includes(form.type)">
        <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" :xxl="8">
          <a-form-item label="是否外链" field="isExternalUrl" v-if="[1, 2].includes(form.type)">
            <a-switch
              v-model="form.isExternal"
              :checked-value="true"
              :unchecked-value="false"
              checked-text="是"
              unchecked-text="否"
              type="round"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" :xxl="8">
          <a-form-item label="是否隐藏" field="hidden">
            <a-switch
              v-model="form.isHidden"
              :checked-value="true"
              :unchecked-value="false"
              checked-text="是"
              unchecked-text="否"
              type="round"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" :xxl="8">
          <a-form-item label="是否缓存" field="keepAlive">
            <a-switch
              v-model="form.isCache"
              :checked-value="true"
              :unchecked-value="false"
              checked-text="是"
              unchecked-text="否"
              type="round"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="菜单排序" field="sort">
        <a-input-number v-model="form.sort" placeholder="请输入菜单排序" :min="1" mode="button" style="width: 150px" />
      </a-form-item>
      <a-form-item label="状态" field="status">
        <a-switch
          v-model="form.status"
          :checked-value="1"
          :unchecked-value="0"
          checked-text="启用"
          unchecked-text="禁用"
          type="round"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { getMenu, addMenu, updateMenu, type MenuResp } from '@/apis'
import { Message, type FormInstance } from '@arco-design/web-vue'
import type { MenuForm } from './type'
import { useForm } from '@/hooks'
import { filterTree, transformPathToName } from '@/utils'
import { mapTree } from 'xe-utils'

interface Props {
  menus: MenuResp[]
}

const props = withDefaults(defineProps<Props>(), {
  menus: () => []
})

// 转换为菜单树
const menuSelectTree = computed(() => {
  const menus = JSON.parse(JSON.stringify(props.menus)) as MenuResp[]
  const data = filterTree(menus, (i) => [1, 2].includes(i.type))
  return mapTree(data, (i) => ({
    id: i.id,
    title: i.title,
    children: i.children
  }))
})

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改菜单' : '新增菜单'))
const formRef = ref<FormInstance>()

const rules: FormInstance['rules'] = {
  parentId: [{ required: true, message: '请选择上级菜单' }],
  title: [{ required: true, message: '请输入菜单标题' }],
  path: [{ required: true, message: '请输入路由地址' }],
  name: [{ required: true, message: '请输入组件名称' }],
  component: [{ required: true, message: '请输入组件路径' }],
  permission: [{ required: true, message: '请输入权限标识' }]
}

const { form, resetForm } = useForm<MenuForm>({
  type: 1,
  icon: '',
  title: '',
  sort: 999,
  permission: '',
  path: '',
  name: '',
  component: '',
  redirect: '',
  isExternal: false,
  isCache: false,
  isHidden: false,
  parentId: '',
  status: 1
})
const routeName = computed(() => transformPathToName(form.path))
const formRules = computed(() => {
  if ([1, 2].includes(form.type)) {
    const { title, name, path } = rules
    return { title, name, path } as FormInstance['rules']
  }
  if (form.type === 3) {
    const { parentId, title, permission } = rules
    return { parentId, title, permission } as FormInstance['rules']
  }
})

// 切换类型清除校验
const onChangeType = () => {
  formRef.value?.clearValidate()
}

// 重置
const reset = () => {
  formRef.value?.resetFields()
  resetForm()
}

const visible = ref(false)
// 新增
const onAdd = (id?: string) => {
  reset()
  form.parentId = id
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  reset()
  dataId.value = id
  const res = await getMenu(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateMenu(form, dataId.value)
      Message.success('修改成功')
    } else {
      await addMenu(form)
      Message.success('新增成功')
    }
    emit('save-success')
    return true
  } catch (error) {
    return false
  }
}

const emit = defineEmits<{
  (e: 'save-success'): void
}>()

defineExpose({ onAdd, onUpdate })
</script>
