import { getLocalStorage, removeLocalStorage, setLocalStorage } from '@/common/localstorage'
import { createStyle, query, removeHeadStyle, convert, createDIV } from '@/utils'
import {
  getFontFamily,
  getLineHeight,
  getPrimaryBGColor,
  getPrimaryColor
} from '@/templates/config'
import { onActivated, onMounted, reactive, ref } from 'vue'
import { warningMessage } from '@/common/message'

const get = getLocalStorage,
  set = setLocalStorage
export const CUSTOM_CSS_STYLE = 'custom-css-style',
  CUSTOM_MARKDOWN_PRIMARY_COLOR = 'custom-markdown-primary-color',
  CUSTOM_MARKDOWN_PRIMARY_BG_COLOR = 'custom_markdown_primary_bg_color',
  MARKDOWN_FONT = 'markdown-font',
  ADJUST_RESUME_MARGIN_TOP = 'ADJUST_RESUME_MARGIN_TOP',
  AUTO_ONE_PAGE = 'auto-one-page',
  WHITE_SPACE = 'white-space',
  LINE_HEIGHT = 'Line_Height',
  A4_HEIGHT = 1123,
  SELF_HEIGHT = -1234

export const renderCV = ref<HTMLElement>()
export const step = ref<number>(90)
export const pageSize = ref<number>(1)

export function setStep(val: number | any) {
  step.value = val
}

function queryRenderCV() {
  return <HTMLElement>document.querySelector('.reference-dom')
}

export function useAvatar(emits: any) {
  async function setAvatar(event: any) {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file) // Temporarily use base64 for processing and later change to cdn
    reader.onload = function (event) {
      emits('upload-avatar', event.target?.result)
    }
  }

  return {
    setAvatar
  }
}

export function useCustomCSS(resumeType: string) {
  const cssDialog = ref(false),
    cacheKey = CUSTOM_CSS_STYLE + '-' + resumeType
  const cssText = ref(get(cacheKey) ? (get(cacheKey) as string) : '')

  function toggleDialog() {
    cssDialog.value = !cssDialog.value
  }

  function setStyle() {
    cssDialog.value = false
    let style = query(cacheKey)

    const cssValue = cssText.value.trim(),
      isAppend = style
    if (!cssText.value) {
      return
    }
    if (!style) {
      style = createStyle()
      style.setAttribute(cacheKey, 'true')
    }
    style.textContent = cssValue
    !isAppend && document.head?.appendChild(style)
    set(cacheKey, cssValue)
  }

  function removeStyle() {
    cssDialog.value = false
    removeHeadStyle(cacheKey)
    removeLocalStorage(cacheKey)
    cssText.value = ''
  }

  onActivated(() => !query(cacheKey) && setTimeout(setStyle, 50))

  return {
    cssDialog,
    cssText,
    toggleDialog,
    setStyle,
    removeStyle
  }
}

export function usePrimaryBGColor(resumeType: string) {
  const cacheKey = CUSTOM_MARKDOWN_PRIMARY_BG_COLOR + '-' + resumeType,
    initialColor = getPrimaryBGColor(resumeType)
  const primaryColor = ref(get(cacheKey) ? (get(cacheKey) as string) : initialColor)

  function setPrimaryColor(color: string | null) {
    if (!color) {
      primaryColor.value = initialColor
      color = initialColor
    }
    let style = query(cacheKey)
    const append = style
    if (!style) {
      style = createStyle()
      style.setAttribute(cacheKey, 'true')
    }
    style.textContent = `:root { --markdown-primary-bg-color: ${color}; }`
    !append && document.head.appendChild(style)
    set(cacheKey, color)
  }

  onActivated(() => !query(cacheKey) && setPrimaryColor(primaryColor.value))

  return {
    primaryColor,
    setPrimaryColor
  }
}

