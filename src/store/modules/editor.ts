import { defineStore } from 'pinia'
import { nextTick } from 'vue'

import pinia from '@/store'
import { getLocalStorage, setLocalStorage } from '@/common/localstorage'
import { showMessageVN } from '@/common/message'
import { templates } from '@/templates/config'
import { ensureEmptyPreWhiteSpace } from '@/views/editor/components/tabbar/hook'

const MARKDOWN_CONTENT = 'markdown-content'
const WRITABLE = 'writable'

export const getCurrentTypeContent = (type: string): string => {
  for (const template of templates.value) {
    if (type === template.type) {
      return template.content
    }
  }
  return ''
}

const useEditorStore = defineStore('editorStore', {
  state: () => ({
    MDContent: '',
    nativeContent: '',
    writable: Boolean(getLocalStorage(WRITABLE)) || false
  }),
  actions: {
    // Initialize editor content (default is Markdown mode)
    initMDContent(resumeType: string) {
      const cacheKey = MARKDOWN_CONTENT + '-' + resumeType
      this.MDContent = getLocalStorage(cacheKey)
        ? (getLocalStorage(cacheKey) as string)
        : getCurrentTypeContent(resumeType)
    },
    setMDContent(nv: string, resumeType: string) {
      this.MDContent = nv
      // What to do after processing
      if (!nv) return
      setLocalStorage(`${MARKDOWN_CONTENT}-${resumeType}`, nv)
    },
    // Switch editing mode
    setWritableMode(originHTML: HTMLElement) {
      this.writable = !this.writable
      setLocalStorage(WRITABLE, this.writable)
      showMessageVN('You have switched to', this.writable ? 'content mode' : 'Markdown mode')
      if (this.writable) {
        nextTick(() => {
          originHTML = originHTML || (document.querySelector('.reference-dom') as HTMLElement)
          originHTML = <HTMLElement>originHTML.cloneNode(true)
          const DOMTree = document.querySelector('.writable-edit-mode') as HTMLElement
          ensureEmptyPreWhiteSpace(originHTML)
          DOMTree && (DOMTree.innerHTML = originHTML.innerHTML)
        })
      }
    },
    setNativeContent(content: string) {
      this.nativeContent = content
    },
    resetNativeContent() {
      this.nativeContent = ''
    }
  }
})

export default () => useEditorStore(pinia)
