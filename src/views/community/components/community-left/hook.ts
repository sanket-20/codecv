import { isLogin } from '@/common/global'
import useUserStore from '@/store/modules/user'
import { errorMessage } from '@/common/message'
import { queryCommunity } from '@/api/modules/community'
import { reactive, ref } from 'vue'
import { tabs } from './constant'
import { useThrottleFn } from '@vueuse/core'
import { IArticle, ICommunityCondition, IResponse } from '@@types/type'

export function useTab(conditions: ICommunityCondition, conditionQuery: () => void) {
  const tab = ref(tabs[0])
  function toggleTab(idx: number) {
    tab.value = tabs[idx]
    conditions.tab = idx
    // Switching requires recalculating pageNum.
    conditions.pageNum = 1
    conditionQuery()
  }
  return {
    tab,
    toggleTab
  }
}

export function useData() {
  const { userInfo, loginModelToggle } = useUserStore()
  const data = ref<IArticle[]>([]),
    loading = ref(false),
    noMore = ref(false)
  const conditions = reactive({
    pageNum: 1,
    pageSize: 10,
    keyword: '',
    professional: '',
    tab: 0,
    uid: userInfo.uid
  })
// infinite scroll
async function queryList() {
    if (noMore.value) {
      return
    }
    loading.value = true
    conditions.pageNum += 1
    const res = (await queryCommunity(conditions)) as IResponse<IArticle[]>
    if (res.code != 200) {
      return errorMessage(res.msg)
    }
    loading.value = false
    data.value.push(...(<IArticle[]>res.data))
    if ((res.data as IArticle[]).length < conditions.pageSize) {
      noMore.value = true
    }
  }
  // Conditional query
  async function conditionQuery() {
    if (conditions.tab == 2) {
      if (!isLogin()) {
        errorMessage('请先登录再查看。')
        loginModelToggle()
        return
      }
      conditions.uid = userInfo.uid // Only look at my own
    }
    loading.value = true
    const res = (await queryCommunity(conditions)) as IResponse<IArticle[]>
    if (res.code != 200) {
      return errorMessage(res.msg)
    }
    loading.value = false
    data.value = res.data as IArticle[]
    if (data.value.length < conditions.pageSize) {
      noMore.value = true
    }
  }
  // Click on professional anchor query
  function queryProfessional(professional: string) {
    if (professional != conditions.professional) {
      conditions.professional = professional
      conditionQuery()
    }
  }
  // Delete article
  function removeArticle(idx: number) {
    data.value.splice(idx, 1)
  }
  // reset subquery
  function resetSub() {
    conditions.pageNum = 1
    conditions.keyword = ''
    conditions.professional = ''
    conditionQuery()
  }
  // search
  function searchSub() {
    conditions.pageNum = 1
    conditionQuery()
  }
  return {
    data,
    loading,
    noMore,
    conditions,
    resetSub: useThrottleFn(resetSub, 1000),
    searchSub: useThrottleFn(searchSub, 1000),
    queryList,
    queryProfessional,
    removeArticle,
    conditionQuery
  }
}