// todo: The problem of color display after rebound will be solved by connecting to the backend in the future.
export function usePrimaryColor(resumeType: string) {
  const cacheKey = CUSTOM_MARKDOWN_PRIMARY_COLOR + '-' + resumeType,
    initialColor = getPrimaryColor(resumeType),
    color = ref(get(cacheKey) ? (get(cacheKey) as string) : initialColor)

  function setColor(value: string | null) {
    if (!value) {
      color.value = initialColor
      value = initialColor
    }
    let styleDOM = query(cacheKey)
    const isAppend = styleDOM

    if (!styleDOM) {
      styleDOM = createStyle()
      styleDOM.setAttribute(cacheKey, 'true')
    }
    styleDOM.textContent = `:root { --markdown-primary-color: ${value} }`
    !isAppend && document.head.appendChild(styleDOM)
    set(cacheKey, value)
  }

  onActivated(() => !query(cacheKey) && setColor(color.value))

  return {
    color,
    setColor
  }
}

// Custom font
export function useCustomFont(resumeType: string) {
  const cacheKey = MARKDOWN_FONT + '-' + resumeType
  const fontOptions = [
    {
      value: 'Noto Serif SC',
      label: 'Noto Serif SC'
    },
    {
      value: 'Noto Sans SC',
      label: 'Noto Sans SC'
    },
    {
      value: 'Nunito',
      label: 'Nunito(英文)'
    }
  ]
  const font = ref(
    get(cacheKey) ? (get(cacheKey) as string) : getFontFamily(resumeType) || fontOptions[0].value
  )

  function setFont(fontFamily: string | null, first?: boolean) {
    let style = query(cacheKey)
    const isAppend = style
    if (!style) {
      style = createStyle()
      style.setAttribute(cacheKey, 'true')
    }

    style.textContent = `.jufe * { font-family: ${fontFamily}, 'Noto Sans SC', 'Noto Serif SC', 'Nunito', sans-serif, serif; }`
    !isAppend && document.head.appendChild(style)
    set(cacheKey, fontFamily)
    const renderCV = queryRenderCV()
    ensureEmptyPreWhiteSpace(renderCV)
    !first && splitPage(renderCV)
  }

  onActivated(() => setFont(font.value, true))

  return {
    fontOptions,
    font,
    setFont
  }
}

/* One click reset */
export function restResumeContent(resumeType: string) {
  localStorage.removeItem(`${CUSTOM_CSS_STYLE}-${resumeType}`)
  localStorage.removeItem(`${CUSTOM_MARKDOWN_PRIMARY_COLOR}-${resumeType}`)
  localStorage.removeItem(`${CUSTOM_MARKDOWN_PRIMARY_BG_COLOR}-${resumeType}`)
  localStorage.removeItem(`${MARKDOWN_FONT}-${resumeType}`)
  localStorage.removeItem(`${AUTO_ONE_PAGE}-${resumeType}`)
  localStorage.removeItem(`${ADJUST_RESUME_MARGIN_TOP}-${resumeType}`)
  localStorage.removeItem(`${LINE_HEIGHT}-${resumeType}`)
  localStorage.removeItem(`markdown-content-${resumeType}`)
  location.reload()
}

