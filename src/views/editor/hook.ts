import { onActivated, onDeactivated, Ref, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDebounceFn, useThrottleFn } from '@vueuse/core'

import { getLocalStorage } from '@/common/localstorage'
import { errorMessage, successMessage, warningMessage } from '@/common/message'
import { download, downloadOfBuffer, importCSS, isDev, queryDOM, useLoading } from '@/utils'
import { ensureEmptyPreWhiteSpace, splitPage } from './components/tabbar/hook'
import useEditorStore from '@/store/modules/editor'
import { convertDOM } from '@/utils/moduleCombine'
import { resumeExport } from '@/api/modules/resume'
import {
  CUSTOM_CSS_STYLE,
  CUSTOM_MARKDOWN_PRIMARY_COLOR,
  CUSTOM_MARKDOWN_PRIMARY_BG_COLOR,
  MARKDOWN_FONT,
  ADJUST_RESUME_MARGIN_TOP,
  AUTO_ONE_PAGE,
  LINE_HEIGHT
} from './components/tabbar/hook'

export const get = getLocalStorage,
  styleAttrs = [
    CUSTOM_MARKDOWN_PRIMARY_COLOR,
    CUSTOM_MARKDOWN_PRIMARY_BG_COLOR,
    MARKDOWN_FONT,
    LINE_HEIGHT,
    ADJUST_RESUME_MARGIN_TOP, // priority 3 (the larger the number, the lower the priority)
    AUTO_ONE_PAGE, // priority 2
    CUSTOM_CSS_STYLE // priority 1
  ]

export function useRenderHTML(resumeType: Ref<string>) {
  const renderDOM = ref<HTMLElement>(document.body)
  const editorStore = useEditorStore()

  onActivated(() => {
    importCSS(resumeType.value)
    renderDOM.value.innerHTML = convertDOM(editorStore.MDContent).innerHTML
    setTimeout(() => splitPage(renderDOM.value), 100)
  })

  watch(
    () => editorStore.MDContent,
    v => {
      renderDOM.value.innerHTML = convertDOM(v).innerHTML
      useThrottleFn(() => splitPage(renderDOM.value), 50)()
    }
  )
  // Refresh the page (this is a more problematic point)
  watch(
    () => resumeType.value,
    () => {
      location.reload()
    }
  )
  return {
    renderDOM
  }
}

