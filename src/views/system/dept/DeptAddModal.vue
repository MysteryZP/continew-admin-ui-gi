<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :esc-to-close="false"
    :modal-style="{ maxWidth: '520px' }"
    width="90%"
    @before-ok="save"
    @close="reset"
  >
    <GiForm ref="formRef" v-model="form" :options="options" :columns="columns" />
  </a-modal>
</template>

<script setup lang="ts">
import { getDept, addDept, updateDept } from '@/apis'
import type { DeptReq } from './type'
import { Message } from '@arco-design/web-vue'
import { GiForm, type Columns } from '@/components/GiForm'
import { useForm } from '@/hooks'
import { useDept } from '@/hooks/app'

const { deptList, getDeptList } = useDept()

const dataId = ref('')
const isUpdate = computed(() => !!dataId.value)
const title = computed(() => (isUpdate.value ? '修改部门' : '新增部门'))
const formRef = ref<InstanceType<typeof GiForm>>()

const options: Options = {
  form: {},
  col: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
  btns: { hide: true }
}

const columns: Columns = [
  {
    label: '上级部门',
    field: 'parentId',
    type: 'tree-select',
    data: deptList,
    props: {
      allowClear: true,
      allowSearch: true,
      fallbackOption: false,
      filterTreeNode(searchKey, nodeData) {
        if (nodeData.title) {
          return nodeData.title.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
        }
        return false
      }
    }
  },
  { label: '名称', field: 'name', type: 'input', rules: [{ required: true, message: '请输入名称' }] },
  {
    label: '排序',
    field: 'sort',
    type: 'input-number',
    props: {
      min: 1,
      mode: 'button'
    }
  },
  {
    label: '描述',
    field: 'description',
    type: 'textarea',
    props: {
      maxLength: 200,
      autoSize: { minRows: 3, maxRows: 5 }
    }
  },
  {
    label: '状态',
    field: 'status',
    type: 'switch',
    props: {
      type: 'round',
      checkedValue: 1,
      uncheckedValue: 2,
      checkedText: '启用',
      uncheckedText: '禁用'
    }
  }
]

const { form, resetForm } = useForm<DeptReq>({
  name: '',
  parentId: undefined,
  sort: 999,
  status: 1
})

// 重置
const reset = () => {
  formRef.value?.formRef?.resetFields()
  resetForm()
}

const visible = ref(false)
// 新增
const onAdd = (id?: string) => {
  if (!deptList.value.length) {
    getDeptList()
  }
  reset()
  form.parentId = id
  dataId.value = ''
  visible.value = true
}

// 修改
const onUpdate = async (id: string) => {
  if (!deptList.value.length) {
    await getDeptList()
  }
  reset()
  dataId.value = id
  const res = await getDept(id)
  Object.assign(form, res.data)
  visible.value = true
}

// 保存
const save = async () => {
  try {
    const isInvalid = await formRef.value?.formRef?.validate()
    if (isInvalid) return false
    if (isUpdate.value) {
      await updateDept(form, dataId.value)
      Message.success('修改成功')
    } else {
      await addDept(form)
      Message.success('新增成功')
    }
    // 更新部门树
    await getDeptList()
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
