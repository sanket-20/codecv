<script setup lang="ts">
import { numFormat } from '@/utils/format'
import wechat from '@/assets/img/wechat.jpg'

const defaultUserInfo = {
  uid: 0,
  nickName: 'Leilei Leilei',
  username: 'coderlei',
  sex: 'male',
  professional: 'Front-end development engineer',
  graduation: '2023',
  school: 'Jiangxi University of Finance and Economics',
  avatar: 'https://codeleilei.gitee.io/blog/avatar.jpg',
  origin: 'Nanchang, Jiangxi'
}
</script>

<template>
  <article class="pointer">
    <user-info :user-info="defaultUserInfo" />
    <h3>"Announcement on Temporary Suspension of Community Services"</h3>
    <p class="intro line-4">
      Dear brothers and sisters, the previous server has expired, so the community will not provide it for the time being, but the data is still there, and the account can be used normally after it returns to normal in the future! The resume service can also be used normally, don’t say I ran away😅! If you have any questions or better suggestions, you can contact me on WeChat. More like-minded friends are welcome to maintain this project together!
    </p>
    <div class="covers-container">
      <el-image
        :src="wechat"
        :preview-src-list="[wechat]"
        :initial-index="0"
        fit="cover"
        :lazy="true"
        loading="lazy"
        class="mr-10 cover-item"
        :preview-teleported="true"
        :hide-on-click-modal="true"
      />
    </div>
    <div class="article-bottom">
      <div class="operator-group">
        <span>
          <i class="iconfont icon-like font-20"></i>
          {{ numFormat(99999) }}
        </span>
        <span>
          <i class="iconfont icon-comment font-20"></i>
          {{ numFormat(99999) }}
        </span>
        <span class="visit-people">
          <i class="iconfont icon-browse font-20"></i>
          Views {{ numFormat(99999) }}
        </span>
      </div>
      <span class="tag pointer">#Community Announcements</span>
    </div>
  </article>
</template>

<style lang="scss" scoped>
article {
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 0.5px solid #999;
  color: var(--font-color);
  position: relative;

  .visit-people {
    position: absolute;
    right: -20px;
    top: -5px;
  }

  .intro {
    opacity: 0.9;
    &:hover {
      opacity: 0.8;
    }
  }

  &:last-child {
    border-bottom: none;
  }

  h3 {
    margin-bottom: 5px;
    color: var(--font-color);
  }

  .article-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tag {
      color: var(--theme);

      &:hover {
        opacity: 0.7;
      }
    }

    .operator-group {
      margin: 10px 0;

      span {
        margin-right: 20px;
        cursor: pointer;

        &:hover {
          color: var(--theme);
        }
      }
    }
  }
}
</style>