export function useResumeType() {
  const route = useRoute()
  //Initialization also needs to fill in the value, otherwise subsequent updates will be inconsistent and cause an infinite refresh loop.
  const resumeType = ref(route.query.type ? String(route.query.type) : '10front_end')
  onActivated(() => {
    resumeType.value = route.query.type ? String(route.query.type) : '10front_end'
  })
  return {
    resumeType
  }
}
//Export resume｜markdown content
export function useDownLoad(type: Ref<string>) {
  const router = useRouter(),
    editorStore = useEditorStore(),
    { showLoading, closeLoading } = useLoading()
  // Process styles in PDF before exporting
  const exportPreHandler = async () => {
    const html = queryDOM('.jufe') as HTMLElement,
      htmlStyles = getComputedStyle(html)
    const resumeBgColor = `html,body { background: ${htmlStyles.getPropertyValue(
      'background'
    )}; font-size:${htmlStyles.getPropertyValue('font-size')}; }`
    const resetStyle = ` * { margin: 0; padding: 0; box-sizing: border-box; }`
    // Get the style of the resume template
    let style = '',
      linkURL = 'none'
    if (isDev()) {
      // The production environment uses dynamic import. The production environment uses link to import (to solve the problem of production default attributes not being exposed)
      style = await importCSS(type.value)
    } else {
      const linkStyle = document.querySelector('link[href*="/css/style"]') as HTMLLinkElement
      linkURL = linkStyle?.href || 'none'
    }
    // Handle custom generated styles
    for (const attr of styleAttrs) {
      const styleContent = document.head.querySelector(`style[${attr}-${type.value}]`)?.textContent
      if (!styleContent) continue
      style += styleContent
    }
    style = resetStyle + resumeBgColor + style
    return { style, link: linkURL, content: html }
  }
  // Export PDF & images
  const downloadDynamic = async (isPDF: boolean, fileName?: string) => {
    const { content: html, style, link } = await exportPreHandler()
    const content = html.cloneNode(true) as HTMLElement
    !isPDF && ensureEmptyPreWhiteSpace(content)
    showLoading('Exporting, please wait patiently...')
    try {
      const pdfData = await resumeExport({
        content: content.outerHTML,
        style,
        link,
        name: type.value,
        type: isPDF ? 0 : 1
      })
      const buffer = isPDF ? pdfData.pdf.data : pdfData.picture.data
      const _fileName = (fileName || document.title) + (isPDF ? '.pdf' : '.png')
      const fileType = 'application/' + isPDF ? 'pdf' : 'png'
      downloadOfBuffer(buffer, _fileName, fileType)
      successMessage('Export successful~')
    } catch (e: any) {
      const errorMsg =
        e.message == 'Failed to fetch'
          ? 'Domestic export is error-prone, please try again. If possible, open the ladder and try again or use backup export'
          : 'Export error, please try an alternative export solution first'
      errorMessage(errorMsg)
    }
    closeLoading()
  }

  const downloadNative = () => {
    editorStore.setNativeContent((<HTMLElement>queryDOM('.jufe')).innerHTML)
    router.push({ path: '/download', query: { type: type.value } })
  }

  const downloadMD = () => {
    const blob = new Blob([editorStore.MDContent])
    const url = URL.createObjectURL(blob)
    download(url, document.title + '.md')
    URL.revokeObjectURL(url)
    successMessage('Export successful~')
  }
  return {
    downloadMD,
    downloadDynamic,
    downloadNative
  }
}

export function useImportMD(resumeType: string) {
  function importMD(file: File) {
    const { writable } = useEditorStore()
    if (writable) {
      return warningMessage('Please switch to Markdown mode first')
    }
    const reader = new FileReader(),
      { setMDContent } = useEditorStore()
    reader.readAsText(file, 'utf-8')
    reader.onload = function (event) {
      successMessage('Import successful~')
      setMDContent((event.target?.result as string) || '', resumeType)
    }
    reader.onerror = function () {
      errorMessage('Import failed!')
    }
  }
  return {
    importMD
  }
}

export function useAvatar(resumeType: string) {
  const matchAvatarSlot = /!\[Personal avatar\]\(.*\)/
  function setAvatar(path: string) {
    const { MDContent, setMDContent } = useEditorStore()
    if (!matchAvatarSlot.test(MDContent)) {
      warningMessage('Before uploading, please make sure the location you want to upload exists in the editor! [Personal avatar](...) this keyword')
      return
    }
    const newContent = MDContent.replace(matchAvatarSlot, `![Personal avatar](${path})`)
    setMDContent(newContent, resumeType)
    successMessage('The avatar is uploaded successfully. If you want to change it to an online picture, you can directly modify the corresponding link!')
    // You may also need to handle avatars in editable mode
    const writableDOM = document.querySelector('.writable-edit-mode')
    if (writableDOM) {
      const avatar: HTMLImageElement | null = writableDOM.querySelector('img[alt*=personal avatar]')
      avatar && (avatar.src = path)
    }
  }
  return {
    setAvatar
  }
}

export const clickedTarget = ref<HTMLElement | null>()

export function ensureResetClickedTarget() {
  clickedTarget.value = null
}

// Alternate export button
export function useShowExport() {
  const showExport = ref(false)

  function setShowExport() {
    const scrollTop = document.body.getBoundingClientRect().top
    if (Math.abs(scrollTop) > 50 && window.innerWidth > 600) {
      showExport.value = true
    } else {
      showExport.value = false
    }
  }

  onActivated(() => {
    document.addEventListener('scroll', useDebounceFn(setShowExport, 400))
  })

  onDeactivated(() => {
    document.removeEventListener('scroll', setShowExport)
  })
  return {
    showExport
  }
}