// Adjust element margins
export function useAdjust(resumeType: string) {
  const visible = ref(false)
  const properties = reactive<IElementProperty[]>([])
  const cacheKey = ADJUST_RESUME_MARGIN_TOP + '-' + resumeType
  interface IElementProperty {
    name: string
    marginTop: number
    marginBottom: number
    tagName: string
    className: string
  }

  function getProperties(element: HTMLElement): IElementProperty[] {
    const curProperties: IElementProperty[] = []
    const seenTags = new Set<string>() // Used to record the tag names that have been processed
    const seenClassNames = new Set<string>() // Used to record the class names that have been processed

    function helper(el: HTMLElement) {
      if (el !== element) {
        const computedStyle = window.getComputedStyle(el) // Get the calculated style
        const marginTop = parseInt(computedStyle.marginTop) // Get marginTop value
        const marginBottom = parseInt(computedStyle.marginBottom)
        const tagName = el.tagName.toLowerCase() // Get the tag name and convert it to lowercase
        const className = el.className.split(' ')[0] || '' // Get the class name, if not, use 'No Class' instead
        const name = convert(className || tagName)

        // Determine whether the tag name and class name have been processed. If not, add them to the result array and add them to the seenTags and seenClassNames collections.
        if (!seenTags.has(tagName) || !seenClassNames.has(className)) {
          curProperties.push({ tagName, name, marginBottom, marginTop, className })
          seenTags.add(tagName)
          seenClassNames.add(className)
        }
      }
      // Traverse all child nodes of the current element and call this function recursively
      const children = el.children
      for (let i = 0; i < children.length; i++) helper(children[i] as HTMLElement)
    }

    helper(element) //Call the recursive function to start getting the marginTop and lineHeight values
    return curProperties
  }

  function adjustMargin() {
    setVisible()
    // Get dom element
    const targetElement = queryRenderCV()
    const curProperties = getProperties(targetElement)
    properties.length = 0
    properties.push(...curProperties)
  }

  function confirmAdjustment() {
    setVisible()
    let styleDOM = query(cacheKey),
      cssText = ''
    const isAppend = styleDOM

    if (!styleDOM) {
      styleDOM = createStyle()
      styleDOM.setAttribute(cacheKey, 'true')
    }
    for (const property of properties) {
      const target = property.className ? `.${property.className}` : property.tagName
      cssText += `.jufe ${target} {margin-top: ${property.marginTop}px!important; margin-bottom: ${property.marginBottom}px!important;}`
    }
    styleDOM.textContent = cssText
    priorityInsert(isAppend, styleDOM)
    set(cacheKey, cssText)
    const renderCV = queryRenderCV()
    ensureEmptyPreWhiteSpace(renderCV)
    splitPage(renderCV)
  }

  function priorityInsert(isAppend: Element | null, styleDOM: Element) {
    if (!isAppend) {
      //Insert in front of the automatic one-page css because the adjustment priority is the lowest
      const autoOnePage = query(AUTO_ONE_PAGE + '-' + resumeType)
      const customCSS = query(CUSTOM_CSS_STYLE + '-' + resumeType)
      if (autoOnePage || customCSS) {
        const siblingStyle = autoOnePage || customCSS
        document.head.insertBefore(styleDOM, siblingStyle)
      } else {
        // If not, append directly to head
        document.head.appendChild(styleDOM)
      }
    }
  }

  function setVisible() {
    visible.value = !visible.value
  }
  // Enter the page to read historical styles and initialize CSS
  function initAdjustCSS() {
    const adjustCSS = (get(cacheKey) as string) || ''
    if (!adjustCSS) return
    let styleDOM = query(cacheKey)
    const isAppend = styleDOM
    if (!styleDOM) {
      styleDOM = createStyle()
      styleDOM.setAttribute(cacheKey, 'true')
    }
    styleDOM.textContent = adjustCSS
    priorityInsert(isAppend, styleDOM)
  }
  // If there is no user-adjusted style in the page, then it needs to be initialized.
  onActivated(() => !query(cacheKey) && initAdjustCSS())
  return { adjustMargin, visible, confirmAdjustment, properties }
}

//Adjust row height
export function useLineHeight(resumeType: string) {
  const cacheKey = LINE_HEIGHT + '-' + resumeType
  const h = ref(get(cacheKey) ? +(get(cacheKey) as string) : +getLineHeight(resumeType))
  const lineHeightOptions = Array(30)
    .fill(0)
    .map((item, idx) => ({
      label: `${10 + idx}px`,
      value: 10 + idx
    }))
  function setLineHeight(newH: number, first?: boolean) {
    h.value = newH
    let style = query(cacheKey)
    const isAppend = style
    if (!style) {
      style = createStyle()
      style.setAttribute(cacheKey, 'true')
    }
    style.textContent = `.markdown-transform-html * { line-height: ${newH}px; }`
    !isAppend && document.head.appendChild(style)
    set(cacheKey, newH)
    const renderCV = queryRenderCV()
    ensureEmptyPreWhiteSpace(renderCV)
    !first && splitPage(renderCV)
  }

  onActivated(() => setLineHeight(h.value, true))
  return {
    h,
    lineHeightOptions,
    setLineHeight
  }
}

