<script setup lang="ts">
import { useLinkInput } from './hook'

const emit = defineEmits(['confirm'])
const { link, linkText, confirm } = useLinkInput(emit)
const title = link.value ? 'Modify link' : 'Insert link'
</script>

<template>
  <h3>{{ title }}</h3>
  &nbsp;
  <el-input v-model="link" placeholder="Please enter the link address"></el-input>
  &nbsp;
  <el-input v-model="linkText" placeholder="Please enter link text"></el-input>
  &nbsp;
  <br />
  <button class="btn primary pointer hover" @click.stop="confirm">Confirm</button>
</template>