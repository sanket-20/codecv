interface IResumeDOMStruct {
  node: Node
  parent: Node
  latest: boolean
  uid: number
  whiteSpace: number
}

const TAB_SIZE = 2 // A tab is 2 spaces in size
function isElementNode(node: Node) {
  return node.nodeType === node.ELEMENT_NODE
}

function getTagName(node: HTMLElement) {
  return node?.tagName.toLowerCase()
}

// Process HTML structure and convert markdown content
export function resumeDOMStruct2Markdown({
  parent,
  node,
  latest,
  uid,
  whiteSpace
}: IResumeDOMStruct) {
  let result = ''

  if (node.nodeType === Node.ELEMENT_NODE) {
    // Recursively traverse child nodes
    const classList = (node as HTMLElement).classList
    const tagName = <string>getTagName(<HTMLElement>node) // Get tag name
    const isDeepList = // Determine whether it is a nested list
        ['ul', 'ol'].includes(<string>getTagName(<HTMLElement>node)) &&
        getTagName(<HTMLElement>parent) == 'li',
      children = node.childNodes
    if (classList.contains('flex-layout')) {
      result += '::: start\n' // If it is the specified class name, add the starting syntax to the result string
    } else if (classList.contains('iconfont')) {
      result += `icon:${classList[1].slice(5)} ` // If it is the specified class name, add icon syntax to the result string
    } else if (classList.contains('head-layout')) {
      result += '::: headStart\n' // If it is the specified class name, add the header starting syntax to the result string
    } else if (classList.contains('main-layout')) {
      result += '::: mainStart\n' // Same as above
    } else if (tagName === 'a') {
      result += '['
    } else if (['b', 'strong'].includes(tagName)) {
      result += '**'
    } else if (tagName[0] === 'h') {
      result += '#'.repeat(+tagName[1]) + ' '
    } else if (tagName === 'li') {
      //ps：Need to deal with possible subset nesting issues
      const isOrder = getTagName(<HTMLElement>node.parentElement) == 'ol'
      result += ' '.repeat(whiteSpace) + `${!isOrder ? '- ' : uid + '. '}`
    } else if (['td', 'th'].includes(tagName)) {
      result += '| '
    } else if (tagName === 'code') {
      result += '`'
    } else if (tagName === 'i' && classList[0] != 'iconfont') {
      result += '*'
    } else if (tagName === 'br') {
      result += '&nbsp;'
    } else if (tagName === 'blockquote') {
      result += '> '
    }
    // Handle sub-content
    for (let i = 0; i < children.length; i++) {
      const isElement = isElementNode(children[i])
      // Recursively traverse child nodes
      const _isOrderItem = isElement && getTagName(<HTMLElement>children[i].parentElement) == 'ol'
      // If it is a nested list, it needs to be displayed in a new line.
      isDeepList && (result += '\n')
      result += resumeDOMStruct2Markdown({
        parent: node,
        node: children[i],
        latest: i === children.length - 1,
        uid: _isOrderItem ? ++uid : 0,
        whiteSpace: isDeepList ? whiteSpace + TAB_SIZE : whiteSpace // Handling nested parsing of lists
      })
    }
    if (classList.contains('flex-layout')) {
      result += '::: end' // If it is the specified class name, add the closing syntax to the result string
    } else if (classList.contains('head-layout')) {
      result += '::: headEnd' // If it is the specified class name, add the header closing syntax to the result string
    } else if (classList.contains('main-layout')) {
      result += '::: mainEnd' // Same as above
    } else if (classList.contains('flex-layout-item') && !latest) {
      result += '\n:::' // If it is the specified class name, add content syntax to the result string
    } else if (tagName == 'a') {
      result += `](${(node as HTMLElement).getAttribute('href')})`
    } else if (['b', 'strong'].includes(tagName)) {
      result += '**'
    } else if (tagName == 'img') {
      const alt = (node as HTMLImageElement).alt
      const isAvatar = alt?.includes('profile picture')
      result += `![${isAvatar ? 'profile picture' : alt}](${(node as HTMLImageElement).src})`
    } else if (tagName === 'tr') {
      result += '|'
    } else if (['th', 'td'].includes(tagName)) {
      result += ' '
    } else if (tagName === 'code') {
      result += '`'
    } else if (tagName === 'i' && classList[0] != 'iconfont') {
      result += '*'
    }
    if (
      !['b', 'span', 'strong', 'a', 'i', 'td', 'th', 'thead', 'code', 'ul', 'ol'].includes(tagName)
    ) {
      result += '\n'
    }
  } else {
    // Process text nodes and clear the spaces before and after
    const content = (node as Text).textContent || ''
    result += content // Add text content to the result string
  }
  return result
}