// follow scroll
export function useFollowRoll() {
  const followRoll = ref(false)
  let destory: null | (() => void) = null
  function scrollHandler() {
    if (!followRoll.value) return null
    const wem = document.querySelector('.writable-edit-mode') as HTMLElement
    const cs = document.querySelector('.cm-scroller') as HTMLElement
    const render = document.querySelector('.markdown-render') as HTMLElement
    // const reallRenderHeight = document.querySelector('.jufe') as HTMLElement
    function wemcb() {
      if (followRoll.value) {
        render.scrollTop = render.scrollHeight * (wem.scrollTop / wem.scrollHeight)
      }
    }

    function cscb() {
      if (followRoll.value) {
        render.scrollTop = render.scrollHeight * (cs.scrollTop / cs.scrollHeight)
      }
    }

    cs?.addEventListener('scroll', cscb)
    wem?.addEventListener('scroll', wemcb)

    return () => {
      wem?.removeEventListener('scroll', wemcb)
      cs?.removeEventListener('scroll', cscb)
    }
  }
  function setFollowRoll() {
    destory && destory()
    destory = scrollHandler()
  }
  onMounted(setFollowRoll)
  return {
    followRoll,
    setFollowRoll
  }
}

// Get the height of the element
function calculateElementHeight(element: HTMLElement) {
  // Get the style object
  const styles = getComputedStyle(element)
  // Get the content height of the element
  // const contentHeight = element.getBoundingClientRect().height
  const contentHeight = element.clientHeight
  // Get the margin height of the element
  const marginHeight =
    +styles.getPropertyValue('margin-top').slice(0, -2) +
    +styles.getPropertyValue('margin-bottom').slice(0, -2)
  // Calculate the total height of the element
  const totalHeight = contentHeight + marginHeight
  return totalHeight
}

// Get the offset of the element from the top of the target element
function getElementTop(element: HTMLElement, target: HTMLElement) {
  let actualTop = element.offsetTop
  let current = element.offsetParent as HTMLElement

  while (current !== target) {
    actualTop += current.offsetTop
    current = current.offsetParent as HTMLElement
  }
  return actualTop
}

// Split view
export function splitPage(renderCV: HTMLElement) {
  handlerWhiteBoundary(renderCV)
  let page = 0,
    realHeight = 0
  const target = renderCV.clientHeight,
    reRender = document.querySelector('.re-render') as HTMLElement
  reRender.innerHTML = ''

  while (target - realHeight > 0) {
    const wrapper = createDIV(),
      resumeNode = renderCV.cloneNode(true) as HTMLElement
    wrapper.classList.add('jufe-wrapper-page')
    //Create the content inside and minimize the height
    const realRenderHeight = Math.min(target - realHeight, A4_HEIGHT)
    const wrapperItem = createDIV()
    wrapperItem.classList.add('jufe-wrapper-page-item')
    wrapperItem.style.height = realRenderHeight + 'px'

    resumeNode.style.position = 'absolute'
    resumeNode.style.top = -page * A4_HEIGHT + 'px'
    resumeNode.style.left = 0 + 'px'

    wrapperItem.appendChild(resumeNode)
    wrapper.appendChild(wrapperItem)

    realHeight += A4_HEIGHT
    page++
    reRender?.appendChild(wrapper)
  }
  pageSize.value = page
}

// Make sure to delete the previous empty elements before processing, otherwise multiple calls in multi-page situations will generate multiple blank placeholders.
export function ensureEmptyPreWhiteSpace(renderCV: HTMLElement) {
  const children = Array.from(renderCV.children) as HTMLElement[]
  for (const child of children) {
    if (child.getAttribute(WHITE_SPACE)) renderCV.removeChild(child)
    else {
      ensureEmptyPreWhiteSpace(child)
    }
  }
}

function createBoundaryWhiteSpace(h: number) {
  const whiteSpace = createDIV()
  whiteSpace.setAttribute(WHITE_SPACE, 'true')
  // Create border whitespace placeholder plus top margin
  whiteSpace.style.height = h + 'px'
  return whiteSpace
}

