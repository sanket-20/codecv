<script setup lang="ts">
import { warningMessage } from '@/common/message'
import { ref } from 'vue'

const emit = defineEmits(['confirm'])

const col = ref(5)
const row = ref(2)

function confirm() {
  if (!col.value || !row.value) {
    warningMessage('Please fill in valid numbers!')
    return
  }
  emit('confirm', col.value, row.value)
}
</script>

<template>
  <h3>Insert the number of rows and columns in the table</h3>
  &nbsp;
  <el-input v-model="col" type="number" placeholder="Please enter the number of columns"></el-input>
  &nbsp;
  <el-input v-model="row" type="number" placeholder="Please enter the number of rows"></el-input>
  &nbsp;
  <br />
  <button class="btn primary pointer hover" @click.stop="confirm">Confirm</button>
</template>

<style lang="scss" scoped></style>