<script setup lang="ts">
import { warningMessage } from '@/common/message'
import { ref } from 'vue'

const emit = defineEmits(['confirm'])

const column = ref(2)

function confirm() {
  if (!column.value) {
    warningMessage('Please fill in the complete form!')
    return
  }
  emit('confirm', column.value)
}
</script>

<template>
  <h3>Please enter the number of columns to be inserted</h3>
  &nbsp;
  <el-input v-model="column" type="number" placeholder="Please enter the number of columns"></el-input>
  &nbsp;
  <br />
  <button class="btn primary pointer hover" @click.stop="confirm">Confirm</button>
</template>

<style lang="scss" scoped></style>