// Handle boundary content truncation
export function handlerWhiteBoundary(renderCV: HTMLElement) {
  const pt = +getComputedStyle(renderCV).getPropertyValue('padding-top').slice(0, -2)
  const pb = +getComputedStyle(renderCV).getPropertyValue('padding-bottom').slice(0, -2)
  const children = Array.from(renderCV.children) as HTMLElement[]
  const pageSize = { value: 1 }
  for (const child of children) {
    // The margins of child elements also need to be involved in the calculation
    const height = calculateElementHeight(child)
    const actualTop = getElementTop(child, renderCV)
    // If the total length exceeds the height of one A4 page (excluding the height of the bottom margin), then you need to find the border element
    if (actualTop + height > A4_HEIGHT * pageSize.value - pb) {
      // If there are child nodes, continue searching and minimize the height of the blank element.
      if (child.children.length) {
        // New page, recalculate the new page height
        findBoundaryElement(child, renderCV, pt, pb, pageSize)
      } else {
        renderCV.insertBefore(
          createBoundaryWhiteSpace(A4_HEIGHT * pageSize.value - actualTop + pt),
          child
        )
        ++pageSize.value
      }
    }
  }
  return renderCV
}

//Exclude the case where there is no boundary in the multi-column layout
function findBoundaryElement(
  node: HTMLElement,
  target: HTMLElement,
  paddingTop: number,
  paddingBottom: number,
  pageSize: { value: number }
) {
  const children = Array.from(node.children) as HTMLElement[]
  for (const child of children) {
    const totalHeight = calculateElementHeight(child)
    const actualTop = getElementTop(child, target)
    if (actualTop + totalHeight > A4_HEIGHT * pageSize.value - paddingBottom) {
      // Directly exclude a line of paragraph text because there is no need to go deeper into a paragraph of text in markdown, and they cannot embed any other elements.
      if (
        child.children.length &&
        !['p', 'li', 'table'].includes(child.tagName.toLocaleLowerCase())
      ) {
        findBoundaryElement(child, target, paddingTop, paddingBottom, pageSize)
      } else {
        // Found the border, insert a blank element before the border element and squeeze the content to the next page.
        node.insertBefore(
          createBoundaryWhiteSpace(A4_HEIGHT * pageSize.value - actualTop + paddingTop),
          child
        )
        pageSize.value++
      }
    }
  }
}

/* Automatic page Start */
export function useAutoOnePage(resumeType: string) {
  const cacheKey = AUTO_ONE_PAGE + '-' + resumeType,
    autoOnePage = ref<any>(getLocalStorage(cacheKey))
  async function setAutoOnePage(first?: boolean) {
    const renderCV: HTMLElement = queryRenderCV()
    ensureEmptyPreWhiteSpace(renderCV)
    if (autoOnePage.value) {
      const difference = A4_HEIGHT - renderCV?.clientHeight
      if (difference < 0 && difference < -200) {
        warningMessage('Your content is a bit too much! It will not look good if it is compressed into one page~')
        return
      }
      if (difference > 0 && difference > 500) {
        warningMessage("Your content is a bit too little! It won't look good if it is compressed into one page. Fill in a little more content~")
        return
      }
      const { differenceConfig, map } = getInitMarginTop(renderCV)
      useOnePageCSSContent(differenceConfig, difference, map, cacheKey, resumeType)
    } else {
      removeHeadStyle(cacheKey)
    }
    // cache for 3 hours
    setLocalStorage(cacheKey, autoOnePage.value)
    !first && splitPage(renderCV)
  }
  onActivated(() => !query(cacheKey) && setTimeout(() => setAutoOnePage(true), 50))

  return {
    autoOnePage,
    setAutoOnePage
  }
}

function getInitMarginTop(container: HTMLElement) {
  // You cannot get all adjustable tags like this. You need to recursively determine whether the current element is in flex layout. Flex will be in multiple columns, which will cause many invalid tag processing.
  const titles = Array.from(container.querySelectorAll('h1,h2,h3,h4,h5,h6,li,p')),
    differenceConfig: priorityDefineItem[] = []
  const visited = new Set(),
    map = new Map()
  for (const title of titles) {
    const tag = title.tagName.toLowerCase()
    // console.log(title)
    map.set(tag, (map.get(tag) || 0) + 1)
    if (visited.has(tag)) {
      continue
    }
    visited.add(tag)
    const top = +getComputedStyle(title, null).marginTop.slice(0, -2)
    const cur = { ...priorityDefine[tag as keyof priorityDefine], top, tag }
    // Calculate priority
    const optimal = cur.top / cur.max
    cur.optimal = optimal
    differenceConfig.push(cur)
  }
  return { differenceConfig, map }
}

