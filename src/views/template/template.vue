<script setup lang="ts">
import NavBar from '@/components/navBar.vue'
import resumeCard from './components/resumeCard.vue'
import Empty from '@/components/empty.vue'
import { templateCategory } from './constant'
import { useCategory, useTemplateData, useNotification } from './hook'
import { numFormat } from '@/utils/format'
import ToastModal from '@/components/toast-modal/toastModal.vue'

const { queryCategory, data } = useCategory()
const { ranks } = useTemplateData()
const { flag, close } = useNotification()
</script>

<template>
  <div class="resume-container flex">
    <div class="resume-left-container content-card" data-aos="fade-right">
      <NavBar button="Create Template" :tabs="templateCategory" @tab-click="queryCategory" />
      <div class="resume-card-container" v-if="data.length">
        <resume-card v-for="theme in data" :key="theme.id" :theme="theme" />
      </div>
      <Empty v-else title="No templates of this type for now. You can click on the top right corner to create a template or contact the author to add one~" />
    </div>
    <div class="resume-right-container" data-aos="fade-left">
      <div class="resume-hot-rank content-card mb-20">
        <strong class="mb-20">Resume Template Popularity Ranking</strong>
        <ul v-if="ranks.length">
          <li
            v-for="(t, idx) in ranks"
            :key="t.type"
            class="flex hover pointer"
            @click="$router.push({ path: `/editor`, query: { type: t.type } })"
          >
            <el-tooltip :content="t.name" placement="left">
              <p class="line-1">
                <span class="mr-10">{{ idx + 1 }}</span
                >{{ t.name }}
              </p>
            </el-tooltip>
            <sub> <i class="iconfont icon-hot"></i> {{ numFormat(+String(t.hot)) }}</sub>
          </li>
        </ul>
        <Empty title="Loading..." v-else />
      </div>
      <div class="resume-notification content-card">
        <strong>Announcement</strong>
        <p>
          If you find this project helpful, please consider giving a
          <a href="https://github.com/acmenlei/codecv" target="_blank">star to the project</a>
          . If you encounter any bugs, please describe and reproduce the problems through WeChat/issues in the bottom,
          and good user experience needs everyone to build together. Thank you for your support~🙏
        </p>
      </div>
    </div>
  </div>
  <ToastModal :flag="flag" @close="close">
    <h3 style="margin-bottom: 10px">Notification</h3>
    <p style="line-height: 27px">
      Recently, there have been many responses from students. I'm sending a notice. This website is a backup website.
      If you need to experience more functions, please go to the main site<del
        style="color: var(--theme)"
        ><a
          target="_blank"
          href="https://codecv.top"
          style="color: var(--theme); text-decoration: none"
        >
          https://codecv.top</a
        ></del
      >(the main site is being filed, it will be restored in about a week), you can visit the temporary address<a
        target="_blank"
        href="https://wuxiancv.com"
        style="color: var(--theme); text-decoration: none"
      >
        https://wuxiancv.com</a
      >
    </p>
    <ol class="" style="margin: 10px 0; padding-left: 20px; line-height: 28px">
      <li>🌈 The main site's file export is more stable.</li>
      <li>✍🏻 Better writing experience.</li>
      <li>✨ More perfect tools.</li>
      <li>☁️ Real-time saving of data in the cloud.</li>
    </ol>
    <p>If not needed, please ignore it directly. Thank you for your cooperation!</p>
    <br />
    <div class="flex group">
      <img src="@/assets/img/wechat_group.png" style="width: 30%" />
      <h4>Join the group chat to get the latest information, hurry up, brothers~ ✌🏻</h4>
    </div>
    <p style="text-align: center; margin-top: 20px">
      <button class="primary btn" @click="close">Got it</button>
    </p>
  </ToastModal>
</template>

<style lang="scss" scoped>
.resume-container {
  max-width: var(--max-width);
  margin: 20px auto;

  .resume-notification {
    padding-bottom: 140px;
    position: sticky;
    top: 80px;
    font-size: 15px;
    line-height: 28px;
    strong {
      display: inline-block;
      margin-bottom: 10px;
      padding-bottom: 5px;
      color: var(--theme);
    }
    a {
      color: #5e75eb;
    }
  }

  .resume-hot-rank {
    strong {
      display: inline-block;
      color: var(--theme);
    }
    li {
      font-size: 14px;
      line-height: 30px;
      p {
        max-width: 135px;
      }
      sub {
        font-weight: bold;
        white-space: nowrap;
        color: orangered;
        text-align: right;
        flex-grow: 1;
      }
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        p span {
          color: orangered;
        }
      }
    }
  }

  .resume-left-container {
    margin-right: 20px;
    .resume-card-container {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
    }
  }
}
.group {
  align-items: center;
  gap: 40px;
}

@media screen and (max-width: 800px) {
  .resume-right-container {
    display: none;
  }
  .resume-left-container {
    margin-left: 20px;
  }
}
</style>
