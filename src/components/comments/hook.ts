import { isLogin } from '@/common/global'
import { errorMessage } from '@/common/message'
import { successMessage } from '@/common/message'
import { removeComment } from '@/api/modules/comments'
import { calcOffsetTop, scrollTo } from '@/utils'
import useUserStore from '@/store/modules/user'
import { nextTick, Ref, ref, watch } from 'vue'
import { type IResponse } from '@@types/type'

// Action required to reply
export function useReply(emits: any) {
  const { userInfo } = useUserStore()
  const currenId = ref(-1)
  let preId = -1

  function reply(commentId: number) {
    if (preId === commentId) {
      currenId.value = -1
      preId = -1
      return
    }
    preId = commentId
    currenId.value = commentId
  }

  async function remove(commentId: number, articleId: number, level: number) {
    if (!isLogin()) {
      errorMessage('请先登录！')
      window.location.reload()
      return
    }
    const rest: IResponse<unknown> = (await removeComment({
      commentId,
      articleId,
      level
    })) as IResponse<unknown>
    if (rest.code == 200) {
      successMessage(rest.msg)
      emits('reQueryComments')
      return
    }
    errorMessage(rest.msg)
  }

  return {
    userInfo,
    reply,
    remove,
    currenId
  }
}
// Show more
export function useShowMore(count: number) {
  const more = ref<boolean>(count > 1)

  function setMore() {
    more.value = false
  }
  return {
    more,
    setMore
  }
}
// Get the specific page number and location of the current review
export function useCommentPosition(position: Ref<number>) {
  const comments = ref()
  // Click on the notification to locate comments
  watch(
    () => position.value,
    () => {
      try {
        nextTick(() => {
          const targetComment = comments.value.children[position.value]
          scrollTo(calcOffsetTop(targetComment) - 65)
          targetComment.classList.add('notice')
          setTimeout(() => {
            targetComment.classList.remove('notice')
          }, 1000)
        })
      } catch (e) {
        console.log(e)
        errorMessage('Something went wrong, please refresh and try again~')
      }
    }
  )
  return {
    comments
  }
}
