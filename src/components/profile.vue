<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

import { userForm } from '@/layout/header/hook'
import { professionals } from '@/views/community/components/community-left/constant'
import { ImageUpload } from '@/utils/uploader'

const emits = defineEmits(['cancel', 'submit'])
const ruleFormRef = ref<FormInstance>(),
  uploadInput = ref()
const rules = reactive<FormRules>({
  nickName: [
    { required: true, message: 'Please enter a nickname', trigger: 'blur' },
    { min: 1, max: 16, message: '1～16Character', trigger: 'blur' }
  ],
  school: [
    { required: true, message: 'Please enter the institution you are studying in', trigger: 'blur' },
    { min: 4, max: 20, message: '4～20Character', trigger: 'blur' }
  ],
  sex: [{ required: true, message: 'Please select gender', trigger: 'change' }],
  professional: [{ required: true, message: 'Please select your intended position', trigger: 'blur' }],
  graduation: [{ required: true, message: 'Please select graduation time', trigger: 'blur' }],
  origin: [
    { required: true, message: 'Please enter your region', trigger: 'blur' },
    { max: 10, min: 2, message: '2～10Character', trigger: 'blur' }
  ]
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      emits('submit')
      console.log('submit!')
    }
  })
}

const uploadAvatar = async function () {
  const files = uploadInput.value.files as FileList
  const url = await ImageUpload(files[0])
  userForm.avatar = url
}
</script>
<template>
  <el-form ref="ruleFormRef" :model="userForm" :rules="rules" label-width="100px" status-icon>
    <el-form-item label-width="80px">
      <label for="user_avatar_upload">
        <img class="pointer" :src="userForm.avatar" alt="avatar" />
      </label>
      <input
        type="file"
        ref="uploadInput"
        id="user_avatar_upload"
        accept=".png,.jpg,.jpeg,.gif,.webp"
        @change="uploadAvatar"
      />
    </el-form-item>
    <el-form-item label="gender" prop="sex" required>
      <el-radio-group v-model="userForm.sex">
        <el-radio label="male" />
        <el-radio label="female" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="User's Nickname" prop="nickName" required>
      <el-input class="input" v-model="userForm.nickName" placeholder="Internet surfing nicknames" />
    </el-form-item>
    <el-form-item label="graduated school" prop="school" required>
      <el-input class="input" v-model="userForm.school" placeholder="the school you attend" />
    </el-form-item>
    <el-form-item label="Intended position" prop="professional" required>
      <el-select v-model="userForm.professional" placeholder="Choose your intended position">
        <el-option v-for="(prof, idx) in professionals" :key="idx" :label="prof" :value="prof" />
      </el-select>
    </el-form-item>
    <el-form-item label="Graduation Time" required prop="graduation">
      <el-date-picker v-model="userForm.graduation" type="year" placeholder="graduation time" />
    </el-form-item>
    <el-form-item label="area" prop="origin" required>
      <el-input class="input" v-model="userForm.origin" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">Submit changes</el-button>
      <el-button @click="$emit('cancel')">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
#user_avatar_upload {
  display: none;
}

img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.input {
  width: 190px;
}
</style>
