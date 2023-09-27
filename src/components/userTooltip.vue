<script setup lang="ts">
import { IUserInfo } from '@@types/type'

defineProps<{ userInfo: IUserInfo }>()
</script>

<template>
  <div class="user-tooltip flex content-card">
    <div class="head flex">
      <img class="mr-10" :src="userInfo.avatar" alt="avatar" />
      <strong class="nick-name">
        {{ userInfo.nickName }}
      </strong>
    </div>
    <p>
      <strong>gender：</strong>
      {{ userInfo.sex }}born
    </p>
    <p>
      <strong>School:</strong>
      <span>{{ userInfo.school }} -</span>
      <span>{{ userInfo.graduation }}session</span>
    </p>
    <p>
      <strong>Career Objective:</strong>
      {{ userInfo.professional }}
    </p>
    <p>
      <strong>Region: </strong>
      {{ userInfo.origin }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.user-tooltip {
  width: 200px;
  min-height: 200px;
  font-size: 0.8rem;
  color: #666;
  background-color: #8ec5fc;
  background-image: linear-gradient(62deg, white 0%, #5fd5f5 200%);

  p {
    margin-top: 10px;
  }

  .head {
    justify-content: space-between;
    align-items: flex-end;

    .nick-name {
      color: orange;
    }
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
}
</style>
