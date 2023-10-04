import { templates } from '@/templates/config'
import TypeNet from 'typenet'
import { onActivated, onMounted, onUnmounted, reactive, ref } from 'vue'
import avatar1 from '@/assets/svg/avataaars1.svg'
import avatar2 from '@/assets/svg/avataaars2.svg'
import avatar3 from '@/assets/svg/avataaars3.svg'
import avatar4 from '@/assets/svg/avataaars4.svg'
import avatar5 from '@/assets/svg/avataaars5.svg'
import { getTemplateCondition, queryGiteeRepoStars } from '@/api/modules/resume'

export function useTypeNet() {
  onMounted(() => {
    const content = document.querySelector('.typenet-text')
    if (content?.querySelector('.type-container') != null) return
    new TypeNet('.typenet-text', { speed: 10, style: 'font-weight: bold; line-height: 28px' })
      .type(' in 5 minutes', { style: 'font-size: 40px;line-height: 60px' })
      .type(' with CodeCV ', {
        style: 'color: #ff7449; font-size: 40px;line-height: 60px'
      })
      .type('to quickly generate your high-quality resume', {
        style: 'font-size: 40px;line-height: 60px'
      })
      .line()
      .line()
      .type('CodeCV supports you to write your resume using Markdown syntax, highly extensible. And it supports dual editing modes, ')
      .type('Markdown mode ', { style: 'color: #ff7449' })
      .type('as well as')
      .type(' rich text mode ', { style: 'color: #ff7449' })
      .type('seamless switching, multiple template adaptations. Write a set of resume content that can adapt to multiple resume templates, everything you want is here~')
      .start()
  })
}

export function usePresentation() {
  const GAP = 110,
    init = -30
  let timer: number

  const presentationData = reactive(templates.value.slice(7, 12))
  const presentationIndex = ref(0)
  const styleConfig = [
    {
      transform: `translateX(${init}px) scale(${0.7})`,
      zIndex: 0
    },
    {
      transform: `translateX(${GAP + init}px) scale(${0.8})`,
      zIndex: 1
    },
    {
      transform: `translateX(${GAP * 2 + init}px) scale(${1})`,
      zIndex: 2
    },
    {
      transform: `translateX(${GAP * 3 + init}px) scale(${0.8})`,
      zIndex: 1
    },
    {
      transform: `translateX(${GAP * 4 + init}px) scale(${0.7})`,
      zIndex: 0
    }
  ]

  onMounted(() => {
    timer = setInterval(() => {
      presentationIndex.value = (presentationIndex.value + 1) % styleConfig.length
      presentationData.unshift(presentationData.pop() as (typeof presentationData)[0])
    }, 3000)
  })
  onUnmounted(() => clearInterval(timer))

  return {
    styleConfig,
    presentationData,
    presentationIndex
  }
}

export function useUserComments() {
  const comments = [
    {
      avatar: avatar1,
      profession: 'Frontend Technology Expert at Alibaba',
      content: 'The user experience is pretty good. The UI is really well designed. Keep it up!'
    },
    {
      avatar: avatar2,
      profession: 'Embedded Development Engineer',
      content: "Found this tool in nk's recommendation. Thanks a lot to the author for the development. Although I am not a frontend or backend developer, it feels really good~"
    },
    {
      avatar: avatar3,
      profession: 'Java Development Engineer',
      content: 'This resume tool is really cool! It saved me a lot of time. The resume templates are also very practical. Discovered a treasure of a tool!!'
    },
    {
      avatar: avatar4,
      profession: 'User Operations',
      content: "Writing a resume is really convenient. Because I don't understand the markdown that UP said, so I use the rich text way to write. It feels as easy as writing in Word. Highly recommended~"
    },

    {
      avatar: avatar5,
      profession: 'Product Manager',
      content: 'Found this treasure resource while working on the website at home during the weekend. Writing a resume is as simple as taking notes. WYSIWYG, will use this for writing resumes from now on~'
    }
  ]
  return {
    comments
  }
}

export function useRecentTemplate() {
  onMounted(() => {
    // Process data
    ;(async () => {
      const _templateData = await getTemplateCondition()
      if (!_templateData.result) {
        return
      }
      const templateData = JSON.parse(_templateData.result)
      templates.value.forEach(template => (template.hot = templateData[`t${template.type}`]))
    })()
  })
}

export function useGiteeRepoStars() {
  interface GiteeRepoStars {
    avatar_url: string
    events_url: string
    followers_url: string
    following_url: string
    gists_url: string
    html_url: string
    id: number
    login: string
    member_role: string
    name: string
    organizations_url: string
    received_events_url: string
    remark: string
    repos_url: string
    star_at: string
    starred_url: string
    subscriptions_url: string
    type: string
    url: string
  }
  const repoStars = ref<GiteeRepoStars[]>([])
  const animate = ['fade-right', 'fade-up', 'fade-down', 'zoom-in', 'zoom-out', 'fade-left']
  async function query() {
    repoStars.value = (await queryGiteeRepoStars()) as GiteeRepoStars[]
  }

  function createAnimateEffect() {
    return animate[Math.floor(Math.random() * 10) % animate.length]
  }
  onActivated(query)
  return {
    repoStars,
    createAnimateEffect
  }
}