// Calculate priority and process data with high priority
export const priorityDefine = {
  h1: { max: 30, min: -15, top: 0, tag: '', optimal: 0 },
  h2: { max: 30, min: -15, top: 0, tag: '', optimal: 0 },
  h3: { max: 20, min: -15, top: 0, tag: '', optimal: 0 },
  h4: { max: 20, min: -15, top: 0, tag: '', optimal: 0 },
  h5: { max: 20, min: -15, top: 0, tag: '', optimal: 0 },
  h6: { max: 20, min: -15, top: 0, tag: '', optimal: 0 },
  li: { max: 10, min: -15, top: 0, tag: '', optimal: 0 },
  p: { max: 10, min: -15, top: 0, tag: '', optimal: 0 }
}
export type priorityDefineItem = (typeof priorityDefine)['h1']
export type priorityDefine = typeof priorityDefine
const defaultCmp = (x: priorityDefineItem, y: priorityDefineItem) => x.optimal > y.optimal // 默认是最大堆
const swap = (arr: priorityDefineItem[], i: number, j: number) =>
  ([arr[i], arr[j]] = [arr[j], arr[i]])
export class Heap {
  //The default is the maximum heap
  container: priorityDefineItem[] = []
  cmp = defaultCmp
  constructor(cmp: (x: priorityDefineItem, y: priorityDefineItem) => boolean) {
    this.cmp = cmp
  }
  push(data: priorityDefineItem) {
    const { container, cmp } = this
    container.push(data)
    let index = container.length - 1
    while (index) {
      const parent = Math.floor((index - 1) / 2)
      if (!cmp(container[index], container[parent])) {
        return
      }
      swap(container, index, parent)
      index = parent
    }
  }
  pop() {
    const { container, cmp } = this
    if (!container.length) {
      return null
    }
    swap(container, 0, container.length - 1)
    const res = container.pop()
    const length = container.length
    let index = 0,
      exchange = index * 2 + 1
    while (exchange < length) {
      // Take the case of the maximum heap: if there is a right node and the value of the right node is greater than the value of the left node
      const right = index * 2 + 2
      if (right < length && cmp(container[right], container[exchange])) {
        exchange = right
      }
      if (!cmp(container[exchange], container[index])) {
        break
      }
      swap(container, exchange, index)
      index = exchange
      exchange = index * 2 + 1
    }
    return res
  }

  top() {
    if (this.container.length) return this.container[0]
    return null
  }

  isEmpty() {
    return this.container.length === 0
  }
}

function useOnePageCSSContent(
  priority: priorityDefineItem[],
  difference: number,
  map: Map<string, number>,
  cacheKey: string,
  resumeType: string
) {
  const heap = new Heap((x, y) => (difference < 0 ? x.optimal > y.optimal : x.optimal < y.optimal))
  for (const optimal of priority) {
    heap.push(optimal)
  }
  if (difference < 0) {
    // Large top stack (to shrink, you need to reduce the padding, so write it like this for the time being)
    while (difference++ < 20) {
      const topEl = heap.pop() as priorityDefineItem
      topEl.top = topEl.top - 1 / (map.get(topEl.tag) || 1)
      topEl.optimal = topEl.top / topEl.max
      heap.push(topEl as priorityDefineItem)
    }
  } else {
    // Small top stack (the padding should also be reduced when stretching, the idea is the same as above)
    while (difference-- > 20) {
      const topEl = heap.pop() as priorityDefineItem
      topEl.top = topEl.top + 1 / (map.get(topEl.tag) || 1)
      topEl.optimal = topEl.top / topEl.max
      heap.push(topEl as priorityDefineItem)
    }
  }
  // Create style sheet
  const styleDOM = createStyle()
  let cssText = ''
  styleDOM.setAttribute(cacheKey, 'true')

  for (const optimal of heap.container) {
    // Increase the weight to prevent being overwritten
    cssText += `.jufe ${optimal.tag}{margin-top:${optimal.top}px!important;}`
  }
  styleDOM.textContent = cssText
  //Insert in front of the custom CSS because the priority of the automatic page is the second highest
  const customCSS = query(CUSTOM_CSS_STYLE + '-' + resumeType)
  customCSS ? document.head.insertBefore(styleDOM, customCSS) : document.head.appendChild(styleDOM)
}