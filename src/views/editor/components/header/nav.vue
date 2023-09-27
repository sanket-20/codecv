<script setup lang="ts">
import nav from '@/common/nav/nav'
import { refreshGuide } from '../guide/guide'

defineEmits(['export-md', 'import-md', 'export-picture'])
</script>

<template>
  <ul class="nav">
    <li v-for="(navItem, idx) in nav" :key="idx">
      <template v-if="navItem.children">
        <el-dropdown class="el-dropdown">
          <!-- Parent menu -->
          <div class="el-dropdown-link">{{ navItem.name }}</div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(subNavItem, sidx) in navItem.children" :key="sidx">
                <!-- Submenu -->
                <label for="import_md" v-if="subNavItem.startsWith('import')">
                  Import MD
                  <input
                    accept=".md"
                    id="import_md"
                    type="file"
                    @change="$emit('import-md', $event)"
                  />
                </label>
                <span v-else-if="subNavItem.includes('exportMD')" @click="$emit('export-md')">{{
                  subNavItem
                }}</span>
                <span v-else @click="$emit('export-picture')">{{ subNavItem }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <!-- If this is not a cascading menu, go here -->
      <template v-else>
        <router-link :to="navItem.path || ''">{{ navItem.name }}</router-link>
      </template>
    </li>
    <li class="use-guide" @click="refreshGuide()">Turn on guide</li>
  </ul>
</template>

<style lang="scss" scoped>
.el-dropdown {
  line-height: inherit;

  .el-dropdown-link {
    color: orange;
    font-weight: bold;
    outline: none;
  }
}

#import_md {
  width: 0;
  height: 0;
}

label[for='import_md'] {
  color: inherit;
  cursor: pointer;
}
</style>