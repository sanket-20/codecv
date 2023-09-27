import { ElLoading } from 'element-plus'
import 'element-plus/es/components/loading/style/css'

export const wOpen = window.open

export async function importCSS(name: string) {
  const res = await import(`../templates/modules/${name}/style.scss`)
  return res.default
}

export function download(url: string, fileName: string) {
  const a = document.createElement('a')
  a.download = fileName
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function downloadOfBuffer(buffer: Iterable<number>, fileName: string, type: string) {
  const blob = new Blob([new Uint8Array(buffer)], { type })
  const url = URL.createObjectURL(blob)
  download(url, fileName)
  URL.revokeObjectURL(url)
}

export function createText(text: string) {
  return document.createTextNode(text)
}

export function queryDOM(uni: string) {
  return document.querySelector(uni)
}

export function createStyle() {
  return document.createElement('style')
}

export function createDIV() {
  return document.createElement('div')
}

export function query(attr: string) {
  return document.head.querySelector(`style[${attr}]`)
}

export function removeHeadStyle(attr: string) {
  query(attr)?.remove()
}

export function useLoading() {
  let loading: any = null
  function showLoading(text: string) {
    loading = ElLoading.service({
      lock: true,
      text,
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
  function closeLoading() {
    loading && loading.close()
  }
  return {
    showLoading,
    closeLoading
  }
}

export function scrollTo(targetTop = 0) {
  const documentBody: HTMLElement = document.documentElement || document.body
  // 计算gap
  let GAP = Math.abs(documentBody.scrollTop - targetTop) / 20,
    currentScrollTop = 0,
    preScrollTop = -1

  const _GAP = GAP

  function scrollHelper() {
    currentScrollTop = documentBody.scrollTop
    // How far is it from the target?
    const currentDistance = currentScrollTop - targetTop
    // 1. Exceeded the maximum and minimum values
    // 2. Just finished walking
    if (preScrollTop == currentScrollTop || currentDistance == 0) {
      return
    }
    preScrollTop = currentScrollTop

    window.requestAnimationFrame(function () {
      GAP = currentDistance > 0 ? _GAP : -_GAP
      currentScrollTop -= GAP
      // If the distance is relatively small, then you can locate it directly
      if (Math.abs(currentDistance) < _GAP) {
        documentBody.scrollTop = targetTop
        return
      }
      documentBody.scrollTop = currentScrollTop
      Math.abs(currentDistance) > 0 && scrollHelper()
    })
  }
  scrollHelper()
}

export function calcOffsetTop(dom: HTMLElement) {
  let height = dom?.offsetTop,
    parent = dom?.offsetParent as HTMLElement
  while (parent !== null) {
    height += parent.offsetTop
    parent = parent.offsetParent as HTMLElement
  }
  return height
}

export function convert(target: string) {
  switch (target) {
    case 'h1':
      return 'first level title'
    case 'h2':
      return 'Second level title'
    case 'h3':
      return 'Level 3 headings'
    case 'h4':
      return 'Level 4 heading'
    case 'h5':
      return 'Level 5 heading'
    case 'h6':
      return 'Level 6 headings'
    case 'strong':
      return 'Emphasis/bold'
    case 'a':
      return 'Link'
    case 'p':
      return 'normal text'
    case 'li':
      return 'list item'
    case 'ul':
      return 'unordered list'
    case 'ol':
      return 'ordered list'
    case 'resume-module':
      return 'Entire submodule'
    case 'single-code':
      return 'code box'
    case 'head-layout':
      return 'Personal information column'
    case 'main-layout':
      return 'Main content'
    case 'flex-layout':
      return 'multi-column layout'
    case 'flex-layout-item':
      return 'multi-column layout items'
    case 'iconfont':
      return 'Font icon'
    case 'img':
      return 'ID photo/picture'
    case 'table':
      return 'sheet'
    case 'thead':
      return 'Header'
    case 'tr':
      return 'Table row'
    case 'th':
      return 'header cell'
    case 'tbody':
      return 'form body'
    case 'td':
      return 'table data cells'
  }
  return target
}

export function getTagColor(index: number): any {
  const colors = ['danger', 'warning', 'success', 'info'],
    len = colors.length
  return colors[index % len]
}

export function isDev() {
  return import.meta.env.MODE === 'development'
}
