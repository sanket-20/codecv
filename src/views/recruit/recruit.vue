<script setup lang="ts">
import {
  useData,
  EducationalRequiredOptions,
  WorkAndResetTimeOptions,
  WorkEXPOptions
} from './hook'
import { getTagColor } from '@/utils'

const { data, form, reset, pageNumChange } = useData()
</script>

<template>
  <div class="recruit flex">
    <div class="recruit-data content-card mr-20" data-aos="fade-right">
      <h6 class="mb-20" style="color: var(--strong-color)">
        PS: For those who need to add a position, please contact the author. It must be a genuine job opening. If KPI padding is discovered, it will be publicly listed in the blacklist.
      </h6>
      <el-form :inline="true" :model="form">
        <el-form-item label="Fuzzy Search">
          <el-input v-model="form.keyword" placeholder="Keyword search" clearable />
        </el-form-item>
        <el-form-item label="Job Position">
          <el-input v-model="form.job" placeholder="Position filter" clearable />
        </el-form-item>
        <el-form-item label="Educational Requirements">
          <el-select v-model="form.educational_required" placeholder="Educational requirements" clearable>
            <el-option
              v-for="(item, index) in EducationalRequiredOptions"
              :label="item"
              :value="item"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Work Experience">
          <el-select v-model="form.type" placeholder="Recruitment type" clearable>
            <el-option
              v-for="(item, index) in WorkEXPOptions"
              :label="item"
              :value="item"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Company Tags">
          <el-select v-model="form.icu" placeholder="Filter by tag" clearable>
            <el-option
              v-for="(item, index) in WorkAndResetTimeOptions"
              :label="item"
              :value="item"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button color="var(--theme)" @click="reset">Reset</el-button>
        </el-form-item>
      </el-form>
      <div class="recruit-limit">
        <el-table :data="data" style="width: 100%">
          <el-table-column label="Logo" prop="logo">
            <template #default="{ row }">
              <img v-if="row.logo" class="corporation_logo" :src="row.logo" alt="Company logo" />
              <i v-else class="iconfont icon-city font-25" />
            </template>
          </el-table-column>
          <el-table-column label="Company Name" prop="corporation">
            <template #default="{ row }">
              <strong>{{ row.corporation }}</strong>
            </template>
          </el-table-column>
          <el-table-column label="Position" prop="job" />
          <el-table-column label="Work Experience" prop="type">
            <template #default="{ row }">
              <el-tag v-for="(t, index) in row.type" :type="getTagColor(index)" :key="index">{{
                t
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Educational Requirements" prop="educational_required">
            <template #default="{ row }">
              <el-tag
                v-for="(er, index) in row.educational_required"
                :type="getTagColor(index)"
                :key="index"
                round
                >{{ er }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="Company Tags" prop="tags">
            <template #default="{ row }">
              <el-tag v-for="(t, index) in row.tags" :type="getTagColor(index)" :key="index">{{
                t
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="End Time" prop="endTime" />
          <el-table-column label="Application Channel" prop="external_link">
            <template #default="{ row }">
              <div v-if="typeof row.external_link == 'string'" class="line-1">
                <el-link :href="row.external_link" target="_blank"> Click to Apply </el-link>
              </div>
              <div v-else style="color: var(--strong-color)">
                <span>{{ row.external_link.app }}: </span>
                <span>{{ row.external_link.contact }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Remarks" prop="remark" />
        </el-table>
        <el-pagination
          @update:current-page="pageNumChange"
          :page-size="form.pageSize"
          class="mt-20"
          layout="prev, pager, next, total"
          :total="data.length"
        />
      </div>
    </div>
    <div class="recruit-slide content-card" data-aos="fade-left">
      <p class="mb-10">Author's WeChat</p>
      <img src="@/assets/img/wechat.jpg" alt="Contact" class="author qr" />
      <br />
      <br />
      <p class="mb-10">QQ Community</p>
      <img src="@/assets/img/qqgroup.jpeg" alt="QQ Community" class="qqgroup qr" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.recruit {
  max-width: var(--max-width);
  margin: 20px auto;
  .recruit-data {
    width: 1080px;
    .corporation_logo {
      width: 70px;
    }
  }
  .recruit-slide {
    position: sticky;
    top: 80px;
    flex: 1;
    .qr {
      width: 100%;
    }
  }
  :deep(.el-tag) {
    margin-top: 5px;
  }
}
</style>
