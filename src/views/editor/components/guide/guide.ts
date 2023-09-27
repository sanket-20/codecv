import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import './popover.scss'
import { getLocalStorage, setLocalStorage } from '@/common/localstorage'

const driverObj = driver({
  popoverClass: 'popover-container',
  showProgress: true,
  nextBtnText: 'Next',
  prevBtnText: 'Previous step',
  doneBtnText: 'Get started',
  steps: [
    {
      element: '.editor-toolbar',
      popover: {
        title: 'Creating Toolbar',
        description: 'You can use this toolbar to quickly format your resume'
      }
    },
    {
      element: '.icon-write',
      popover: {
        title: 'Edit mode switch',
        description:
          'Two modes are now supported, you can use <strong style="color: var(--strong-color)">markdown</strong> or <strong style="color: var(--strong-color)"> Rich text</strong>writing method, there is no need to worry about data loss after switching, because the data between them is synchronized~'
      }
    },
    {
      element: '.operator-level2',
      popover: {
        title: 'Resume Toolbar',
        description:
          'You can use these tools to adjust the effect you want to see on your resume. Next, I will introduce you to the use of each tool'
      }
    },
    {
      element: '.icon-adjust',
      popover: {
        title: 'Adjust element margins',
        description:
          'If you are not satisfied with the layout of a certain element in your resume, you can use this function to adjust the top and bottom margins of the specified element'
      }
    },
    {
      element: '.icon-zhengjian',
      popover: {
        title: 'ID photo',
        description: 'This function is to upload ID photos'
      }
    },

    {
      element: '.icon-diy',
      popover: {
        title: 'Custom CSS',
        description:
          'If you have the ability to write CSS, you can edit the CSS here to adjust the effect of your resume. Note that the CSS needs to be written under the .jufe class to ensure it takes effect'
      }
    },
    {
      element: '.font-color-picker',
      popover: { title: 'Customized font color', description: 'The color of your resume can be freely controlled by yourself' }
    },
    {
      element: '.main-color-picker',
      popover: { title: 'Customize the main color', description: 'Similarly, the main color can also be adjusted freely' }
    },
    {
      element: '.icon-refresh',
      popover: {
        title: 'Reset content',
        description: 'If you want to clear all changes and return to the original appearance, please use this function. This operation is irreversible! '
      }
    },
    {
      element: '.auto-one-page',
      popover: {
        title: 'Smart Page',
        description: 'If your resume content exceeds one page or is less than one page, you can use this function to optimize the layout of your resume'
      }
    },
    {
      element: '.follow-roll',
      popover: {
        title: 'Follow scroll',
        description: 'Is it too troublesome to scroll the left and right containers at the same time? Turn this one on! '
      }
    },

    {
      element: '.lh-select',
      popover: {
        title: 'Adjust line spacing',
        description: 'Adjusting line spacing is very useful when controlling the number of resume pages! '
      }
    },
    {
      element: '.font-select',
      popover: {
        title: 'Set font',
        description: 'You can choose the font effect according to your preference~'
      }
    },
    {
      element: '.el-dropdown-link',
      popover: {
        title: 'Export resume content',
        description:
          'If you want to save your resume content, please export the MD</strong> file here<strong style="color: var(--strong-color)">and import it when you want to continue writing'
      }
    },
    {
      element: '.use-guide',
      popover: {
        title: 'Using the guide',
        description: 'If you want to view the instructions again, please click here'
      }
    }
  ]
})

export const startGuide = function () {
  const guideStatus = getLocalStorage('resume-make-guide')
  if (guideStatus) return
  setTimeout(driverObj.drive)
  setLocalStorage('resume-make-guide', true, 1000 * 3600 * 24 * 180)
}
export const refreshGuide = driverObj.drive
