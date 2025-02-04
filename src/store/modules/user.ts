import { defineStore } from 'pinia'
import VerificationCode, { createCode } from 'picture-verification-code'
import pinia from '@/store'
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '@/common/localstorage'
import { errorMessage, successMessage } from '@/common/message'
import { Tip } from '@/common/tip'
import { login, logout, registerUser, verify } from '@/api/modules/user'
import { userForm } from '@/layout/header/hook'
import { IUser, IUserInfo } from '@@types/type'

const codeInstance = new VerificationCode()
export const TOKEN = 'TOKEN',
  USERNAME = 'USERNAME',
  SET_TOKEN = 'SET_TOKEN',
  SET_USERNAME = 'SET_USERNAME'

export const initialInfo = {
  uid: 0,
  nickName: '',
  username: '',
  sex: '',
  professional: '',
  graduation: '',
  school: '',
  avatar: '',
  origin: ''
}

const useUserStore = defineStore('userStore', {
  state: () => ({
    userInfo: initialInfo,
    loginState: {
      logined: false, // Login status
      loginModel: false,
      verify: '', // Verification code
      verifyImg: '' // Verification code picture
    },
    token: getLocalStorage(TOKEN) || ''
  }),
  actions: {
    login(user: IUser, isLogin: boolean) {
      if (!user.username || !user.password) {
        errorMessage(Tip.BE_INCOMPLATE)
        return
      }
      if (this.loginState.verify.toLowerCase() != user.verify.toLowerCase()) {
        errorMessage(Tip.VERIFY_CODE_INVAILED)
        return
      }
      const cb = isLogin ? login : registerUser
      cb(user).then((res: any) => {
        if (res.code === 200) {
          this.loginState.logined = true
          this.loginModelToggle()
          // Update user information
          this.setUserInfo(this.userInfo, res.data)
          this.setUserInfo(userForm, res.data)
          // Cache important information
          setLocalStorage(TOKEN, res.token)
          setLocalStorage(USERNAME, res.data.username)
          successMessage(res.msg)
        } else {
          errorMessage(res.msg)
        }
      })
    },
    logout() {
      logout({ username: getLocalStorage(USERNAME) as string }).then((res: any) => {
        if (res.code != 200) {
          errorMessage(res.msg)
          return
        }
        removeLocalStorage(TOKEN)
        removeLocalStorage(USERNAME)
        location.reload()
      })
    },
    verifyLoginState(token: string, username: string) {
      verify({ token, username }).then((res: any) => {
        if (res.code === 200) {
          this.loginState.logined = true
          this.setUserInfo(this.userInfo, res.data)
          this.setUserInfo(userForm, res.data)
        } else {
          errorMessage(res.msg)
        }
      })
    },
    loginModelToggle() {
      this.loginState.loginModel = !this.loginState.loginModel
      this.genVerify()
    },
    genVerify() {
      this.loginState.verify = createCode()
      this.loginState.verifyImg = codeInstance.render(this.loginState.verify)
    },
    setUserInfo(target: IUserInfo, userInfo: IUserInfo) {
      target.uid = userInfo.uid
      target.nickName = userInfo.nickName
      target.username = userInfo.username
      target.sex = userInfo.sex
      target.professional = userInfo.professional
      target.graduation = userInfo.graduation
      target.school = userInfo.school
      target.avatar = userInfo.avatar
      target.origin = userInfo.origin
    }
  }
})

export default () => useUserStore(pinia)
