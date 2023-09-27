<script setup lang="ts">
import ToastModal from '@/components/toast-modal/toastModal.vue'
import Empty from '@/components/empty.vue'
import { Codemirror } from 'vue-codemirror'
import { cssLanguage } from '@codemirror/lang-css'
import { marks } from './constant'
import {
  step,
  setStep,
  useAvatar,
  usePrimaryBGColor,
  useCustomFont,
  useCustomCSS,
  usePrimaryColor,
  useAutoOnePage,
  useAdjust,
  useLineHeight,
  useFollowRoll,
  restResumeContent
} from './hook'
import { oneDark } from '@codemirror/theme-one-dark'
import { useThemeConfig } from '@/common/global'
import { useResumeType } from '../../hook'

const emits = defineEmits(['upload-avatar', 'html-convert'])

const { resumeType } = useResumeType()
const { autoOnePage, setAutoOnePage } = useAutoOnePage(resumeType.value)
const { cssDialog, cssText, toggleDialog, setStyle, removeStyle } = useCustomCSS(resumeType.value)
const { color, setColor } = usePrimaryColor(resumeType.value)
const { fontOptions, font, setFont } = useCustomFont(resumeType.value)
const { setAvatar } = useAvatar(emits)
const { primaryColor, setPrimaryColor } = usePrimaryBGColor(resumeType.value)
const { adjustMargin, visible, confirmAdjustment, properties } = useAdjust(resumeType.value)
const { followRoll, setFollowRoll } = useFollowRoll()
const { h, lineHeightOptions, setLineHeight } = useLineHeight(resumeType.value)
const { isDark } = useThemeConfig()
</script>

<template>
  <div class="operator resume-tools">
    <el-slider
      size="small"
      class="slider"
      :marks="marks"
      v-model="step"
      @change="setStep"
      :step="10"
      show-stops
    />
   <div class="operator-level2">
      <el-tooltip content="Adjust the top and bottom margins of elements" effect="light">
        <i class="iconfont icon-adjust operator-item" @click="adjustMargin"></i>
      </el-tooltip>
      <el-tooltip
        content="Please make sure the location you want to upload exists in the editor before uploading![Personal avatar](...) this placeholder"
        effect="light"
      >
        <label for="upload-avatar" class="operator-item card">
          <i class="iconfont icon-zhengjian"></i>
        </label>
      </el-tooltip>
      <input type="file" id="upload-avatar" accept=".png,.jpg,.jpeg" @change="setAvatar" />
      <el-tooltip content="Writing CSS" effect="light">
        <i class="operator-item iconfont icon-diy" @click="toggleDialog"></i
      ></el-tooltip>
      <div class="operator-item font-color-picker">
        <el-color-picker @change="setColor" size="small" v-model="color" />
      </div>
      <div class="operator-item main-color-picker">
        <el-color-picker @change="setPrimaryColor" size="small" v-model="primaryColor" />
      </div>
      <el-popconfirm
        width="240"
        confirm-button-text="Yes"
        cancel-button-text="Wrong click"
        title="Do you want to reset all contents of your resume?"
        @confirm="restResumeContent(resumeType)"
      >
       <template #reference>
          <i class="operator-item iconfont icon-refresh ml-20"></i>
        </template>
      </el-popconfirm>
      <el-tooltip content="Auto one page" effect="light">
        <el-switch
          class="operator-item auto-one-page"
          size="small"
          @change="() => setAutoOnePage()"
          v-model="autoOnePage"
        />
      </el-tooltip>
      <el-tooltip content="Follow scroll" effect="light">
        <el-switch
          class="operator-item follow-roll"
          size="small"
          v-model="followRoll"
          @change="setFollowRoll"
        />
      </el-tooltip>
      <el-tooltip content="Line height setting" effect="light">
        <el-select
          v-model="h"
          class="operator-item lh-select"
          @change="setLineHeight"
          placement="bottom"
          size="small"
        >
          <el-option
            v-for="item in lineHeightOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-tooltip>
      <el-tooltip content="Font settings" effect="light">
        <el-select
          v-model="font"
          class="operator-item font-select"
          @change="setFont"
          placement="bottom"
          size="small"
        >
          <el-option
            v-for="item in fontOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-tooltip>
    </div>
    <br />
  </div>
  <!-- Pop-up box -->
  <ToastModal v-if="cssDialog" :flag="cssDialog" @close="cssDialog = false" width="400px">
    <h4 class="mb-10">Write CSS styles to apply to templates</h4>
    <codemirror
      v-model="cssText"
      autofocus
      :style="{ minHeight: '300px', maxHeight: '500px' }"
      :indent-with-tab="true"
      :extensions="isDark ? [cssLanguage, oneDark] : [cssLanguage]"
      placeholder="Format such as .jufe h2 { color: red; }"
    />
    <br />
    <button class="btn primary cursor hover" @click="setStyle">Confirm</button>
    <button class="btn primary cursor hover" @click="removeStyle">Reset</button>
  </ToastModal>
  <!-- Adjust margins -->
  <ToastModal
    v-if="visible"
    :flag="visible"
    @close="confirmAdjustment"
    :width="properties.length ? '525px' : '310px'"
  >
    <div class="properties-container flex" v-if="properties.length">
      <div class="properties-header">
        <span>Element name</span>
        <span>Top margin (px)</span>
        <span>Bottom margin (px)</span>
      </div>
      <div class="properties-item" v-for="(property, idx) in properties" :key="idx">
        <el-space>
          <span>{{ property.name }} ({{ property.className || property.tagName }})</span>
          <el-input-number size="small" v-model="property.marginTop" />
          <el-input-number size="small" v-model="property.marginBottom" />
        </el-space>
      </div>
    </div>
    <Empty v-else title="There is no content in the resume yet, you can write something first" />
    <br />
    <h5 style="color: var(--strong-color)">PS: Only display the ones already used in the resume template</h5>
  </ToastModal>
</template>

<style lang="scss" scoped>
.operator {
  width: 100%;
  margin: 0 auto;
  position: sticky;
  top: 0;
  transform: translateY(-20px);
  z-index: 1;
  background: var(--toolbar-bg);
  padding-top: 20px;

  /* Solve the problem of label default margin */
  .card {
    height: 25px;
  }
  .slider {
    width: 190mm;
    user-select: none;
    margin: 0 auto;
  }
  .operator-level2 {
    display: flex;
    margin-top: 25px;
    justify-content: center;
    align-items: flex-end;

    .operator-item {
      margin-right: 14px;
    }
    .font-color-picker {
      margin-right: 22px;
    }
    .main-color-picker {
      margin-right: 0;
    }
    #upload-avatar {
      width: 0;
      height: 0;
    }

    i.iconfont {
      color: #f8f8f8;
      font-size: 24px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.properties-container {
  flex-wrap: wrap;
  flex-direction: column;
  overflow: scroll;
  .properties-header {
    padding-bottom: 30px;
    position: relative;
    span {
      font-weight: 600;
      position: absolute;
    }
    span:nth-child(2) {
      transform: translateX(210px);
    }
    span:nth-child(3) {
      transform: translateX(340px);
    }
  }
  .properties-item {
    margin-top: 10px;
    span {
      width: 200px;
      font-size: 14px;
    }
  }
}
</style>