import { markdownToHTML } from 'markdown-transform-html'

// Split the resume module and integrate the content of each sub-module
function moduleCombine(DOMStr: string) {
  const fragment = document.createElement('div')
  fragment.innerHTML = DOMStr
  const hasMainLayout = fragment.querySelector('.main-layout')
  const searchStart = hasMainLayout || fragment
  const nodes = Array.from(searchStart.childNodes) as HTMLElement[]
  let container = null,
    // eslint-disable-next-line prefer-const
    result = document.createElement('div')

  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) continue
    if (node.tagName.toLocaleLowerCase() === 'h2') {
      if (container) {
        result.appendChild(container)
      }
      container = document.createElement('div')
      container.className = 'resume-module'
      container.appendChild(node)
    } else {
      container ? container.appendChild(node) : result.appendChild(node)
    }
  }
  // Also add the last
  container && result.appendChild(container)
  if (hasMainLayout) {
    searchStart.parentNode?.replaceChild(result, searchStart)
    result.className = 'main-layout'
    result = fragment
  }
  return result
}

export function convertDOM(DOMStr: string) {
  return moduleCombine(markdownToHTML(DOMStr))
}
