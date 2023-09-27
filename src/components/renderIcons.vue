<script setup lang="ts">
import { successMessage } from '@/common/message'
import originData from '@/assets/icon/iconfont.json'
import { ref } from 'vue'
import Empty from './empty.vue'

let data = { ...originData }

const emit = defineEmits(['select-icon'])
// copy icon
type Icon = (typeof data.glyphs)[0]
const clipboard = (item: Icon) => {
  successMessage('Copied to clipboard, you can paste directly')
  navigator.clipboard.writeText(`icon:${item.font_class} `)
  emit('select-icon', item.font_class)
}
// Paging function
const iconData = ref<Icon[]>(data.glyphs.slice(0, 20))
const pageChange = function (page: number) {
  iconData.value = data.glyphs.slice((page - 1) * 20, page * 20)
}
// fuzzy search
const keyword = ref('')
function search() {
  if (!keyword.value) {
    iconData.value = data.glyphs = originData.glyphs
  } else {
    iconData.value = data.glyphs = originData.glyphs.filter(icon =>
      icon.font_class.includes(keyword.value)
    )
  }
  pageChange(1)
}
</script>

<template>
  <div class="render-modal">
    <el-input
      type="text"
      @keydown.enter="search"
      placeholder="Search by icon name"
      class="mb-10"
      v-model="keyword"
    />
    <div class="render-modal-icons" v-if="iconData.length">
      <button v-for="(item, idx) in iconData" :key="idx" @click="clipboard(item)">
        <i :class="['iconfont', `icon-${item.font_class}`]">
          <p>{{ item.font_class }}</p>
        </i>
      </button>
    </div>
    <Empty title="There is no such icon yet" v-else></Empty>
    <el-pagination
      v-if="iconData.length"
      :page-size="20"
      background
      layout="prev, pager, next"
      :total="data.glyphs.length"
      class="mt-4 page"
      @current-change="pageChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.render-modal {
  .render-modal-icons {
    min-height: 350px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
  }
  button {
    outline: none;
    background: transparent;
    border: none;
    height: 60px;
    color: var(--writable-font-color);

    i {
      font-size: 20px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }

      p {
        text-align: center;
        font-size: 14px;
      }
    }
  }

  .page {
    margin: 10px 0 0 25px;
    background: var(--background);
  }
}
</style>
