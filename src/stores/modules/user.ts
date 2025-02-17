import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { resetRouter } from '@/router'
import { accountLogin as accountLoginApi, logout as logoutApi, getUserInfo as getUserInfoApi } from '@/apis'
import type { UserInfo } from '@/apis'
import { setToken, clearToken, getToken } from '@/utils/auth'
import { resetHasRouteFlag } from '@/router/permission'
import getAvatar from '@/utils/avatar'

const storeSetup = () => {
  const userInfo = reactive<Pick<UserInfo, 'nickname' | 'avatar'>>({
    nickname: '',
    avatar: ''
  })
  const name = computed(() => userInfo.nickname)
  const avatar = computed(() => userInfo.avatar)

  const token = ref(getToken() || '')
  const roles = ref<string[]>([]) // 当前用户角色
  const permissions = ref<string[]>([]) // 当前角色权限标识集合

  // 重置token
  const resetToken = () => {
    token.value = ''
    clearToken()
    resetHasRouteFlag()
  }

  // 登录
  const accountLogin = async (params: any) => {
    const res = await accountLoginApi(params)
    setToken(res.data.token)
    token.value = res.data.token
  }

  // 退出登录
  const logout = async () => {
    try {
      await logoutApi()
      await logoutCallBack()
      return true
    } catch (error) {
      return false
    }
  }

  // 退出登录回调
  const logoutCallBack = async () => {
    roles.value = []
    permissions.value = []
    resetToken()
    resetRouter()
  }

  // 获取用户信息
  const getInfo = async () => {
    const res = await getUserInfoApi()
    userInfo.nickname = res.data.nickname
    userInfo.avatar = getAvatar(res.data.avatar, res.data.gender)
    if (res.data.roles && res.data.roles.length) {
      roles.value = res.data.roles
      permissions.value = res.data.permissions
    }
  }

  return {
    userInfo,
    name,
    avatar,
    token,
    roles,
    permissions,
    accountLogin,
    logout,
    logoutCallBack,
    getInfo,
    resetToken
  }
}

export const useUserStore = defineStore('user', storeSetup, {
  persist: { paths: ['token', 'roles', 'permissions'], storage: localStorage }
})
