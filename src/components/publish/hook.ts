import { onDeactivated } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { errorMessage, successMessage, warningMessage } from '@/common/message'
import { publishComment, publishCommentReply } from '@/api/modules/comments'
import useUserStore from '@/store/modules/user'
import { Ref, ref } from 'vue'
import { ImageUpload } from '@/utils/uploader'
import { IResponse } from '@@types/type'
export function useEmoji(mainContent: Ref<string>) {
  const picker = ref(false)

  function togglePicker() {
    picker.value = !picker.value
  }

  function setEmoji(emoji: any) {
    togglePicker()
    mainContent.value += emoji.i
  }

  return {
    picker,
    togglePicker,
    setEmoji
  }
}
// The logic of comments and replies is here.
export function usePublishShare(
  articleId: Ref<number>,
  level: Ref<number>,
  posterCommentId: Ref<number>,
  replyAuthorId: Ref<number>,
  replyArticleAuthorId: Ref<number>,
  replyCommentId: Ref<number>,
  replyCommentLevel: Ref<number>,
  emits: any,
  images: Ref<string[]>
) {
  const shareMainContent = ref('')
  const { loginState, loginModelToggle, userInfo } = useUserStore()

  async function publish() {
    if (!loginState.logined) {
      loginModelToggle()
      return
    }
    if (!shareMainContent.value.trim()) {
      warningMessage('What do you want to do by posting empty content? ? ?')
      return
    }
    if (shareMainContent.value.length > 200) {
      warningMessage('There are too many to save, so delete them to less than 200 words.')
      return
    }
    const cb = level.value == 1 ? publishComment : publishCommentReply
    const params = {
      content: shareMainContent.value.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      authorId: userInfo.uid, // Who is the author of this comment?
      images: images.value.join('~$^$~'),
      level: level.value, // What level of comments
      articleId: articleId.value, // Article ID
      posterCommentId: posterCommentId.value, // Who is the original poster?
      replyAuthorId: replyAuthorId.value, // Who posted the comment you replied to?
      replyArticleAuthorId: replyArticleAuthorId.value, // Who published the reply article?
      replyCommentId: replyCommentId.value, // Reply to whom
      replyCommentLevel: replyCommentLevel.value // What level of comment is the reply to?
    }
    // console.log(params)
    const rest = (await cb(params)) as IResponse<unknown>
    if (rest.code == 200) {
      shareMainContent.value = ''
      images.value.length = 0 // Clear image content
      emits('reQueryComments')
    }
    rest.code == 200 ? successMessage(rest.msg) : errorMessage(rest.msg)
  }

  onDeactivated(() => {
    shareMainContent.value = ''
    images.value.length = 0
  })
  return {
    shareMainContent,
    publish: useThrottleFn(publish, 1000)
  }
}

export function usePickerImage() {
  const images = ref<string[]>([])

  async function pickerImage() {
    if (images.value.length >= 2) {
      return errorMessage('Only 2 pictures can be uploaded at most!')
    }
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', '.png,.jpg,.gif,.jpeg,.webp')
    input.click()

    input.onchange = async function () {
      const files = Array.from(input.files as FileList)
      for (const file of files) {
        const path = await ImageUpload(file)
        images.value.push(path)
      }
      input.remove()
    }
  }

  function deleteImage(idx: number) {
    images.value.splice(idx, 1)
  }
  return {
    images,
    pickerImage,
    deleteImage
  }
}
