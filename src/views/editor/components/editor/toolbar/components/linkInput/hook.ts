import { warningMessage } from '@/common/message'
// import { clickedTarget } from '@/views/editor/hook'
import { ref } from 'vue'

export const link = ref('')
export const linkText = ref('')

export function reset() {
  link.value = ''
  linkText.value = ''
  // clickedTarget.value = null
}

// Content mode: Set the link information of the pop-up box when clicking a hyperlink
export function setClickedLinkURL(target: HTMLElement) {
  link.value = target.getAttribute('href') || ''
}
export function setClickedLinkText(target: HTMLElement) {
  linkText.value = target.textContent || ''
}

export function useLinkInput(emit: any) {
  function confirm() {
    if (!link.value || !linkText.value) {
      warningMessage('Please fill in the complete!')
      return
    }
    emit('confirm', link.value, linkText.value)
    reset()
  }

  return {
    confirm,
    link,
    linkText
  }
}
