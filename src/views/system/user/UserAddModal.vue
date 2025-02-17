<template>
  <a-drawer
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :width="width >= 520 ? 520 : '100%'"
    @before-ok="save"
    @close="reset"
  >
    <a-form ref="formRef" :model="form" :rules="rules" size="large" auto-label-width>
      <a-form-item label="用户名" field="username">
        <a-input v-model.trim="form.username" placeholder="请输入用户名" :max-length="64" />
      </a-form-item>
      <a-form-item label="昵称" field="nickname">
        <a-input v-model.trim="form.nickname" placeholder="请输入昵称" :max-length="30" />
      </a-form-item>
      <a-form-item v-if="!isUpdate" label="密码" field="password">
        <a-input-password v-model.trim="form.password" placeholder="请输入密码" :max-length="32" />
      </a-form-item>
      <a-form-item label="手机号码" field="phone">
        <a-input v-model.trim="form.phone" placeholder="请输入手机号码" />
      </a-form-item>
      <a-form-item label="邮箱" field="email">
        <a-input v-model.trim="form.email" placeholder="请输入邮箱" :max-length="255" />
      </a-form-item>
      <a-form-item label="性别" field="gender">
        <a-radio-group v-model="form.gender">
          <a-radio :value="1">男</a-radio>
          <a-radio :value="2">女</a-radio>
          <a-radio :value="0" disabled>未知</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="所属部门" field="deptId">
        <a-tree-select
          v-model="form.deptId"
          :data="deptList"
          placeholder="请选择所属部门"
          allow-clear
          allow-search
          :filter-tree-node="filterDeptOptions"
        />
      </a-form-item>
      <a-form-item label="角色" field="roleIds">
        <a-select
          v-model="form.roleIds"
          :options="roleList"
          placeholder="请选择角色"
          multiple
          allow-clear
          :allow-search="{ retainInputValue: true }"
        />
      </a-form-item>
      <a-form-item label="描述" field="description">
        <a-textarea
          v-model.trim="form.description"
          placeholder="请输入描述"
          show-word-limit
          :max-length="200"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
      <a-form-item label="状态" field="status">
        <a-switch
          v-model="form.status"
          :disabled="form.isSystem"
          :checked-value="1"
          :unchecked-value="2"
          checked-text="启用"
          unchecked-text="禁用"
          type="round"
        />
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
import { getUser, addUser, updateUser } from '@/apis'
import type { Gender, Status } from '@/types/global'
import { Message, type FormInstance, type TreeNodeData } from '@arco-design/web-vue'
import { useForm } from '@/hooks'
import { useDept, useRole } from '@/hooks/app'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const { roleList, getRoleList } = useRole()
const { deptList, getDeptList } = useDept()
// 过滤部门
const filterDeptOptions = (searchKey: string, nodeData: TreeNodeData) => {
  if (nodeData.title) {
    return nodeData.title.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
  }
  return false
}

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改用户' : '新增用户'))
const formRef = ref<FormInstance>()

const rules: FormInstance['rules'] = {
  username: [{ required: true, message: '请输入用户名' }],
  nickname: [{ required: true, message: '请输入昵称' }],
  password: [{ required: true, message: '请输入密码' }],
  deptId: [{ required: true, message: '请选择所属部门' }],
  roleIds: [{ required: true, message: '请选择角色' }]
}

const { form, resetForm } = useForm({
  id: '',
  username: '',
  nickname: '',
  gender: 1 as Gender,
  phone: '',
  email: '',
  deptId: '',
  roleIds: [] as string[],
  description: '',
  status: 1 as Status,
  type: 2 as 1 | 2,
  disabled: false
})

// 重置
const reset = () => {
  formRef.value?.resetFields()
  resetForm()
}

const visible = ref(false)
// 新增
const onAdd = () => {
  if (!deptList.value.length) {
    getDeptList()
  }
  if (!roleList.value.length) {
    getRoleList()
  }
  reset()
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  if (!deptList.value.length) {
    await getDeptList()
  }
  if (!roleList.value.length) {
    await getRoleList()
  }
  reset()
  dataId.value = id
  const res = await getUser(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateUser(form, dataId.value)
      Message.success('修改成功')
    } else {
      await addUser(form)
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
